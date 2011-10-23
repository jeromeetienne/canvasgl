CanvasGL.Context	= function(domElement)
{
	this._domElement	= domElement;
	this._drawImages	= [];

	this._initGL();

	// init shaders
	CanvasGL.initShaders(this._gl);

	this._initBuffers();
}

CanvasGL.Context.prototype._initGL	= function()
{
	try {
		// get the context
		this._gl		= this._domElement.getContext("experimental-webgl");
		// set the context dimensions
		this._gl.viewportWidth	= this._domElement.width;
		this._gl.viewportHeight	= this._domElement.height;
	}catch (e){}
	// check for errors
	if (!this._gl)	alert("Could not initialise WebGL, sorry :-(");

	this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this._gl.enable(this._gl.DEPTH_TEST);
}

CanvasGL.Context.prototype.glFlush	= function()
{
	this._render(this._drawImages);
	this._drawImages	= [];	// reallocation ? any bench
}

CanvasGL.Context.prototype.drawImage	= function(imgElement)
{
	var dstX, dstY;
	var srcX = 0;
	var srcY = 0;
	var srcW = imgElement.width;
	var srcH = imgElement.height;
	var dstW = imgElement.width;
	var dstH = imgElement.height;
	if( arguments.length === 3 ){
		//ctx.drawImage(imgElement, dstX, dstY);
		dstX	= arguments[1];
		dstY	= arguments[2];
	}else if( arguments.length === 5 ){
		//ctx.drawImage(imgElement, dstX, dstY, dstW, dstH);
		dstX	= arguments[1];
		dstY	= arguments[2];
		dstW	= arguments[3];
		dstH	= arguments[4];
	}else if( arguments.length === 9 ){
		//ctx.drawImage(imgElement, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
		srcX	= arguments[1];
		srcY	= arguments[2];
		srcW	= arguments[3];
		srcH	= arguments[4];
		dstX	= arguments[5];
		dstY	= arguments[6];
		dstW	= arguments[7];
		dstH	= arguments[8];
	}else console.assert(false);

	// queue this in the drawImages array
	this._drawImages.push({
		img	: imgElement,
		srcX	: srcX,
		srcY	: srcY,
		srcW	: srcW,
		srcH	: srcH,
		dstX	: dstX,
		dstY	: dstY,
		dstW	: dstW,
		dstH	: dstH
	});
}

CanvasGL.Context.prototype._bindImage	= function(image)
{
	var gl		= this._gl;
	var texture	= gl.createTexture();
	image._canvasglTexture	= texture;
	gl.bindTexture	(gl.TEXTURE_2D, texture);
	gl.texImage2D	(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture	(gl.TEXTURE_2D, null);
}



CanvasGL.Context.prototype._render	= function(drawImages)
{
	var gl	= this._gl;
	
	this._updateBuffers();

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, this._bufVertexPosition);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this._bufVertexPosition.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this._bufTextureCoord);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this._bufTextureCoord.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, neheImage._canvasglTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	// TODO this should be triangle strip ? trigrou says no
	// - so unclear at best. gl.TRIANGLES are simple. leave them for now
	// drawElements got limitations from a size pov
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._bufVertexIndex);
	gl.drawElements(gl.TRIANGLES, this._bufVertexIndex.numItems, gl.UNSIGNED_SHORT, 0);
	
}


//////////////////////////////////////////////////////////////////////////////////
//		Buffers								//
//////////////////////////////////////////////////////////////////////////////////

CanvasGL.Context.prototype._initBuffers	= function()
{
	var gl			= this._gl;
	this._bufVertexPosition	= gl.createBuffer();
	this._bufTextureCoord	= gl.createBuffer();
	this._bufVertexIndex	= gl.createBuffer();
}

CanvasGL.Context.prototype._updateBuffers	= function()
{
	this._updateVertexPositionsBuffers();
	this._updateTextureCoordsBuffers()
	this._updateVertexIndexBuffers()
}

CanvasGL.Context.prototype._updateVertexPositionsBuffers	= function()
{
	var gl		= this._gl;
	var drawImages	= this._drawImages;
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

	gl.bindBuffer(gl.ARRAY_BUFFER, this._bufVertexPosition);

	var vertices 	= [];
	for( var i = 0; i < drawImages.length; i++){
// dstX, dstY, dstW, dstH
		var drawImage	= drawImages[i];
		appendVertexPosition(vertices, drawImage.dstX, drawImage.dstY, drawImage.dstW, drawImage.dstH);
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this._bufVertexPosition.itemSize = 2;
	this._bufVertexPosition.numItems = vertices.length/this._bufVertexPosition.itemSize;
}


CanvasGL.Context.prototype._updateTextureCoordsBuffers	= function()
{
	var gl		= this._gl;
	var drawImages	= this._drawImages;
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

	gl.bindBuffer(gl.ARRAY_BUFFER, this._bufTextureCoord);
	// here to push the src vectors
	var textureCoords = [];
// srcx, srcy, srcW, srcH
	for(var i=0; i < drawImages.length; i++){
		var drawImage	= drawImages[i];
		appendTextureCoord(textureCoords, drawImage.srcX, drawImage.srcY, drawImage.srcW, drawImage.srcH)
        }
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	this._bufTextureCoord.itemSize = 2;
	this._bufTextureCoord.numItems = textureCoords.length/this._bufTextureCoord.itemSize;
}

CanvasGL.Context.prototype._updateVertexIndexBuffers	= function()
{
	var gl		= this._gl;
	var drawImages	= this._drawImages;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._bufVertexIndex);
	var squareVertexIndices = [];
	for(var i=0; i < drawImages.length; i++){
		// face one
		squareVertexIndices.push(i*4+0);	squareVertexIndices.push(i*4+1);	squareVertexIndices.push(i*4+2);
		// face two
		squareVertexIndices.push(i*4+0);	squareVertexIndices.push(i*4+2);	squareVertexIndices.push(i*4+3);
	}
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareVertexIndices), gl.STATIC_DRAW);
	this._bufVertexIndex.itemSize = 1;
	this._bufVertexIndex.numItems = squareVertexIndices.length/this._bufVertexIndex.itemSize;
}

