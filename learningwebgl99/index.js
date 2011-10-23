var ctx;

//var neheTexture;
var neheImage;
var stats;

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
console.log("kkk", options)
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
	var offsetX	= 100+30*Math.cos(present*2);
	var offsetY	= 100+50*Math.sin(present*3);
	
	for(var i = 0; i < nSprites; i++){
		var sizeW	= guiOptions.spriteSizeValue + guiOptions.spriteSizeRange*(Math.random()-0.5);
		var drawImage	= {
			dstX	: offsetX + 1*Math.random()*(viewportW-64),
			dstY	: offsetY + 1*Math.random()*(viewportH-64),
			dstW	: sizeW,
			dstH	: sizeW,

			srcX	: 0,
			srcY	: 0,
			srcW	: 256,
			srcH	: 256
		};
		ctx.drawImage(
			neheImage,
			drawImage.srcX, drawImage.srcY, drawImage.srcW, drawImage.srcH,
			drawImage.dstX, drawImage.dstY, drawImage.dstW, drawImage.dstH
		);
	}
}

function init()
{
	var canvas	= document.getElementById("canvas");
	
	CanvasGL.enable(canvas)
	ctx		= canvas.getContext('2d');	

	// init the texture
/**
 * - how to abstract this ?
 * - input variable is Image
 * - image._canvasglTexture	= gl.createTexture()
 * - init the texture when the image is loaded
 * - 2 cases, already loaded ? not yet loaded
 * - how to detect each case ?
 *   - likely available on the internet
 *   - neheImage.width isnt 0 if loaded ?
*/
	neheImage	= new Image();
	neheImage.onload= function(){
		ctx._bindImage(neheImage)
console.log("neheImage", neheImage.width)
console.dir(neheImage)
		animate();
	}
console.log("neheImage", neheImage.width)
	neheImage.src	= "images/nehe.gif";

	// build the GUI 
	buildGui(guiOptions);

	// stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );

}

function animate(){
	render();
	stats.update();
	requestAnimFrame(animate);
}

var renderNSprites	= 1000;
var renderLastTime	= Date.now();

function render()
{
	buildDrawImages(ctx._gl.viewportWidth, ctx._gl.viewportHeight, renderNSprites);
	ctx.update();
	
	var present	= Date.now();
	var renderDelay	= present - renderLastTime;
	renderLastTime	= present;
	
	var spriteDelay	= renderDelay/renderNSprites;
	var fps		= guiOptions.fps;
	renderNSprites	= (1000/fps)/spriteDelay;
	//console.log("renderNSprite", Math.floor(renderNSprites));
	//console.log("renderDelay", renderDelay, spriteDelay, renderNSprites);
	renderNSprites	= 10000;
	document.getElementById("nSprites").innerHTML	= Math.floor(renderNSprites);
}


