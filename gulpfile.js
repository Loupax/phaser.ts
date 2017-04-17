'use strict';
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const open = require('gulp-open');
const concat = require('gulp-concat');
const gulpMerge = require('gulp-merge');
const connect = require('gulp-connect');
const spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
const texturepacker = require('spritesmith-texturepacker');

const locations = {images: ['src/**/*.png']};

gulp.task('server', function () {
    connect.server({
        root: ['dist'],
        livereload: true
    });
});

gulp.task('sprites',function () {
    const spriteData = gulp.src(locations.images).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.json',
        algorithm: 'binary-tree',
        cssTemplate: texturepacker
    }));
    return spriteData.pipe(gulp.dest('dist/img'));
});
gulp.task('watch', function () {
    gulp.watch('./src/**/*.ts', ['compile']);
    gulp.watch(locations.images, ['sprites']);
});

gulp.task('default', ['server', 'compile', 'watch']);

gulp.task('copyAssets', function () {
    return gulp.src(['src/*.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('open', ['copyAssets'], function () {
    gulp.src('localhost:8080')
        .pipe(open());
});

gulp.task('compile', ['copyAssets', 'sprites'], function () {
    return gulpMerge(phaser(), ts_compile())
        .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

function ts_compile() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        .bundle()
        .on('error', function (error) {
            console.error(error.toString());
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(connect.reload());
}

function phaser() {
    return gulp.src('./node_modules/phaser/build/phaser.js');
}
