const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const del = require("del");
const tslint = require("gulp-tslint");
const tsProject = ts.createProject("tsconfig.json");

gulp.task("clean:dist", () => del(["dist/**/*"]));

gulp.task("build", ["clean:dist", "tslint"], () => {
    const outDir = tsProject.config.compilerOptions.outDir || "dist";
    return tsProject.src()
        .pipe(tsProject())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(outDir));
});


gulp.task("tslint", () => {
    return tsProject.src()
        .pipe(tslint({
            formatter: "verbose",
        }))
        .pipe(tslint.report({
            emitError: false,
        }));
});

gulp.task("watch", ["build"], () => {
    gulp.watch("./src/**/*.ts", ["build"]);
});

// gulp.task("default", ["watch"]);
