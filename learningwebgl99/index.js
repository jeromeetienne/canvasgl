var gl;	

var neheTexture;

var shaderProgram;

var squareVertexPositionBuffer;
var squareTextureCoordBuffer;
var squareVertexIndexBuffer;

/**
 * So this will be done by CanvasGL canvas api
*/
function buildDrawImages()
{
	var viewportW	= gl.viewportWidth;
	var viewportH	= gl.viewportHeight;
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
	
	gl		= CanvasGL.initGL(canvas);

	// init the texture
	neheTexture	= CanvasGL.initTexture("images/nehe.gif");

	// init shaders
	CanvasGL.initShaders(gl);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	CanvasGL.initBuffers(gl);
	
	animate();
}

function animate(){
	requestAnimFrame(animate);
	render();
}

function render(){
	var drawImages	= buildDrawImages();

	CanvasGL.updateBuffers(gl, drawImages);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, neheTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	// TODO this should be triangle strip ? trigrou says no
	// - so unclear at best. gl.TRIANGLES are simple. leave them for now
	// drawElements got limitations from a size pov
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


