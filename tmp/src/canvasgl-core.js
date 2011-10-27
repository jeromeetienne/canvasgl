/** namespace */
var CanvasGL	= CanvasGL	|| {};

/**
 * CanvasGL.enable(canvasElement) to make a canvas as possible CanvasGL
*/
CanvasGL.enable	= function(domElement)
{
	domElement.$oldGetContext	= domElement.getContext
	domElement.getContext		= CanvasGL.getContext
}

/**
 * Intercept the context call to forward to canvas 
*/
CanvasGL.getContext	= function(contextId)
{
	var domElement	= this;
	// if it isnt for CanvasGL, forward to previous getContext function
	if( contextId != 'canvasgl' )	return domElement.$oldGetContext.apply(domElement, arguments);
console.log("III")
	return new CanvasGL.Context(domElement);
}
