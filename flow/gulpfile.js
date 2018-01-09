var gulp        = require('gulp');
var path        = require('path');
var ts          = require('gulp-typescript');
var browserify  = require('gulp-browserify');
var uglify      = require('gulp-uglify');
var del         = require('del');
const sourcemaps= require('gulp-sourcemaps');
const sass      = require('gulp-sass');
const postcss   = require('gulp-postcss');
const autoprefixer      = require('autoprefixer');
const rename            = require('gulp-rename');
// ts source 
var ts_source    = path.join(__dirname,'dev/**/*.ts');

var scss_source  = path.join(__dirname,'dev/**/*.scss');

var html_source  = path.join(__dirname,'dev/**/*.html');

var html_release = path.join(__dirname,'templates/');

var cache        = path.join(__dirname,'cache');

//  page 入口
var cache_entry  = path.join(__dirname,'cache/**/*.js');

var cache_release= path.join(__dirname,'cache/release')

var dest         = path.join(__dirname,'static/release');


gulp.task('template:init',()=>{
    gulp.src( html_source )
     .pipe( gulp.dest( html_release ))
})

// ts 部分
gulp.task("ts:compile",()=>{
   gulp.src( ts_source )
    .pipe(
        ts({
            noImplicitAny: true,
            module: 'commonjs',
            lib: [
                "dom",
                "es5",
                "scripthost",
                "es2015.iterable"
            ]
        })
    )
    .pipe(gulp.dest( cache ))
})

gulp.task('js:browserify',()=>{
    return gulp.src( cache_entry )
        .pipe(browserify({
            insertGlobals: false,
        }))
        .pipe(uglify())
        .pipe(gulp.dest(cache_release))
})

gulp.task('js:release',()=>{
    
})

// del  cache
gulp.task("cache:del",(cb)=>{
    del('cache',cb)
})

gulp.task('scss:compile',()=>{
    return gulp.src( scss_source )
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle : "nested"
    }))
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(gulp.dest( cache ))
    .pipe(sass({
        outputStyle : "compressed"
    }))
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest( dest ));
})

gulp.task('image:compile',()=>{
    gulp.src()
})