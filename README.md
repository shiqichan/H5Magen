# H5Magen
HTML5电子杂志生成器。

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

电子杂志使用`MarkDown`语法，有关语法见：[MarkDown 语法说明 (简体中文版)](http://wowubuntu.com/markdown/)

本项目程序，解析MarkDown语法内容，生成HTML，并添加渲染CSS和相关的JavaScript。

#### 写法示例

待续。

