/** namespace */
var CanvasGL		= CanvasGL		|| {};
CanvasGL.Context	= CanvasGL.Context	|| {};

CanvasGL.Context.Buffers	= function(gl)
{
	this._gl		= gl;
	this._bufVertexPosition	= gl.createBuffer();
	this._bufTextureCoord	= gl.createBuffer();
	this._bufVertexIndex	= gl.createBuffer();
}

CanvasGL.Context.Buffers.prototype.vertexPosition	= function(){ return this._bufVertexPosition;	}
CanvasGL.Context.Buffers.prototype.textureCoord		= function(){ return this._bufTextureCoord;	}
CanvasGL.Context.Buffers.prototype.vertexIndex		= function(){ return this._bufVertexIndex;	}

CanvasGL.Context.Buffers.prototype.update	= function(drawImages)
{
	this._updateVertexPositionsBuffers(drawImages);
	this._updateTextureCoordsBuffers(drawImages)
	this._updateVertexIndexBuffers(drawImages)
}

CanvasGL.Context.Buffers.prototype._updateVertexPositionsBuffers	= function(drawImages)
{
	var gl		= this._gl;
	var viewportW	= gl.viewportWidth;
	var viewportH	= gl.viewportHeight;

	var appendVertexPosition	= function(positions, x,y, width, height){
		var pixelXToPosition	= function(x){
			return + (x - viewportW/2) / (viewportW/2);
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

	var values 	= [];
	for( var i = 0; i < drawImages.length; i++){
// dstX, dstY, dstW, dstH
		var drawImage	= drawImages[i];
		appendVertexPosition(values, drawImage.dstX, drawImage.dstY, drawImage.dstW, drawImage.dstH);
	}

	var buffer	= this._bufVertexPosition;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
	buffer.itemSize	= 2;
	buffer.numItems	= values.length/buffer.itemSize;
}


CanvasGL.Context.Buffers.prototype._updateTextureCoordsBuffers	= function(drawImages)
{
	var gl		= this._gl;
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

	// here to push the texture coordinates
	var values	= [];
	for(var i=0; i < drawImages.length; i++){
		var drawImage	= drawImages[i];
		appendTextureCoord(values, drawImage.srcX, drawImage.srcY, drawImage.srcW, drawImage.srcH)
        }

	var buffer	= this._bufTextureCoord;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
	buffer.itemSize = 2;
	buffer.numItems = values.length/buffer.itemSize;
}

CanvasGL.Context.Buffers.prototype._updateVertexIndexBuffers	= function(drawImages)
{
	var gl		= this._gl;

	var values	= [];
	for(var i=0; i < drawImages.length; i++){
		// face one
		values.push(i*4+0);	values.push(i*4+1);	values.push(i*4+2);
		// face two
		values.push(i*4+0);	values.push(i*4+2);	values.push(i*4+3);
	}
	
	var buffer	= this._bufVertexIndex;
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(values), gl.STATIC_DRAW);
	buffer.itemSize	= 1;
	buffer.numItems	= values.length/buffer.itemSize;
}


