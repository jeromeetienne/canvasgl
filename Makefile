#! /usr/bin/env make

build:
	cat src/canvasgl-core.js	>  build/canvasgl.js
	cat src/canvasgl-context.js	>> build/canvasgl.js
	cat src/canvasgl-proxyCtx.js	>> build/canvasgl.js
	cat src/canvasgl-buffers.js	>> build/canvasgl.js
	cat src/canvasgl-shaders.js	>> build/canvasgl.js

.PHONY: build