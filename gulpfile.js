/* This file is task runner based on piping for nodejs applications */

var gulp = require('gulp'),
    gulpJshint = require('gulp-jshint');


gulp.task("default",['watch']);

gulp.task('jshint', function(){
        return gulp.src('./frontend/js/*.js')
            .pipe(gulpJshint())
            .pipe(gulpJshint.reporter('jshint-stylist'));
});


gulp.task('watch',function(){
    gulp.watch('./frontend/js/*.js',['jshint']);
})


gulp.task('start-db',function(){
    gulp.run();
})