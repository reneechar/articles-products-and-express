
'use strict';

const Gulp = require('gulp');
const Sass = require('gulp-sass');
const Concat = require('gulp-concat');
const BrowserSync = require('browser-sync');
const Spawn = require('child_process').spawn;


Gulp.task('default', ['dev']);

Gulp.task('dev', ['express', 'browser-sync', 'sass', 'sass:watch']);

// Browser-Sync
Gulp.task('browser-sync', _ => {
  BrowserSync.init({
    proxy: `localhost:8080`
  });
});

// Express server
Gulp.task('express', _ => {
  let options = { shell: true, stdio: "inherit" };
  return Spawn('nodemon', ['server.js'], options);
});

// SASS
Gulp.task('sass', _ => {
  return Gulp.src('./sass/styles.scss')
    .pipe(Sass().on('error', Sass.logError))
    .pipe(Concat('styles.css'))
    .pipe(Gulp.dest('./public/css'))
    .pipe(BrowserSync.stream())
  ;
});

Gulp.task('sass:watch', _ => {
  Gulp.watch('./sass/styles.scss', ['sass']);
});