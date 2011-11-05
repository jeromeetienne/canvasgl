(function(exports){
	
var NoWebGL	= {};
exports.NoWebGL	= NoWebGL;

//////////////////////////////////////////////////////////////////////////////////
//		define all the functions to emulate				//
//////////////////////////////////////////////////////////////////////////////////
NoWebGL.Fct			= {}

// list of functions returning undefined
NoWebGL.Fct.undefinedList	= [
	'enable',
	'disable',
	'finish',
	'viewport',
	'clear',
	'save',
	'restore',

	'lineWidth',

	'depthFunc',
	'depthMask',
	'clearDepth',
	
	'clearColor',

	'clearStencil',
	'frontFace',
	'cullFace',
	
	'blendEquation',
	'blendFunc',
	'blendEquationSeparate',
	'blendFuncSeparate',
	
	'bindTexture',
	'activeTexture',
	'deleteTexture',
	'texImage2D',
	'texParameteri',

	'uniform1i',
	'uniform1f',
	'uniform3f',
	'uniform4f',
	'uniform1fv',
	'uniform3fv',
	'uniform1iv',
	'uniformMatrix3fv',
	'uniformMatrix4fv',
	
	'bindRenderbuffer',
	'bindFramebuffer',
	'renderbufferStorage',
	
	'generateMipmap',
	
	'bindBuffer',
	'bufferData',
	'vertexAttribPointer',
	'drawElements',
	'drawArrays',
	
	'shaderSource',
	'compileShader',
	'attachShader',
	'linkProgram',
	'useProgram',

	'enableVertexAttribArray',
];

// list of function returning true
NoWebGL.Fct.trueList	= [
	'getParameter',
	'getShaderParameter',
	'getProgramParameter',
	
	'framebufferTexture2D',
	'framebufferRenderbuffer',
];

// list of function returning {}
NoWebGL.Fct.objList	= [
	'createShader',
	'createProgram',
	'createTexture',
	'createBuffer',
	'createRenderbuffer',
	'createFramebuffer',
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
NoWebGL.getContext	= function(contextId){
	if( contextId != "experimental-webgl" )	return origGetContext.apply(this, arguments);
	return NoWebGL.Context;
}

// hijack the normal HTMLCanvasElement
var origGetContext	= HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext  = NoWebGL.getContext;
NoWebGL.noConflict	= function(){
	HTMLCanvasElement.prototype.getContext  = origGetContext;
}

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
