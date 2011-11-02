******************************************************************
Long term:
* do custom API tunned for image copy and high performance
  * use WRAP_S/T
  * blending or not ?
  * if not blending, draw in reverse order with gl.depthFunc( gl.LESS );
  * it is tuned for speed but dont uselessly diverge from canvas2d API
* do canvas2d API layer for compatibility (ease inclusion)
******************************************************************

* handle nowebgl detection

ProxyContext:
- memoryleak ? YES
- apparently the canvas and/or textures arent freeed...
  - normal or not ?
  - see deleteTexture

DrawImage:
- issue with transaparent
- FIXED new drawimage are drawn BELOW old ones
  - how to fix it ?
  - issue with blending ? understand blending
  - reverse sort to draw inverse order

DrawImage: better multi image
- implement single call for multiple images
- possible from 8 to 32 textures, so up to 32 simulatenous images in a single calls

Benchmark:
- various test executed for each backend
- single page to test all backend
- user change only browser, OS

- make benchmark.js to compare each backend
  - so open each context, and make a suite for each test
