/* This file is task runner based on piping for nodejs applications */

var os = require('os'),
    proj = require('./package'),
    gulp = require('gulp'),
    gulpJshint = require('gulp-jshint'),
    open = require('gulp-open'),
    exec = require('child_process').exec;


var browser = os.platform() === 'linux' ? 'google-chrome' : (
        os.platform() === 'darwin' ? '/Applications/Google\ Chrome.app' : (
                os.platform() === 'win32' ? 'chrome' : 'firefox'));

function runCommand(command) {
    return function (cb) {
        exec(command, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }
}

gulp.task("default",['server']);

gulp.task('jshint', function(){
        return gulp.src('./frontend/js/*.js')
            .pipe(gulpJshint())
            .pipe(gulpJshint.reporter('jshint-stylist'));
});

gulp.task('watch',function(){
    gulp.watch('./frontend/js/*.js',['jshint']);
});

gulp.task('startDb',function(){
   console.dir(proj.dbconfig);
   runCommand('if test -d '+
                   proj.dbconfig.path+'/data; ' +
                   'then ' +
                        'if test -d '+proj.dbconfig.path+'/data/db; ' +
                        'then ' +
                            proj.dbconfig.path +'/bin/mongod --dbpath '+ proj.dbconfig.path+'/data/db; '+
                        'else ' +
                            'mkdir '+proj.dbconfig.path+'/data/db; ' +
                            proj.dbconfig.path +'/bin/mongod --dbpath '+ proj.dbconfig.path+'/data/db; '+
                        ' fi;' +
                    'else ' +
                        'mkdir ' +proj.dbconfig.path+'/data; ' +
                        'mkdir ' +proj.dbconfig.path+'/data/db; ' +
                        proj.dbconfig.path +'/bin/mongod --dbpath '+ proj.dbconfig.path+'/data/db ;'+
            'fi')(function(err){
           console.log(err)
       });
});

gulp.task('startApp', function(){
    runCommand('node ./backend/app.js')(function (err){
    	console.log(err);
    });
});

gulp.task('openBrowser', function(){
    var options = {
        uri: 'http://localhost:3000/',
        app: browser
    };
    gulp.src(__filename)
        .pipe(open(options));
});

gulp.task('openTestBrowser', function(){
    var options = {
        uri: 'http://localhost:3000/testreport.html',
        app: browser
    };
    gulp.src(__filename)
        .pipe(open(options));
});

gulp.task('server',function(){
    runCommand('gulp startDb')(function(err){console.log(err)});
    runCommand('gulp startApp')(function(err){console.log(err)});
    runCommand('gulp openBrowser')(function(err){console.log(err)});
});

gulp.task('test',function(){
    runCommand('karma start')(function(err){console.log(err)});
    runCommand('gulp openTestBrowser')(function(err){console.log(err)});
});