let gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    autoPrefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    gcmq = require('gulp-group-css-media-queries'),
    fileInclude = require('gulp-file-include'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
    del = require('del')

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "dist/",
        },
        notify: true,
        open: true,
    })
})
gulp.task('html', function () {
    return gulp
        .src(['src/html/**/*.html', '!src/html/**/_*.html'])
        .pipe(fileInclude({
            prefix: '@@',
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true,
        }))
});

gulp.task('sass', function () {
    return gulp
        .src('src/sass/main.sass')

        .pipe(sass({
            outputStyle: 'compressed',
        }).on('error', notify.onError()))
        .pipe(gcmq('main.css'))
        .pipe(
            autoPrefixer([
                "last 5 versions"
            ], {
                cascade: true
            })
        )
        .pipe(
            browserSync.reload({
                stream: true,
            })
        )

        .pipe(gulp.dest('dist/css'))
});
gulp.task('js', function () {
    return gulp
        .src(['src/js/script.js'])
        .pipe(gulp.dest('dist/js'))

        .pipe(browserSync.reload({
            stream: true,
        }))
});
gulp.task('img', function () {
    return gulp
        .src('src/img/**/*')
        .pipe(
            cache(imagemin({
                    interlaced: true,
                })

            ))
        .pipe(gulp.dest('dist/img'))

        .pipe(browserSync.reload({
            stream: true,
        }))
});

gulp.task('fonts', function () {
    return gulp
        .src('src/fonts/**/*')
        .pipe(gulp.dest('dist/img'))

        .pipe(browserSync.reload({
            stream: true,
        }))
});

gulp.task("clear", function () {
    return cache.clearAll();
});

gulp.task('remove-build', function () {
    return del('dist');
});

gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.sass', gulp.parallel('sass'));
    gulp.watch('src/html/**/*.html', gulp.parallel('html'));
    gulp.watch('src/js/script.js', gulp.parallel('js'));
    gulp.watch('src/fonts', gulp.parallel('fonts'));
    gulp.watch('src/img/**/*', gulp.parallel('img'));
});

gulp.task('default', gulp.parallel('sass', 'html', 'js', 'fonts', 'img',
    'watch', 'browser-sync'));