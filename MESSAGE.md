on my macbook intel HD 3000 gpu, i got
3200 for canvas 2D
1500 for webgl-2d
18000 for canvasgl.

performance on canari, chrome stable, firefox.

performance depends a lot on the gpu here.

put number on linux, and mac.

performance are peak numbers.

performance depending on the size of destination

performance depending on the amount of source image.

performance may degrade depending on the usage pattern tho.

worst case: one copy of many Image elements.
best case: many copy of one Image elements

# how much work to include it ?

canvasgl aims to be a canvas 2D dropin replacement.

it will works as a dropin

but one may need some more porting to get top performance tho.



# description

TODO just describe how it is done.


first, lets look at a little rule of thumb for webgl.
it is called "reduce the number of draw call to be faster".
It means that the less webgl draw call you do, the faster you are.

how canvasgl process the ```ctx.drawImage``` you do.

It queues all you calls.

they are drawn only when you do ```ctx.update()```.

TODO API: to bind this custom ```ctx.update``` to a clear rectangle for the whole
viewport. Assuming this ```cls``` is done at the begining of the frame ?
Goal: ease inclusion.

# efficiency tips

## reduce the number of source Image elements

The number of source Image element is a key factor in performance.

```
    ctx.drawImage(img, 0, 0);
```


The number of textures that you can use during a given webgl draw call, is limited.

limited to 8. true ? i think 8 is the minimum required but may go higher.
gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
or MAX_COMBINED_TEXTURE_IMAGE_UNITS

my macbook got 16, others got 32. it depends on the graphic card.


if you need more texture, you need to do more webgl draw calls.

in WebGL, we try to limit them as much as possible because those draw calls are the
one consuming much of the time.

Nice stuff: in my understanding, current best practices suggests to use
"sprite sheets" images to improve download time. Good! This likely reduces
the amount of source Image.

TODO what about the order

What if you get 8 images or less ?
