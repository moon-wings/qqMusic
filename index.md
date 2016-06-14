安装https://ffmpeg.zeranoe.com/builds/

cmd ffprobe -v
cmd切换到qqmusic/musics

ffprobe -v quiet -print_format json -show_fomat  (这里有两个空格)1.mp3




// v8引擎 node.exe
console.log(1);

var fs = require('fs');
console.dir(fs);
fs.readdir('./musics/',function(err,files){
	// console.log(arguments);
	console.log(files)
})//异步  有回调函数


var fs = require('fs');
var files = fs.readdirSync('./musics/');
console.log(files);
console.log(1);  //同步没有回调函数



