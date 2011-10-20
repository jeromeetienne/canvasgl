/** namespace */
var CanvasGL	= CanvasGL	|| {};

/**
 * get the text of a shader from Dom ID (up to the caller to compile it)
 *
 * @returns {String} the text of the shader
*/
CanvasGL.getShaderFromDomId	= function(domId)
{
	var element	= document.getElementById(domId);
	var text	= "";
	console.assert(element);
	
	var element	= element.firstChild;
	while(element){
		if( element.nodeType == 3)	text	+= element.textContent;
		element	= element.nextSibling;
	}
	return text;
}

/**
 * Compile a shader from its type and text
 * 
 * @returns the compiled shader
*/
CanvasGL.compileShader	= function(gl, type, text)
{
	var type2gl	= {
		"x-shader/x-fragment"	: gl.FRAGMENT_SHADER,
		"x-shader/x-vertex"	: gl.VERTEX_SHADER
	};
	// sanity check - 
	console.assert(type2gl[type], "unknown type of shader: "+type);
	// create and compile shader
	var shader	= gl.createShader(type2gl[type]);
	gl.shaderSource(shader, text);
	gl.compileShader(shader);
	// check if there is a compilation error
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		console.assert(false);
	}
	// return the shader itself
	return shader;
}

/**
 * get and compile a shader
*/
CanvasGL.getAndCompileShader	= function(gl, type, domId)
{
	var text	= CanvasGL.getShaderFromDomId(domId);
	var code	= CanvasGL.compileShader(gl, type, text);
	return code;
}

/**
 * link shader program
 * 
 * @returns the shader program
*/
CanvasGL.buildShaderProgram	= function(gl, vertexDomId, fragmentDomId)
{
	// get vertexShader and fragmentShader
	var vertexShader	= CanvasGL.getAndCompileShader(gl, "x-shader/x-vertex"	, vertexDomId);
	var fragmentShader	= CanvasGL.getAndCompileShader(gl, "x-shader/x-fragment", fragmentDomId);
	
	// create and link the program
	var program	= gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	// check if an error occured
	if(!gl.getProgramParameter(program, gl.LINK_STATUS) ){
		alert("Could not initialise shaders");
		console.assert(false);
	}
	// use this program
	// TODO is this needed here ??? 
	gl.useProgram(program);
	// return the shader program
	return program;
}