const fsExtra = require('./fs-extra');

module.exports = Object.assign({}, fsExtra, {
    createWriteStream: function () {},
    createReadStream: function () {},
    ReadStream: function () {},
    WriteStream: function () {},
    FileReadStream: function () {},
    FileWriteStream: function () {}
});
