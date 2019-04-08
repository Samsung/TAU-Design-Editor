'use babel';

import $ from 'jquery';
import path from 'path';
import fs from 'fs';
import {packageManager, Package} from 'content-manager';
import {appManager} from '../../app-manager';
import {DressElement} from '../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import editor from '../../editor';
import {StateManager} from '../../system/state-manager';
import {} from './components/category-element';
import {} from './components/thumbnail-element';
import {} from './components/grouped-button-element';
import {} from './components/file-picker-element';

var app = null;
const CompositeDisposable = editor.CompositeDisposable;
const States = StateManager.States;
const notificationManager = editor.notifications;

if (window.atom) {
    const remote = require('remote');

    if (remote) {
        app = remote.require('app');
    }
}
const CLOSET_DEFAULT_WORKSPACE = path.join((app && app.getPath('home')) || '', 'ClosetWorkspace'),
    TEMPLATE_PATH = '/panel/wizards/project-wizard-element.html';

/**
 *
 */
class ProjectWizard extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        this._initialize();
        this._registerCommands();
        this.events = {
            'category.change': 'onCategoryChange',
            'click .pw-accept-btn': 'onAccept',
            'click .pw-cancel-btn': 'onCancel',
            'click .closet-grouped-button-item': 'onChangeProfile'
        };
    }

    /**
     * attach callback
     */
    onAttached() {
        this._parseCategories(packageManager.getPackages(Package.TYPE.APP_TEMPLATE));
        this.$el.attr('tabindex', '-1');
    }

    /**
     * Init
     * @private
     */
    _initialize() {
        this._appPath = appManager.getAppPath();
        this._templateMetadata = {};

        this._projectNameInputElement = null;
        this._projectPathInputElement = null;
        this._categoryElement = null;
        this._thumbnailElement = null;
        this._groupedButtonElement = null;
        this._useExisingWindowElement = null;

        this._newProjectInfo = {};
    }

    /**
     * Change template view
     * @param {string} profileName
     * @private
     */
    _changeTemplateView(profileName) {
        this._categoryElement.setCategoryItemData(this._templateMetadata[profileName]);
    }

    /**
     * Parse categories
     * @param {Object} templateMetadata
     * @private
     */
    _parseCategories(templateMetadata) {
        var data, metadata = templateMetadata._packages;
        Object.keys(metadata).forEach((templateName) => {
            var profiles = null;
            data = $.extend(true, {}, metadata[templateName].options);
            data.id = templateName;
            profiles = data.profile.split(',');

            profiles.forEach((profile) => {
                if (!this._templateMetadata[profile]) {
                    this._templateMetadata[profile] = {};
                }

                if (!this._templateMetadata[profile][data.category]) {
                    this._templateMetadata[profile][data.category] = [];
                }
                this._templateMetadata[profile][data.category].push(data);
            });

        });
    }

    /**
     * Open project wizard
     */
    openProjectWizard() {
        var self = this;

        $.ajax({
            url: path.join(self._appPath.src, TEMPLATE_PATH),
            cache: false
        }).done((html) => {
            self.$el.append($(html));
            eventEmitter.emit(EVENTS.OpenPanel, {
                type: 'modal',
                item: self
            });

            self._projectNameInputElement = self.$el.find('.pw-project-name')[0];
            $(self._projectNameInputElement).focus();
            self._projectPathInputElement = self.$el.find('closet-file-picker')[0];
            self._projectTemplateWrapperElement = self.$el.find('.closet-template-thumbnail-wrapper')[0];

            self._categoryElement = self.$el.find('closet-pw-category')[0];
            self._thumbnailElement = self.$el.find('closet-pw-thumbnail')[0];
            self._groupedButtonElement = self.$el.find('closet-grouped-button')[0];
            self._useExisingWindowElement = self.$el.find('.use-existing-window-chk')[0];
            self._useExisingWindowElement.checked = StateManager.get(States.UseExistingWindow);

            self._projectNameInputElement.getModel().setPlaceholderText('Write your project name');
            self._projectPathInputElement.path = CLOSET_DEFAULT_WORKSPACE;

            self.$el.parent().addClass('closet-project-wizard-panel').css('z-index', 99);

            self._changeTemplateView(self.$el.find('closet-grouped-button')[0].getButtons()[0].text().toLowerCase());
        });

    }

    /**
     * Category change callback
     * @param {Event} event
     * @param {Object} thumbnailData
     */
    onCategoryChange(event, thumbnailData) {
        this._thumbnailElement.setThumbnailMetadata(thumbnailData.list);
        this._thumbnailElement.render();
    }

    /**
     * Set new project info
     * @private
     */
    _setNewProjectInfo() {
        var thumbnailElement = this._thumbnailElement;
        this._newProjectInfo = {
            projectProfile: this._groupedButtonElement.getSelectedButton().text(),
            workSpacePath: this._projectPathInputElement.path,
            projectName: this._projectNameInputElement.getModel().getText(),
            projectPath: path.join(this._projectPathInputElement.path, this._projectNameInputElement.getModel().getText()),
            templatePath: thumbnailElement.templatePath,
            pathToLibs: thumbnailElement.packagePath + path.sep + 'libs',
            libsToInclude: thumbnailElement.libraries,
            useExistingWindow: this._useExisingWindowElement.checked
        };
    }

    /**
     * Validation check
     * @returns {*}
     * @private
     */
    _validationCheck() {
        var projectInfo = this._newProjectInfo;

        if (!projectInfo.projectName) {
            return {
                result: false,
                message: 'Please filling the project name field.'
            };
        } else if (!projectInfo.templatePath) {
            return {
                result: false,
                message: 'Please choose a template.'
            };
        } else if (fs.existsSync(this._newProjectInfo.projectPath)) {
            return {
                result: false,
                message: 'Please choose other project directory. It is already existed.'
            };
        }
        return {
            result: true,
            message: ''
        };

    }

    /**
     * Cancel callback
     */
    onCancel() {
        StateManager.set(States.UseExistingWindow, this._useExisingWindowElement.checked);
        this._destroy();
    }

    /**
     * Accept callback
     */
    onAccept() {
        var validate;

        this._setNewProjectInfo();
        validate = this._validationCheck();
        StateManager.set(States.UseExistingWindow, this._useExisingWindowElement.checked);

        if (validate.result === true) {
            eventEmitter.emit(EVENTS.OpenNewProject, this._newProjectInfo);
            this._destroy();
        } else {
            notificationManager.addError(validate.message, {dismissed: true});
            notificationManager.clear();
        }
    }

    /**
     * Change profile callback
     * @param {Event} e
     */
    onChangeProfile(e) {
        this._changeTemplateView(e.target.textContent.toLowerCase());
    }

    /**
     * Destroy
     * @private
     */
    _destroy() {
        eventEmitter.emit(EVENTS.ClosePanel, {item: this, clean: true});
        this._initialize();

        this.$el.html('');
    }

    /**
     * Register commands
     * @private
     */
    _registerCommands() {
        this.subscriptions = new CompositeDisposable();

        if (this.subscriptions && this.subscriptions.add) {
            this.subscriptions.add(editor.commands.add(editor.selectors.workspace, {
                'closet-project-wizard:accept': this.onAccept.bind(this),
                'closet-project-wizard:cancel': this.onCancel.bind(this)
            }));
        }
    }
}

const ProjectWizardElement = document.registerElement('closet-project-wizard', ProjectWizard);

export {ProjectWizardElement, ProjectWizard};
