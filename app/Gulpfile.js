let gulp = require('gulp');
let concat = require('gulp-concat');  
let rename = require('gulp-rename');  
let uglify = require('gulp-uglify');
let merge = require('gulp-merge');
let cleanCSS = require('gulp-clean-css');

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