var gulp = require('gulp');
var path = require('path');
var ts = require('gulp-typescript');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var sequence = require('gulp-sequence');
var print = require('gulp-print');
// ts source 
var ts_source = path.join(__dirname, 'dev/**/*.ts');

var scss_source = path.join(__dirname, 'dev/pages/**/*.scss');

var html_source = path.join(__dirname, 'dev/**/*.html');

var html_release = path.join(__dirname, 'templates/');

var cache_str = 'z_cache'
var cache = path.join(__dirname, cache_str);

//  page 入口
var cache_entry = path.join(__dirname, cache_str,'/pages/**/*.js');

var cache_release = path.join(__dirname,cache_str, '/release')

var dest = path.join(__dirname, 'static/release');


gulp.task('template:init', function () {
    return gulp.src(html_source)
        .pipe(gulp.dest(html_release))

})

// ts 部分
gulp.task("ts:compile", () => {
    return gulp.src(ts_source)
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
        .pipe(gulp.dest(cache))
})

gulp.task('js:browserify', () => {
    return gulp.src(cache_entry)
        .pipe(browserify({
            insertGlobals: false,
        }))
        .pipe(uglify())
        .pipe(rename({
            dirname: 'js'
        }))
        .pipe(gulp.dest(dest))
})

// del  cache
gulp.task("cache:del", (cb) => {
    return del(cache, cb)
})

gulp.task('scss:compile', () => {
    return gulp.src(scss_source)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "nested"
        }))
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        // .pipe(gulp.dest(cache))
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(rename({
            extname: '.min.css',
            dirname: 'css'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));
})

gulp.task('file:watch',()=>{
    gulp.watch( ts_source ,gulp.series(
        'ts:compile',
        'js:browserify',
        'cache:del'
    ))
    gulp.watch( scss_source ,gulp.series(
        'scss:compile'
    ))
    gulp.watch( html_source ,gulp.series(
        'template:init'
    ))
})

gulp.task('build', gulp.series(
    gulp.parallel(
        'template:init',
        'scss:compile',
        'ts:compile'),

    'js:browserify',
    'cache:del'

))