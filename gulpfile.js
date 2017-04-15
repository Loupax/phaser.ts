'use strict';
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var open = require('gulp-open');
var concat = require('gulp-concat');
var gulpMerge = require('gulp-merge');
var connect = require('gulp-connect');

gulp.task('server', function () {
    connect.server({
        root: ['dist'],
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.ts', ['compile']);
});

gulp.task('default', ['server', 'compile', 'watch', 'open']);

gulp.task('copyAssets', function () {
    return gulp.src(['src/*.html', 'src/**/*.png'])
        .pipe(gulp.dest('dist'));
});

gulp.task('open', ['copyAssets'], function () {
    gulp.src('game.dev')
        .pipe(open());
});

gulp.task('compile', ['copyAssets'], function () {
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
