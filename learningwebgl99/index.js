var gl;	

var neheTexture;

var shaderProgram;

var squareVertexPositionBuffer;
var squareTextureCoordBuffer;
var squareVertexIndexBuffer;

function initShaders(gl) {
	shaderProgram		= CanvasGL.compileShaderProgram(gl, "shader-vs", "shader-fs");
    
	// init shader variables
	shaderProgram.vertexPositionAttribute	= gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.textureCoordAttribute	= gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.samplerUniform		= gl.getUniformLocation(shaderProgram, "uSampler");
}

function buildDrawImages()
{
	var viewportW	= gl.viewportWidth;
	var viewportH	= gl.viewportHeight;
	var drawImages	= [];
	for( var i = 0; i < 10; i++){
		var drawImage	= {
			dstX	: Math.random()*viewportW,
			dstY	: Math.random()*viewportH,
			dstW	: 64,
			dstH	: 64
		};
		drawImages.push(drawImage);
	};
	return drawImages;
}

/**
 * TODO make the pixel to clip coordinate conversion in gpu
 * - viewportW, viewportH in uniforms
*/
function initBuffers(gl, drawImages)
{
	var viewportW	= gl.viewportWidth;
	var viewportH	= gl.viewportHeight;


	var appendPosition	= function(positions, x,y, width, height){
		var pixelXToPosition	= function(x){
			return (x - viewportW/2) / (viewportW/2);
		};
		var pixelYToPosition	= function(y){
			return - (y - viewportH/2) / (viewportH/2);
		};
		var minX	= pixelXToPosition(x);
		var maxX	= pixelXToPosition(x+width);
		var minY	= pixelYToPosition(y);
		var maxY	= pixelYToPosition(y+height);
		positions.push(minX);	positions.push(minY);
		positions.push(maxX);	positions.push(minY);
		positions.push(maxX);	positions.push(maxY);
		positions.push(minX);	positions.push(maxY);
	};

	squareVertexPositionBuffer	= gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);

	var vertices 	= [];
	for( var i = 0; i < drawImages.length; i++){
// dstX, dstY, dstW, dstH
		var drawImage	= drawImages[i];
		appendPosition(vertices, drawImage.dstX, drawImage.dstY, drawImage.dstW, drawImage.dstH);
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squareVertexPositionBuffer.itemSize = 2;
	squareVertexPositionBuffer.numItems = vertices.length/squareVertexPositionBuffer.itemSize;

	var nbSquare	= vertices.length/8;
	console.log("nbsquare", nbSquare);

	squareTextureCoordBuffer	= gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareTextureCoordBuffer);
	// here to push the src vectors
	var textureCoords = [];
// srcx, srcy, srcW, srcH
	for(var i=0; i < nbSquare; i++){
		textureCoords.push(0.0);	textureCoords.push(0.0);
		textureCoords.push(1.0);	textureCoords.push(0.0);
		textureCoords.push(1.0);	textureCoords.push(1.0);
		textureCoords.push(0.0);	textureCoords.push(1.0);
        }
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	squareTextureCoordBuffer.itemSize = 2;
	squareTextureCoordBuffer.numItems = textureCoords.length/squareTextureCoordBuffer.itemSize;
	
	squareVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
	var squareVertexIndices = [];
	for(var i=0; i < nbSquare; i++) {
		// face one
		squareVertexIndices.push(i*4+0);	squareVertexIndices.push(i*4+1);	squareVertexIndices.push(i*4+2);
		// face two
		squareVertexIndices.push(i*4+0);	squareVertexIndices.push(i*4+2);	squareVertexIndices.push(i*4+3);
	}
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareVertexIndices), gl.STATIC_DRAW);
	squareVertexIndexBuffer.itemSize = 1;
	squareVertexIndexBuffer.numItems = squareVertexIndices.length/squareVertexIndexBuffer.itemSize;
};

function drawScene(gl) {
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
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function tick() {
	requestAnimFrame(tick);
	drawScene(gl);
}


function webGLStart()
{
	var canvas	= document.getElementById("lesson05-canvas");
	gl		= CanvasGL.initGL(canvas);
	initShaders(gl);

	var drawImages	= buildDrawImages();
	//console.log("drawImages", drawImages)
	initBuffers(gl, drawImages);
	neheTexture	= CanvasGL.initTexture("images/nehe.gif");
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	tick();
}
