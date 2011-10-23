var ctx;

var neheTexture;

// TODO all those should be in canvasgl-context
var shaderProgram;
var squareVertexPositionBuffer;
var squareTextureCoordBuffer;
var squareVertexIndexBuffer;

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
			dstX	: offsetX + Math.random()*(viewportW-64),
			dstY	: offsetY + Math.random()*(viewportH-64),
			dstW	: 64,
			dstH	: 64,

			srcX	: 0,
			srcY	: 0,
			srcW	: 256,
			srcH	: 256
		};
		drawImages.push(drawImage);
	};
	return drawImages;
}

function init()
{
	var canvas	= document.getElementById("canvas");
	
	ctx		= new CanvasGL.Context(canvas);

	// init the texture
	neheTexture	= CanvasGL.initTexture(ctx._gl, "images/nehe.gif");
	
	animate();
}

function animate(){
	requestAnimFrame(animate);
	render();
}

function render(){
	var drawImages	= buildDrawImages(ctx._gl.viewportWidth, ctx._gl.viewportHeight);

	ctx._flush(drawImages);
}


