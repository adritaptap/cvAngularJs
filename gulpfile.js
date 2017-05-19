var gulp = require('gulp'),
webserver = require('gulp-webserver'),
del = require('del'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
source = require('vinyl-source-stream'),
buffer = require('vinyl-buffer'),
gutil = require('gulp-util'),
ngAnnotate = require('browserify-ngannotate')
browserify = require('browserify'),
ngAnnotate = require('browserify-ngannotate'),
uglify = require('gulp-uglify');


var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
    del([
        'dist'
        ], cb);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', ['clean'], function() {
    return gulp.src('./styles/*')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cachebust.resources())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// fills in the Angular template cache, to prevent loading the html templates via
// separate http requests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-template-cache', ['clean'], function() {

    var ngHtml2Js = require("gulp-ng-html2js"),
    concat = require("gulp-concat");
    
    return gulp.src("./partials/*.html")
    .pipe(ngHtml2Js({
        moduleName: "todoPartials",
        prefix: "/partials/"
    }))
    .pipe(concat("templateCachePartials.js"))
    .pipe(gulp.dest("./dist"));
});

gulp.task('build-js', ['clean'], function() {
    var b = browserify({
        entries: './app/app.js',
        debug: true,
        paths: ['./app/controllers', './app/services', './app/directives'],
        transform: [ngAnnotate]
    });

    return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(cachebust.resources())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/app/'));
});


/////////////////////////////////////////////////////////////////////////////////////
//
// full build (except sprites), applies cache busting to the main page css and js bundles
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', [ 'clean','build-css','build-template-cache', 'build-js'], function() {
    return gulp.src('index.html')
    .pipe(cachebust.references())
    .pipe(gulp.dest('dist'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// watches file system and triggers a build when a modification is detected
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function() {
    return gulp.watch(['./index.html','./partials/*.html', './styles/*.*css', './app/**/*.js'], ['build']);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launches a web server that serves files in the current directory
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('webserver', ['watch','build'], function() {
    gulp.src('.')
    .pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: "http://localhost:8000/index.html"
    }));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launch a build upon modification and publish it to a running server
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('dev', ['watch', 'webserver']);


/////////////////////////////////////////////////////////////////////////////////////
//
// installs and builds everything, including sprites
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['build']);