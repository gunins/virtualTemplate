const gulp = require('gulp');
const rollup = require('rollup-stream');
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

gulp.task('rollup', ['clean'], () => rollup({
    input:  './src/index.js',
    format: 'umd',
    name:   'virtualtemplate'
}).pipe(source('index.js'))
    .pipe(gulp.dest('./dist')));

gulp.task('rollupTest', ['rollup'], () => gulp
    .src(['test/**/*.js'], {read: false})
    .pipe(chain(({path}) => {
        const name = path.replace(process.cwd() + 'test/', '');
        return rollup({
            input:  path,
            format: 'umd',
            name
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