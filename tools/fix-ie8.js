/*
 * Looks like transform-es3-member-expression-literals babel's plugin is not convert
 * reserved word `default` into literal when it used as `import * from ...`
 */
var vfs = require('vinyl-fs');
var map = require('map-stream');

var dir = process.argv[2];
if (!dir) {
    throw new Error('Source directory arg is required');
}

var replace = function(file, cb) {
    var content = file.contents.toString('utf-8').replace(/\.default\b/g, '[\'default\']');
    file.contents = new Buffer(content);
    cb(null, file);
};

vfs.src([dir + '/*.js', '!' + dir + '/*.min.js'])
    .pipe(map(replace))
    .pipe(vfs.dest(dir));
