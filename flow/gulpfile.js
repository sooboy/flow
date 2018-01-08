var gulp = require('gulp');
var path = require('path');
var ts = require('gulp-typescript');

// ts source 
var ts_source = path.join(__dirname,'dev/**/*.ts');

var scss_source = path.join(__dirname,'dev/**/*.scss');

var html_source = path.join(__dirname,'dev/**/*.html');

var html_release =path.join(__dirname,'templates/');

var cache = path.join(__dirname,'cache');

// tong page 入口
var cache_tong = path.join(__dirname,'cache/pages/**/*.js');

var dest =path.join(__dirname,'static/release');


gulp.task('template:init',()=>{
    gulp.src( html_source )
     .pipe( gulp.dest( html_release ))
})

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
    return gulp.src(cache_tong)
        .pipe(browserify({
            insertGlobals: false,
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dest))
})