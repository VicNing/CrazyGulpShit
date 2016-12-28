const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const network = require('os').networkInterfaces();
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const utils = require('gulp-util');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const reload = browserSync.reload;
const hostIp = network.WLAN[1].address;

gulp.task('modular', () => {
    let b = browserify({
        entries: 'app/js/index.js',
        debug: false
    });
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .on('error', utils.log)
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('babel', () => {
    return gulp.src('app/js/*')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));

});

gulp.task('serve', () => {
    browserSync.init({
            server: ['.'],
            port: 3000,
            host: hostIp
        }
    );
    gulp.watch(['app/*'], reload);
    gulp.watch(['app/**/*'], reload);
});

// gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
// gulp.watch(['app/scripts/**/*.js'], ['lint', 'scripts', reload]);
// gulp.watch(['app/images/**/*'], reload);