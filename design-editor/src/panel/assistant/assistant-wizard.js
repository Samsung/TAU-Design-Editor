'use babel';

import $ from 'jquery';
import fs from 'fs';
import mustache from 'mustache';
import {packageManager, Package} from 'content-manager';
import editor from '../../editor';
import {appManager} from '../../app-manager';
import {DressElement} from '../../utils/dress-element';
import {eventEmitter, EVENTS} from '../../events-emitter';
import pathUtils from '../../utils/path-utils';

const CompositeDisposable = editor.CompositeDisposable,
    INPUT_CLASS_LIST = [
        'instance-name',
        'tau-widget-name'
    ],
    ACTION_PRESET_LIST = {
        NONE: 'none',
        PAGE_TRANSITION: 'page-transition',
        POPUP_OPEN: 'popup-open'
    },
    instanceListTemplate = '{{#instances}}<option value=\'{{.}}\'>{{.}}</option>{{/instances}}';

class AssistantWizard extends DressElement {
    /**
     * Init
     * @private
     */
    _initialize() {
        this._$activeBlock = null;
        this._$target = null;
        this._targetCompInfo = null;
        this._$usingExistInstanceCheckbox = null;
        this._$instanceList = null;

        this._$useCustomEventCheckbox = null;
        this._$eventTypeInput = null;
        this._$eventTypeSelect = null;

        this._$actionPresetGroup = null;
        this._$actionPresetArea = null;

        this._inputModels = [];
        this._subscriptions = null;
        this._appPath = appManager.getAppPath();

        this.events = {
            'click .aw-cancel-btn': '_onClickCancel',
            'click .aw-accept-btn': '_onClickAccept',
            'click .closet-grouped-button': '_onClickTab',
            'click .closet-assistant-wizard-option-item' : '_onClickOptionButton'
        };
    }

    /**
     * create callback
     */
    onCreated() {
        this._initialize();
        this._registerCommands();
    }

	/**
	 * Open
	 * @param {HTMLElement} element
	 * @param {Array} existInstanceList
	 */
	open(element, existInstanceList) {
		const
			PackageList = packageManager.getPackages(Package.TYPE.COMPONENT),
			$el = this.$el;

		window.parent.postMessage({
			type: 'ASSISTANT_WIZARD_OPEN'
		}, '*');

		this._$target = $(element);
		this._targetCompInfo = PackageList.getPackageByElement(element);

		const
			componentAttrs = this._targetCompInfo.options.attributes,
			CustomEventList = this._targetCompInfo.options.events;

		$.get(`${this._appPath.src}/panel/assistant/assistant-wizard.html`, (content) => {
			$el.html(mustache.render(content, {
				options: componentAttrs ? this._createOptionList(componentAttrs) : [],
				events: CustomEventList,
				notTAUWidget : !this._targetCompInfo.options.generator
			}));

			this._$usingExistInstanceCheckbox = $el.find('.closet-using-exist-instance');
			this._$instanceList = $el.find('.closet-exist-instance-list');
			this._$pageList = $el.find('.closet-exist-page-names');
			this._$widgetOptionButtons = $el.find('.closet-assistant-wizard-option-item');
			this._$useCustomEventCheckbox = $el.find('.closet-input-manually');
			this._$actionPresetGroup = $el.find('.closet-action-preset-group');
			this._$actionPresetArea = $el.find('.closet-assistant-wizard-preset-wrapper');

			this._$eventTypeSelect = $el.find('.event-type');
			this._$eventTypeInput = $el.find('.event-type-custom');

			eventEmitter.emit(EVENTS.OpenPanel, {
				type: 'modal',
				item: this
			});

			this._setActiveBlockByTabElement($el.find('.closet-task-group button.selected'));

			this._setInputModels();
			this._setInitialStringToInput();
			this._setUsingExistInstance(!!(existInstanceList.length));
			this._setInstanceList(existInstanceList);
			this._updateFileList(pathUtils.createProjectPath());

			$el.parent().addClass('closet-assistant-wizard-panel');

			this._bindEvent();
		});
	}

    /**
     * Bind events
     * @private
     */
    _bindEvent() {
        this._$useCustomEventCheckbox.on('click', this._onClickCustom.bind(this));
		this._$actionPresetGroup.on('click', this._onClickPreset.bind(this));
		this._$usingExistInstanceCheckbox.on('click', this._onClickUseExistVar.bind(this));
    }

    /**
     * on click custom callback
     * @param {Event} event
     * @private
     */
    _onClickCustom(event) {
        var $targetEl = $(event.target);

        if ($targetEl.is(':checked')) {
            this._$eventTypeInput.css('display', 'block').focus();
            this._$eventTypeSelect.css('display', 'none');
        } else {
            this._$eventTypeInput.css('display', 'none');
            this._$eventTypeSelect.css('display', 'block');
        }
    }

