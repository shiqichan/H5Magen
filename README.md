# H5Magen
HTML5电子杂志生成器。

一个生成好的示例：

![](http://shiqichan.qiniudn.com/simple.demo.h5magen.png)

## 如何安装

### nodejs/npm

[点击这里下载安装](http://nodejs.org/download/)。

### 下载本项目

需要安装了git。

然后：

```
git clone https://github.com/shiqichan/H5Magen.git
```

命令行，进入`H5Magen`目录，执行：

```
npm install
```

安装工作完毕。

## 如何使用

### 执行项目自带的示例

命令行，`H5Magen`目录下，执行：

```
node h5magen -s examples/firstMagazine
```

将根据`firstMagzine`目录的素材生成电子杂志，位置在`examples/firstMagzine/dist`目录下。在浏览器打开`dist`目录下的`index.html`文件，即可看到生成的电子杂志。

### 编写自己的杂志

#### 基本思路

电子杂志，分为：

1. 数据
2. 模板

其中，数据部分，是*编辑*制作的，模板，是开发者根据制作要求提前做好的。

比如，数据，见[1.json](https://github.com/shiqichan/H5Magen/blob/master/examples/firstMagazine/1.json)：

```
{
	"layout":"simple/article_1",
	"backgroundImageUrl":"images/008.jpg",
	"title":"猫",
	"subtitle":"小型猫科动物也是杀手",
	"content":"在美国，家猫每年导致高达37亿只本土鸟类死亡。"
}
```
模板部分，见[article_1.hbs](https://github.com/shiqichan/H5Magen/blob/master/templates/simple/article_1.hbs)

```
<article style="background-image: url({{{backgroundImageUrl}}})">
<h1>{{{title}}}</h1>
<h2>{{{subtitle}}}</h2>
<p>{{{content}}}</p>
</article>
```

#### 写法示例

待续。

