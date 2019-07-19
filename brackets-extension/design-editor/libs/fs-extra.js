const FileSystem = window.top.brackets.getModule('filesystem/FileSystem'),
	ProjectManager = window.top.brackets.getModule('project/ProjectManager');

function readFile(name, encoding, callback) {
	const file = FileSystem.getFileForPath(name);
	file.read({}, callback);
}

function refresh(callback) {
	const args = arguments;
	ProjectManager.refreshFileTree();
	if (callback) {
		callback.call(args);
	}
}

function existsDir(name, callback) {
	const file = FileSystem.getDirectoryForPath(name);
	file.exists(callback);
}

function makeDir(dirName, callback) {
	const dir = FileSystem.getDirectoryForPath(dirName);
	dir.create(callback);
}

function writeFile(name, data, callback) {
	const file = FileSystem.getFileForPath(name),
		dirName = name.replace(/[^/]+$/, '');

	existsDir(dirName, (notUsed, isDirectory) => {
		if (isDirectory) {
			file.write(data, {}, refresh.bind(null, callback));
		} else {
			makeDir(dirName, () => {
				file.write(data, {}, refresh.bind(null, callback));
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
	FileSystem.getFileForPath(src).read({}, (error, content) => {
		FileSystem
			.getFileForPath(dest)
			.write(content, {}, refresh.bind(null, callback));
	});
}

function readDir(name, callback) {
	const dir = FileSystem.getDirectoryForPath(name);
	dir.getContents((err, directories) => {
		const names = directories.map(_dir => _dir.name);
		callback(err, names);
	});
}

function deleteFile(name, callback) {
	ProjectManager.deleteItem(
		FileSystem.getFileForPath(name)
	);
	if (callback) {
		callback();
	}
}

module.exports = {
	readFile: readFile,
	writeFile: writeFile,
	makeDir: makeDir,
	existsDir: existsDir,
	exists: exists,
	copy: copy,
	readdir: readDir,
	deleteFile
};
