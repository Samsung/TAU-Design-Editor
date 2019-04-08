var dress = require('dress');
var Mustache = require('mustache');
var TypeElement = require('../type-element');
var utils = require('../../../design-editor/src/utils/utils');

var brackets = utils.checkGlobalContext('brackets');
var FileSystem = brackets.getModule('filesystem/FileSystem');
var ProjectManager = brackets.getModule('project/ProjectManager');

var TEMPLATE = '<button class="inline-block btn closet-attr-src-btn closet-attr-long-button">source</button>';

module.exports = dress.factory('closet-type-src', {
    defaults: {
        extension: []
    },
    events: {
        'click .closet-attr-src-btn': 'onClickSrcBtn'
    },
    onReady: function () {
        this.$el.html(Mustache.render(TEMPLATE, this.options));
    },
    onClickSrcBtn: function () {
        var self = this;
        FileSystem.showOpenDialog(false, false, 'Choose source file', ProjectManager.getProjectRoot().fullPath, null,
            function (error, file) {
                if (error) {
                    console.error(error);
                    return;
                }

                self.setValue(brackets.app.convertRelativePath(file[0]));
            });
    }
}, TypeElement);
