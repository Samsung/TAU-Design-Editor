
module.exports = {
    join: function () {
        return [].join.call(arguments, '/');
    },
    dirname: function (url) {
        var array = url.split('/');
        array.pop();
        return array.join('/');
    },
    relative: function (path) {
        return path;
    },
    extname: function (url) {
        return '.' + (url.split('.').pop());
    },
    sep: '/'
};
