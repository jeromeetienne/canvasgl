#! /usr/bin/env make

build:
	cat src/*.js > build/canvasgl.js

.PHONY: build