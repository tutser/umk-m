'use strict';

const gulp          = require('gulp');
const pug           = require('gulp-pug');
const sass          = require('gulp-sass');
const stylus        = require('gulp-stylus');
const browserSync   = require('browser-sync');
const autoprefixer  = require('gulp-autoprefixer');
const sourcemaps    = require('gulp-sourcemaps');
const debug         = require('gulp-debug');
const del           = require('del');
const ghpages       = require('gh-pages');



// Компиляция .pug файлов в .html и размещение их в папке release

gulp.task('pug', function () {
  return gulp.src('./project/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('release'))
    .pipe(browserSync.reload({stream: true}))
});


// Компиляция .scss файлов в .css и размещение их в папке release/css

gulp.task('sass', function(){
  return gulp.src('project/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    //.pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions']
    }))
    //.pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('release/css'))
    .pipe(browserSync.reload({stream: true}))
});


// Компиляция .styl файлов в .css и размещение их в папке release/css

gulp.task('stylus', function () {
  return gulp.src('./project/stylus/**/*.styl')
    .pipe(stylus())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions']
    }))
    .pipe(gulp.dest('./release/css/'))
    .pipe(browserSync.reload({stream: true}))
});


// При изменении фалов .js в папке project/js - размещение их в папке release/js
// и reload браузера

gulp.task('script', function(){
  return gulp.src('./project/js-dev/*.js', {since: gulp.lastRun('script')})
    .pipe(debug({title: 'script'}))
    .pipe(gulp.dest('release/js'))
    .pipe(browserSync.reload({stream: true}))
});


// Запуск локального web сервера localhost:3000 
// будет подгружаться папка release

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
        baseDir: "release/"
      }
  });
});


// Удаление папки release (вызывается вручную или в составе задачи build )

gulp.task('clean', function() { 
  return del('release');
});


// Копирование всех файлов из папки assets (различные заготовки, библиотеки, 
// изображения, подгружаемые стили)

gulp.task('assets', function() {
  return gulp.src('project/assets/**', {since: gulp.lastRun('assets')})
      .pipe(debug({title: 'assets'}))
      .pipe(gulp.dest('release'))
});


// Пересборка проекта (удаление папки release и полная сборка стилей и препроцессоров)

gulp.task('build', gulp.series('clean', 
  gulp.parallel('pug', 'sass', 'stylus', 'assets')
));


// Создает отделюную ветку на GitHub под названием gh-pages и копирует туда содержимое папки release
// необходима для публикации статических файлов на сервисе github.io

gulp.task('ghpages', function() {
  return ghpages.publish('release', function(err) {})
});


// Слежение за изменениями в файлах и запуск соответствующих задач

gulp.task('watch', function(){
  gulp.watch('./project/stylus/**/*.styl', gulp.parallel('stylus'));
  gulp.watch('./project/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('./project/**/*.pug', gulp.parallel('pug'));
  gulp.watch('./project/js-dev/*.js', gulp.parallel('script'));
});


// Стартовая задача при вызове gulp без параметров

gulp.task('default', 
  gulp.parallel('pug', 'sass', 'stylus', 'script', 'assets', 'browser-sync', 'watch')
);







