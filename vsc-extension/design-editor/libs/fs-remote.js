module.exports = {
    readFile: function (name, callback) {
        fetch(name).then(content => 
            callback(content)
        );
    }
};
