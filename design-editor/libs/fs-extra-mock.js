
function readFile(name, encoding, callback) {
    var content = window.fileMap.get(name),
        err = {
            code: 'ENOENT'
        };
    callback(window.fileMap.has(name) ? null : err, content);
}

function refresh(callback) {

}

function writeFile(name, data, callback) {

}

function makeDir(dirName, callback) {

}

function existsDir(name, callback) {

}

function exists(name, callback) {

}

function copy(src, dest, callback) {

}

function readDir(name, callback) {

}

function readdirSync(name) {
    return ['a', 'b'];
}

module.exports = {
    readFile: readFile,
    writeFile: writeFile,
    makeDir: makeDir,
    existsDir: existsDir,
    exists: exists,
    copy: copy,
    readdir: readDir,
    readdirSync: readdirSync
};
