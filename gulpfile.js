var gulp = require('gulp');
var build = require('gulp-build');
var react = require('react-scripts');
var sourcemap = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('copyfiles', function(){
   return gulp.src('./build')
    .pipe(gulp.dest('https://mindtree951.sharepoint.com/sites/dev/Test/'))
})

gulp.task('build-deploy',function(){
    gulp.src('./**/*.js')
    .pipe(react('build'))
   // .pipe(sourcemap.init())
   // .pipe(concat('dw.js'))
    .pipe(gulp.dest('./dist'))
})