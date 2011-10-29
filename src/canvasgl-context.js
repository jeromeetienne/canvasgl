/** namespace */
var CanvasGL	= CanvasGL	|| {};

CanvasGL.Context	= function(domElement)
{
	this._domElement	= domElement;
	this._drawImages	= [];

	this._initGL();
	this._shaders	= new CanvasGL.Context.Shaders(this._gl);
	this._buffers	= new CanvasGL.Context.Buffers(this._gl);
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

CanvasGL.Context.prototype.update	= function()
{
	this._render();
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
	}else console.assert(false, "wrong number of parameters in .drawImage()");

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
	console.assert( !image._canvasglTexture );
	var gl		= this._gl;
	var texture	= gl.createTexture();
	image._canvasglTexture	= texture;
	var initTexture	= function(){
		console.log("init texture for ", image)
		gl.bindTexture	(gl.TEXTURE_2D, texture);
		gl.texImage2D	(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture	(gl.TEXTURE_2D, null);		
	};
	// image.width === 0 when it isnt yet loaded
	var isLoaded	= image.width ? true : false;
	if( isLoaded )	initTexture();
	else		image.onload	= function(){ initTexture(); }
}

CanvasGL.Context.prototype._isBoundImage	= function(image)
{
	return image._canvasglTexture ? true : false;
}

CanvasGL.Context.prototype._render	= function()
{
	var gl		= this._gl;
	var drawImages	= this._drawImages;

	// clear the screen
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	// TODO do i need DEPTH ?
	
	// detect batch using the same image as source
	for(var indexFirst = 0; indexFirst < drawImages.length;){
		var indexLast	= indexFirst;
		for(var i = indexFirst; i < drawImages.length; i++){
			if( drawImages[i].img !== drawImages[indexFirst].img )	break;
			indexLast	= i;
		}
		this._renderImage(drawImages, indexFirst, indexLast, true);
		indexFirst	= indexLast+1;
	}
}

CanvasGL.Context.prototype._renderImage	= function(drawImages, indexFirst, indexLast, bufferUpdate)
{
	var image	= drawImages[indexFirst].img;
	var program	= this._shaders.program();
	var gl		= this._gl;

	// build the buffer
	bufferUpdate && this._buffers.update(drawImages, indexFirst, indexLast);

	var buffer	= this._buffers.vertexPosition();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(program.vertexPositionAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);

	var buffer	= this._buffers.textureCoord();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(program.textureCoordAttribute, buffer.itemSize, gl.FLOAT, false, 0, 0);

	if( !image._canvasglTexture )	this._bindImage(image);
	var texture	= image._canvasglTexture;
console.log("image", image, texture)
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(program.samplerUniform, 0);

	// TODO this should be triangle strip ? trigrou says no
	// - so unclear at best. gl.TRIANGLES are simple. leave them for now
	// drawElements got limitations from a size pov
	var buffer	= this._buffers.vertexIndex();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
	gl.drawElements(gl.TRIANGLES, buffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//////////////////////////////////////////////////////////////////////////////////
//		ProxyCtx							//
//////////////////////////////////////////////////////////////////////////////////

CanvasGL.Context.prototype._proxyctxCreateIfNeeded	= function()
{
	if( this._proxyctx )	return this._proxyctx;
	var canvas	= this._proxyCanvas	= document.createElement('canvas');
	var ctx 	= this._proxyctx	= this._proxyCanvas.getContext('2d');
	canvas.width	= this._gl.viewportWidth;
	canvas.height	= this._gl.viewportHeight;
console.log("canvas", canvas)
	return this._proxyctx;
}

CanvasGL.Context.prototype._proxyctxFlush	= function()
{
	var canvas	= this._proxyCanvas;
	window.open(canvas.toDataURL());
	this.drawImage(canvas, 0, 0);
	this._proxyCanvas	= null;
	this._proxyctx		= null;
}

CanvasGL.Context.proxyGetter	= function(property){
	CanvasGL.Context.prototype.__defineGetter__(property, function(){
		this._proxyctxCreateIfNeeded();
		console.log("Getter", property, "returns", this._proxyctx[property]);
		return this._proxyctx[property];
	});
}

CanvasGL.Context.proxySetter	= function(property){
	CanvasGL.Context.prototype.__defineSetter__(property, function(value){
		this._proxyctxCreateIfNeeded();
		console.log("Setter", property, "from", this._proxyctx[property], "to", value);
		return this._proxyctx[property]	= value;
	});
}

CanvasGL.Context.proxyDrawCall	= function(property){
	CanvasGL.Context.prototype[property]	= function(){
		this._proxyctxCreateIfNeeded();
		console.log("proxyDrawCall", property, arguments)
		this._proxyctx[property].apply(this._proxyctx, arguments);
		this._proxyctxFlush();
	};
}

CanvasGL.Context.proxyGetter("fillStyle");
CanvasGL.Context.proxySetter("fillStyle");
CanvasGL.Context.proxyDrawCall("fillRect");

