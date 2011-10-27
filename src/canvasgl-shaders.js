/** namespace */
var CanvasGL		= CanvasGL		|| {};
CanvasGL.Context	= CanvasGL.Context	|| {};

CanvasGL.Context.Shaders	= function(gl)
{
	this._gl	= gl;

	this._program	= this._buildShaderProgram();
	shaderProgram	= this._program;
	
	// init shader variables
	var program	= this._program;
	
// TODO those variables names are too big
// - they are use in canvasgl-context._render()
	
	program.vertexPositionAttribute	= gl.getAttribLocation(program, "aVertexPosition");
	gl.enableVertexAttribArray(program.vertexPositionAttribute);

	program.textureCoordAttribute	= gl.getAttribLocation(program, "aTextureCoord");
	gl.enableVertexAttribArray(program.textureCoordAttribute);

	program.samplerUniform		= gl.getUniformLocation(program, "uSampler");
}

CanvasGL.Context.Shaders.prototype.program	= function(){ return this._program;	}

CanvasGL.Context.Shaders._vertexShaderText	= [
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

CanvasGL.Context.Shaders._fragmentShaderText	= [
	"#ifdef GL_ES",
		"precision highp float;",
	"#endif",

	"varying vec2		vTextureCoord;",
	"uniform sampler2D	uSampler;",

	"void main(void) {",
		"gl_FragColor    = texture2D(uSampler, vTextureCoord);",
	"}"
].join("\n");


/**
 * link shader program
 * 
 * @returns the shader program
*/
CanvasGL.Context.Shaders.prototype._buildShaderProgram	= function()
{
	var gl			= this._gl;
	// get vertexShader and fragmentShader
	var vertexShader	= this._compileShader("x-shader/x-vertex"	, CanvasGL.Context.Shaders._vertexShaderText);
	var fragmentShader	= this._compileShader("x-shader/x-fragment"	, CanvasGL.Context.Shaders._fragmentShaderText);

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

/**
 * Compile a shader from its type and text
 * 
 * @returns the compiled shader
*/
CanvasGL.Context.Shaders.prototype._compileShader	= function(type, text)
{
	var gl		= this._gl;
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
