var pkg = require('./package.json');
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    git = require('gulp-git'),
    del = require('del'),
    replace = require('gulp-replace-task'),
    react = require('gulp-react'),
    livereload = require('gulp-livereload');

var CONST = {
    bower:'bower_components'
}
var config = {
    lib:{
        js:[
            CONST.bower+'/react/react.min.js',
            CONST.bower+'/react/JSXTransformer.js',
            CONST.bower+'/jquery/dist/jquery.min.js',
            CONST.bower+'/showdown/compressed/Showdown.min.js'
        ],
        js_release:[
            CONST.bower+'/react/react.min.js',
            CONST.bower+'/jquery/dist/jquery.min.js',
            CONST.bower+'/showdown/compressed/Showdown.min.js'
        ],
        css:[
            CONST.bower+'/bootstrap/dist/css/bootstrap.min.css',
            CONST.bower+'/font-awesome/css/font-awesome.min.css'
        ],
        fonts:[
            CONST.bower+'/bootstrap/dist/fonts/*.*',
            CONST.bower+'/font-awesome/fonts/*.*'
        ]
    }
};

var jsxPattern = {
    patterns: [
        {
            match: /type="text\/jsx"/g,
            replacement: ''
        }
    ]
};

gulp.task('default', function(){
});

gulp.task('dev_jslib', function(){
    return gulp.src(config.lib.js)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('src/lib/js/'));
});

gulp.task('dev_csslib', function(){
    return gulp.src(config.lib.css)
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('src/lib/css/'));
});

gulp.task('dev_fontslib', function(){
    return gulp.src(config.lib.fonts)
        .pipe(gulp.dest('src/lib/fonts/'));
});

gulp.task('dev',['dev_jslib','dev_csslib','dev_fontslib']);

//#####################release#############################
gulp.task('release', ['clone','cleandist','release_jslib','release_csslib','release_fontslib','release_src','cleantmp','replace','react']);

gulp.task('clone', function(cb){
    git.clone(pkg.repository.url,{args: 'tmp'},function(err){
        if (err) return cb(err);
        cb(err);
    });
});

gulp.task('cleandist',['clone'], function(cb){
    del(['dist'],function(){
        cb();
    });
});

gulp.task('release_jslib',['cleandist'], function(cb){
    return gulp.src(config.lib.js_release)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('dist/lib/js/'));
});

gulp.task('release_csslib',['release_jslib'], function(cb){
    return gulp.src(config.lib.css)
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('dist/lib/css/'));
});

gulp.task('release_fontslib',['release_csslib'], function(cb){
    return gulp.src(config.lib.fonts)
        .pipe(gulp.dest('dist/lib/fonts/'));
});

gulp.task('release_src',['release_fontslib'], function(cb){
    return gulp.src('tmp/src/**/*.*')
        .pipe(gulp.dest('dist'));
});

gulp.task('cleantmp',['release_src'], function(cb){
    del(['tmp'],function(){
        cb();
    });
});

gulp.task('replace',['cleantmp'], function(cb){
    return gulp.src('dist/index.html')
        .pipe(replace(jsxPattern))
        .pipe(gulp.dest('dist'));
});

gulp.task('react',['replace'], function(cb){
    return gulp.src('dist/js/**/*.js')
        .pipe(react())
        .pipe(gulp.dest('dist/js'));
});

//#######################################################


gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/**/*.*', function(){
        gulp.src('src/*.html')
            .pipe(livereload());
    });
});

