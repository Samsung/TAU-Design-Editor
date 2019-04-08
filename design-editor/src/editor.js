'use babel';
import utils from "./utils/utils";

var atomPackage = null,
    brackets = utils.checkGlobalContext('brackets'),
    bracketsProjectManager = brackets && brackets.getModule('project/ProjectManager'),
    CommandManager = brackets && brackets.getModule('command/CommandManager'),
    Commands = brackets && brackets.getModule('command/Commands'),
    TextEditor = brackets && brackets.getModule('editor/Editor');

if (window.atom) {
    // in whole code is use window.atom without cache to correct run modules in tests
    // adn do mocks
    atomPackage = require('atom');
}

export default {
    /**
     * Open
      * @param options
     */
    open: function (options) {
        window.atom.open(options);
    },
    /**
     * Get version
      * @returns {*}
     */
    getVersion: function () {
        return window.atom.getVersion();
    },
    /**
     * Resolve package path
      * @param packageName
     * @returns {*}
     */
    resolvePackagePath: function (packageName) {
        if (this.isAtom()) {
            return window.atom.packages.resolvePackagePath(packageName);
        }

        return '/';
    },
    /**
     *
      */
    workspace: {
        /**
         * Get workspace
          * @returns {atom.workspace|{getPanes, open, getActivePaneItem, getActiveTextEditor, observeTextEditors, onDidChangeActivePaneItem, onDidDestroyPaneItem, addLeftPanel}}
         */
        get: function () {
            return window.atom.workspace;
        },
        /**
         * Get Active Pane Item
          * @returns {*|{getPath}}
         */
        getActivePaneItem: function () {
            return window.atom.workspace.getActivePaneItem();
        },
        /**
         * Get Active Text Editor
          * @returns {null|*|{name, getText}}
         */
        getActiveTextEditor: function () {
            return window.atom && window.atom.workspace.getActiveTextEditor();
        },
        /**
         * Get Panes
          * @returns {*}
         */
        getPanes: function () {
            return window.atom.workspace.getPanes();
        },
        /**
         * Get Left Panel
          * @param options
         * @returns {*}
         */
        getLeftPanel: function (options) {
            return window.atom.workspace.getLeftPanel(options);
        },
        /**
         * Get Left Panels
          * @returns {*}
         */
        getLeftPanels: function () {
            return window.atom.workspace.getLeftPanels();
        },
        /**
         * Get top panel
          * @param options
         * @returns {*}
         */
        getTopPanel: function (options) {
            return window.atom.workspace.getTopPanel(options);
        },
        /**
         * Get top panels
          * @returns {*}
         */
        getTopPanels: function () {
            return window.atom.workspace.getTopPanels();
        },
        /**
         * Get right panel
          * @param options
         * @returns {*}
         */
        getRightPanel: function (options) {
            return window.atom.workspace.getRightPanel(options);
        },
        /**
         * Get right panels
          * @returns {*}
         */
        getRightPanels: function () {
            return window.atom.workspace.getRightPanels();
        },
        /**
         * Get bottom panel
          * @param options
         * @returns {*}
         */
        getBottomPanel: function (options) {
            return window.atom.workspace.getBottomPanel(options);
        },
        /**
         * Get bottom panels
          * @returns {*}
         */
        getBottomPanels: function () {
            return window.atom.workspace.getBottomPanels();
        },
        /**
         * Get modal panel
          * @param options
         * @returns {*}
         */
        getModalPanel: function (options) {
            return window.atom.workspace.getModalPanel(options);
        },
        /**
         * Get modal panels
          * @returns {*}
         */
        getModalPanels: function () {
            return window.atom.workspace.getModalPanels();
        },
        /**
         * open
          * @param uri
         * @returns {*}
         */
        open: function (uri) {
            if (window.atom) {
                return window.atom.workspace.open(uri);
            }
            CommandManager.execute(Commands.CMD_ADD_TO_WORKINGSET_AND_OPEN, {fullPath: uri, paneId: 'first-pane'});
            window.top.globalData.fileUrl = uri;
            window.top.loadFromFile();
            return null;
        },
        /**
         * Observe text editor
          * @param callback
         */
        observeTextEditors: function (callback) {
            if (window.atom !== undefined) {
                window.atom.workspace.observeTextEditors(callback);
            }
        },
        /**
         * Did change active pane item callback
          * @param callback
         */
        onDidChangeActivePaneItem: function (callback) {
            if (window.atom !== undefined) {
                window.atom.workspace.onDidChangeActivePaneItem(callback);
            }
        },
        /**
         * Did destroy pane item callback
          * @param callback
         */
        onDidDestroyPaneItem: function (callback) {
            if (window.atom !== undefined) {
                window.atom.workspace.onDidDestroyPaneItem(callback);
            }
        },
        /**
         * Add left panel
          * @param options
         * @returns {*}
         */
        addLeftPanel: function (options) {
            return window.atom.workspace.addLeftPanel(options);
        },
        /**
         * Add top panel
          * @param options
         * @returns {*}
         */
        addTopPanel: function (options) {
            return window.atom.workspace.addTopPanel(options);
        },
        /**
         * Add right panel
          * @param options
         * @returns {*}
         */
        addRightPanel: function (options) {
            return window.atom.workspace.addRightPanel(options);
        },
        /**
         * Add bottom panel
          * @param options
         * @returns {*}
         */
        addBottomPanel: function (options) {
            return window.atom.workspace.addBottomPanel(options);
        },
        /**
         * Add modal panel
          * @param options
         * @returns {*}
         */
        addModalPanel: function (options) {
            return window.atom.workspace.addModalPanel(options);
        }
    },
    /**
     *
      */
    project: {
        /**
         * Get paths
          * @returns {null|*|{addScope, getExtensionPrefs}|{Scope, FileStorage}|{}|*[]}
         */
        getPaths: function () {
            return (window.atom &&
                window.atom.project.getPaths()) ||
                (bracketsProjectManager &&
                        [bracketsProjectManager.getProjectRoot().fullPath]);
        },
        /**
         * Add path
          * @param projectPath
         */
        addPath: function (projectPath) {
            return window.atom.project.addPath(projectPath);
        },
        /**
         * Remove path
          * @param projectPath
         * @returns {*}
         */
        removePath: function (projectPath) {
            return window.atom.project.removePath(projectPath);
        },
        /**
         * Get relative path
          * @param fullPath
         * @returns {*}
         */
        relativizePath: function (fullPath) {
            return window.atom.relativizePath(fullPath);
        },
        /**
         * Did change paths callback
          * @param callback
         */
        onDidChangePaths: function (callback) {
            window.atom.project.onDidChangePaths(callback);
        },
        /**
         * Get root directory
          * @returns {*}
         */
        getRootDirectory: function () {
            return window.atom.project.rootDirectories[0].path;
        }
    },
    /**
     * Get view
      * @param editor
     * @returns {*}
     */
    getView: function (editor) {
        return window.atom.views.getView(editor);
    },
    /**
     *
      */
    commands: {
        /**
         * Add command
          * @param target
         * @param commandName
         * @param callback
         * @returns {function()}
         */
        add: function (target, commandName, callback) {
            return window.atom && window.atom.commands ? window.atom.commands.add(target, commandName, callback) : () => {};
        },
        /**
         * Dispatch command
          * @param target
         * @param commandName
         * @returns {*}
         */
        dispatch: function (target, commandName) {
            return window.atom.commands.dispatch(target, commandName);
        }
    },
    /**
     *
      */
    grammars: {
        /**
         * return grammar for scope
          * @param scope
         * @returns {*}
         */
        grammarsByScopeName: function (scope) {
            return window.atom.grammars.grammarsByScopeName(scope);
        }
    },

    CompositeDisposable: (atomPackage && atomPackage.CompositeDisposable) || (() => ({})),
    TextEditor: (atomPackage && atomPackage.TextEditor) || ((TextEditor && TextEditor.Editor) || (() => {})),
    notifications: window.atom && window.atom.notifications,
    selectors: {
        workspace: 'atom-workspace',
        workspaceAxis: 'atom-workspace-axis',
        textEditor: 'atom-text-editor'
    },
    isAtom : function () {
        return !!window.atom;
    },
    isVSC: function() {
        return !!window.vscode;
    }
};
