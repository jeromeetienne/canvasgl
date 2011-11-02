/**
 * proxy context is a way to emulate canvas API by forwarding any call to an actual canvas
 * - it is using Canvas.Context.prototype directly
 *   - not too clean it would be better which a distinct class
 * - TODO apparently the created canvas are never freed
*/

CanvasGL.Context.prototype._proxyctxCreateIfNeeded	= function()
{
	if( this._proxyctx )	return this._proxyctx;
	var canvas	= this._proxyCanvas	= document.createElement('canvas');
	var ctx 	= this._proxyctx	= this._proxyCanvas.getContext('2d');
	canvas.width	= this._gl.viewportWidth;
	canvas.height	= this._gl.viewportHeight;
//console.log("canvas", canvas)
	return this._proxyctx;
}

CanvasGL.Context.prototype._proxyctxFlush	= function()
{
	var canvas	= this._proxyCanvas;
// TODO to debug
if( false ){
	window.open(canvas.toDataURL());
}
if( false ){
	var element	= document.createElement("img");
	element.src	= canvas.toDataURL();
	document.body.appendChild(element)
}
	this.drawImage(canvas, 0, 0);
	this._proxyCanvas	= null;
	this._proxyctx		= null;
}

CanvasGL.Context.proxyGetter	= function(property){
	CanvasGL.Context.prototype.__defineGetter__(property, function(){
		this._proxyctxCreateIfNeeded();
		//console.log("Getter", property, "returns", this._proxyctx[property]);
		return this._proxyctx[property];
	});
}

CanvasGL.Context.proxySetter	= function(property){
	CanvasGL.Context.prototype.__defineSetter__(property, function(value){
		this._proxyctxCreateIfNeeded();
		//console.log("Setter", property, "from", this._proxyctx[property], "to", value);
		return this._proxyctx[property]	= value;
	});
}

CanvasGL.Context.proxyCall	= function(property, withFlush){
	CanvasGL.Context.prototype[property]	= function(){
		this._proxyctxCreateIfNeeded();
		//console.log("proxyDrawCall", property, arguments)
		this._proxyctx[property].apply(this._proxyctx, arguments);
		if( withFlush )	this._proxyctxFlush();
	};
}

// define all the properties to proxy
CanvasGL.Context._proxyGetterSetters	= [
	"fillStyle",
	"globalAlpha",
];
CanvasGL.Context._proxyCalls		= [
	"beginPath", "closePath", "moveTo", "lineTo",
	"save", "restore",
	"rotate", "scale", "translate",
];
CanvasGL.Context._proxyDrawCalls	= [
	"fillRect", "strokeRect", "clearRect",
	"stroke", "fill",
];

// actually bind those calls into CanvasGL.Context.prototype
CanvasGL.Context._proxyDrawCalls.forEach(function(property){
	CanvasGL.Context.proxyCall(property, true);
})
CanvasGL.Context._proxyCalls.forEach(function(property){
	CanvasGL.Context.proxyCall(property, false);
})
CanvasGL.Context._proxyGetterSetters.forEach(function(property){
	CanvasGL.Context.proxyGetter(property);
	CanvasGL.Context.proxySetter(property);
})

