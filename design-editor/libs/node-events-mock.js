var map = new Map(),
    EventsEmmiter = function () {

    };

EventsEmmiter.prototype = {
    on: function (name, callback) {
        map.set(name, callback);
    },
    emit: function (name) {
        var callback = map.get(name),
            args = [].slice.call(arguments);
        args.shift();
        if (callback) {
            callback.apply(callback, args);
        }
    }
};

module.exports = EventsEmmiter;
