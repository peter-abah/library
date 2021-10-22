'use strict';

const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');

const generateCss = (callback) => {
  const processors = [
    require('autoprefixer'),
  ];

  src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(dest('./css'));

  callback();
};

const watchFiles = (callback) => {
  watch('./src/sass/**/*.scss', generateCss);
  callback();
}

exports.default = series(watchFiles, generateCss);
exports.css = generateCss