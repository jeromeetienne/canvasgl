/** namespace */
var CanvasGL	= CanvasGL	|| {};


/**
 * Init webgl on canvas domElement
 * return the gl context
*/
CanvasGL.initGL	= function(canvas){
	var gl;
	try {
		gl			= canvas.getContext("experimental-webgl");
		gl.viewportWidth	= canvas.width;
		gl.viewportHeight	= canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
	return gl;
}

/**
 * get a shader from the DOM and compile it
 *
 * TODO split this into getShaderFromDom and compileShader. what to do about the type
 * TODO to rename grabAndCompileShader
*/
CanvasGL.getShader	= function(gl, domId)
{
	var shaderElement	= document.getElementById(domId);
	console.assert(shaderElement);
	
	var shaderText		= "";

	var element	= shaderElement.firstChild;
	while(element){
		if( element.nodeType == 3)	shaderText	+= element.textContent;
		element	= element.nextSibling;
	}
	
	var shader;
	if (shaderElement.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderElement.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else	console.assert(false, "unknown type of shader: "+shaderElement.type);
	
	gl.shaderSource(shader, shaderText);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		console.assert(false);
	}
	
	return shader;
}

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

CanvasGL.compileShaderProgram	= function(gl, vertexDomId, fragmentDomId)
{
	var fragmentShader	= CanvasGL.getShader(gl, fragmentDomId);
	var vertexShader	= CanvasGL.getShader(gl, vertexDomId);

	var shaderProgram	= gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
    
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
		console.assert(false);
	}

	gl.useProgram(shaderProgram);

	return shaderProgram;
}
