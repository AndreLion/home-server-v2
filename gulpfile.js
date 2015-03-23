var gulp = require('gulp'),
    concat = require('gulp-concat'),
    git = require('gulp-git'),
    del = require('del'),
    replace = require('gulp-replace-task'),
    processhtml = require('gulp-processhtml'),
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

gulp.task('dev', function(){
    gulp.src(config.lib.js)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('src/lib/js/'));
    gulp.src(config.lib.css)
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('src/lib/css/'));
    gulp.src(config.lib.fonts)
        .pipe(gulp.dest('src/lib/fonts/'));
});

gulp.task('clone2tmp', function(cb){
    git.clone('https://github.com/AndreLion/home-server-v2',{args: 'tmp'},function(err){
        cb(err);
    });
});

gulp.task('tmp2dist', ['clone2tmp'], function(cb){
    del(['dist'],function(){
        gulp.src(config.lib.js_release)
            .pipe(concat('lib.js'))
            .pipe(gulp.dest('dist/lib/js/'));
        gulp.src(config.lib.css)
            .pipe(concat('lib.css'))
            .pipe(gulp.dest('dist/lib/css/'));
        gulp.src(config.lib.fonts)
            .pipe(gulp.dest('dist/lib/fonts/'));
        gulp.src('tmp/src/**/*.*')
            .pipe(gulp.dest('dist'));
        del(['tmp'],function(){
            cb();
        });
    });
});

gulp.task('processdist', ['tmp2dist'], function(cb){
    gulp.src('dist/index.html')
        .pipe(replace(jsxPattern))
        .pipe(gulp.dest('dist'));
});

gulp.task('test', ['clone2tmp','tmp2dist','processdist']);

gulp.task('release', function(){
    git.clone('https://github.com/AndreLion/home-server-v2',{args: 'tmp'},function(err){
        //if (err) throw err;
        del(['dist'],function(){
            gulp.src(config.lib.js_release)
                .pipe(concat('lib.js'))
                .pipe(gulp.dest('dist/lib/js/'));
            gulp.src(config.lib.css)
                .pipe(concat('lib.css'))
                .pipe(gulp.dest('dist/lib/css/'));
            gulp.src(config.lib.fonts)
                .pipe(gulp.dest('dist/lib/fonts/'));
            gulp.src('tmp/src/**/*.*')
                .pipe(gulp.dest('dist'));
            gulp.src('dist/index.html')
                .pipe(replace(jsxPattern))
                .pipe(gulp.dest('dist'));
            /*gulp.src('dist/*.html')
                .pipe(processhtml())
                .pipe(gulp.dest('dist'));*/
            del(['tmp']);
        });
    });
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/**/*.*', function(){
        gulp.src('src/*.html')
            .pipe(livereload());
    });
});

