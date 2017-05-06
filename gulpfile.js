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
const audiosprite = require('gulp-audiosprite');

const locations = {images: ['src/**/*.png'], sounds: ['src/**/*.wav'], html: ['src/**/*.html']};

gulp.task('server', function () {
    connect.server({
        root: ['dist'],
        livereload: true
    });
});

gulp.task('sprites', function () {
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
    gulp.watch(locations.sounds, ['audiosprite']);
    gulp.watch(locations.html, ['html'])
});

gulp.task('default', ['server', 'compile', 'sprites', 'audiosprite', 'html', 'watch']);

gulp.task('html', function () {
    return gulp.src(['src/*.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('open', function () {
    gulp.src('localhost:8080')
        .pipe(open());
});

gulp.task('compile', function () {
    return gulpMerge(phaser(), ts_compile())
        .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['html', 'sprites', 'audiosprite', 'compile']);

gulp.task('audiosprite', function () {
    gulp.src('./src/snd/*.wav')
        .pipe(audiosprite({
            format: 'jukebox',
            export: "mp3,m4a,ac3,4xm,ogg"//"ogg,m4a,mp3,ac3"
        }))
        .pipe(gulp.dest('dist/snd'));
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
        .transform('babelify')
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
