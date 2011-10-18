var canvas	= document.getElementById('container');  
var ctx		= canvas.getContext('2d');
ctx.width	= 10;

Flow().seq(function(next){
	sprite0	= new Image();
	sprite0.onload = function(){
		next();
	};  
	sprite0.src = '../images/sprite0.png';
}).seq(function(next){
	sprite1	= new Image();
	sprite1.onload = function(){
		next();
	};  
	sprite1.src = '../images/sprite1.png';
}).seq(function(next){
	console.log("drawn")
	var startTime	= Date.now();
	var fps		= 30;
	var duration	= 1;
	for(var sec = 0; sec < duration; sec++){
		for(var frame = 0; frame < fps; frame++){
			for(var i = 0; i < 1080; i++){
				var x	= Math.random()*50;
				var y	= Math.random()*50;
				ctx.drawImage(sprite0, Math.floor(x), Math.floor(y)); 
				ctx.drawImage(sprite1, Math.floor(x), Math.floor(y)); 
			}
		}
	}
	var deltaTime	= Date.now() - startTime;
	console.log("deltaTime", (deltaTime/1000)),
	console.profileEnd();
});


ctx.fillStyle	= "rgb(200,0,0)";  
ctx.fillRect (10, 10, 55, 50);  

ctx.fillStyle	= "rgba(0, 0, 200, 0.5)";  
ctx.fillRect (30, 30, 55, 50);
