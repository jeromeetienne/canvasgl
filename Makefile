#! /usr/bin/env make
# makefile to automatize simple operations

build:
	cat src/canvasgl-core.js	>  build/canvasgl.js
	cat src/canvasgl-context.js	>> build/canvasgl.js
	cat src/canvasgl-proxyCtx.js	>> build/canvasgl.js
	cat src/canvasgl-buffers.js	>> build/canvasgl.js
	cat src/canvasgl-shaders.js	>> build/canvasgl.js

server:
	python -m SimpleHTTPServer

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~

.PHONY: build