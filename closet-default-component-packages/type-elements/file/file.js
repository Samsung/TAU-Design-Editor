

var Mustache = require('mustache'),
    dress = require('dress'),
    $ = require('jquery'),
    TypeElement = require('../type-element'),
    remote = require('remote'),
    dialog = window.atom && remote.require('dialog'),
    BrowserWindow = window.atom && remote.require('browser-window'),

    TEMPLATE_ATOM = '<button class="inline-block btn closet-attr-file-btn' +
        ' closet-attr-long-button">{{value}}</button>',
    TEMPLATE_BRACKETS = '<input type="file" class="inline-block btn' +
        ' closet-attr-file-file closet-attr-long-button" />';

module.exports = dress.factory('closet-type-file', {

    defaults: {
        extension: []
    },

    events: {
        'click .closet-attr-file-btn': 'onClickFileBtn'
    },

    onReady: function () {
        var self = this;
        if (window.atom) {
            self.$el.html(Mustache.render(TEMPLATE_ATOM, self.options));
        } else {
            self.$el.html(Mustache.render(TEMPLATE_BRACKETS, self.options));
            self.$el.find('.closet-attr-file-file').on('change', function (event) {
                self.setValue(URL.createObjectURL(event.target.files[0]));
            });
        }
    },

    onClickFileBtn: function () {
        var self = this,
            extensions = self.extension.length ? self.extension : ['*'],
            parentWindow = null,
            $blind = $('<div style="position:absolute;top:0px;left:0px;width:200%;height:200%;z-index:10000;"></div>');

        $blind.appendTo(document.body);
        if (window.atom) {
            parentWindow = process.platform === 'darwin' ? null : BrowserWindow.getFocusedWindow();
            dialog.showOpenDialog(parentWindow, {
                title: 'Select file',
                filters: [
                    {
                        name: 'files',
                        extensions: extensions
                    }
                ]
            }, function (filePath) {
                if (filePath) {
                    self._setPath(filePath[0]);
                }
                $blind.remove();
            });
        }
    },

    _setPath : function (newPath) {
        var pathToProjects = atom.project.relativizePath(newPath);
        if (pathToProjects[0] !== null) {
            newPath = pathToProjects[1];
        }
        this.$el.find('.closet-attr-file-btn').text(newPath);
        this.setValue(newPath);
    }

}, TypeElement);
