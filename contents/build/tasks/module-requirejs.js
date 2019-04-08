var path = require('path'),
    async = require('async'),
    requirejs = require('requirejs');

module.exports = function (grunt) {
    var LOG_LEVEL_TRACE = 0, LOG_LEVEL_WARN = 2;

    // TODO: extend this to send build log to grunt.log.ok / grunt.log.error
    // by overriding the r.js logger (or submit issue to r.js to expand logging support)
    requirejs.define('node/print', [], function () {
        return function print(msg) {
            if (msg.substring(0, 5) === 'Error') {
                grunt.log.errorlns(msg);
                grunt.fail.warn('RequireJS failed.');
                return;
            }

            grunt.log.oklns(msg);
        };
    });

    grunt.registerMultiTask('module-requirejs', 'tau changeable theme converter', function () {
        var self = this,
            done = this.async(),
            options = this.options();

        async.eachSeries(this.filesSrc, function (file, next) {
            var baseUrl = options.baseUrl,
                dir = options.output;
            requirejs.optimize(self.options({
                name: path.relative(baseUrl, file).replace('.js', ''),
                out: path.join(dir, path.relative(baseUrl, file)),
                logLevel: grunt.option('verbose') ? LOG_LEVEL_TRACE : LOG_LEVEL_WARN
            }), function () {
                try {
                    next();
                    grunt.log.oklns('Success module ' + file + ' build.');
                } catch (e) {
                    grunt.fail.warn('There was an error while processing your done function: "' + e + '"');
                }
            });
        }, function (err) {
            if (err) {
                grunt.fail.warn(err);
                done(false);
            } else {
                grunt.log.oklns('Success module requirejs build.');
                done();
            }
        });

    });
};