    /**
     * On click preset callback
     * @param {Event} event
     * @private
     */
    _onClickPreset(event) {
        var $curTargetEl,
            $targetEl,
            presetName;

        $curTargetEl = $(event.currentTarget);
        $targetEl = $(event.target);

        $curTargetEl.find('.selected').removeClass('selected');
        $targetEl.addClass('selected');

        presetName = $targetEl.attr('data-preset-name');

        this._showPresetOptions(presetName);
    }

	/**
     * On click useExistVar checkbox callback
     * @param {Event} event
     * @private
     */
	_onClickUseExistVar(event){
		const isCheckboxChecked = event.target.checked;
		if (!isCheckboxChecked) {
			this._$instanceList[0].style = 'display:none;';
		} else {
			this._$instanceList[0].style = 'display:flex;';
		}
	}

    /**
     * Show preset
     * @param {string} presetName
     * @private
     */
    _showPresetOptions(presetName) {
        var presetAreaPrefix = 'preset-';

        this._$actionPresetArea.find('.active').removeClass('active');

        switch (presetName) {
        case ACTION_PRESET_LIST.NONE:
            this._$actionPresetArea.find('.' + presetAreaPrefix + ACTION_PRESET_LIST.NONE).addClass('active');
            break;
        case ACTION_PRESET_LIST.PAGE_TRANSITION:
            this._$actionPresetArea.find('.' + presetAreaPrefix + ACTION_PRESET_LIST.PAGE_TRANSITION).addClass('active');
            break;
        }
    }

    /**
     * Click option button callback
     * @param {Event} event
     * @private
     */
    _onClickOptionButton(event) {
        var $el = $(event.target);
        if ($el.hasClass('selected')) {
            $el.removeClass('selected');
        } else {
            $el.addClass('selected');
        }
    }

    /**
     * Create options list
     * @param {Object} attributes
     * @returns {Array}
     * @private
     */
    _createOptionList(attributes) {
        var keys,
            key,
            result = [],
            length,
            dataAttrToken,
            i;

        dataAttrToken = /^(data)-/g;
        keys = Object.keys(attributes);
        length = keys.length;

        for (i = 0; i < length; i += 1) {
            key = keys[i];
            if (attributes[key]['widget-option']) {
                result.push({
                    name: this._snakeToCamel(key.replace(dataAttrToken, '')),
                    value: attributes[key].value
                });
            }
        }

        return result;
    }

    /**
     * Convert name
     * @param {string} string
     * @returns {string}
     * @private
     */
    _snakeToCamel(string) {
        var snakeToken = /(-\w)/g;

        return string.replace(snakeToken, function (matches) {
            return matches[1].toUpperCase();
        });
    }

    /**
     * Set input models
     * @private
     */
    _setInputModels() {
        var i, length;

        length = INPUT_CLASS_LIST.length;
        for (i = 0; i < length; i += 1) {
            this._inputModels.push(this.$el.find('.' + INPUT_CLASS_LIST[i]));
        }
    }

    /**
     * Set initial string to input
     * @private
     */
    _setInitialStringToInput() {
        var i, length, string, inputModel, snakeToken = /(-)/g,
            classString;

        length = INPUT_CLASS_LIST.length;
        for (i = 0; i < length; i += 1) {
            inputModel = this._inputModels[i];
            classString = INPUT_CLASS_LIST[i];
            string = 'Write ' + classString.replace(snakeToken, ' ');
            inputModel.val('');
            inputModel.attr('placeholder', string);
        }
    }

    /**
     * Set existing instance
     * @param {boolean} isExist
     * @private
     */
    _setUsingExistInstance(isExist) {
        this._$usingExistInstanceCheckbox.prop('checked', isExist).prop('disabled', !isExist);
    }

    /**
     * Set instance list
     * @param {Array} instanceList
     * @private
     */
    _setInstanceList(instanceList) {
        if (instanceList.length) {
            this._$instanceList.html(mustache.render(instanceListTemplate, {
                instances : instanceList
            }));
            this._$instanceList.css('display', 'flex');
        } else {
            this._$instanceList.html('');
            this._$instanceList.css('display', 'none');
        }
    }

    /**
     *  Update file list
     * @param {string} filePath
     * @private
     */
    _updateFileList(filePath) {
        var self = this;
        fs.readdir(filePath, function (err, files) {
            self._$pageList.html(mustache.render(instanceListTemplate, {
                instances: files.filter(function (file) {
                    return file.match(/\.html$/);
                })
            }));
        });
    }

