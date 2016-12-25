"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var mqpacker = require("css-mqpacker");
var csso = require("gulp-csso");
var imagemin = require('gulp-imagemin');
var rename = require("gulp-rename");
var del = require("del");
var run = require("run-sequence");

gulp.task("style", function () {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
        "last 2 versions"
        ]
      })
    ]))
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("css"))
  .pipe(server.stream());
});

gulp.task("serve", ["style"], function () {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});


gulp.task("mystyle", function () {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
        "last 2 versions"
        ]
      })
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"))
});


gulp.task('images', () =>
  gulp.src('./img/**/*.{png,jpg,gif}')
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
    ]))
  .pipe(gulp.dest('build/img'))
);

gulp.task("copy", function() {
	return gulp.src([
		"fonts/**/*.{woff,woff2}",
		"img/**",
		"js/**",
		"*.html"
	], {
		base: "."
	})
	.pipe(gulp.dest("build"))
});


gulp.task("clean", function() {
  return del("build");
});


gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "mystyle",
    "images",
    fn
  );
});
