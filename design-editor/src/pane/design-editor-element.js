'use babel';
/**
 * Module for design editor working space
 * where user see application and can drop elements
 * @module design-editor-element
 */

import $ from 'jquery';
import {packageManager, Package} from 'content-manager';
import {StateManager} from '../system/state-manager';
import {SnapGuideManager} from './snap-guide-manager';
import {Guide} from './guide';
import {DressElement} from '../utils/dress-element';
import {EVENTS, eventEmitter} from '../events-emitter';
import {SelectLayerElement} from './select-layer/select-layer-element';
import {SectionControllerElement} from './section-controller-element';
import {elementSelector} from './element-selector';
import {GridElement} from './grid-element';
import {RulerElement} from './ruler-element';
import {ElementDetector} from './element-detector';
import {componentGenerator} from './component-generator';
import editor from '../editor';
import {TooltipElement} from '../panel/tooltip-element';
import {Devices} from '../system/devices';
import utils from '../utils/utils';
import {removeMediaQueryConstraints} from '../utils/iframe';
import pathUtils from '../utils/path-utils';
import fs from 'fs-extra';
import path, {relative, join} from 'path';

const KEY_CODE = {
	DELETE: 46
};
const INTERNAL_ID_ATTRIBUTE = 'data-id';
const LOCK_CLASS = 'lock';
const RE_COPY_ATTRIBUTE_TO_CONTAINER = new RegExp('^(data-(?!tau)|st-).*');

let _instance = null;

const getAppConfig = (app_path) => {
	return new Promise((resolve, reject) => {
		const configPath = path.join(app_path, 'config.xml');
		// eslint-disable-next-line no-console
		console.log(`searching for: ${configPath}`);
		fs.readFile(configPath, 'utf8', (err, text) => {
			if (err) {
				reject(err);
			} else {
				resolve({file: configPath, text});
			}
		});
	});
};

const changeAppProfile = (app_path, profile) => {
	return new Promise((resolve, reject) => {
		getAppConfig(app_path).then((res) => {
			console.log('changing profile to: ' + profile + ' in ' + res.file);
			const text = res.text.replace(/<tizen:profile[^>]+>/gi, '<tizen:profile name="' + profile + '"/>');
			fs.writeFile(res.file, text, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(text);
				}
			});
		}).catch((err) => {
			reject(err);
		});
	});
};

/**
 * Toggles/sets parent node modifications for element based on parent-modifiers option from component
 * @param {jQuery} $element
 * @param {Object} componentPackage
 * @param {Number} [forceState] Force the modifications on (1) or off (2)
 */
function toggleParentModifications($element, componentPackage, forceState) {
	return new Promise((resolve) => {
		var modifiers = componentPackage.options['parent-modifiers'],
			$parents = $();
		if (modifiers !== undefined) {
			modifiers.forEach((modifier) => {
				var $parent = $element.closest(modifier.selector),
					className = modifier.className;
				if ($parent.length > 0) {
					if (className !== undefined) {
						if (forceState === 2 || (forceState !== 1 && $parent.hasClass(className))) {
							$parent.removeClass(className);
						} else if (forceState === 1 || (forceState !== 2 && !$parent.hasClass(className))) {
							$parent.addClass(className);
						}

						$parents = $parents.add($parent);
					}
				}
			});
			resolve($parents);
		}
	});
}

