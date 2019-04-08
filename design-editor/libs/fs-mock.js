
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

function existsSync(name) {
    return true;
}

function copy(src, dest, callback) {

}

function readDir(name, callback) {

}

function readdirSync(name) {
    return ['a', 'b'];
}

function fileReadStream() {}
function fileWriteStream() {}
function readStream() {}
function writeStream() {}
function createReadStream() {}
function createWriteStream() {}

module.exports = {
    readFile: readFile,
    writeFile: writeFile,
    makeDir: makeDir,
    existsDir: existsDir,
    exists: exists,
    existsSync: existsSync,
    copy: copy,
    readdir: readDir,
    readdirSync: readdirSync,
    ReadStream: readStream,
    WriteStream: writeStream,
    FileReadStream: fileReadStream,
    FileWriteStream: fileWriteStream,
    createReadStream: createReadStream,
    createWriteStream: createWriteStream
};
