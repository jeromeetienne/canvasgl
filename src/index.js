var canvas	= document.getElementById('container');  

if( true ){
	CanvasGL.enable(canvas)
	var ctx		= canvas.getContext('canvasgl');	
}else{
	var ctx		= canvas.getContext('2d');
}
ctx.width	= 10;

function init()
{
	sprite0	= new Image();
	sprite0.onload = function(){
		//next();
	};  
	sprite0.src = '../images/sprite0.png';

	sprite1	= new Image();
	sprite1.onload = function(){
		next();
	};  
	sprite1.src = '../images/sprite1.png';
	
	animate();
}

function animate(){
	requestAnimFrame(animate);
	render();
}
function render(){
	console.log("drawn")
	var startTime	= Date.now();
	var fps		= 1;
	var duration	= 1;
	var nbSprites	= 2000;

	var present	= Date.now()/1000;
	var offsetX	= 30*Math.cos(present*2);
	var offsetY	= 50*Math.sin(present*3);

	for(var sec = 0; sec < duration; sec++){
		for(var frame = 0; frame < fps; frame++){
			for(var i = 0; i < nbSprites; i++){
				var x	= offsetX + Math.random()*50;
				var y	= offsetY + Math.random()*50;
				ctx.drawImage(sprite0, Math.floor(x), Math.floor(y), 64,64); 
				//ctx.drawImage(sprite0, Math.floor(x), Math.floor(y), 64,64); 
				//ctx.drawImage(sprite1, Math.floor(x), Math.floor(y)); 
			}
		}
	}
	var deltaTime	= Date.now() - startTime;
	console.log("deltaTime", (deltaTime/1000));
	console.profileEnd();
}
init();
