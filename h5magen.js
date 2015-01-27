var marked = require('marked')
	fs = require('fs'),
	ncp = require('ncp').ncp,
	async = require('async'),
	Handlebars=require('Handlebars'),
	lineReader = require('line-reader'),
	argv = require('minimist')(process.argv.slice(2));

// 图书类
var Magazine=function(dir){
	this.dir=dir;
};

//生成电子书方法
Magazine.prototype.generate=function(){
	var self=this;
	
	// 获取全部数据文件
	self.dataFiles=[self.dir+'/front_cover.json'];
	for(var i=1;;i++){
		var filePath=self.dir+'/'+i+'.json';
		if (fs.existsSync(filePath)){
			self.dataFiles.push(filePath);
		}else{
			break;
		}
	}
	self.dataFiles.push(self.dir+'/back_cover.json');
	console.log('生成数据文件列表 .. OK');

	self.articles=[];

	async.eachSeries(self.dataFiles,function(filePath,callback){
		fs.readFile(filePath,'utf8',function(err,data){
			if(err) return err;
			var article=new Article(JSON.parse(data));
			self.articles.push({
				height:'100%',
				width:'100%',
				content:article.html
			});
			callback(null);
		});
	},function(err){
		if (err) return err;
		console.log('加载数据文件.. OK');

		// 通过hbs模板生成html正文
		var source=fs.readFileSync('templates/magazine.hbs','utf8');
		var template = Handlebars.compile(source);
		var result=template({articles:JSON.stringify(self.articles)});

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
		console.log('HTML文件生成.. OK');
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

	});
};

// 文章类
var Article=function(data){
	this.data=data;

	var source=fs.readFileSync('templates/'+this.data.layout+'.hbs','utf8');
	var template = Handlebars.compile(source);
	this.html=template(this.data);
};

if (!argv.s){
	console.log('缺少必要的参数。\n -s 源文件目录');
	return;
}

var magazine=new Magazine(argv.s);
magazine.generate();





