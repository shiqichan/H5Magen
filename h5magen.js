var marked = require('marked')
	fs = require('fs'),
	ncp = require('ncp').ncp,
	async = require('async'),
	Handlebars=require('Handlebars'),
	lineReader = require('line-reader'),
	argv = require('minimist')(process.argv.slice(2));

// 图书类
var Book=function(dir){
	this.dir=dir;
};

//生成电子书方法
Book.prototype.generate=function(){
	var self=this;
	async.series([
			function(callback){
				self.frontCover=new Article(self.dir+'/'+'front_cover.md');
				self.frontCover.parse(callback);
				console.log('解析封面..OK');
			},
			function(callback){
				self.contentCount=0;
				self.contentFiles=[];
				for(var i=1;;i++){
					var filePath=self.dir+'/'+i+'.md';
					if (fs.existsSync(filePath)){
						self.contentFiles.push(filePath);
						self.contentCount++;
					}else{
						break;
					}
				}
				console.log('正文共.. '+self.contentCount+'篇');
				callback(null);
			},
			function(callback){
				var _callback=callback;
				self.contentArticles=[];
				async.each(self.contentFiles, function(filePath,callback){
					var article=new Article(filePath);
					article.parse(function(){
						self.contentArticles.push(article);
						callback(null);
					});
					console.log('解析'+filePath+'..OK');
				},function(err){
					_callback(null);
				});
			},
			function(callback){
				self.backCover=new Article(self.dir+'/'+'back_cover.md');
				self.backCover.parse(callback);
				console.log('解析封底..OK');
			},
			function(callback){
				var allAticles=[];

				allAticles.push(self.frontCover);
				self.contentArticles.forEach(function(article){
					allAticles.push(article);
				});
				allAticles.push(self.backCover);

				var articles=[];

				allAticles.forEach(function(article){
					articles.push({
						height:'100%',
						width:'100%',
						content:article.html
					});
				});
				
				// 通过hbs模板生成html正文
				var source=fs.readFileSync('magazine.hbs','utf8');
				var template = Handlebars.compile(source);
				var result=template({articles:JSON.stringify(articles)});

				// 临时加的方法，递归删除目录文件
				var deleteFolderRecursive = function(path) {
				  if( fs.existsSync(path) ) {
				    fs.readdirSync(path).forEach(function(file,index){
				      var curPath = path + "/" + file;
				      if(fs.lstatSync(curPath).isDirectory()) { // recurse
				        deleteFolderRecursive(curPath);
				      } else { // delete file
				        fs.unlinkSync(curPath);
				      }
				    });
				    fs.rmdirSync(path);
				  }
				};

				// 删除dist目录及其文件
				var distDir=self.dir+'/dist';
				deleteFolderRecursive(distDir);
				// 新建dist目录
				fs.mkdirSync(distDir);
				// 新建index.html
				fs.writeFileSync(distDir+'/index.html',result);
				// 复制必要的文件
				fs.createReadStream('islider.js').pipe(fs.createWriteStream(distDir+'/islider.js'));
				// 复制图片文件目录
				ncp(self.dir+'/images',distDir+'/images',function(err){
					if (err) {
						return console.error(err);
					}else{
						console.log('图片文件目录复制..OK');
					}
				});

				callback(null);
			}
		]);
};

// 文章类
var Article=function(filePath){
	this.markDownFilePath=filePath;
};

Article.prototype.parse=function(_callback){
	var self=this;

	async.series([
		// 分析控制信息
		function(callback){
			self.markDownText='';
			var target=self;
			lineReader.eachLine(self.markDownFilePath, function(line, last) {
				// 获取背景图片url
				if ((/^background_img:/).test(line)){
					target.backgroundImageUrl=line.substr('background_img:'.length,line.length);
				}
				// 获取布局类型
				if ((/^layout:/).test(line)){
					target.layout=line.substr('layout:'.length,line.length);
				}

				target.markDownText+=line;
				if(!last){
					target.markDownText+='\n';
				}else{
					callback(null);
				}
			});
		},
		// 分析MarkDown，生成html片段
		function(callback){
			self.html='<article style="background-image: url('+self.backgroundImageUrl+')">';
			self.html+=marked(self.markDownText);
			self.html+='</article>'
			callback(null);
		},
		function(callback){
			callback(null);
			_callback(null);
		}
		]);
};

if (!argv.s){
	console.log('缺少必要的参数。\n -s 源文件目录');
	return;
}

var book=new Book(argv.s);
book.generate();





