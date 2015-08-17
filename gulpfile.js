require('babel/register');

var gulp = require('gulp');
var runSequence = require('gulp-run-sequence');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var del = require('del');
var rename = require('gulp-rename');

gulp.task('clean', function(done) {
    del(['dist'], done);
});

gulp.task('lint', function () {
    return gulp.src(['tiny.js', 'modules/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('build', function() {
    return browserify({
        entries: './tiny.js',
        debug: false
    })
        .transform(babelify)
        .bundle()
        .pipe(source('tiny.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('compress', function() {
    return gulp.src('dist/tiny.js')
        .pipe(uglify())
        .pipe(rename('tiny.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', function(cb) {
    runSequence(['lint', 'clean'], 'build', 'compress', cb);
});

gulp.task('default', ['dist']);
