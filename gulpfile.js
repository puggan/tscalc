const gulp = require("gulp");
const plug = require("gulp-load-plugins")({
    rename: {
        "gulp-clean-css": "uglifycss",
        "gulp-uglify": "uglifyjs",
        "gulp-html-minifier2": "html",
    },
});

//<editor-fold desc="IDE help only">
// noinspection PointlessBooleanExpressionJS, ConstantIfStatementJS just here for ide inspection help
if (false) {
    // noinspection UnreachableCodeJS just here for ide inspection help
    plug.concat = require("gulp-concat");
    plug.html = require("gulp-html-minifier2");
    plug.ignore = require("gulp-ignore");
    plug.less = require("gulp-less");
    plug.rename = require("gulp-rename");
    plug.sourcemaps = require("gulp-sourcemaps");
    plug.typescript = require("gulp-typescript");
    plug.uglifycss = require("gulp-clean-css");
    plug.uglifyjs = require("gulp-uglify");
}
//</editor-fold>

//<editor-fold desc="Task Less/CSS">
const css_task = () => gulp
    .src("src/less/*.less")
    .pipe(plug.sourcemaps.init())

    .pipe(plug.less())
    .pipe(plug.concat("style.min.css"))
    .pipe(plug.uglifycss({level: 2}))
    .pipe(plug.sourcemaps.write("./", {includeContent: false, sourceRoot: "src/less/"}))
    .pipe(gulp.dest("build/"));
gulp.task("css", css_task);
//</editor-fold>

//<editor-fold desc="Task Typescript">
const ts_task = () => gulp
    .src(["src/ts/*.ts", "!ts/*.d.ts"])
    .pipe(plug.sourcemaps.init())
    .pipe(plug.typescript({"target": "ES5"})) // uglifyjs dosn't work with ES6
    .pipe(plug.concat("app.min.js"))
    .pipe(plug.uglifyjs())
    .pipe(plug.sourcemaps.write("./", {includeContent: false, sourceRoot: "src/ts/"}))
    .pipe(gulp.dest("build/"));
gulp.task("ts", ts_task);
//</editor-fold>

//<editor-fold desc="Task HTML">
const html_task = () => gulp
   .src("src/html/index.html")
   .pipe(plug.html(
      {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          sortAttributes: true,
          sortClassName: true,
          useShortDoctype: true,
      }))
   .pipe(gulp.dest("build/"));
gulp.task("html", html_task);
//</editor-fold>

gulp.task("default", gulp.series([gulp.parallel("css", "ts"), "html"]));

