/** namespace */
var CanvasGL	= CanvasGL	|| {};

/**
 * CanvasGL.bind(canvasElement) to make a canvas as possible CanvasGL
*/
CanvasGL.bind	= function(domElement)
{
	domElement.$oldGetContext	= domElement.getContext
	domElement.getContext		= CanvasGL.getContext
}

/**
 * CanvasGL.unbind(canvasElement)
*/
CanvasGL.unbind	= function(domElement)
{
	domElement.getContext		= domElement.$oldGetContext;
	delete domElement.$oldGetContext;
}

/**
 * Intercept the context call to forward to canvas 
*/
CanvasGL.getContext	= function(contextId)
{
	var domElement	= this;
	// if it isnt for CanvasGL, forward to previous getContext function
	if( contextId != '2d' )	return domElement.$oldGetContext.apply(domElement, arguments);

	return new CanvasGL.Context(domElement);
}
