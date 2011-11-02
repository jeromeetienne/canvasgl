(function(global){
	
var NoWebGL	= {};
global.NoWebGL	= NoWebGL;

//////////////////////////////////////////////////////////////////////////////////
//		define all the functions to emulate				//
//////////////////////////////////////////////////////////////////////////////////
NoWebGL.Fct			= {}

// list of functions returning undefined
NoWebGL.Fct.undefinedList	= [
	'enable',
	'finish',
	'viewport',
	'clear',
	'save',
	'restore',

	'clearColor',
	'depthFunc',
	'blendEquationSeparate',
	'blendFuncSeparate',
	
	'bindTexture',
	'activeTexture',
	'deleteTexture',
	'texImage2D',
	'texParameteri',

	'uniform1i',
	
	'bindBuffer',
	'bufferData',
	'vertexAttribPointer',
	'drawElements',
	
	'shaderSource',
	'compileShader',
	'attachShader',
	'linkProgram',
	'useProgram',

	'enableVertexAttribArray',
];

// list of function returning true
NoWebGL.Fct.trueList	= [
	'getShaderParameter',
	'getProgramParameter',
];

// list of function returning {}
NoWebGL.Fct.objList	= [
	'createShader',
	'createProgram',
	'createTexture',
	'createBuffer',
	'getAttribLocation',
	'getUniformLocation',
];

// list of constant that need to be set
NoWebGL.Fct.constantList	= [
	'FRAGMENT_SHADER',
	'VERTEX_SHADER',
];

// define the various functions
NoWebGL.Fct.returnUndefined	= function(){ return undefined;	}
NoWebGL.Fct.returnTrue		= function(){ return true;	}
NoWebGL.Fct.returnObject	= function(){ return {};	}

NoWebGL.Context		= {};
NoWebGL.getContext	= function(){	return NoWebGL.Context;	}

NoWebGL.Fct.constantList.forEach(function(method){
	NoWebGL.Context[method]	= 1;	// each constant is equal to 1
});
NoWebGL.Fct.undefinedList.forEach(function(method){
	NoWebGL.Context[method]	= NoWebGL.Fct.returnUndefined;
});
NoWebGL.Fct.trueList.forEach(function(method){
	NoWebGL.Context[method]	= NoWebGL.Fct.returnTrue;
});
NoWebGL.Fct.objList.forEach(function(method){
	NoWebGL.Context[method]	= NoWebGL.Fct.returnObject;
});

})(this);
