/** namespace */
var CanvasGL	= CanvasGL	|| {};


/**
 * Init webgl on canvas domElement
 * 
 * @returns gl context
*/
CanvasGL.initGL	= function(canvas)
{
	try {
		// get the context
		var gl			= canvas.getContext("experimental-webgl");
		// set the context dimensions
		gl.viewportWidth	= canvas.width;
		gl.viewportHeight	= canvas.height;
	}catch (e){}
	// check for errors
	if (!gl)	alert("Could not initialise WebGL, sorry :-(");
	// return gl context
	return gl;
}

/**
 * Load and init a TEXTURE_2D
 * 
 * @returns a texture
*/
CanvasGL.initTexture	= function(url)
{
	var texture	= gl.createTexture();
	var image	= new Image();
	image.onload	= function(){
		gl.bindTexture	(gl.TEXTURE_2D, texture);
		gl.texImage2D	(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture	(gl.TEXTURE_2D, null);
	}
	image.src	= url;
	return texture;
}

