var gulp = require('gulp');
var concat = require('gulp-concat');  
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify');
var merge = require('gulp-merge');
var cleanCSS = require('gulp-clean-css');

gulp.task('default', function () {
    var jsStream = gulp.src('js/*')
        .pipe(concat('build.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
    
    var cssStream = gulp.src('css/*')
        .pipe(concat('build.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/css'));

    return merge(jsStream, cssStream);
});