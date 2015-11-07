var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');

gulp.task('less', function () {
    return gulp.src('./src/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./src/css'));
});