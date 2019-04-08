

const express = require('express');
const glob = require('glob');

const app = express();

const config = {
    port: 3423
};

app.listen(config.port);

const expressBrowserify = require('express-browserify'),
    es2015 = require('babel-preset-es2015'),
    DESIGN_EDITOR_PATH = '../',
    B_PATH_DESIGN_EDITOR = DESIGN_EDITOR_PATH + '/closet/brackets/brackets-editor.js',
    B_OPTIONS = {
        watch: true,
        debug: true,
        extension: [
            'jsx',
            'json',
            'js',
            'es6'
        ],
        transform: [
            [
                'babelify',
                {
                    'sourceMapRelative': '$PWD/src',
                    'presets': [es2015]
                }
            ]
        ],
        cache: {},
        packageCache: {},
        require: [
            {
                file: DESIGN_EDITOR_PATH + '/libs/content-manager.js',
                expose: 'content-manager'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/js-beautify/js/index.js',
                expose: 'js-beautify'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/tau-component-packages/main.js',
                expose: 'tau-component-packages'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/mustache/mustache.js',
                expose: 'mustache'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/mustache/mustache.js',
                expose: 'mustache'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/path-browserify/index.js',
                expose: 'path'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/js-beautify/js/index.js',
                expose: 'js-beautify'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/jquery/dist/jquery.js',
                expose: 'jquery'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/jquery-ui/jquery-ui.js',
                expose: 'jquery-ui'
            },
            {
                file: DESIGN_EDITOR_PATH + '/libs/atom.js',
                expose: 'atom'
            },
            {
                file: DESIGN_EDITOR_PATH + '/libs/fs-mock.js',
                expose: 'fs'
            },
            {
                file: DESIGN_EDITOR_PATH + '/libs/fs-extra-mock.js',
                expose: 'fs-extra'
            },
            {
                file: DESIGN_EDITOR_PATH + '/libs/remote.js',
                expose: 'remote'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/checkbox/checkbox',
                expose: 'closet-default-component-packages/type-elements/checkbox/checkbox'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/color/color',
                expose: 'closet-default-component-packages/type-elements/color/color'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/effect/effect',
                expose: 'closet-default-component-packages/type-elements/effect/effect'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/file/file',
                expose: 'closet-default-component-packages/type-elements/file/file'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/image-filter/image-filter',
                expose: 'closet-default-component-packages/type-elements/image-filter/image-filter'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/number/number',
                expose: 'closet-default-component-packages/type-elements/number/number'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/range/range',
                expose: 'closet-default-component-packages/type-elements/range/range'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/select/select',
                expose: 'closet-default-component-packages/type-elements/select/select'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/string-list/string-list',
                expose: 'closet-default-component-packages/type-elements/string-list/string-list'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-default-component-packages/type-elements/text/text',
                expose: 'closet-default-component-packages/type-elements/text/text'
            },
            {
                file: DESIGN_EDITOR_PATH + '/node_modules/closet-component-packages',
                expose: 'closet-component-packages'
            }
        ]
    };


app.get('/js/', function (req, res, next) {
    expressBrowserify('../src/' + req.query.file, B_OPTIONS)(req, res, next);
});

app.get('/spec-list.json', function (req, res, next) {
    glob('**/*.spec.js', {
        cwd: '../src/'
    }, function (er, files) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(files.sort()));
    });
});

app.use(express.static('./public'));
app.use('/base/src/', express.static('../src'));

console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);
