'use babel';

import fs from 'fs';
import $ from 'jquery';
import {} from 'jquery-ui';
import editor from '../../editor';
import {eventEmitter, EVENTS} from '../../events-emitter';
import {appManager as AppManager} from '../../app-manager';
import {DressElement} from '../../utils/dress-element';
import utils from '../../utils/utils';

const TextEditor = editor.TextEditor;

const brackets = utils.checkGlobalContext('brackets');
const saveDocument = utils.checkGlobalContext('saveDocument');


class AssistantView extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        this.events = {
            'blur .closet-assistant-editor': '_onChange'
        };
        this._initialize();
        this._changeTimer = 0;
        this._changeTimerTTL = 250;
    }

    /**
     * Attachment callback
      */
    onAttached() {
        if (this.parentNode) {
            this.$el.parent().addClass('assistant-panel');
        }
        this._addResizeHelper();
    }

    /**
     * Destroy callback
      */
    onDestroyed() {
        this._destroyResizeHelper();
    }

    /**
     * Init
      * @private
     */
    _initialize() {
        this._appPath = AppManager.getAppPath();
        this._currentFilePath = null;
        this._currentGrammar = null;
        this._opened = false;

        eventEmitter.on(EVENTS.ElementDragStop, this._onElementDragStop.bind(this));
        eventEmitter.on(EVENTS.ElementDrag, this._onElementDrag.bind(this));
    }

    /**
     * Destroy resize helper
      * @private
     */
    _destroyResizeHelper() {
        if (this.$el.resizable('instance')) {
            this.$el.resizable('destroy');
        }
    }

    /**
     * Add resize helper
      * @private
     */
    _addResizeHelper() {
        this.$el.resizable({
            handles: 'e',
            stop() {
                eventEmitter.emit(EVENTS.AssistantViewResized);
            }
        });
    }

    _onChange() {
        if (this._changeTimer) {
            clearTimeout(this._changeTimer);
        }

        this._changeTimer = setTimeout(() => {
            // save file
            if (editor.isAtom()) {
                this._textEditor.saveAs(this._currentFilePath);
            } else {
                if (saveDocument) {
                    saveDocument(this._textEditor.document, true, function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                } else {
                    console.warn('save document hook not found!');
                }
            }
        }, this._changeTimerTTL);
    }

    /**
     * Get selectable item
     * @param {HTMLElement} element
     * @param {string|Array} selectorList
     * @returns {*}
     * @private
     */
    static _getSelectableItem(element, selectorList) {
        var $element = $(element),
            matched = false;

        if (selectorList) {
            if ($.isArray(selectorList)) {
                selectorList = selectorList.join(', ');
            }

            do {
                if ($element.is(selectorList)) {
                    matched = true;
                }
                if (matched === false) {
                    $element = $element.parent();
                }
            } while ((matched === false) && ($element.length > 0));
        } else {
            matched = true;
        }
        return matched ? $element : null;
    }

    /**
     * Element drag callback
     * @param {Event} event
     * @private
     */
    _onElementDrag(event) {
        var pointedElement,
            $lineElement,
            lineNumber,
            textEditorElement = this._$textEditorEl && this._$textEditorEl[0] || null;

        if (textEditorElement && textEditorElement.shadowRoot) {
            // atom version
            pointedElement = textEditorElement.shadowRoot.elementFromPoint(event.clientX, event.clientY);
            $lineElement = AssistantView._getSelectableItem(pointedElement, ['div.line']);
            if ($lineElement) {
                lineNumber = $lineElement.attr('data-screen-row');
                this._$textEditorEl.focus();
            }
        } else {
            // brackets version
            pointedElement = document.elementFromPoint(event.clientX, event.clientY);
            $lineElement = AssistantView._getSelectableItem(pointedElement, ['.CodeMirror-code > div']);
            if ($lineElement) {
                lineNumber = $lineElement.parent().children().index($lineElement[0]);
            }
        }

        if ($lineElement) {
            this.setCursorPosition([lineNumber, 0]);
        }
    }

	/**
	 * Element drag stop
	 * @private
	 */
	_onElementDragStop() {
		if (this.isOpened()) {
			eventEmitter.emit(EVENTS.OpenAssistantWizard);
		}
	}

    /**
     * Set grammar
     * @param {Object} grammar
     */
    setGrammar(grammar) {
        if (this._currentGrammar !== grammar) {
            this._currentGrammar = grammar;
            this._textEditor.setGrammar(grammar);
        }
    }

    /**
     * Set content
     * @param {string} jsPath
     */
    setContents(jsPath) {
        console.log('setting content with: ' + jsPath);
        var DocumentManager = null,
            self = this,
            contents = '';
        if (editor.isAtom()) {
            console.log('using atom editor');
            contents = fs.readFileSync(jsPath, 'utf-8');
            this._currentFilePath = jsPath;
            this._textEditor.setText(contents, {
                autoIndent: true,
                autoIndentNewline: true
            });
        } else if (!this._textEditor) {
            console.log('using brackets editor');
            DocumentManager = brackets.getModule('document/DocumentManager');
            DocumentManager.getDocumentForPath(jsPath).then((doc) => {
                console.log('document info');
                console.log(doc.toString());
                this._textEditor = new TextEditor(
                    doc,
                    true,
                    this.$el,
                    null,
                    {
                        readOnly: false
                    }
                );
                this._textEditor.on('blur', () => {
                    self._onChange();
                });
                this._textEditor._codeMirror.on('changes', () => {
                    self._onChange();
                });
                this._textEditor._codeMirror._lineFolds = {}; // ensure this is an obj
                this._$textEditorEl = this._textEditor.$el;
                this._bracketsDocument = doc;
                setTimeout(() => {
                    this._textEditor.refresh();
                    this._textEditor.focus();
                }, 0);
            });
        }
    }

    /**
     * Open
     * @param {string} referenceJSPath
     */
    open(referenceJSPath) {
        this.$el.html(this._$textEditorEl);
        this.setContents(referenceJSPath);

        eventEmitter.emit(EVENTS.OpenPanel, {
            type: 'left',
            item: this,
            priority: 120
        });

        this._opened = true;
    }

    /**
     * Close
     */
    close() {
        if (this.isOpened()) {
            eventEmitter.emit(EVENTS.ClosePanel, {
                item: this,
                clean: false
            });

            // @TODO change removeClass to .hide()
            this.$el.parent().removeClass('closet-editor-panel-visible');

            this._opened = false;
        }
    }

    /**
     * is Open?
     * @returns {boolean}
     */
    isOpened() {
        return this._opened;
    }

    /**
     * Return cursor position
     * @returns {*}
     */
    getCursorPosition() {
        var position = null;
        if (editor.isAtom()) {
            return this._textEditor.getCursorScreenPosition();
        }
        position = this._textEditor.getCursorPos();
        return {
            row: position.line,
            column: position.ch
        };
    }

    /**
     * Set cursor position
     * @param {Array} pos
     */
    setCursorPosition(pos) {
        if (editor.isAtom()) {
            this._textEditor.setCursorScreenPosition(pos);
        } else {
            this._textEditor.setCursorPos(pos[0], pos[1]);
        }
    }

    /**
     * Insert text
     * @param {string} contents
     */
    insertText(contents) {
        var position = null,
            line = null,
            match = null;
        if (editor.isAtom()) {
            this._textEditor.insertText(contents, {
                autoIndent: true,
                autoIndentNewline: true
            });
        } else {
            position = this.getCursorPosition();
            line = this._bracketsDocument.getLine(position.row);
            match = line.match(/^[ \t]*/);
            contents = contents.split('\n').filter(lineElement => lineElement).map(lineElement => match[0] + lineElement).join('\n');
            this._bracketsDocument.replaceRange(contents, {
                line: position.row,
                ch: position.column
            });
        }
    }
}

const AssistantViewElement = document.registerElement('closet-assistant-view', AssistantView);

export {AssistantViewElement, AssistantView};
