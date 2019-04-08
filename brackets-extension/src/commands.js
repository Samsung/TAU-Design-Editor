var COMMANDS = {
        BUILD_WGT: 'design-editor.build-wgt',
        TAU_PREVIEW: 'design-editor.preview'
    },
    COMMAND_SHORTCUTS = {
        BUILD_WGT: 'F10'
    },
    brackets = window.brackets || window.top.brackets;

define(function (require, exports, module) {
    var Strings = require('strings'),
        AppInit = brackets.getModule('utils/AppInit'),
        Menus = brackets.getModule('command/Menus'),
        CommandManager = brackets.getModule('command/CommandManager'),
        CodeHintManager= brackets.getModule('editor/CodeHintManager'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        CommandBuild = require('./command-package-build'),
        CommandTAUPreview = require('./command-tau-preview'),
        completionDict = JSON.parse(require('text!../code-completion-dict.json')),
        textToCursorRegexp = /(:?^|\s)([\w\.]+)$/gi,
        installedCommands = {
            buildWgt: null,
            tauPreview: null
        };

    function registerCommandAndMenu(Command, menu, key) {
        var commandInstance = CommandManager.register(Strings[key], COMMANDS[key], Command.menuTrigger);

        if (COMMAND_SHORTCUTS[key]) {
            menu.addMenuItem(COMMANDS[key], COMMAND_SHORTCUTS[key]);
        } else {
            menu.addMenuItem(COMMANDS[key]);
        }

        if (typeof Command.isChecked === 'function') {
            commandInstance.setChecked(Command.isChecked());
        }

        if (typeof Command.isEnabled === 'function') {
            commandInstance.setEnabled(Command.isEnabled());
        }

        return commandInstance;
    }

    module.exports = {
        initialize: function () {
            // @TODO proof of concept!
            CodeHintManager.registerHintProvider({
                hasHints: function (editor, implicitChar) {

                    textToCursorRegexp.lastIndex = 0; // reset
                    var cursor = editor.getCursorPos();
                    var line = editor._codeMirror.getLine(cursor.line);
                    var lineToCursor = line.substring(0, cursor.ch);
                    var textToCursorM = textToCursorRegexp.exec(lineToCursor);
                    var textToCursor = textToCursorM && textToCursorM[2];

                    return completionDict.find(function (item) {
                        return item.indexOf(textToCursor || lineToCursor) > -1;
                    });
                },
                getHints: function (implicitChar) {

                    textToCursorRegexp.lastIndex = 0; // reset
                    var editor = EditorManager.getActiveEditor();
                    var result = [];

                    if (editor) {
                        var cursor = editor.getCursorPos();
                        var line = editor._codeMirror.getLine(cursor.line);
                        var lineToCursor = line.substring(0, cursor.ch);
                        var textToCursorM = textToCursorRegexp.exec(lineToCursor);
                        var textToCursor = textToCursorM && textToCursorM[2];
                        result = completionDict.filter(function (item) {
                            return item.indexOf(textToCursor) > -1;
                        });
                    }

                    return {
                        hints: result,
                        match: null,
                        selectInitial: true,
                        handleWideResults: false
                    };
                },
                insertHint: function (hint) { // @TODO fix for parameter completion
                    var editor = EditorManager.getActiveEditor();
                    if (editor) {
                        var cursor = editor.getCursorPos();
                        var line = editor._codeMirror.getLine(cursor.line);
                        var lineToCursor = line.substring(0, cursor.ch);
                        var textToCursorM = textToCursorRegexp.exec(lineToCursor);
                        var textToCursor = textToCursorM && textToCursorM[2];
                        editor._codeMirror.replaceRange(
                            hint,
                            {
                                line: cursor.line,
                                ch: cursor.ch
                                    - (textToCursor ? textToCursor.length : lineToCursor.length)
                            },
                            {
                                line: cursor.line,
                                ch: cursor.ch
                            }

                        );
                    }

                    return false;
                }
            }, "all");
            CommandTAUPreview.initialize();
        },
        initializeMenus: function () {
            AppInit.appReady(function () {
                var viewMenu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);

                installedCommands.tauPreview = registerCommandAndMenu(CommandTAUPreview, viewMenu, 'TAU_PREVIEW');

                // @TODO temporary, reference should not be passed to command
                CommandTAUPreview._registerMenuCommand(installedCommands.tauPreview);
            });
        }
    };
});