class DesignEditor extends DressElement {
	/**
	 * Update data
	 * @param {Model} model
	 * @param {string} stringHTML
	 * @param {string} path
	 * @param {string} uri
	 */
	update(model, stringHTML, path, state, networks) {
		var uri = state && pathUtils.joinPaths(state.basePath, relative('/projects/', state.fileUrl));
		console.log('design-editor-element.update', path, uri);
		var serverPath;

		/*
		 * iframe(design view) should be re-constructed when switch the edit mode. Because code view was changed.
		 * But, If HTML String insert to iframe only used innerHTML, javascript code don't operate automatically.
		 * So, we need to use another method that is open, write, close document mechanism.
		 * However, this method has problem too. It is path problem. So we need to set base path before write a new HTML string.
		 */
		// create empty document wich will be store a model

		path = path || this._path;
		uri = uri || this._uri;
		serverPath = uri.replace(/[^\/]+$/, '').replace(/^\/projects/, '');
		model = model || this._model;

		const documentForModel = document.implementation.createHTMLDocument(''),
			// iframe document
			iframeDocument = this._$iframe[0].contentWindow && this._$iframe[0].contentWindow.document,
			basePath = path || editor.project.getPaths()[0];

		console.log('basePath', editor.project.getPaths());

		if (!stringHTML) {
			stringHTML = this._model ? this._model.export(true, null) : (this._stringHTML || '');
		}

		this._stringHTML = stringHTML;
		this._uri = uri;
		this._path = path || basePath;
		this._basePath = basePath.replace(/\\/g, '/') + '/';

		let profile = this.screenConfig.profile;
		console.log('profile in screen configuration: ' + profile);

		let appURI = uri.replace(/\/[^\/]+$/gi, '');

		/**
		 * @TODO changing tau source is disabled for now

		if (profile === 'tv') { //@TODO this needs to be removed
			profile = 'mobile';
		}

		stringHTML = stringHTML.replace(/<link rel="stylesheet" href="libs\/tau\/[a-z0-9]*\/theme\/default\/tau.(min.)?css">/g, '');
		stringHTML = stringHTML.replace('</head>', '<link rel="stylesheet" href="libs/tau/' + this.screenConfig.profile + '/theme/default/tau.css"></head>');

		stringHTML = stringHTML.replace(/<script type="text\/javascript" src="libs\/tau\/[a-z0-9]*\/js\/tau.(min.)?js"><\/script>/g, '');
		stringHTML = stringHTML.replace('</head>', '<script type="text/javascript" src="libs/tau/' + this.screenConfig.profile + '/js/tau.js"></script></head>');

		if (this.screenConfig.shape === 'rectangle') {
					stringHTML = stringHTML.replace('<link rel="stylesheet" href="libs/tau/wearable/theme/default/tau.circle.min.css">', '');
				stringHTML = stringHTML.replace('<script type="text/javascript" src="js/circle-helper.js"></script>', '');
		} else {
				if (stringHTML.indexOf('<link rel="stylesheet" href="libs/tau/wearable/theme/default/tau.circle.min.css">') === -1) {
				stringHTML = stringHTML.replace('</head>', '<link rel="stylesheet" href="libs/tau/wearable/theme/default/tau.circle.min.css"></head>');
			}
			if (stringHTML.indexOf('<script type="text/javascript" src="js/circle-helper.js"></script>') === -1) {
				stringHTML = stringHTML.replace('</head>', '<script type="text/javascript" src="js/circle-helper.js"></script></head>');
			}
		}

		**/
		this._$iframe.attr('src', uri);

		// fill model document by HTML
		documentForModel.documentElement.innerHTML = stringHTML;

		this._model = model;

		const configPath = (() => {
			const catalogName = this.getBasePath().split('/').filter(elem => elem.length)[0];
			return `/${catalogName}`;
		})();

		getAppConfig(configPath).then((res) => {
			const matches = /<tizen:profile[^"]+"([^"]+)[^>]+>/gi.exec(res.text);
			let configProfile = profile;
			if (matches && matches[1]) {
				console.log('profile found in config.xml: ' + matches[1]);
				configProfile = matches[1];
			}
			// init model, add data-id attributes
			if (!model.isInit()) {
				console.log('model initializing');
				this._model.init(documentForModel, packageManager.getPackages(Package.TYPE.COMPONENT), this);

				this.screenConfig.profile = profile = configProfile;
				if (profile && !this.screenConfig.device) {
					let def = this.screenConfig.device = Devices.getDefaultDevice(profile);
					if (def) {
						Devices.fillDeviceConfig(profile, def, this.screenConfig);
					}
				}

				console.log('setting screen profile to: ' + profile);
				StateManager.set('screen', this.screenConfig);

				eventEmitter.emit(EVENTS.RequestChangeProfile, profile);
				if (this.screenConfig.device) {
					eventEmitter.emit(EVENTS.RequestChangeDevice, this.screenConfig.device);
				}
			} else {
				console.log('updating model, new profile: ' + profile);
				this._model.update(documentForModel);

				changeAppProfile(appURI, profile)
					.then(function (config) {
						console.log('config.xml successfuly changed');
					})
					.catch(function (err) {
						console.error('could not modify config.xml', err);
					});
			}

			//@TODO: this needs to be fixed
			let finalBase = pathUtils.joinPaths(this.getBasePath(), serverPath);
			const globalData = utils.checkGlobalContext('globalData');
			if (window.vscode && globalData.host) {
				console.log('finalBase:', globalData.host + serverPath);
				finalBase = globalData.host + serverPath;
			}
			if (iframeDocument) {
				// fill HTML to iframe and run TAU
				console.log('writing model', this._model.getDOM(), 'to iframe document', iframeDocument);
				iframeDocument.open('text/htmlreplace');
				iframeDocument.write(
					this._model.getHTML()
						.replace('<html', '<html data-project="closet"')
						.replace(/(<head[^>]*>)/, `$1<base href="${  this.getBasePath()
						}/" data-project-path="true"><style>.using-alternative-selector{opacity:0.4;}</style>`)
				);
				iframeDocument.close();

				//@TODO: this needs to be fixed
				iframeDocument.addEventListener('pageshow', () => {
					console.log('$iframe.pageshow');
					this._updateIFrameHeight();
					iframeDocument.querySelector('base').setAttribute('href', finalBase);
					// "pageshow" event is triggered by TAU then TAU shoud be exists in iframe scope
					let tau = iframeDocument.defaultView.tau

					// fix data-ids for contained widgets
					const components = packageManager.getPackages(Package.TYPE.COMPONENT);
					const packages = components._packages;
					// find all build widgets
					iframeDocument.querySelectorAll('[data-tau-built]').forEach((widgetEl) => {
						widgetEl.getAttribute('data-tau-name').split(',').forEach((name) => {
							// get matching component for each built widget
							const component = packages[name.toLowerCase()];
							if (component) {
								let widget = tau.engine.getBinding(widgetEl, name);
								if (!widget) {
									widget = tau.engine.instanceWidget(widgetEl, name);
								}
								if (widget) {
									let container = widget.getContainer();
									// if component root element is not widget element
									// then the root element is a container
									// and data-ids should be moved
									if (widgetEl !== container) {
										if (widgetEl.hasAttribute(INTERNAL_ID_ATTRIBUTE)) {
											container.setAttribute(
												INTERNAL_ID_ATTRIBUTE,
												widgetEl.getAttribute(INTERNAL_ID_ATTRIBUTE)
											);
											widgetEl.removeAttribute(INTERNAL_ID_ATTRIBUTE);

											Array.prototype.slice.call(widgetEl.attributes).forEach((attribute) => {
												if (RE_COPY_ATTRIBUTE_TO_CONTAINER.test(attribute.name)) {
													container.setAttribute(attribute.name, attribute.value);
												}
											});
										}
									}
								}
							}
						});
					});
				});
			}

			this._$iframe.one('load', () => {
				removeMediaQueryConstraints(
					this._$iframe[0].contentDocument,
					pathUtils.createProjectPath(serverPath, true)
				);

				this._selectLayer.refreshAltSelectors();
				this._attachAlternativeSelectors(this._$iframe.contents()[0]);
				this._updateIFrameHeight();
				this._$iframe.css('visibility', 'visible');
				eventEmitter.emit(EVENTS.ActiveEditorUpdated, 1, this);
			});
			elementSelector.unSelect();
		}).catch((err) => {
			console.error('could not find app config.xml!', err);
		});

	}

	/**
	 * attache alternative selector
	 * @param {Document} doc
	 * @private
	 */
	_attachAlternativeSelectors(doc) {
		Array.prototype.forEach.call(doc.querySelectorAll('.using-alternative-selector'), (element) => {
			this._selectLayer.attachAlternativeSelector(element);
		});
	}

	/**
	 * Return model connected with editor
	 * @returns {model}
	 */
	getModel() {
		return this._model;
	}

	/**
	 * Do clone of iframe
	 * @returns {*}
	 */
	getIframeClone() {
		return this._$iframe.clone();
	}

	/**
	 * Create callback
	 */
	onCreated() {
		var self = this,
			snapGuides = null;

		this.defaults = {
			uri: ''
		};

		this.isContentsLoaded = false;
		this.screenConfig = StateManager.get('screen');

		if (!this.screenConfig) {
			this.screenConfig = {
				profile: 'mobile',
				width: 360,
				height: 640,
				ratio: 1.0,
				radius: 50,
				shape: 'rectangle'
			};
			StateManager.set('screen', this.screenConfig);
		}
		this._iFrameContentScrollerSelector = '.ui-page .ui-scroller,' +
			' .ui-page .ui-content'; // TODO : this TAU dependency needs to be
		// fixed.

		// create elements
		this._$scroller = $('<div class="closet-design-editor-scroller"></div>');
		this._$iframe = $('<iframe class="closet-design-editor-frame"></iframe>');
		this._$iframeDummy = $('<div class="frame-dummy"></div>');
		this._$designArea = $('<div class="design-area"></div>');

		this._callback = {
			Lock: this._onLockElement,
			Unlock: this._onUnlockElement,
			ElementSelected: this._onSelectedElement,
			ElementDeselected: this._onDeselectedElement,
			EditorConfigChanged: this._onChangedEditConfig,
			ChangeStyle: this._onStyleChanged,
			ChangeAttribute: this._onAttributeChanged,
			RemoveAttribute: this._onAttributeRemoved,
			ChangeContent: this._onContentChanged,
			ElementInserted: this._onElementInserted,
			ElementDeleted: this._onElementDeleted,
			ElementMoved: this._onElementMoved,
			ScriptInserted: this._onScriptInserted,
			StyleInserted: this._onStyleInserted,
			Show: this._onShowElement,
			Hide: this._onHideElement,
			ChangeProfile: this._onChangeProfile,
			ChangeShape: this._onChangeShape,
			DocumentSave: this._onSaveFile
		};

		Object.keys(this._callback).forEach(callbackName => {
			eventEmitter.on(EVENTS[callbackName], this._callback[callbackName].bind(this));
		});

		this.$el.on('click', (event) => {
			var $target = $(event.target);

			if ($target.is(self._$scroller)) {
				self._onDeselectedElement();
				elementSelector.unSelect();
			}
		});

		// we need first bind events, next we can create another layers
		this._selectLayer = new SelectLayerElement();
		this._selectLayer.options = {
			designEditor: this,
			screenWidth: this.screenConfig.width,
			screenHeight: this.screenConfig.height,
			screenRatio: this.screenConfig.ratio
		};
		this._sectionController = new SectionControllerElement();

		this._gridLayer = new GridElement();
		this._rulerXLayer = new RulerElement();
		this._rulerYLayer = new RulerElement();
		this._rulerYLayer.setOrientation('vertical');
		this._tooltipPanel = new TooltipElement();

		snapGuides = SnapGuideManager.getInstance().getGuides();
		this._$scroller.append(this._$iframe).append(this._$iframeDummy)
			.append(this._selectLayer)
			.append(this._sectionController);

		this.$el.append(this._$designArea);

		this._$designArea.append(this._$scroller)
			.append(this._gridLayer)
			.append(this._rulerXLayer)
			.append(this._rulerYLayer)
			.append(this._tooltipPanel)
			.append(snapGuides.vertical)
			.append(snapGuides.horizontal);

		this._$iframe.one('load', this._onContentsLoaded.bind(this));
		this._$scroller.on('scroll', this._onScroll.bind(this));

		this._guide = new Guide();
	}

	/**
	 * On ready callback
	 */
	onReady() {
		this._$iframe.attr('src', this.options.uri);
		this._$iframe.css('visibility', 'hidden');
	}

	/**
	 * on change profile callback
	 * @private
	 */
	_onChangeProfile() {
		console.log('design-editor-element._onChangeProfile');
		this.screenConfig = StateManager.get('screen');
		this.update();
	}

	/**
	 * on save file callback
	 * @private
	 */
	_onSaveFile(loud) {
		console.log('desing-editor-element._onSaveFile');
		const saveToFile = utils.checkGlobalContext('saveToFile');
		if (saveToFile) {
			saveToFile(function () {
				console.log('file saved!');
			}, !loud);
			this.update();
		} else {
			console.warn('no save file function!');
		}
	}

	/**
	 * On change shape callback
	 * @private
	 */
	_onChangeShape() {
		this.screenConfig = StateManager.get('screen');
		this.update();
	}

	/**
	 * On detached
	 */
	onDetached() {
		eventEmitter.removeListener(EVENTS.Lock, this._callback.Lock);
		eventEmitter.removeListener(EVENTS.Unlock, this._callback.Unlock);
		eventEmitter.removeListener(EVENTS.ElementSelected, this._callback.ElementSelected);
		eventEmitter.removeListener(EVENTS.ElementDeselected, this._callback.ElementDeselected);
		eventEmitter.removeListener(EVENTS.EditorConfigChanged, this._callback.EditorConfigChanged);
		eventEmitter.removeListener(EVENTS.ChangeStyle, this._callback.ChangeStyle);
		eventEmitter.removeListener(EVENTS.ChangeAttribute, this._callback.ChangeAttribute);
		eventEmitter.removeListener(EVENTS.RemoveAttribute, this._callback.RemoveAttribute);
		eventEmitter.removeListener(EVENTS.ChangeContent, this._callback.ChangeContent);
		eventEmitter.removeListener(EVENTS.ElementInserted, this._callback.ElementInserted);
		eventEmitter.removeListener(EVENTS.ElementDeleted, this._callback.ElementDeleted);
		eventEmitter.removeListener(EVENTS.ElementMoved, this._callback.ElementMoved);
		eventEmitter.removeListener(EVENTS.ScriptInserted, this._callback.ScriptInserted);
		eventEmitter.removeListener(EVENTS.StyleInserted, this._callback.StyleInserted);
		eventEmitter.removeListener(EVENTS.Show, this._callback.Show);
		eventEmitter.removeListener(EVENTS.Hide, this._callback.Hide);
		eventEmitter.removeListener(EVENTS.DocumentSave, this._callback.DocumentSave);
	}

	/**
	 * Sync selector
	 * @private
	 */
	_syncSelector() {
		if (this._requiredSyncSelector) {
			this._selectLayer.syncSelector(this._getElementById(elementSelector.getSelectedElementId()));
			this._selectLayer.syncAlternativeSelector();
			this._requiredSyncSelector = false;
		}
	}

	/**
	 * on content loaded callback
	 * @private
	 */
	_onContentsLoaded() {
		this.isContentsLoaded = true;
		console.log('content loaded', this.$el, this._$iframe.src);
		this.$el.trigger('oncontentsloaded');
	}

	/**
	 * Update iframe height
	 * @private
	 */
	_updateIFrameHeight() {
		var screenConfig = this.screenConfig,
			screenWidth = parseInt(screenConfig.width, 10),
			screenHeight = parseInt(screenConfig.height, 10),
			screenRatio = screenConfig.ratio,
			scrollElement = this._$iframe.contents().find(this._iFrameContentScrollerSelector)[0],
			scrollDistance = (scrollElement && scrollElement.scrollHeight - scrollElement.clientHeight) || 0,
			style = {
				width: screenWidth + 'px',
				height: screenHeight + 'px',
				transform: 'scale3d(' + screenRatio + ',' + screenRatio + ',' + screenRatio + ') translate(-50%)',
				'mask-image': screenConfig.shape === 'circle' ?
					'radial-gradient(circle, #fff ' + (screenWidth / 2) + 'px, transparent ' + (screenHeight / 2) + 'px)'
					: 'none'
			};

		$(scrollElement).css('overflowY', 'hidden');
		// update positions to adjust the scroller

		this._$iframe.css(
			$.extend(style, {
				top: '-webkit-calc((50% - ' + ((screenHeight * screenRatio) / 2) + 'px) + ' +
				this._$scroller.scrollTop() + 'px)'
			})
		);

		this._$iframeDummy.css(
			$.extend(style, {
				top: '-webkit-calc((100% - ' + (screenHeight * screenRatio) + 'px) + ' +
					scrollDistance + 'px)'
			})
		);
	}

	/**
	 * Get iframe position
	 * @returns {*}
	 */
	getIFramePosition() {
		return this._$iframe.position();
	}

	/**
	 * Show
	 */
	show() {
		var self = this;
		if (this.isContentsLoaded) {
			// this._selectDefaultElement();
		} else {
			this.$el.one('oncontentsloaded', this._selectDefaultElement.bind(this));
		}
		this._layout();
		this._updateGridRulerLayout();
		this._observeResize = setInterval(() => {
			if (self._lastSize) {
				if (self._lastSize.width !== self.$el.parent().outerWidth() || self._lastSize.height !== self.$el.parent().outerHeight()) {
					self._layout();
					self._updateGridRulerLayout();
					self._selectLayer.makeHoverScroller();
				}
			}
			self._lastSize = {
				width: self.$el.parent().outerWidth(),
				height: self.$el.parent().outerHeight()
			};
		}, 100);
		this._visible = true;
	}

	/**
	 * Hide
	 */
	hide() {
		clearInterval(this._observeResize);
		this._visible = false;
	}

	/**
	 * On changed edit config
	 * @param {string} type
	 * @param {Object} config
	 * @private
	 */
	_onChangedEditConfig(type, config) {
		if (type === 'screen') {
			this.screenConfig = config;
			this._layout();
			this._updateGridRulerLayout();
		}
	}

	/**
	 * Function that calls refresh on TAU widget
	 * @param {string} id id of
	 * @private element
	 */
	_refreshTAUWidget(id) {
		let element = this._getElementById(id),
			tau = this._$iframe[0].contentWindow && this._$iframe[0].contentWindow.tau,
			widgetInstance;

		if (tau) {
			widgetInstance = tau.engine.getBinding(element[0]);
			if (widgetInstance) {
				widgetInstance.refresh();
			}
		}
	}

	/**
	 * Callback for change attribute of element
	 * @param {string} id id of element
	 * @param {string} name name of attribute
	 * @param {string} value value of attribute
	 */
	_onAttributeChanged(id, name, value) {
		this._getElementById(id).attr(name, value);
		this._refreshTAUWidget(id);
	}

	/**
	 * Callback for remove attribute of element
	 * @param {string} id id of element
	 * @param {string} name name of attribute
	 */
	_onAttributeRemoved(id, name) {
		this._getElementById(id).removeAttr(name);
		this._refreshTAUWidget(id);
	}

	/**
	 * Callback for change content of element
	 * @param {string} id id of element
	 * @param {string} value value of attribute
	 */
	_onContentChanged(id, value) {
		this._getElementById(id).html(value);
		this._refreshTAUWidget(id);
	}

	/**
	 * Return element for given id
	 * @param {string} id
	 * @returns {jQuery}
	 */
	_getElementById(id) {
		return this._$iframe.contents().find('[' + INTERNAL_ID_ATTRIBUTE + '=' + id + ']');
	}

	/**
	 * Callback on change style event
	 * @param {string} id Id of changed element
	 * @param {string} name style name
	 * @param {string} value style new value
	 */
	_onStyleChanged(id, name, value) {
		var bigRegexp = /[A-Z]/g;
		this._getElementById(id).css(name.replace(bigRegexp, c => '-' + c.toLowerCase()), value);
		this._requiredSyncSelector = true;
		requestAnimationFrame(this._syncSelector.bind(this));
	}

	/**
	 * Callback for event insert element
	 * @param {string} parentId id of parent element
	 * @param {string} id id of inserted element
	 * @param {string} content content of inserted HTML Element
	 * @param {string} previousId id of inserted element
	 */
	_onElementInserted(parentId, id, content, previousId) {
		var $parent = null,
			$previous = null,
			$guideElement = null,
			contentDoc = null,
			fragment = null,
			generatedElement = null,
			packageInfo = null;

		if (!this.isVisible()) {
			return;
		}

		$parent = this._getElementById(parentId);
		$previous = this._getElementById(previousId);
		$guideElement = $parent.find('.closet-guide-element').first();
		contentDoc = this._$iframe[0].contentWindow.document;
		fragment = contentDoc.createElement('div');

		fragment.innerHTML = content;

		generatedElement = fragment.firstElementChild;

		if ($guideElement.length) {
			$guideElement.replaceWith(generatedElement);
		} else if ($previous.length) {
			$previous.replaceWith(generatedElement);
		} else {
			$parent.prepend(generatedElement);
		}

		componentGenerator.generateComponent(generatedElement, this);
		// @todo - disabled because tau-id was propagated to source code
		//          but why this argument was copied, it need verified
		//if ($(generatedElement).attr('id')) {
			//this._model.updateAttribute(id, 'id', $(generatedElement).attr('id'));
		//    $(generatedElement).attr('id', '');
		//}

		this._updateIFrameHeight();

		packageInfo = packageManager.getPackages(Package.TYPE.COMPONENT).getPackageByElement(generatedElement);
		if (packageInfo && packageInfo.options) {
			if (packageInfo.options.altSelector) {
				this._selectLayer.attachAlternativeSelector(generatedElement);
			}
			var externalResources = packageInfo.options.externalResources;
			if (externalResources) {
				var dom = this._model._DOM;
				externalResources.forEach(function (scriptData) {
					var fileSrc = scriptData;
					var attributes = {};

					if (typeof scriptData === 'object') {
						fileSrc = scriptData.src;
						attributes = scriptData.attributes;
					}

					var fileExtension = fileSrc.match(/[^.]+$/)[0];
					var resource;

					// check if resources already exists
					switch (fileExtension) {
						case 'js' :
							if (!dom.head.querySelector('script[src="' + fileSrc +'"]')) {
								var resource = document.createElement('script');
								resource.setAttribute('src', fileSrc);
							}
							break;
						case 'css' :
							if (!dom.head.querySelector('link[href="' + fileSrc +'"]')) {
								var resource = document.createElement('link');
								resource.setAttribute('href', fileSrc);
								resource.setAttribute('rel', 'stylesheet');
							}
							break;
					}
					if (resource) {
						Object.keys(attributes).forEach(function (key) {
							resource.setAttribute(key, attributes[key]);
						});
						dom.head.appendChild(resource);
					}
				});
			}
		}

		elementSelector.select(id);
	}

	/**
	 * Callback for event script insert
	 * @param {string} dest
	 */
	_onScriptInserted(dest) {
		// @TODO remove security exception on insert
		// this._$iframe.contents().find('head').append($('<script>').attr('type', 'text/javascript').attr('src', dest));
	}

	/**
	 * Callback for event style insert
	 * @param {string} dest
	 */
	_onStyleInserted(dest) {
		this._$iframe.contents().find('head').append($('<link>').attr('rel', 'stylesheet').attr('href', dest));
	}

	/**
	 * Callback for event delete element
	 * @param {number} id
	 */
	_onElementDeleted(id) {
		var element = this._getElementById(id);

		element.remove();

		var packageInfo = packageManager.getPackages(Package.TYPE.COMPONENT).getPackageByElement(element);
		var externalResources = packageInfo.options.externalResources;
		if (externalResources) {
			var dom = this._model._DOM;
			 // check if exists other elements indicated type
			if (!dom.querySelector(packageInfo.options.selector)) {
				// remove unnecesary resources
				externalResources.forEach(function (scriptData) {
					var fileSrc = scriptData;

					if (typeof scriptData === 'object') {
						fileSrc = scriptData.src;
					}

					var fileExtension = fileSrc.match(/[^.]+$/)[0];

					switch (fileExtension) {
						case 'js' :
							var scripts = [].slice.call(dom.querySelectorAll('script[src]'));
							scripts.forEach(function (resource) {
								if (resource.getAttribute('src').indexOf(fileSrc) > -1) {
									dom.head.removeChild(resource);
								}
							});
							break;
						case 'css' :
							var css = [].slice.call(dom.querySelectorAll('link[href]'));
							css.forEach(function (resource) {
								if (resource.getAttribute('href').indexOf(fileSrc) > -1) {
									dom.head.removeChild(resource);
								}
							});
							break;
					}
				});
			}
		}
	}

	/**
	 * Callback for event delete element
	 * @param {number} id
	 */
	_onElementMoved(id, parentId, siblingId) {
		const $element = this._getElementById(id);
		const $parent = this._getElementById(parentId);
		let $sibling = this._getElementById(siblingId);

		if (!$element.length) {
			return;
		}

		if ($sibling.length) {
			$sibling.after($element);
		} else {
			$sibling = $parent.find(`[${INTERNAL_ID_ATTRIBUTE}]`);
			if ($sibling.length) {
				$element.insertBefore($sibling.eq(0));
			} else {
				$parent.prepend($element);
			}
		}

		elementSelector.unSelect();
	}

	/**
	 * Callback responsible for locking element
	 * @param {string} elementId
	 */
	_onLockElement(elementId) {
		const $element = this._getElementById(elementId);
		if ($element.length) {
			$element.addClass(LOCK_CLASS);
		}
	}

	/**
	 * Callback responsible for unlockng element
	 * @param {string} elementId
	 */
	_onUnlockElement(elementId) {
		const $element = this._getElementById(elementId);
		if ($element.length) {
			$element.removeClass(LOCK_CLASS);
		}
	}

	/**
	 * Callback responsible for hide element
	 * @param {string} elementId
	 */
	_onHideElement(elementId) {
		const $element = this._getElementById(elementId);
		if ($element.length) {
			$element.css('visibility', 'hidden');
		}
	}

	/**
	 * Callback responsible for show element
	 * @param {string} elementId
	 */
	_onShowElement(elementId) {
		const $element = this._getElementById(elementId);
		if ($element.length) {
			$element.css('visibility', 'visible');
		}
	}

	/**
	 * Callback for event select element
	 * @param {number} elementId
	 */
	_onSelectedElement(elementId) {
		var $element;
		console.log("_onSelectedElement", elementId);

		if (this.isVisible()) {
			$element = this._getElementById(elementId);

			if ($element.length) {
				requestAnimationFrame(this._selectLayer.showSelector.bind(this._selectLayer, $element[0]));
			}
		}
	}

	/**
	 * Callback for event deselect element
	 * @param {number} elementId
	 */
	_onDeselectedElement(elementId) {
		var $element = this._getElementById(elementId);

		if ($element.length > 0) {
			this._selectLayer.hideSelector($element);
		} else {
			this._selectLayer.hideSelector();
		}
	}

	/**
	 * On scroll
	 * @private
	 */
	_onScroll() {
		var x = this._$scroller.scrollLeft(),
			y = this._$scroller.scrollTop();
		this._setEditorScroll(x, y);
	}

	/**
	 * Get scroller
	 * @returns {jQuery|HTMLElement|*}
	 */
	getScroller() {
		return this._$scroller;
	}

	/**
	 * Get content scroller
	 * @returns {*|T}
	 */
	getContentScroller() {
		return this._$iframe.contents().find(this._iFrameContentScrollerSelector);
	}

	/**
	 * Get scroller position
	 * @returns {{x: *, y: *}}
	 */
	getScrollerScroll() {
		return {
			x: this._$scroller.scrollLeft(),
			y: this._$scroller.scrollTop()
		};
	}

	/**
	 * set scroller position
	 * @param {number} x
	 * @param {number} y
	 */
	setScrollerScroll(x, y) {
		this._$scroller.scrollLeft(x);
		this._$scroller.scrollTop(y);
	}

	/**
	 * Set editor scroll
	 * @param {number} x
	 * @param {number} y
	 * @private
	 */
	_setEditorScroll(x, y) {
		var screenHeight = parseInt(this.screenConfig.height, 10),
			screenRatio = this.screenConfig.ratio;

		this._gridLayer.scroll(x, y);
		this._rulerXLayer.scroll(x, y);
		this._rulerYLayer.scroll(x, y);

		// get positions of selectLayout and iframe not to be effected from scroll position so that it will be stuck
		// at the same position.
		this._selectLayer.setScroll(x, y);
		this._$iframe.css('top', '-webkit-calc((50% - ' + ((screenHeight * screenRatio) / 2) + 'px) + ' + y + 'px)');

		// synchronize scrollTop of the element inside iframe with the scroller of the design-editor
		this._$iframe.contents().find(this._iFrameContentScrollerSelector).scrollTop(y);

		// sync with scroll position
		this._selectLayer.syncSelector(this._getElementById(elementSelector.getSelectedElementId()));
		this._selectLayer.syncAlternativeSelector();
		eventEmitter.emit(EVENTS.SetNewGuideline, this._$iframe);
	}

	/**
	 * Layout
	 * @private
	 */
	_layout() {
		var screenConfig = this.screenConfig,
			adjustedWidth = screenConfig.width * screenConfig.ratio,
			adjustedHeight = screenConfig.height * screenConfig.ratio;

		this._updateIFrameHeight();

		this._selectLayer.screenWidth = screenConfig.width;
		this._selectLayer.screenHeight = screenConfig.height;
		this._selectLayer.screenRatio = screenConfig.ratio;
		this._selectLayer.screenShape = screenConfig.shape;

		$(this._selectLayer).css({
			width: adjustedWidth + 'px',
			height: adjustedHeight + 'px',
			top: '-webkit-calc((50% - ' + ((screenConfig.height * screenConfig.ratio) / 2) + 'px))'
		});
		this._selectLayer.makeHoverScroller();
	}

	/**
	 * Upgrade grid ruler
	 * @private
	 */
	_updateGridRulerLayout() {
		var offset = this._$iframe.position(),
			screenConfig = this.screenConfig;

		this._gridLayer.setLayout(offset, screenConfig.ratio);
		this._rulerXLayer.setLayout(offset, screenConfig.ratio);
		this._rulerYLayer.setLayout(offset, screenConfig.ratio);
	}

	/**
	 * Select default element
	 * @private
	 */
	_selectDefaultElement() {
		var page = this._$iframe.contents().find('closet-page, .ui-page');
		if (!elementSelector.select(page.attr(INTERNAL_ID_ATTRIBUTE))) {
			elementSelector.unSelect();
		}
	}

	/**
	 * Bind events
	 * @private
	 */
	_bindEvents() {
		this._selectLayer.$el.on('keydown', this._onKeyDown.bind(this));
	}

	/**
	 * Callback for keyboard key down
	 * @param {Event} event
	 * @private
	 */
	_onKeyDown(event) {
		var selectedElementId = elementSelector.getSelectedElementId(),
			selectedElement = this._getElementById(selectedElementId),
			info = this.getUIInfo(selectedElement);

		if (!selectedElement.attr('data-closed-edit-mode')) {
			if (event.keyCode === KEY_CODE.DELETE && selectedElement) {
				event.stopImmediatePropagation();
				elementSelector.unSelect();
				this._deleteElement(info);
			}
		}
	}

	/**
	 * Delete element
	 * @param {Object} info
	 * @returns {boolean}
	 * @private
	 */
	_deleteElement(info) {
		var $element,
			ownerDoc,
			selectedComponentPackage;

		return new Promise((resolve) => {
			var self = this;
			if (self.$el.is(':visible')) {

				if (info) {
					$element = info.$element;
				} else {
					console.debug('check if info, null, is ok');
				}

				if ($element) {
					ownerDoc = $element[0].ownerDocument;

					selectedComponentPackage = info.package;

					toggleParentModifications($element, info.package, 2).then(($parents) => {
						$parents.each((index, parent) => {
							var $localParent = $(parent);
							self._model.updateAttribute(
								$localParent.data('id'),
								'class',
								$localParent.attr('class')
							);
						});
					});

					this._model.delete($element.attr(INTERNAL_ID_ATTRIBUTE));

					// @TODO
					// if(selectedComponentPackage.isElementRemained(ownerDoc) === false) {
					//    selectedComponentPackage.removeImportedResources();
					// }
				} else {
					console.debug('check if $element, null, is ok');
				}

				resolve();
			}
		});
	}

	/**
	 * Insert component
	 * @param {Event} event
	 * @param {Object} componentPackageInfo
	 * @param {HTMLElement} element
	 */
	insertComponent(event, componentPackageInfo, element) {
		var self = this,
			$content = this._$iframe.contents(),
			$guideElement = $content.find('.closet-guide-element'),
			$parent = null,
			packages,
			sParentPackage,
			parentId = '',
			elementId = '';

		console.log("insertComponent");
		this._selectLayer.hideHighlighter();

		if (componentPackageInfo.options['parent-constraint']) {
			packages = packageManager.getPackages(Package.TYPE.COMPONENT);
			sParentPackage = packages.get(componentPackageInfo.options['parent-constraint']);
			$parent = $guideElement.closest(sParentPackage.options.selector);
		} else {
			$parent = $guideElement.parent();
		}

		if (!$parent) {
			self._selectLayer.hideHighlighter();
			return;
		}

		if ($parent && $parent.length) {
			do {
				parentId = $parent.attr(INTERNAL_ID_ATTRIBUTE);
				$parent = $parent.parent();
			} while ($parent.length && !parentId);

			// $guideElement.prev() is always guideline element
			if (!element) {
				elementId = this._model.insert(parentId, componentPackageInfo, $guideElement.prev().attr(INTERNAL_ID_ATTRIBUTE));
			} else {
				elementId = this._model.move($(element).attr(INTERNAL_ID_ATTRIBUTE), parentId, $guideElement.prev().attr(INTERNAL_ID_ATTRIBUTE));
			}
			$guideElement = $parent.find('[data-id=' + elementId + ']'); // find guide element again as inserting new content replaces the old one

			// modifier after insertion, the direct parent has to have an id
			toggleParentModifications($guideElement, componentPackageInfo, 1).then(($parents) => {
				var wrapContent = componentPackageInfo.options.wrapContent;
				$parents.each((index, parent) => {
					var $localParent = $(parent);
					self._model.updateAttribute(
						$localParent.data('id'),
						'class',
						$localParent.attr('class')
					);
					if (wrapContent) {
						self._model.wrapChildren(parent, wrapContent);
					}
				});
			});

			// hide tooltip-panel
			eventEmitter.emit(EVENTS.TooltipPanelClose, {
				category: 'components'
			});
		}

		eventEmitter.emit(EVENTS.DeleteAllGuide);
	}

	/**
	 * Convert editor pos to content pos
	 * @param {Object} options
	 * @returns {{x: (number|*), y: (number|*)}}
	 * @private
	 */
	_convertEditorPosToContentPos(options/* pointerPosition, offset, ratio*/) {
		var x,
			y,
			offsetX,
			offsetY,
			ratio;

		if (!options) {
			options = {offset: {}};
		}

		offsetX = options.offsetX || options.offset.left || 0;
		offsetY = options.offsetY || options.offset.top || 0;

		ratio = options.ratio || 1;

		x = (options.pointX - offsetX) / ratio;
		y = (options.pointY - offsetY) / ratio;

		return {
			x: x,
			y: y
		};
	}

	/**
	 * Get info of UI
	 * @param {HTMLElement} element
	 * @param filter
	 * @returns {Object|null}
	 */
	getUIInfo(element, filter) {
		return ElementDetector.getInstance().detect(element, filter);
	}

	/**
	 * Display highlighter
	 * Highlighter : It represents the area of focus.
	 * @param {jQuery|HTMLElement} container
	 */
	showHighlighter(container) {
		var $container = $(container);
		if ($container) {
			if ($container.length) {
				this._selectLayer.showHighlighter($container[0]);
			} else {
				this._selectLayer.hideHighlighter();
			}
		}
	}

	/**
	 * Hide highlighter
	 */
	hideHighlighter() {
		this._selectLayer.hideHighlighter();
	}

	/**
	 * Find element which located under the mouse pointer
	 * @param {[number]} pointPosition
	 * @returns {HTMLElement}
	 */
	getElementInfoFromIFrame(pointPosition) {
		var $doc = this._$iframe.contents(),
			displayRatio = StateManager.get('screen', {}).ratio,
			pos,
			positionOffset = this._$iframe.offset(),
			iframe = this._$iframe[0],
			elementsFromPoint;

		pos = this._convertEditorPosToContentPos(
			{
				pointX: pointPosition[0],
				pointY: pointPosition[1],
				offsetX: positionOffset.left + iframe.scrollLeft,
				offsetY: positionOffset.top + iframe.scrollTop,
				ratio: displayRatio
			}
		);

		elementsFromPoint = $doc[0].elementsFromPoint(pos.x, pos.y)
			.filter((element) => element.getAttribute(INTERNAL_ID_ATTRIBUTE));

		return {
			element: elementsFromPoint[0],
			pointFromIFrame: pos
		};
	}

	/**
	 * Get DesignView from iframe
	 * @returns {jQuery} iframe
	 */
	getDesignViewIframe() {
		return this._$iframe;
	}

	/**
	 * Get select layer
	 * @returns {SelectLayerElement|*}
	 */
	getSelectLayer() {
		return this._selectLayer;
	}

	/**
	 * Get selected element
	 * @returns {*|jQuery|HTMLElement}
	 */
	getSelectedElement() {
		return this._selectLayer.getSelectedElement();
	}

	/**
	 * Returns styles for element
	 * @param {string} elementId
	 * @returns {*}
	 */
	getComputedStyle(elementId) {
		var $element = this._getElementById(elementId),
			computedStyles = null,
			styles = {};
		if ($element.length) {
			computedStyles = this._$iframe[0].contentWindow.getComputedStyle($element[0]);
			for (let i = 0; i < computedStyles.length; i += 1) {
				const name = computedStyles[i].replace(/-([a-z])/g, partName => partName[1].toUpperCase());
				styles[name] = computedStyles[computedStyles[i]];
			}
		}
		return styles;
	}

	/**
	 * is visible?
	 * @returns {boolean}
	 */
	isVisible() {
		return this._visible;
	}

	/**
	 * Get base path
	 * @returns {string|*}
	 */
	getBasePath() {
		return this._basePath;
	}

	/**
	 * Get URI
	 * @returns {*}
	 */
	getURI() {
		return this._uri;
	}
}

const DesignEditorElement = document.registerElement('closet-design-editor', DesignEditor);

/**
 * This method makes the instance of DesignEditorElement.
 * Design Editor Element is a singleton and to get its instance this method should be used.
 * @returns {*}
 */
DesignEditorElement.getInstance = function () {
	if (_instance === null) {
		_instance = new DesignEditorElement();
	}

	return _instance;
};

export {DesignEditorElement, DesignEditor};
