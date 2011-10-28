on my macbook intel HD 3000 gpu, i got
3200 for canvas 2D
1500 for webgl-2d
18000 for canvasgl.

performance on canari, chrome stable, firefox.

performance depends a lot on the gpu here.

put number on linux, and mac.

performance are peak numbers.

performance depending on the size of destination

performance may degrade depending on the usage pattern tho.

monster case: copy of many small Image elements.

TODO just describe how it is done.

# description



# efficiency tips

## reduce the number of source Image elements

The number of source Image element is a key factor in performance.

```
    ctx.drawImage(img, 0, 0);
```


The number of textures that you can use during a given webgl draw call, is limited.

limited to 8. true ?

if you need more texture, you need to do more webgl draw calls.

in WebGL, we try to limit them as much as possible because those draw calls are the
one consuming much of the time.

Nice stuff: in my understanding, current best practices suggests to use
"sprite sheets" images to improve download time. Good! This likely reduces
the amount of source Image.

TODO what about the order