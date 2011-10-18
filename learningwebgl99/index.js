var gl;

function initGL(canvas) {
	try {
		gl	= canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}


function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}
	
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}

	
var shaderProgram;

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
    
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
    
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
    
	gl.useProgram(shaderProgram);
    
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    
	shaderProgram.samplerUniform	= gl.getUniformLocation(shaderProgram, "uSampler");
}

var	neheTexture;
function initTexture() {
	var texture	= gl.createTexture();
	var image	= new Image();
	image.onload	= function(){
		gl.bindTexture	(gl.TEXTURE_2D, texture);
		gl.texImage2D	(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture	(gl.TEXTURE_2D, null);
	}
	image.src	= "nehe.gif";
	
	neheTexture	= texture;
}


var squareVertexPositionBuffer;
var squareVertexTextureCoordBuffer;
var squareVertexIndexBuffer;

function initBuffers() {
	var viewportW	= 512;
	var viewportH	= 512;
	
	var pixelXToPosition	= function(x){
		return (x - viewportW/2) / (viewportW/2);
	}
	var pixelYToPosition	= function(y){
		return - (y - viewportH/2) / (viewportH/2);
	}
	var buildPosition	= function(x,y, width, height){
		var minX	= pixelXToPosition(x);
		var maxX	= pixelXToPosition(x+width);
		var minY	= pixelYToPosition(y);
		var maxY	= pixelYToPosition(y+height);
		return [
			minX, minY,
			maxX, minY,
			maxX, maxY,
			minX, maxY
		];
	}
	
	squareVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	var vertices 	= [];
	vertices	= vertices.concat( buildPosition(0,0,50,50) );
	vertices	= vertices.concat( buildPosition(150,50,150,50) );
console.log("vertice", vertices)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squareVertexPositionBuffer.itemSize = 2;
	squareVertexPositionBuffer.numItems = vertices.length/squareVertexPositionBuffer.itemSize;

var nbSquare	= vertices.length/8;

	squareVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer);
	// here to push the src vectors
	var textureCoords = [];
	for(var i=0; i < nbSquare; i++) {
		textureCoords = textureCoords.concat([
			0.0, 0.0,
			1.0, 0.0,
			1.0, 1.0,
			0.0, 1.0,
		]);
        }
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	squareVertexTextureCoordBuffer.itemSize = 2;
	squareVertexTextureCoordBuffer.numItems = textureCoords.length/squareVertexTextureCoordBuffer.itemSize;
	
	squareVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
	var squareVertexIndices = [];
	for(var i=0; i < nbSquare; i++) {
		squareVertexIndices = squareVertexIndices.concat([
			i*4 + 0, i*4 + 1, i*4 + 2,
			i*4 + 0, i*4 + 2, i*4 + 3,    // Front face
		]);
        }
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareVertexIndices), gl.STATIC_DRAW);
	squareVertexIndexBuffer.itemSize = 1;
	squareVertexIndexBuffer.numItems = squareVertexIndices.length/squareVertexIndexBuffer.itemSize;
};

	function drawScene() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	    
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	    
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, neheTexture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
	    
	    // TODO this should be triangle strip
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
		gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}


    function tick() {
        requestAnimFrame(tick);
        drawScene();
    }


    function webGLStart() {
        var canvas = document.getElementById("lesson05-canvas");
        initGL(canvas);
        initShaders();
        initBuffers();
        initTexture();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    }
