
/* global define $*/
const brackets = window.brackets || window.top.brackets;

define((require, exports, module) => {
    var _ = brackets.getModule('thirdparty/lodash'),
        AppInit = brackets.getModule('utils/AppInit'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        FileUtils = brackets.getModule('file/FileUtils'),
        MainViewManager = brackets.getModule('view/MainViewManager'),
        NativeApp = brackets.getModule('utils/NativeApp'),
        PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
        WorkspaceManager = brackets.getModule('view/WorkspaceManager'),
        FileViewController  = brackets.getModule('project/FileViewController'),
        CommandManager = brackets.getModule('command/CommandManager'),
		Commands = brackets.getModule('command/Commands'),
		FileSystem = brackets.getModule('filesystem/FileSystem'),
		ProjectManager = brackets.getModule('project/ProjectManager'),
        supressReloadHackTimer,
        supressReloadHackTimerTTL = 250,
        _documentChange,
        _editorScroll,

        // Templates
        panelHTML = require('text!templates/panel.html'),

        // jQuery objects
        $icon,
        $iframe,
        $panel,

        // Other vars
        currentDoc,
        lastDoc,
        currentEditor,
        panel,
        viewMenu,
        toggleCmd,
        visible = false,
        realVisibility = false,
        isRemoteSample = false,
        commandPreference = null;

    function _calcScrollPos() {
        var scrollInfo = currentEditor._codeMirror.getScrollInfo();
        var scrollPercentage = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);
        var scrollTop = ($iframe[0].contentDocument.body.scrollHeight - $iframe[0].clientHeight) * scrollPercentage;

        return Math.round(scrollTop);
    }

    function __editorScroll() {
        if (commandPreference.get('syncScroll') && $iframe) {
            $iframe[0].contentDocument.body.scrollTop = _calcScrollPos();
        }
    }

    function _loadDoc(doc, isReload) {
        var docText,
            scrollPos,
            yamlRegEx,
            yamlMatch;
        if (doc && visible && $iframe) {
            docText = doc.getText();
            scrollPos = 0;
            yamlRegEx = /^-{3}([\w\W]+?)(-{3})/;
            yamlMatch = yamlRegEx.exec(docText);

            // If there's yaml front matter, remove it.
            if (yamlMatch) {
                docText = docText.substr(yamlMatch[0].length);
            }

            if (isReload) {
                scrollPos = $iframe.contents()[0].body.scrollTop;
            } else if (commandPreference.get('syncScroll')) {
                scrollPos = _calcScrollPos();
            }
        }
    }

    function __documentChange(e) {
        _loadDoc(e.target, true);
    }

    function _resizeAndShowIframe() {
        var iframeWidth = 0;
        if (realVisibility && $iframe) {
            iframeWidth = panel.$panel.innerWidth();

            $iframe.attr('width', iframeWidth + 'px');
            $iframe.show();

            $('#editor-holder').css('max-height', '0');

            $iframe.attr('height', '100%');
        }
    }

    function _setSaveMenuEnabled(isDesignEditorVisible) {
        let saveCommand = CommandManager.get(Commands.FILE_SAVE),
            saveAllCommand = CommandManager.get(Commands.FILE_SAVE_ALL),
            saveAsCommand = CommandManager.get(Commands.FILE_SAVE_AS);

        saveCommand.setEnabled(!isDesignEditorVisible);
        saveAllCommand.setEnabled(!isDesignEditorVisible);
        saveAsCommand.setEnabled(!isDesignEditorVisible);
    }

    function _setPanelVisibility(isVisible) {
		const doc = DocumentManager.getCurrentDocument();
        console.log('_setPanelVisibility', isVisible, realVisibility);

        _setSaveMenuEnabled(isVisible);

        if (isVisible === realVisibility
           && (currentDoc === lastDoc || !isVisible)) {
                return isVisible;
        }


        if (isVisible) {
            console.log('current document', doc);
            if (doc.isDirty) {
                if(!window.confirm('Unsaved changed will not be reflected in TAU Design Editor')) {
                    console.log('cancelled');
                    return !isVisible;
                }
            }
            realVisibility = isVisible;// this will be duplicated
            if (!panel) {
                $panel = $(panelHTML);
                $iframe = $panel.find('#panel-tau-preview-frame');

                panel = WorkspaceManager.createBottomPanel('tau-preview-panel', $panel, 918);

                $panel.on('panelResizeUpdate', function (e, newSize) {
                    $iframe.attr('height', newSize);
                });

                window.setTimeout(_resizeAndShowIframe, 0);

                $iframe.hide();
            } else {
                window.loadFromFile(function () {
                    _resizeAndShowIframe();
                });
            }

            _loadDoc(doc);

            $icon.toggleClass('active');

            panel.show();
        } else {
			realVisibility = isVisible;
			$('#editor-holder').css('max-height', '100%');
			$icon.toggleClass('active');
			panel.hide();
			$iframe.hide();

			ProjectManager.deleteItem(
				FileSystem.getFileForPath(`${doc.file.parentPath}temporary-preview.html`)
			);

			window.setTimeout(() => {
				$iframe[0].contentDocument.body.classList.remove('closet-preview-mode-active');
				$iframe.contents().find('closet-preview-element').off();
				$iframe.contents().find('closet-preview-element').remove();
			}, 500);

			window.saveToFile(() => {}, false);
		}

        return isVisible;
    }

    function _toggleVisibility() {
        console.log('toggleVisibility');
        visible = _setPanelVisibility(!visible);
        toggleCmd.setChecked(visible);
    }

    function _currentDocChangedHandler() {
        var doc = DocumentManager.getCurrentDocument(),
            ext = doc ? FileUtils.getFileExtension(doc.file.fullPath).toLowerCase() : '',
            currentDocExt = currentDoc ? FileUtils.getFileExtension(currentDoc.file.fullPath).toLowerCase() : '',
            projectId = PreferencesManager.getViewState('projectId'),
            serverPath = '',
            filePath = '',
            basePath = '',
            basePathArray,
            isWATT = !!projectId || false;


        // If currently opened document has been modified
        // ask user to save it before changing working file
        if (currentDoc && /html/.test(currentDocExt) && window.top.saveToFile) {
            window.top.saveToFile(() => {}, false);
        }

        if (isWATT) {
            if (doc) {
                serverPath = brackets.app.convertFilePathToServerPath(doc.file.fullPath, projectId);
            }
            filePath = serverPath.replace(new RegExp('https?://[^/]+', 'gi'), '');
            basePath = filePath.replace(new RegExp(projectId + '.*', 'gi'), '') + projectId + '/';
        } else {
            basePathArray = doc && doc.file.fullPath.split('/');
            if (basePathArray) {
                basePathArray.pop();
            } else {
                basePathArray = [];
            }
            basePath = '/fs/fread/raw/' + basePathArray.join('/');
        }

        // @TODO
        // this needs to be fixed!
        // fullPath exists in brackets file index
        // but this is NOT the reall path so it cannot be used for
        // basePath
        window.top.globalData = {
            fileUrl: doc && doc.file.fullPath,
            basePath: basePath,
            projectId: projectId,
            networks: []
        };

        window.top.selectFile = function (file, callback) {
            FileViewController.openAndSelectDocument(
                file.replace(/projects\/([^\/])+/, "projects"), // remove project ID from path
                FileViewController.PROJECT_MANAGER,
                MainViewManager.ACTIVE_PANE
            ).done(function (result) {
                callback(result);
            }).fail(function (err) {
                console.error('could not read file', err);
            });
        };

        function returnTrueStub() {
            return true;
        }

        window.top.saveDocument = function (docToSave, supressReload, callback) {
            var file = docToSave.file,
                oldIsUntitled = docToSave.isUntitled;

            if (supressReload) {
                // as FileSyncManager has no options for disabling
                // wee need to hack it, mark the doc as clean and
                // sub isUntitled function
                docToSave.isDirty = false;
                docToSave.isUntitled = returnTrueStub;
            }

            FileUtils.writeText(file, docToSave.getText(true), true)
                .done(function () {
                    if (supressReload) {
                        // we need to replace the stub function back over again
                        // but we do not want the code to run every call, so we
                        // squash calls in a period of time
                        if (supressReloadHackTimer) {
                            clearTimeout(supressReloadHackTimer);
                        }
                        supressReloadHackTimer = setTimeout(function () {
                            docToSave.file.stat(function (err, stat) {
                                // update doc time
                                // and restor isUntitled
                                doc.keepChangesTime = stat.mtime.getTime();
                                docToSave.isUntitled = oldIsUntitled;
                            });
                        }, supressReloadHackTimerTTL);
                    }

                    if (typeof callback === 'function') {
                        callback();
                    }
                })
                .fail(function (err) {
                    console.error(err);
                    if (typeof callback === 'function') {
                        callback(err);
                    }
                });
        };

        $.getJSON('/networkinterface')
            .done(function (result) {
                if (result && result.interfaces !== undefined) {
                    window.top.globalData.networks = result.interfaces;
                }
            })
            .fail(function (err) {
                console.error('could not fetch list of interfaces', err);
            })
            .always(function () {
                lastDoc = currentDoc;
                if (currentDoc) {
                    currentDoc.off('change', _documentChange);
                    currentDoc = null;
                }

                if (currentEditor) {
                    currentEditor.off('scroll', _editorScroll);
                    currentEditor = null;
                }

                if (doc && /html/.test(ext)) {
                    currentDoc = doc;
                    currentDoc.on('change', _documentChange);
                    currentEditor = EditorManager.getCurrentFullEditor();
                    currentEditor.on('scroll', _editorScroll);

                    $icon.css({display: 'block'});

                    _setPanelVisibility(visible);

                    if (toggleCmd) {
                        toggleCmd.setEnabled(true);
                    }

                    _loadDoc(doc);
                } else {
                    // other type of file is opened, so Design View should be closed
                    $icon.css({display: 'none'});

                    if (toggleCmd) {
                        toggleCmd.setEnabled(false);
                    }

                    _setPanelVisibility(false);
                }
            });
    }

    module.exports = {
        initialize: function () {

            // Prefs
            commandPreference = PreferencesManager.getExtensionPrefs('tau-preview');

            commandPreference.definePreference('useGFM', 'boolean', false);
            commandPreference.definePreference('theme', 'string', 'clean');
            commandPreference.definePreference('syncScroll', 'boolean', true);

            // Debounce event callback to avoid excess overhead
            // Update preview 300 ms ofter document change
            // Sync scroll 1ms after document scroll (just enough to ensure
            // the document scroll isn't blocked).
            _documentChange = _.debounce(__documentChange, 300);
            _editorScroll = _.debounce(__editorScroll, 1);

            // Insert CSS for this extension
            ExtensionUtils.loadStyleSheet(module, '../styles/tauPreview.css');

            // Check if sample was opened using /demos API.
            isRemoteSample = PreferencesManager.getViewState('projectType') === 'demo' ? true : false;

            // Add toolbar icon
            $icon = $('<a>')
                .attr({
                    id: 'tau-preview-icon',
                    href: '#'
                })
                .css({
                    display: 'none'
                })
                .addClass(isRemoteSample ? 'previewMode' : 'editMode')
                .click(_toggleVisibility)
                .appendTo($('#main-toolbar .buttons'));

            // Add a document change handler
            MainViewManager.on('currentFileChange', _currentDocChangedHandler);

            // currentDocumentChange is *not* called for the initial document. Use
            // appReady() to set initial state.
            AppInit.appReady(function () {
                _currentDocChangedHandler();
            });

            // Listen for resize events
            WorkspaceManager.on('workspaceUpdateLayout', _resizeAndShowIframe);
            $('#sidebar').on('panelCollapsed panelExpanded panelResizeUpdate', _resizeAndShowIframe);
        },
        menuTrigger: function () {
            return _toggleVisibility;
        },
        isChecked: function () {
            return realVisibility;
        },
        isEnabled: function () {
            return realVisibility;
        },
        _registerMenuCommand: function (menuCommand) {
            toggleCmd = menuCommand;
        }
    };
});