    /**
     * on click cancel
     * @private
     */
    _onClickCancel() {
        this._close();
    }

    // TODO : need to check the essential forms are filled.
    /**
     * on click accept
     * @private
     */
    _onClickAccept() {
        var result = {
                state: 'accept',
                type: null,
                element: this._$target,
                info: null
            },
            info = {
                name: null,
                type: null,
                widgetInfo: null,
                useExist: this._$usingExistInstanceCheckbox.prop('checked'),
                useCapture: 'false'
            },
            presetType;

        if (this._$activeBlock) {
            if (this._$activeBlock.hasClass('instance-block')) {
                result.type = 'instance';
                info.name = info.useExist === true ? this._$instanceList.val() : this._$activeBlock.find('.instance-name').val();
            } else if (this._$activeBlock.hasClass('tau-widget-block')) {
                result.type = 'tau-widget';
                info.name = info.useExist === true ? this._$instanceList.val() : null;
                info.widgetInfo = {
                    name: this._$activeBlock.find('.tau-widget-name').val(),
                    constructorName : this._targetCompInfo.options.generator.constructor,
                    options : this._getSelectedOptionList()
                };
            } else if (this._$activeBlock.hasClass('event-listener-block')) {
                presetType = this._$actionPresetGroup.find('.selected').attr('data-preset-name');

                if (presetType === ACTION_PRESET_LIST.NONE) {
                    result.type = 'listener';
                } else if (presetType === ACTION_PRESET_LIST.PAGE_TRANSITION) {
                    result.type = 'transition';
                    info.url = this._$pageList.val();
                    info.transition = this._$activeBlock.find('.page-transition-name').val();
                } else if (presetType === ACTION_PRESET_LIST.POPUP_OPEN) {
                    result.type = 'popup';
                }

                info.name = info.useExist === true ? this._$instanceList.val() : '';

                if (this._$useCustomEventCheckbox.is(':checked')) {
                    info.type = this._$eventTypeInput.val();
                } else {
                    info.type = this._$eventTypeSelect.val();
                }
            }

            result.info = info;
            eventEmitter.emit(EVENTS.AssistantWizardAccepted, result);
        }
        this._close();
    }

    /**
     * On click tab
     * @param {Event} event
     * @private
     */
    _onClickTab(event) {
        var $target = $(event.target),
        $currentTargetEl = $(event.currentTarget);
        this._setActiveBlockByTabElement($target);
        $currentTargetEl.find('.selected').removeClass('selected');
        $target.addClass('selected');
    }

    /**
     * Get selected options list
     * @returns {Array}
     * @private
     */
    _getSelectedOptionList() {
        var result = [],
            $item,
            optionName,
            optionDefault;

        Array.prototype.forEach.call(this._$widgetOptionButtons, function (currentItem) {
            $item = $(currentItem);
            if ($item.hasClass('selected')) {
                optionName = $item.attr('data-option-name');
                optionDefault = $item.attr('data-option-default');
                result.push([optionName, optionDefault]);
            }
        });

        return result;
    }

    /**
     * set active block
     * @param {jQuery} $target
     * @private
     */
    _setActiveBlockByTabElement($target) {
        var classNames = $target[0].className;

        ['instance-', 'tau-widget-', 'event-listener-', 'page-transition-'].forEach(function (type) {
            var $instance = this.$el.find('.' + type + 'block');
            if (classNames.indexOf(type) > -1) {

                // $instance.css('visibility', 'visible');
                $instance.css('display', 'flex');
                $instance.addClass('active');

                this._$activeBlock = $instance;
                $instance.find('[focus]').focus();

            } else {

                // $instance.css('visibility', 'hidden');
                $instance.css('display', 'none');
                $instance.removeClass('active');

            }
        }.bind(this));
    }

    /**
     * close
      * @private
     */
    _close() {
		window.parent.postMessage({
			type: 'ASSISTANT_WIZARD_CLOSE'
		}, '*');

        eventEmitter.emit(EVENTS.ClosePanel, {
            item: this,
            clean: true
        });
    }

    /**
     * Register commands
     * @private
     */
    _registerCommands() {
        this._subscriptions = new CompositeDisposable();

        if (this._subscriptions.add) {
            this._subscriptions.add(editor.commands.add('closet-assistant-wizard', {
                'closet-assistant-wizard:accept': this._onClickAccept.bind(this),
                'closet-assistant-wizard:cancel': this._onClickCancel.bind(this)
            }));
        }
    }
}

const AssistantWizardElement = document.registerElement('closet-assistant-wizard', AssistantWizard);

export {AssistantWizardElement, AssistantWizard};
