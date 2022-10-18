const gulp = require('gulp');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const size = require('gulp-size');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');

const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const sass = require('gulp-sass')(require('sass'));
const { src, dest, task, watch, series, parallel } = require('gulp');

const jsPath = 'app/assets/js/**/*.js';
const cssPath = 'app/css/**/*.css';
const sassPath = 'app/scss/**/*.{scss,sass}';
const imgPath = 'app/assets/images/**/*.{gif,png,jpg,jpeg,svg}';
const imgDistPath = 'dist/assets/images/';
const wordpressPath = './';
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

function copySCSS() {
	return src('app/scss/css/*.css').pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
}
exports.copySCSS = copySCSS;

  /**************** Copy CSS to Root task ****************/

  function copyCSS(done) {
    // Copy static files
  gulp.src("dist/css/style.css")
    .pipe(rename("style.css"))
    .pipe(gulp.dest("../.")); // cwebba/style.css
    done();
  }
    exports.copyCSS = copyCSS;
  
  /**************** images task ****************/

  const imgConfig = {
    app     : imgPath,
    dist    : imgDistPath,

    minOpts: {
      optimizationLevel: 5
    }
  };

function imgTask() {
    return src(imgPath)
//    return gulp.src(['app/**/*.{gif,png,jpg}'])
.pipe(newer(imgConfig.dist))
.pipe(imagemin(imgConfig.minOpts))
.pipe(size({ showFiles:true }))
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

// Transpile Sass to CSS:
function scssTask () {
    const sassOptions = {
        errLogToConsole: true,
        outputStyle: 'expanded'
      };
    return src(sassPath)
      .pipe(
      sass(sassOptions)
      .on('error', sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(sourcemaps.write('./')
          .pipe(browserSync.stream({ match: '**/*.scss' }))
      )
      .pipe(dest('app/scss/css'))
    }
  exports.scssTask = scssTask;

// postCSS ONLY here
function cssTask() {
    const processors = [
        postcssPresetEnv({ 
            stage: 1, 
            features: {
            'nesting-rules': true,
          }}),
        autoprefixer(),
        cssnano()
    ];
    return src(cssPath)
      .pipe(concat('style.css'))
      .pipe(sourcemaps.init())
      .pipe(postcss(processors))
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/css'))
      .pipe(browserSync.stream());
    }
    exports.cssTask = cssTask;
    
    
    function watchTask() {
        watch([jsPath, cssPath, sassPath], series(scssTask, (parallel(cssTask, jsTask))));
    }


   // exports.default = parallel(copyHTML, imgTask, jsTask);
exports.default = series(scssTask, copySCSS,(parallel(copyHTML, imgTask, jsTask)), cssTask, watchTask);
