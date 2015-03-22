var gulp = require('gulp'),
    concat = require('gulp-concat'),
    git = require('gulp-git'),
    clean = require('gulp-clean'),
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

// Clone a remote repo 
gulp.task('clone', function(){
    git.clone('https://github.com/AndreLion/home-server-v2',{args: 'tmp'});
});

gulp.task('release', ['clone'],function(){
    gulp.src(config.lib.js)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('dist/lib/js/'));
    gulp.src(config.lib.css)
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('dist/lib/css/'));
    gulp.src(config.lib.fonts)
        .pipe(gulp.dest('dist/lib/fonts/'));
    gulp.src('tmp/src/**/*.*')
        .pipe(gulp.dest('dist/'));
    gulp.src('tmp', {read: false})
        .pipe(clean());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/**/*.*', function(){
        gulp.src('src/*.html')
            .pipe(livereload());
    });
});
