ProxyContext:
- memoryleak ?
- apparently the canvas arent freeed...
  - normal or not ?
- issue with transparent
  - is the transaparent issue in drawImage
  - or in the canvas drawing
  - how can i know ?

DrawImage:
- new drawimage are drawn BELOW old ones
- issue with transaparent
- how to fix it ?
  - issue with blending ? understand blending
  - reverse sort to draw inverse order

DrawImage: better multi image
- implement single call for multiple images
- possible from 8 to 32 textures, so up to 32 simulatenous images in a single calls

----------------------------
* performance
* benchmark
* compatibility canvas 2D API
* publication

* does it fix the problem