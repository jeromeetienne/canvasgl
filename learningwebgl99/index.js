var ctx;

//var neheTexture;
var neheImage;

// TODO all those should be in canvasgl-context
var shaderProgram;

/**
 * So this will be done by CanvasGL canvas api
*/
function buildDrawImages(viewportW, viewportH)
{
	var drawImages	= [];

	var present	= Date.now()/1000;
	var offsetX	= 30*Math.cos(present*2);
	var offsetY	= 50*Math.sin(present*3);

	for(var i = 0; i < 1000; i++){
		var drawImage	= {
			dstX	: offsetX + 0*Math.random()*(viewportW-64),
			dstY	: offsetY + 0*Math.random()*(viewportH-64),
			dstW	: 64,
			dstH	: 64,

			srcX	: 0,
			srcY	: 0,
			srcW	: 256,
			srcH	: 256
		};
		ctx.drawImage(neheImage, drawImage.srcX, drawImage.srcY, drawImage.srcW, drawImage.srcH,
			      drawImage.dstX, drawImage.dstY, drawImage.dstW, drawImage.dstH);
	};
	return drawImages;
}

function init()
{
	var canvas	= document.getElementById("canvas");
	
	ctx		= new CanvasGL.Context(canvas);

	// init the texture
	neheImage	= new Image();
	neheImage.onload	= function(){
		ctx._bindImage(neheImage)

		animate();
	}
	neheImage.src	= "images/nehe.gif";
	
}

function animate(){
	requestAnimFrame(animate);
	render();
}

function render()
{
	buildDrawImages(ctx._gl.viewportWidth, ctx._gl.viewportHeight);
	ctx.glFlush();
}


