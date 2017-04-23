Phaser.ts boilerplate
=====================

This boilerplate is designed so that all our javascript ends up living in a single bundle.js file while avoiding all those pesky PIXI problems

How to run for the first time:

```
npm install && gulp
```

For gulp-audiosprite you'll also need ffmpeg:


```
brew install ffmpeg --with-theora --with-libogg --with-libvorbis
```


After that, just `gulp` will compile everything and serve the game