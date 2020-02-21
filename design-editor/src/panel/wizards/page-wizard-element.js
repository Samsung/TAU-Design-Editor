'use babel';

import $ from 'jquery';
import path from 'path';
import {Package, packageManager} from 'content-manager';
import fs from 'fs';
import {appManager} from '../../app-manager';
import Component from '../../utils/component-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import editor from '../../editor';
import {StateManager} from '../../system/state-manager';
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
class PageWizard extends Component {
	/**
     * Responsible for new Page wizard component
     */
	constructor() {
		super();
		if (!this.initialized) {
			this._initialize();
			this.events = {
				'click .pw-accept-btn': 'onAccept',
				'click .pw-cancel-btn': 'onCancel'
			};

			this._template = '';
		}
	}

	/**
	 * Initialize components state
	 */
	_initialize() {
		this._appPath = appManager.getAppPath();
		this._templateMetadata = {};

		this._pageNameInputElement = null;
		this._pagePathInputElement = null;
		this._categoryElement = null;
		this._thumbnailElement = null;

		this._newPageInfo = {};
		this._parseCategories(packageManager.getPackages(Package.TYPE.PAGE_TEMPLATE));
		this.setAttribute('tabindex', '-1');

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
		const metadata = templateMetadata._packages;

		Object.keys(metadata).forEach((templateName) => {

			const data = {
				...metadata[templateName].options,
				id: templateName,
			};
			data.templpateFileName = data.templateFileName || DEFAULT_TEMPLATE_NAME;
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
		const self = this,
			projectPath = pathUtils.createProjectPath();

		this._projectPath = projectPath;
		this._projectProfile = StateManager.get('screen').profile;
		this.createFromTemplate(TEMPLATE_PATH).then(() => {
			eventEmitter.emit(EVENTS.OpenPanel, {
				type: 'modal',
				item: this
			});
			this._pagePathInputElement = document.querySelector('closet-file-picker');
			this._pageNameInputElement = document.querySelector('.pw-page-name');
			this._pageTemplateWrapperElement = document.querySelector('.closet-template-thumbnail-wrapper');
			this._thumbnailElement = document.querySelector('closet-pw-thumbnail');

			this._pagePathInputElement.path = projectPath;

			this.parentElement.classList.add('closet-page-wizard-panel');
			this.parentElement.style.zIndex = 9999;

			self._changeTemplateView(self._projectProfile);
			self.initialized = true;
			this.bindEvents();
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
		let validate = true;

		if (!this._pageNameInputElement.getValue().trim()) {
			this._pageNameInputElement.classList.add('empty-warning');
			validate = false;
		}

		if (!this._pagePathInputElement.path.trim()) {
			this._pagePathInputElement.classList.add('empty-warning');
			validate = false;
		}

		if (!this._thumbnailElement.templatePath) {
			this._thumbnailElement.classList.add('empty-warning');
			validate = false;
		}

		return validate;
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
		if (this._validationCheck()) {
			this._setNewPageInfo();
			this._saveNewPage();
		}
	}

	/**
	 * Destroy
	 */
	_destroy() {
		eventEmitter.emit(EVENTS.ClosePanel, {item: this, clean: true});
		this._initialize();

		this.innerHTML = '';
	}

}
customElements.define('closet-page-wizard', PageWizard);

export {PageWizard};
