var gulp = require('gulp');
var concat = require('gulp-concat');  
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify');
var merge = require('gulp-merge');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');

gulp.task('default', function () {
    var jsStream = gulp.src([
            'js/*',
            'node_modules/bootstrap/js/dist/collapse.js',
            'node_modules/bootstrap/js/dist/modal.js',
            'node_modules/bootstrap/js/dist/util.js',
        ])
        .pipe(concat('build.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('build/js'));
    
    var fontAwesome = gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('build/font-awesome'));
    
    var cssStream = gulp.src('scss/*')
        .pipe(concat('build.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/css'));

    return merge(jsStream, fontAwesome, cssStream);
});