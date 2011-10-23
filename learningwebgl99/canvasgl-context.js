CanvasGL.Context	= function(domElement)
{
	this._domElement	= domElement;
	this._drawImages	= [];

	this._initGL();


	// init shaders
	CanvasGL.initShaders(this._gl);

	this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this._gl.enable(this._gl.DEPTH_TEST);

	CanvasGL.initBuffers(this._gl);

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


/**
 * 
*/
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
	
	CanvasGL.updateBuffers(gl, drawImages);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, neheImage._canvasglTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	// TODO this should be triangle strip ? trigrou says no
	// - so unclear at best. gl.TRIANGLES are simple. leave them for now
	// drawElements got limitations from a size pov
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
}