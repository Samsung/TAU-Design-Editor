'use babel';

import {StateManager} from '../../system/state-manager';
import {DressElement} from '../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import fs from 'fs-extra';

const TEMPLATE_PATH = '/panel/preview/interaction-view-element.html';
const APPS_PATH = '/projects/apps';

const readAppConfig = (app) => {
	return new Promise((resolve, reject) => {
        const filePath = APPS_PATH + '/' + app + '/config.xml';
        console.log('loading: ' + filePath);
		fs.readFile(filePath, 'utf8', (err, text) => {
			if (err) {
				reject(err);
			} else {
				let profile = 'mobile';

				const matches = /<tizen:profile[^"]+"([^"]+)[^>]+>/gi.exec(text);;
				if (matches && matches[1]) {
					profile = matches[1];
                    console.log('profile found: ' + profile + ' for ' + app);
				} else {
                    console.error('profile not found for: ' + app);
                }

				resolve({
					profile: profile,
					url: APPS_PATH + '/' + app + '/index.html',
					previewId: Math.round(Math.random() * 1000000) + '-' + Date.now()
				});
			}
		});
	});
};

const size = {
	'mobile': {
		'width': 480,
		'height': 800,
		'scale': 0.7
	},
	'tv': {
		'width': 1920,
		'height': 1080,
		'scale': 0.4
	},
	'wearable': {
		'width': 360,
		'height': 360,
		'scale': 1
	},
};

/**
 * Layout apps on Interaction view
 * @param apps
 * @param containerSize
 */
const layoutApps = (apps, containerSize) => {
	let left = 0;
	let top = 0;
	let maxHeight = 0;
	let TOOLS_HEIGHT = 40;

	apps.forEach((app) => {
		let previewScale = size[app.profile].scale;
		let previewWidth = size[app.profile].width * previewScale;
        let previewHeight = size[app.profile].height * previewScale;

		app.view = app.view || {
			left: 0,
			top: 0,
            profile: app.profile,
            width: previewWidth,
            height: previewHeight,
			scale: previewScale
		};

		if ((containerSize.width - left) > previewWidth) {
			app.view.left = left;
			app.view.top = top;

			left += previewWidth;
			// store top position of next row
			if (maxHeight < size[app.profile].height * previewScale) {
				maxHeight = size[app.profile].height * previewScale;
			}
		} else { // move preview to next row
			top += maxHeight + TOOLS_HEIGHT;
			left = 0;

			app.view.left = left;
			app.view.top = top;
		}
	});
};

const createDevicePreview = (self, previewId) => {
	self._render();
	console.log('createDevicePreview');
};

const editSelectedApp = (self, preview) => {
  var frame = preview.querySelector('iframe');
  window.top.selectFile(frame.getAttribute('src'), function () {
    window.top.globalData.fileUrl = frame.getAttribute('src').replace(/projects\/([^\/])+/, 'projects');
    eventEmitter.once(EVENTS.ActiveEditorUpdated, function () {
      eventEmitter.emit(EVENTS.ToggleInteractionView, 1);
		});
    window.top.loadFromFile();
	});
};

const addPreviewTools = (self) => {
	let $tools = self.$el.find('.closet-interaction-view-tools');
	$tools.each((key, tools) => {
		let previewId = tools.getAttribute('data-preview-id');
		let preview = self.$el.find('.closet-interaction-view-container[data-preview-id=' + previewId + ']').get(0);

		tools.addEventListener(
			'click', (event) => {
				let targetClassList = event.target.classList;

				if (targetClassList.contains('fa-minus-square') ||
					targetClassList.contains('fa-plus-square')
				) {
					let scale = parseFloat(preview.getAttribute('data-scale'));

					if (targetClassList.contains('fa-minus-square')) {
						if (scale > 0.1) {
							scale -= 0.1;
						}
					} else if (targetClassList.contains('fa-plus-square')) {
						scale += 0.1;
					}
					preview.style.transform = 'scale(' + scale + ')';
					preview.setAttribute('data-scale', scale);
				} else if (targetClassList.contains('fa-copy')) {
					createDevicePreview(self, previewId);
				} else if (targetClassList.contains('fa-edit')) {
          editSelectedApp(self, preview);
				}
			}, true);
	});
};

const loadPreview = (self, basePath, callback) => {
	let $frame = self.$el.find('.closet-interaction-view-frame[data-src]');
	$frame.one('load', self.scrollIframe.bind(self, callback, $frame));
	$frame.each((key, frame) => {
		frame.setAttribute('src', basePath + frame.getAttribute('data-src').replace(/^\/projects/, ''));
		frame.removeAttribute('data-src');
	});
};


class InteractionView extends DressElement {

    constructor() {
      super();
      this.editor = null;
    }

  /**
	 * Create callback
	 */
	onCreated() {
        var self = this;

		self.eventsListeners = {
            onEditorUpdate: self._onEditorUpdate.bind(this)
        };
        eventEmitter.on(EVENTS.ActiveEditorUpdated, self.eventsListeners.onEditorUpdate);

        self._onEditorUpdate(); // initial
	}

	/**
	 * attached callback
	 */
	onAttached() {
		let self = this;
		self.eventsListeners.interactionViewElementToolbarBackward = self.onClickBackward.bind(self);
		eventEmitter.on(
			EVENTS.InteractionViewElementToolbarBackward,
			self.eventsListeners.interactionViewElementToolbarBackward
		);
	}

	/**
	 * detached callback
	 */
	onDetached() {
		let self = this;
		if (self.eventsListeners.interactionViewElementToolbarBackward) {
			eventEmitter.removeListener(
				EVENTS.InteractionViewElementToolbarBackward,
				self.eventsListeners.interactionViewElementToolbarBackward
			);
			self.eventsListeners.interactionViewElementToolbarBackward = null;
		}
	}


	/**
	 * Render
	 * @param {string} basePath
	 * @param {string[]} apps
	 * @param {number} position
	 * @param {Function} callback
	 * @private
	 */
	_render(basePath, apps, callback) {
		let self = this;

		self.createFromTemplate(
			TEMPLATE_PATH, {
				options: {
					apps: apps
				},
				callback: function () {
					loadPreview(self, basePath, callback);

					// add tools listener
					addPreviewTools(self);
				}
			});
	}

	/**
	 * Show
	 * @param {Editor} editor
	 * @param {Function} callback
	 */
	show({editor, callback}) {
        let self = this,
            apps = self.apps;

        self.editor = editor;
        if (editor && apps.length) {
            layoutApps(apps, self.getBoundingClientRect());
            self._render(editor.getBasePath(), apps, callback);
		}
	}

	/**
	 * Scroll iframe
	 * @param {number} position
	 * @param {Function} callback
	 * @param {jQuery} $frame
	 */
	scrollIframe(callback, $frame) {
		let $elem = this.$el.find('.closet-interaction-view-container'),
			screenConfig = StateManager.get('screen', {}),
			styles = {
				'opacity': '1.0'
			};

		$elem.addClass('closet-preview-shape-' + screenConfig.shape)
			.css(styles);

		$frame.contents().find('head').append();

		window.setTimeout(() => {
			$frame.contents().find('.ui-scroller').scrollTop(0);
			callback();
		}, 0);
	}

    _onEditorUpdate() {
        console.log('checking for multiapp configuration');
        fs.readdir(APPS_PATH, (err, dirs) => {
            Promise.all(dirs.map(readAppConfig)).then(apps => {
                eventEmitter.emit(EVENTS.MultiappUpdate, this.apps = apps || []);
            });
        });
    }

	/**
	 * Click backward callback
	 */
	onClickBackward() {
		let contentDoc = this.$el.find('.closet-interaction-view-frame')[0].contentDocument,
			event;

		if (contentDoc) {
			event = new CustomEvent('tizenhwkey', {
				'bubbles': true,
				'cancelable': true
			});
			event.keyName = 'back';
			contentDoc.body.dispatchEvent(event);
		}
	}
}

const InteractionViewElement = document.registerElement('closet-interaction-view-element', InteractionView);

export {InteractionViewElement, InteractionView};
