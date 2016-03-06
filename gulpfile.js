var gulp = require('gulp');
var path = require("path");
var fs = require("fs");
var buildMinConfig = require("./lib/buildMinConfig");
// 引入组件
var minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'), // js压缩
    concat = require('gulp-concat'), // 合并文件
    rename = require('gulp-rename'), // 重命名
    clean = require('gulp-clean'); //清空文件夹
var minConfig;
// 合并、压缩、重命名css
gulp.task('buildcss', ['buildhtml'], function() {
    if (minConfig && minConfig.css) {
        for (var minName in minConfig.css) {
            var partCssArr = Object.keys(minConfig.css[minName]);
            for (var i in partCssArr) partCssArr[i] = "./static" + partCssArr[i];
            gulp.src(partCssArr)
                .pipe(concat(path.basename(minName)))
                .pipe(minifycss())
                .pipe(gulp.dest('./static/' + path.dirname(minName)));
        }
    }
});

// 合并，压缩js文件
gulp.task('buildjs', ['buildhtml'], function(cb) {
    if (minConfig && minConfig.js) {
        for (var minName in minConfig.js) {
            var partJsArr = Object.keys(minConfig.js[minName]);
            for (var i in partJsArr) partJsArr[i] = "./static" + partJsArr[i];
            gulp.src(partJsArr)
                .pipe(concat(path.basename(minName)))
                .pipe(uglify())
                .pipe(gulp.dest('./static/' + path.dirname(minName)));
        }
    }
    cb();
});

// 合并、压缩、重命名css
gulp.task('buildhtml', function() {
    if (!fs.existsSync(path.resolve("./static/build"))) fs.mkdirSync(path.resolve("./static/build"));
    // 注意这里通过数组的方式写入两个地址,仔细看第一个地址是css目录下的全部css文件,第二个地址是css目录下的areaMap.css文件,但是它前面加了!,这个和.gitignore的写法类似,就是排除掉这个文件.
    minConfig = buildMinConfig.concat(path.resolve("./static/public/html"), path.resolve("./static/build/html"));
});

gulp.task('check', ['buildcss', 'buildjs'], function() {
    buildMinConfig.check(minConfig, path.resolve("./static/"));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    return gulp.src(['./static/build/'], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

// 将bower的库文件对应到指定位置
gulp.task('buildlib', function() {

    gulp.src(['./bower_components/angular/angular.min.js', './bower_components/angular/angular.min.js.map'])
        .pipe(gulp.dest('./static/build/js/lib'))

    gulp.src(['./bower_components/angular-route/angular-route.min.js', './bower_components/angular-route/angular-route.min.js.map'])
        .pipe(gulp.dest('./static/build/js/lib'))


    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js*')
        .pipe(gulp.dest('./static/build/js/lib'))

    gulp.src(['./bower_components/jquery/dist/jquery.min.js', './bower_components/jquery/dist/jquery.min.map'])
        .pipe(gulp.dest('./static/build/js/lib'))

    gulp.src('./bower_components/bootstrap/fonts/*')
        .pipe(gulp.dest('./static/build/css/fonts/'))

    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css*')
        .pipe(gulp.dest('./static/build/css/lib'))
});

// 定义dev任务在日常开发中使用
gulp.task('dev', function() {
    gulp.run('buildlib', 'buildhtml', 'buildcss', 'buildjs');
});

// 清空prod
gulp.task('cleanprod', function() {
    return gulp.src(['../prod/'], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

// 定义一个prod任务作为发布或者运行时使用
gulp.task('copyprod', function() {
    gulp.run('cleanprod', function() {
        var modules = Object.keys(require('./package.json').dependencies);
        for (var i = 0; i < modules.length; i++) {
            gulp.src('./node_modules/' + modules[i] + '/**')
                .pipe(gulp.dest('../prod/node_modules/' + modules[i]));
        }
        gulp.src(['./app.js', './config.js', './package.json', './server.js'])
            .pipe(gulp.dest('../prod/'));
        gulp.src('./bin/*')
            .pipe(gulp.dest('../prod/bin/'));
        gulp.src('./controller/*')
            .pipe(gulp.dest('../prod/controller/'));
        gulp.src('./lib/*')
            .pipe(gulp.dest('../prod/lib/'));
        gulp.src('./routers/*')
            .pipe(gulp.dest('../prod/routers/'));
        /*/static*/
        gulp.src('./static/public/imgs/**')
            .pipe(gulp.dest('../prod/static/public/imgs/'));
        gulp.src('./static/build/**')
            .pipe(gulp.dest('../prod/static/build/'));
        gulp.src('./static/favicon.ico')
            .pipe(gulp.dest('../prod/static/'));
    });

});

// 定义一个prod任务作为发布或者运行时使用
gulp.task('prod', function() {
    gulp.run('default', 'copyprod');
    // 监听.less文件,一旦有变化,立刻调用build-less任务执行
});

// gulp命令默认启动的就是default认为,这里将clean任务作为依赖,也就是先执行一次clean任务,流程再继续.
gulp.task('default', ['clean'], function() {
    gulp.run('dev');
});