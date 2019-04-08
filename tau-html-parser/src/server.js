#!/usr/bin/env node
var tauLinterProvider = require('./tau-linter-provider'),
    http = require('http'),
    server = http.createServer();

/**
 *
 */
function init() {
    tauLinterProvider.initialize();
}

/**
 *
 * @param text
 * @returns {*|Array}
 */
function parser(text) {
    var result = {};

    return tauLinterProvider.lint(text);
}

server.on('request', function (request, response) {
    var page = [],
        result;

    console.log((new Date()) + ' Received request for ' + request.url);

    request.on('data', function (chunk) {
        page.push(chunk);
    }).on('end', function () {
        page = Buffer.concat(page).toString();
        result = JSON.stringify(parser(page));
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(result);
    });

});

server.listen(5479, function () {
    console.log((new Date()) + ' Server is listening on port 5479');
});


init();
