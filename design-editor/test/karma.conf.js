/* global module */
module.exports = function (config) {
    config.set({
        'basePath': '../',
        autoWatch: true,
        singleRun: false,
        frameworks: ['jspm', 'jasmine'],
        preprocessors: {
            'src/**/!(*spec).js': ['babel', 'sourcemap', 'coverage'],
            'libs/**/!(*spec).js': ['babel', 'sourcemap']
        },
        jspm: {
            config: 'test/config.js',
            loadFiles: [
                'src/**/*.spec.js'
            ],
            serveFiles: [
                'src/**/!(*spec).js',
                'libs/**/*.js'
            ]
        },
        browsers: ['Chrome'],
        reporters: ['coverage', 'progress', 'html'],
        files: [
            {'pattern': 'node_modules/tau-component-packages/**/*.js', 'included': false, 'served': true, 'watch': true},
            {'pattern': 'node_modules/closet-default-component-packages/**/*.js', 'included': false, 'served': true, 'watch': true},
            {'pattern': 'node_modules/closet-component-packages/**/*.js', 'included': false, 'served': true, 'watch': true},
            {'pattern': 'node_modules/js-beautify/**/*.js', 'included': false, 'served': true, 'watch': true},
            {'pattern': 'node_modules/jquery-ui/**/*.js', 'included': false, 'served': true, 'watch': true},
            {'pattern': 'src/**/*.html', 'included': false, 'served': true, 'watch': true},
            'node_modules/babel-polyfill/browser.js',
            'node_modules/babel-polyfill/browser.js',
            'node_modules/async/dist/async.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/mustache/mustache.js'
        ],
        htmlReporter: {
            outputDir: 'report', // where to put the reports
            templatePath: null, // set if you moved jasmine_template.html
            focusOnFailures: false, // reports show failures on start
            namedFiles: false, // name files instead of creating sub-directories
            pageTitle: null, // page title for reports; browser info by default
            urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
            reportName: 'report-summary-filename', // report summary filename; browser info by default


            // experimental
            preserveDescribeNesting: false, // folded suites stay folded
            foldAll: false // reports start folded (only with preserveDescribeNesting)
        },
        coverageReporter: {
            instrumenters: {isparta: require('isparta')},
            instrumenter: {
                'src/**/*.js': 'isparta'
            },
            reporters: [
                {
                    type: 'text-summary'
                },
                {
                    type: 'html',
                    dir: 'report/coverage/'
                }
            ]
        },

        babelPreprocessor: {
            options: {
                sourceMap: 'inline'
            },
            sourceFileName: function (file) {
                return file.originalPath;
            }
        }
    });
};
