const gulp = require('gulp');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const { src, dest, task, watch, series, parallel } = require('gulp');

const jsPath = 'app/assets/js/**/*.js';
const cssPath = 'app/css/**/*.css';
const sassPath = 'app/assets/scss/**/*.scss';
const imgPath = 'app/assets/images/**/*.{gif,png,jpg,svg}';

const browserSync = require ('browser-sync').create();

browserSync.init({
    watch: true,
    server: "./dist"
});

/**************** reload task ****************/
function reload(done){
    browserSync.reload();
    done();
  }
  
 
function copyHTML() {
	return src('app/*.html').pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}
exports.copyHTML = copyHTML;

  
function imgTask() {
    return src(imgPath)
//    return gulp.src(['app/**/*.{gif,png,jpg}'])
    .pipe(imagemin())
 .pipe(gulp.dest('dist/assets/images'));
  }
exports.imgTask = imgTask;


function jsTask() {
    return src(jsPath)
      .pipe(sourcemaps.init())
      .pipe(concat('all.js'))
      .pipe(terser())
      .pipe(sourcemaps.write('.' ))
      .pipe(dest('dist/assets/js'));
    }
exports.jsTask = jsTask;


// postCSS ONLY here
function cssTask() {
    var plugins = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano()
    ];
    return src(cssPath)
      .pipe(concat('style.css'))
      .pipe(sourcemaps.init())
      .pipe(postcss(plugins))
      .pipe(sourcemaps.write('.' ))
      .pipe(dest('dist/css'))
      .pipe(browserSync.stream());
    }
    exports.cssTask = cssTask;
    
    
    function watchTask() {
        watch([jsPath, cssPath], parallel(cssTask, jsTask));
    }


   // exports.default = parallel(copyHTML, imgTask, jsTask);
exports.default = series(parallel(copyHTML, imgTask, jsTask, cssTask), watchTask);
