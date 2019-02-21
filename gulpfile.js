const gulp = require("gulp");
const mincss = require("gulp-clean-css");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

gulp.task("mincss", function(){
	gulp.src("./src/css/**/*.css")
	.pipe(mincss())
	.pipe(gulp.dest("./dist/css/"));
});

gulp.task("uglify", function(){
	browserify({
		entries: "src/js/datePicker.js",
		cache: {},
		packageCache: {}
	})
	.bundle()
	.pipe(source("datePicker.min.js"))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest("dist/js/"));
});

gulp.task("default", ["mincss", "uglify"]);