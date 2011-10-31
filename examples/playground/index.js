var ctx;

//var neheTexture;
var neheImage, spriteImage;
var stats;

var usedTech		= "CanvasGL";
//var usedTech		= "rawCanvas2d";
//var usedTech		= "WebGL2D";
var boostCanvasGL	= false;

// maybe replace that by window... or something
var guiOptions	= {
	integerCoord	: true,
	fps		: 30,
	spriteSizeValue	: 64,
	spriteSizeRange	: 0
};


/**
 * Build ui with Data.GUI
*/
function buildGui(options, callback)
{
	callback	= callback	|| function(opts){};
	var gui = new DAT.GUI({
		height	: 4 * 32 - 1
	});

	gui.add(options, 'integerCoord')
		.onFinishChange(function(){callback(options)}).onChange(function(){callback(options)});
	gui.add(options, 'fps').min(15).max(60)
		.onFinishChange(function(){callback(options)}).onChange(function(){callback(options)});
	gui.add(options, 'spriteSizeValue').min(16).max(128)
		.onFinishChange(function(){callback(options)}).onChange(function(){callback(options)});
	gui.add(options, 'spriteSizeRange').min(0).max(128)
		.onFinishChange(function(){callback(options)}).onChange(function(){callback(options)});
}


/**
 * So this will be done by CanvasGL canvas api
*/
function buildDrawImages(viewportW, viewportH, nSprites)
{
	var present	= Date.now()/1000;
	var offsetX	= 100+30*Math.cos(present*3);
	var offsetY	= 100+30*Math.sin(present*3);
	
	for(var i = 0; i < nSprites; i++){
		var sizeW	= guiOptions.spriteSizeValue + guiOptions.spriteSizeRange*(Math.random()-0.5);
		var drawImage	= {
			dstX	: Math.floor(offsetX + 1*Math.random()*(viewportW-64)),
			dstY	: Math.floor(offsetY + 1*Math.random()*(viewportH-64)),
			dstW	: Math.floor(sizeW),
			dstH	: Math.floor(sizeW),

			srcX	: 0,
			srcY	: 0,
			srcW	: 256,	// TODO make that dynamic
			srcH	: 256
		};
		ctx.drawImage(
			neheImage,
			drawImage.srcX, drawImage.srcY, drawImage.srcW, drawImage.srcH,
			drawImage.dstX, drawImage.dstY, drawImage.dstW, drawImage.dstH
		);
	}
}

function buildDrawImages2(){
	ctx.drawImage(spriteImage, 0,0);
	ctx.drawImage(neheImage, 50, 50);
	ctx.drawImage(neheImage, 100, 100);
}

function init()
{
	var canvas	= document.getElementById("canvas");
	

	if( usedTech == "CanvasGL" ){
		CanvasGL.bind(canvas)
		ctx	= canvas.getContext('2d');	
	}else if( usedTech == "rawCanvas2d"){
		ctx	= canvas.getContext('2d');	
	}else if( usedTech == "WebGL2D" ){
		WebGL2D.enable(canvas);
		ctx	= canvas.getContext('webgl-2d');	
	}else	console.assert(false);

	// build the GUI 
	buildGui(guiOptions);

	// stats
	if( false ){
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0px';
		stats.domElement.style.zIndex = 100;
		document.body.appendChild( stats.domElement );
	}

	// init images
	neheImage	= new Image();
	neheImage.src	= "../images/nehe.gif";

	spriteImage	= new Image();
	spriteImage.src	= "../images/sprite4.png";

	animate();
}

function animate()
{
	// loop empty until both images are loaded
	if( spriteImage.width === 0 || neheImage.width === 0 ){
		console.log("wait for image loading")
		requestAnimFrame(animate);		
		return;
	}else if( boostCanvasGL && ctx._isBoundImage(neheImage) === false ){
		buildDrawImages(512,384, 25000);
		ctx._buffers.update(ctx._drawImages, 0, ctx._drawImages.length-1);
		var gl	= ctx._gl;
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);				
	}

	if( boostCanvasGL ){	// for pure webgl perf
		ctx._renderImage(ctx._drawImages, 0, ctx._drawImages.length-1, false)
	}else{
		render();	
	}

	stats && stats.update();

	if( true ){
		requestAnimFrame(animate);	
	}else{
		setTimeout(function(){ animate(); }, 0);
	}
}

var renderNSprites	= {
	"CanvasGL"	: 15000,
	"rawCanvas2d"	: 1500,
	"WebGL2D"	: 500
}[usedTech];
var renderLastTime	= Date.now();
var renderLastStats	= Date.now();

function render()
{
	//buildDrawImages(ctx._gl.viewportWidth, ctx._gl.viewportHeight, renderNSprites);
	//buildDrawImages(512,384, renderNSprites);
	buildDrawImages2();
	if( ctx instanceof CanvasGL.Context )	ctx.update();

	var present	= Date.now();
	var measuredTime= present - renderLastTime;
	renderLastTime	= present;

	var allowedTime	= 1000/guiOptions.fps;
if( true ){
	if( measuredTime > allowedTime )	renderNSprites	-= 10;
	else if( measuredTime < allowedTime )	renderNSprites	+= 10;
}else{
	var factor	= allowedTime / measuredTime;
	var range	= 0.1;
	factor		= Math.max(factor, 1.0-range );
	factor		= Math.min(factor, 1.0+range );
	factor		= Math.pow(factor, 2);
	renderNSprites	= renderNSprites * factor;
}

	if( renderLastStats + 1000 < present ){	
		document.getElementById("nSprites").innerHTML	= Math.floor(renderNSprites);
		renderLastStats	= present;
	}
}


