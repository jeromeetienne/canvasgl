CanvasGL.Context	= function(domElement)
{
	this._domElement	= domElement;

	this._gl		= CanvasGL.initGL(canvas);


	// init shaders
	CanvasGL.initShaders(this._gl);

	this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this._gl.enable(this._gl.DEPTH_TEST);

	CanvasGL.initBuffers(this._gl);

}

CanvasGL.Context.prototype._flush	= function(drawImages)
{
	var gl	= this._gl;
	
	CanvasGL.updateBuffers(gl, drawImages);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, neheTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	// TODO this should be triangle strip ? trigrou says no
	// - so unclear at best. gl.TRIANGLES are simple. leave them for now
	// drawElements got limitations from a size pov
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer);
	gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
}