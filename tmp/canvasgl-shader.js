/** namespace */
var CanvasGL	= CanvasGL	|| {};

CanvasGL._vertexShaderText	= [
	// attribute
	"attribute vec2 aVertexPosition;",
	"attribute vec2 aTextureCoord;",

	// texture
	"varying vec2 vTextureCoord;",

	"void main(void){",
		"gl_Position     = vec4(aVertexPosition.x, aVertexPosition.y, 0, 1.0);",
		"vTextureCoord   = aTextureCoord;",
	"}"
].join("\n");

CanvasGL._fragmentShaderText	= [
	"#ifdef GL_ES",
		"precision highp float;",
	"#endif",

	"varying vec2		vTextureCoord;",
	"uniform sampler2D	uSampler;",

	"void main(void) {",
		"gl_FragColor    = texture2D(uSampler, vTextureCoord);",
	"}"
].join("\n");

CanvasGL.initShaders	= function(gl)
{
	shaderProgram		= CanvasGL._buildShaderProgram(gl, "shader-vs", "shader-fs");
	
	// init shader variables
	shaderProgram.vertexPositionAttribute	= gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.textureCoordAttribute	= gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.samplerUniform		= gl.getUniformLocation(shaderProgram, "uSampler");
}

/**
 * get the text of a shader from Dom ID (up to the caller to compile it)
 *
 * @returns {String} the text of the shader
*/
CanvasGL._getShaderFromDomId	= function(domId)
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
CanvasGL._compileShader	= function(gl, type, text)
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
 * link shader program
 * 
 * @returns the shader program
*/
CanvasGL._buildShaderProgram	= function(gl, vertexDomId, fragmentDomId)
{
	// get vertexShader and fragmentShader
	var vertexShader	= CanvasGL._compileShader(gl, "x-shader/x-vertex", CanvasGL._vertexShaderText);
	var fragmentShader	= CanvasGL._compileShader(gl, "x-shader/x-fragment", CanvasGL._fragmentShaderText);
	
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