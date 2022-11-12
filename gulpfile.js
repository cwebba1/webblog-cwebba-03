const gulp = require('gulp');
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
const svgo = require('postcss-svgo');

const sass = require('gulp-sass')(require('sass'));
const handlebars = require('gulp-compile-handlebars');
const layouts = require('handlebars-layouts');

const { src, dest, watch, series, parallel } = require('gulp');

const jsPath = 'app/assets/js/**/*.js';
const cssPath = 'app/css/**/*.css';
const scssPath = 'app/scss/**/*.{scss,sass}';
const cssscssPath = 'app/scss/css/*.css';
const imgPath = 'app/assets/images/**/*.{gif,png,jpg,jpeg,svg}';
const hbsPath = 'app/pages/*.hbs';
const partialPath = 'app/partials/**/*.hbs';
const htmlPath = 'app/**/*.html';
const imgDistPath = 'dist/assets/images/';
// const wordpressPath = './';
const browserSync = require ('browser-sync').create();

function browser_sync(){
browserSync.init({
    watch: true,
    server: "./dist"
})
};

/**************** reload task ****************/
function reload(done){
    browserSync.reload();
    done();
  }
  
 
function copyHTML(done) {
	return src(htmlPath).pipe(gulp.dest('dist'))
    .pipe(browserSync.stream()),
    done();
};
exports.copyHTML = copyHTML;

  /**************** Copy CSS to Root task ****************/

  function copyCSS(done) {
    // Copy static files
  gulp.src("dist/css/styles.css")
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
    return src(scssPath)
      .pipe(
      sass(sassOptions)
      .on('error', sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(sourcemaps.write('./')
          .pipe(browserSync.stream({ match: '**/*.scss' }))
      )
      .pipe(dest('app/scss/css'))
      .pipe( src(cssscssPath).pipe(gulp.dest('app/css')))
      .pipe(browserSync.stream());
    }
  exports.scssTask = scssTask;

function copySCSS(done) {
	return src(cssscssPath).pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream()),
    done();
}
exports.copySCSS = copySCSS;


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
      .pipe(concat('styles.css'))
      .pipe(sourcemaps.init())
      .pipe(postcss(processors))
      .pipe(sourcemaps.write('.'))
      .pipe(dest('./dist/css'))
      .pipe(browserSync.stream());
    }
    exports.cssTask = cssTask;
    
  /**************** Handlebars task ****************/

  const hbsConfig = {
    app         : hbsPath,
//    watch       : (['app/partials/*.hbs', 'app/pages/*.hbs'], ['hbs']),
//    watch       : 'app/partials/*.hbs',
//    watch       : 'app/pages/*.hbs', 
    build       : htmlPath,   // Need to copy to dist
}

function hbs() {
  return gulp.src('./app/pages/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./app/partials']
    }).on('error', function(e){
            console.log(e);
         }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./app'))
    .pipe(browserSync.stream());
}
exports.hbs = hbs;


function watchTask() {
  gulp.watch(['./assets/images/**/*'], gulp.series(imgTask));
  gulp.watch([scssPath], gulp.series(scssTask, reload));
  gulp.watch([cssscssPath], gulp.series(copySCSS, reload));
  gulp.watch([cssPath], gulp.series(cssTask, reload));
  gulp.watch([jsPath], gulp.series(jsTask, reload));
  gulp.watch([hbsPath], gulp.series(hbs, reload));
  gulp.watch([htmlPath], gulp.series(copyHTML, reload));
 };

//series(parallel(hbs, jsTask), scssTask, copySCSS, cssTask, copyHTML)
      
  exports.default = series( parallel(scssTask, hbs,jsTask, imgTask, copyHTML), series(copySCSS, cssTask), parallel(browser_sync, watchTask));