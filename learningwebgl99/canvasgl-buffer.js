/** namespace */
var CanvasGL	= CanvasGL	|| {};

CanvasGL._initVertexPositionsBuffers	= function(gl, drawImages)
{
	var viewportW	= gl.viewportWidth;
	var viewportH	= gl.viewportHeight;

	var appendVertexPosition	= function(positions, x,y, width, height){
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
		appendVertexPosition(vertices, drawImage.dstX, drawImage.dstY, drawImage.dstW, drawImage.dstH);
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squareVertexPositionBuffer.itemSize = 2;
	squareVertexPositionBuffer.numItems = vertices.length/squareVertexPositionBuffer.itemSize;
}

CanvasGL._initTextureCoordsBuffers	= function(gl, drawImages)
{
	var imageW	= 256;
	var imageH	= 256;

	var appendTextureCoord	= function(arr, x,y, width, height){
		var pixelXToPosition	= function(x){
			return x / imageW;
		};
		var pixelYToPosition	= function(y){
			return y / imageH;
		};
		var minX	= pixelXToPosition(x);
		var maxX	= pixelXToPosition(x+width);
		var minY	= pixelYToPosition(y);
		var maxY	= pixelYToPosition(y+height);
		arr.push(minX);	arr.push(minY);
		arr.push(maxX);	arr.push(minY);
		arr.push(maxX);	arr.push(maxY);
		arr.push(minX);	arr.push(maxY);
	};

	squareTextureCoordBuffer	= gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareTextureCoordBuffer);
	// here to push the src vectors
	var textureCoords = [];
// srcx, srcy, srcW, srcH
	for(var i=0; i < drawImages.length; i++){
		var drawImage	= drawImages[i];
		appendTextureCoord(textureCoords, drawImage.srcX, drawImage.srcY, drawImage.srcW, drawImage.srcH)
        }
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	squareTextureCoordBuffer.itemSize = 2;
	squareTextureCoordBuffer.numItems = textureCoords.length/squareTextureCoordBuffer.itemSize;
}

CanvasGL._initVertexIndexBuffers	= function(gl, drawImages)
{
	squareVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
	var squareVertexIndices = [];
	for(var i=0; i < drawImages.length; i++){
		// face one
		squareVertexIndices.push(i*4+0);	squareVertexIndices.push(i*4+1);	squareVertexIndices.push(i*4+2);
		// face two
		squareVertexIndices.push(i*4+0);	squareVertexIndices.push(i*4+2);	squareVertexIndices.push(i*4+3);
	}
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareVertexIndices), gl.STATIC_DRAW);
	squareVertexIndexBuffer.itemSize = 1;
	squareVertexIndexBuffer.numItems = squareVertexIndices.length/squareVertexIndexBuffer.itemSize;
}

CanvasGL.initBuffers	= function(gl, drawImages)
{
	CanvasGL._initVertexPositionsBuffers(gl, drawImages);
	CanvasGL._initTextureCoordsBuffers(gl, drawImages)
	CanvasGL._initVertexIndexBuffers(gl, drawImages)
};