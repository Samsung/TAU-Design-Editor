'use babel';

import $ from 'jquery';
import path from 'path';
import {Package, packageManager} from 'content-manager';
import fs from 'fs';
import {appManager} from '../../app-manager';
import {DressElement} from '../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import editor from '../../editor';
import {StateManager} from '../../system/state-manager'
import {} from './components/thumbnail-element';
import {} from './components/file-picker-element';
import {} from './components/text-editor-element';
import pathUtils from '../../utils/path-utils';

const CompositeDisposable = editor.CompositeDisposable;
const notificationManager = editor.notifications;

const TEMPLATE_PATH = '/panel/wizards/page-wizard-element.html',
    DEFAULT_TEMPLATE_NAME = 'template.html';

/**
 *
 */
class PageWizard extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        if (!this.initialized) {
            this._initialize();
            this._registerCommands();
            this.events = {
                'click .pw-accept-btn': 'onAccept',
                'click .pw-cancel-btn': 'onCancel'
            };

            this._template = '';

        }
    }

    /**
     * attach callback
     **/
    onAttached() {
        this._parseCategories(packageManager.getPackages(Package.TYPE.PAGE_TEMPLATE));
        this.$el.attr('tabindex', '-1');
    }

    /**
     * Init
     */
    _initialize() {
        this._appPath = appManager.getAppPath();
        this._templateMetadata = {};

        this._pageNameInputElement = null;
        this._pagePathInputElement = null;
        this._categoryElement = null;
        this._thumbnailElement = null;

        this._newPageInfo = {};

        eventEmitter.on(EVENTS.PageWizardOpen, this.openPageWizard.bind(this));
    }

    /**
     * Change template view
     * @param {string} profileName
     */
    _changeTemplateView(profileName) {
        this._thumbnailRefresh(this._templateMetadata[profileName]);
    }

    /**
     * Parse categories
     * @param {Object} templateMetadata
     */
    _parseCategories(templateMetadata) {
        var data, metadata = templateMetadata._packages;

        Object.keys(metadata).forEach((templateName) => {
            data = $.extend(true, {}, metadata[templateName].options);
            data.id = templateName;
            data.templateFileName = data.templateFileName || DEFAULT_TEMPLATE_NAME;

            if (!this._templateMetadata[data.profile]) {
                this._templateMetadata[data.profile] = [];
            }

            this._templateMetadata[data.profile].push(data);
        });
    }

    /**
     * Open page wizard
     */
    openPageWizard() {
        var self = this,
            projectPath = pathUtils.createProjectPath();

        this._projectPath = projectPath;
        this._projectProfile = StateManager.get('screen').profile;

        $.ajax({
            url: path.join(self._appPath.src, TEMPLATE_PATH)
        }).done((html) => {
            self.$el.html(html);
            eventEmitter.emit(EVENTS.OpenPanel, {
                type: 'modal',
                item: self
            });

            self._pagePathInputElement = self.$el.find('closet-file-picker')[0];
            self._pageNameInputElement = self.$el.find('.pw-page-name')[0];
            self._pageTemplateWrapperElement = self.$el.find('.closet-template-thumbnail-wrapper')[0];
            self._thumbnailElement = self.$el.find('closet-pw-thumbnail')[0];

            self._pagePathInputElement.path = projectPath;

            // if (!self._pageNameInputElement.getModel().getText()) {
            //    self._pageNameInputElement.getModel().setText(DEFAULT_PAGE_NAME);
            // }

            self.$el.parent().addClass('closet-page-wizard-panel').css('z-index', 9999);

            self._changeTemplateView(self._projectProfile);
            self.initialized = true;
        });
    }

    /**
     * Refresh thumbnail
     * @param {Object} thumbnailData
     */
    _thumbnailRefresh(thumbnailData) {
        this._thumbnailElement.setThumbnailMetadata(thumbnailData);
        this._thumbnailElement.render();
    }

    /**
     * Get template config path
     * @param {string} templatePath
     * @param {string} profile
     */
    _getTemplateConfigByPath(templatePath, profile) {
        return this._templateMetadata[profile].filter(template => template.path === templatePath)[0];
    }

    /**
     * Save new page
     */
    _saveNewPage() {
        var self = this,
            page = self._newPageInfo,
            jsPath = page.pageName + '.js',
            pageSource = '',
            indexSource;

        fs.readFile(
            path.join(this._projectPath, 'index.html'),
            'utf8',
            (notUsed, content) => {
                indexSource = content.replace(/<!DOCTYPE html>\r?\n?/, '');
                pageSource = indexSource.replace(
                    /(<body[^>]*>)(.|\r|\n)*(<\/body>)/m,
                    '$1\r\n' + page.template + '\r\n$3'
                ).replace(/\{\{js\}\}/, jsPath
                ).replace(/\{\{id\}\}/, page.pageName);

                fs.writeFile(page.pagePath, pageSource, () => {
                    fs.writeFile(page.pagePath.replace('.html', '.js'), [
                        '(function ( ){',
                        '    "use strict";',
                        '    var page = document.getElementById("' + page.pageName + '")',
                        '    page.addEventListener("pagebeforeshow", function () {',
                        '    /**',
                        '     * Add App logic',
                        '     * **/',
                        '',
                        '    });',
                        '})();'
                    ].join('\n'), () => {
                        eventEmitter.emit(EVENTS.OpenPane, {
                            uri: self._newPageInfo.pagePath
                        });
                        self._destroy();
                    });
                });
            }
        );
    }

    /**
     * Set new page info
     */
    _setNewPageInfo() {
        var templateConfig = this._getTemplateConfigByPath(this._thumbnailElement.templatePath, this._projectProfile),
            template,
            pageName = '',
            dir = '';

        if (templateConfig) {
            template = $.ajax({
                url: path.join(templateConfig.path, templateConfig.templateFileName),
                async: false
            }).responseText;
            pageName = this._pageNameInputElement.getValue();
            dir = this._pagePathInputElement.path;
            this._newPageInfo = {
                pageName: pageName,
                workSpacePath: dir,
                pagePath: path.join(dir, pageName + '.html'),
                templatePath: this._thumbnailElement.templatePath,
                template: template
            };
        } else {
            this._newPageInfo = {};
        }
    }

    /**
     * Validate data
     */
    _validationCheck() {
        var pageInfo = this._newPageInfo;

        if (!pageInfo.templatePath) {
            return {
                result: false,
                message: 'Please choose a template.'
            };
        } else if (this._pagePathInputElement.path === pageInfo.pagePath) {
            return {
                result: false,
                message: 'Please enter page name.'
            };
        }
        return {
            result: true,
            message: ''
        };

    }

    /**
     * Cancel click callback
     */
    onCancel() {
        this._destroy();
    }

    /**
     * Accept click callback
     */
    onAccept() {
        var validate;

        this._setNewPageInfo();
        validate = this._validationCheck();

        if (validate.result === true) {
            this._saveNewPage();
        } else {
            notificationManager.addError(validate.message, {dismissed: true});
            notificationManager.clear();
        }
    }

    /**
     * Destroy
     */
    _destroy() {
        eventEmitter.emit(EVENTS.ClosePanel, {item: this, clean: true});
        this._initialize();

        this.$el.html('');
    }

    /**
     * Register commands
     */
    _registerCommands() {
        this.subscriptions = new CompositeDisposable();

        if (this.subscriptions.add) {
            this.subscriptions.add(editor.commands.add('closet-page-wizard', {
                'closet-page-wizard:accept': this.onAccept.bind(this),
                'closet-page-wizard:cancel': this.onCancel.bind(this)
            }));
        }
    }

}
const PageWizardElement = document.registerElement('closet-page-wizard', PageWizard);

export {PageWizardElement, PageWizard};
