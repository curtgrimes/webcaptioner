var gulp = require('gulp');
var concat = require('gulp-concat');  
var rename = require('gulp-rename');  
var uglify = require('gulp-uglify');
var merge = require('gulp-merge');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');

gulp.task('js:build', function() {
    return gulp
        .src([
            'node_modules/popper.js/dist/umd/popper.js', // include this before BS
            'node_modules/bootstrap/js/dist/button.js',
            'node_modules/bootstrap/js/dist/collapse.js',
            'node_modules/bootstrap/js/dist/dropdown.js',
            'node_modules/bootstrap/js/dist/modal.js',
            'node_modules/bootstrap/js/dist/tooltip.js',
            'node_modules/bootstrap/js/dist/popover.js',
            'node_modules/bootstrap/js/dist/tab.js',
            'node_modules/bootstrap/js/dist/util.js',
            'node_modules/moment/min/moment.min.js',
            'js/*',
        ])
        .pipe(concat('build.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('scss:build', function() {
    return gulp
        .src('scss/*')
        .pipe(concat('build.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/css'));
});

gulp.task('fontawesome:build', function() {
    return gulp
        .src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('build/font-awesome'));
});

gulp.task('default', ['js:build', 'scss:build', 'fontawesome:build']);

gulp.task('watch', function () {
    gulp.watch(['js/*'], ['js:build']);
    gulp.watch(['scss/*'], ['scss:build']);
});


/* Homepage */



gulp.task('js:build-home', function() {
    return gulp
        .src([
            'node_modules/jquery/dist/jquery.slim.min.js',
            'node_modules/bootstrap/js/dist/collapse.js',
            'node_modules/bootstrap/js/dist/tab.js',
            'node_modules/bootstrap/js/dist/carousel.js',
            'node_modules/bootstrap/js/dist/util.js',
            'js/home/*',
        ])
        .pipe(concat('build-home.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));
});

gulp.task('watch-home', function() {
    gulp.watch(['js/home/*'], ['js:build-home']);
});