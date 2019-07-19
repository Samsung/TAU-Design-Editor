var FileSystem = window.top.brackets.getModule('filesystem/FileSystem'),
    ProjectManager = window.top.brackets.getModule('project/ProjectManager');

function readFile(name, encoding, callback) {
    var file = FileSystem.getFileForPath(name);
    file.read({}, callback);
}

function refresh(callback) {
    var args = arguments;
    ProjectManager.refreshFileTree();
    if (callback) {
        callback.call(args);
    }
}

function existsDir(name, callback) {
    var file = FileSystem.getDirectoryForPath(name);
    file.exists(callback);
}

function makeDir(dirName, callback) {
    var dir = FileSystem.getDirectoryForPath(dirName);
    dir.create(callback);
}

function writeFile(name, data, callback, additionalFileOptions) {
    var file = FileSystem.getFileForPath(name),
        dirName = name.replace(/[^/]+$/, '');

    existsDir(dirName, function (notUsed, isDirectory) {
        if (isDirectory) {
            file.write(data, additionalFileOptions || {}, refresh.bind(null, callback));
        } else {
            makeDir(dirName, function () {
                file.write(data, additionalFileOptions || {}, refresh.bind(null, callback));
            });
        }
    });
}

function exists(name, callback) {
	const file = FileSystem.getFileForPath(name);
	file.exists((err, _exists) => {
		callback(err, _exists);
	});
}

function copy(src, dest, callback) {
    FileSystem.getFileForPath(src).read({}, function (error, content) {
        FileSystem.getFileForPath(dest).write(content, {}, refresh.bind(null, callback));
    });
}

function readDir(name, callback) {
    var dir = FileSystem.getDirectoryForPath(name);
    dir.getContents((err, directories) => {
        const names = directories.map(_dir => _dir.name);
        callback(err, names);
    });
}

module.exports = {
    readFile: readFile,
    writeFile: writeFile,
    makeDir: makeDir,
    existsDir: existsDir,
    exists: exists,
    copy: copy,
    readdir: readDir,
    createWriteStream: function () {},
    createReadStream: function () {},
    ReadStream: function () {},
    WriteStream: function () {},
    FileReadStream: function () {},
    FileWriteStream: function () {}
};
