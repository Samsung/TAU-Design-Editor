module.exports = {
    readFile: function (name, callback) {
        var FileSystem = window.top.brackets.getModule('filesystem/FileSystem'),
            file = FileSystem.getFileForPath(name);
        file.read({}, callback);
    }
};
