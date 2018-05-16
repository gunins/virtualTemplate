const gulp = require('gulp');
const rollupStream = require('rollup-stream');
const rollup = require('rollup');
const source = require('vinyl-source-stream');
const mocha = require('gulp-mocha');
const del = require('del');
const through = require('through2');

const chain = (cb) => {
    return through.obj(function(chunk, enc, next) {
        let push = this.push.bind(this);
        cb(chunk, enc).pipe(through.obj((chunk, enc, done) => {
            push(chunk);
            done();
            next();
        }))
    });
};

gulp.task('clean', () => {
    return del([
        './dist',
        './target'
    ]);
});

gulp.task('rollup', ['clean'], () => rollupStream({
    input:  './src/index.js',
    format: 'umd',
    name:   'virtualtemplate',
    rollup
}).pipe(source('index.js'))
    .pipe(gulp.dest('./dist')));

gulp.task('rollupTest', ['rollup'], () => gulp
    .src(['test/**/*.js'], {read: false})
    .pipe(chain(({path}) => {
        const name = path.replace(process.cwd() + 'test/', '');
        return rollupStream({
            input:  path,
            format: 'umd',
            name,
            rollup
        })
            .pipe(source(name))
            .pipe(gulp.dest('./target'));
    })));


gulp.task('test', ['rollupTest'], () => {
    return gulp.src([
        './target/test/**/*.js'
    ], {read: false})
        .pipe(mocha({reporter: 'list'}));

});

gulp.task('default', ['test']);