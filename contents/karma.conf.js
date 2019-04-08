// Karma configuration
// Generated on Fri May 29 2015 15:10:06 GMT+0900 (KST)
/* global module */
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['qunit'],


        // list of files / patterns to load in the browser
        files: [
            {pattern: 'bower_components/qunit/qunit/qunit.css', watched: false, included: true, served: true},
            {pattern: 'bower_components/sinon-1.15.0/index.js', watched: false, included: true, served: true},
            {pattern: 'bower_components/sinon-qunit-1.0.0/index.js', watched: false, included: true, served: true},

            {pattern: 'bower_components/jquery/dist/jquery.js', watched: false, included: true, served: true},
            {pattern: 'bower_components/webcomponentsjs/webcomponents-lite.min.js', watched: false, included: true, served: true},

            {pattern: 'dist/**/dress.js', watched: true, included: true, served: true},

            {pattern: 'test/qunit.fixures.js', watched: true, included: true, served: true},
            {pattern: 'test/test-main.js', watched: true, included: true, served: true},

            {pattern: 'test/**/*.js', watched: true, included: true, served: true},
            {pattern: 'test/**/*.tpl', watched: true, included: false, served: true}
        ],


        proxies:  {
            '/test/': '/base/test/'
        },


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
