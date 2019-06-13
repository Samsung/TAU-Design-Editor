'use babel';

import {StateManager} from '../../system/state-manager';
import {DressElement} from '../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import pathUtils from '../../utils/path-utils';
import {removeMediaQueryConstraints} from '../../utils/iframe';
import fs from 'fs-extra';
import path from 'path';
import { promisify } from 'util';

const TEMPLATE_PATH = '/panel/preview/preview-element.html';

/**
 * Responsible for live-preview feature
 * @module Preview
 */
class Preview extends DressElement {

	/**
	 * Actions trigerred when Preview element is created
	 * On Design Editor launching
	 */
	onCreated() {
		this.eventsListeners = {};
	}

	/**
	 * Actions trigerred when preview mode is started
	 */
	onAttached() {
		this.eventsListeners.previewElementToolbarBackward = this.onClickBackward.bind(this);
		eventEmitter.on(EVENTS.PreviewElementToolbarBackward, this.eventsListeners.previewElementToolbarBackward);
	}

	/**
	 * Actions trigerred when preview mode is stopped
	 */
	onDetached() {
		fs.deleteFile(this.fsPath);
		if (this.eventsListeners.previewElementToolbarBackward) {
			eventEmitter.removeListener(
				EVENTS.PreviewElementToolbarBackward,
				this.eventsListeners.previewElementToolbarBackward
			);
			this.eventsListeners.previewElementToolbarBackward = null;
		}
	}

	/**
	 * Render preview screen in Design Editor
	 * @param {string} contents full content of edited HTML file
	 * @param {string} basePath absolute path starting from project root
	 * @param {string} uri absolute path to renered file
	 * @param {number} position project position for scroll
	 * @param {function} callback
	 * @private
	 */
	_render(contents, basePath, uri, position, callback) {
		const preview = this.createPreviewDocument(contents, path.dirname(path.relative(basePath, uri)));
		this.createFromTemplate(TEMPLATE_PATH, {
			callback: () => {
				const $frame = this.$el.find('.closet-preview-frame');

				this.setProfileStyle(position, $frame);

				const indexDir = path.dirname(uri);

				$frame.one('load', () => {
					this.scrollIframe.call(this, position, callback, $frame);
					removeMediaQueryConstraints(
						$frame[0].contentDocument,
						indexDir
					);
				});

				preview
					.then((previewPath) => {
						$frame.attr('src', previewPath);
					}).catch((err) => {
						// eslint-disable-next-line no-console
						console.error(err);
					});
			}
		});
	}

	/**
	 * Show preview mode
	 * @param {Editor} editor editor instance
	 * @param {Function} callback
	 */
	show({editor, callback}) {
		const $targetFrame = editor && editor.getDesignViewIframe(),
			position = ($targetFrame && $targetFrame[0].getBoundingClientRect()) || {top: 0, left: 0};
		let contents = '';

		if ($targetFrame && editor) {
			contents = editor.getModel().export(false, null);
			position.scroll = $targetFrame.contents().find('.ui-scroller').scrollTop();
			this._render(contents, editor.getBasePath(), editor.getURI(), position, callback);
		}
	}

	/**
	 * Scroll iframe to proper position
	 * @param {Object} position
	 * @param {Function} callback
	 * @param {jQuery} $frame
	 */
	scrollIframe(position, callback, $frame) {
		window.setTimeout(() => {
			$frame.contents().find('.ui-scroller').scrollTop(position.scroll);
			callback();
		}, 0);
	}

	/**
	 * Set size of iframe depending of profile
	 * @param  {number} position
	 * @param  {jQuery} $frame
	 */
	setProfileStyle(position, $frame) {
		const $elem = this.$el.find('.closet-preview-container'),
			screenConfig = StateManager.get('screen', {}),
			ratio = screenConfig.ratio,
			styles = {
				width: `${screenConfig.width}px`,
				height: `${screenConfig.height}px`,
				transform: `scale(${ratio}) translate(-50% -50%)`
			};

		if (position.top) {
			styles.top = position.top;
			styles.left = position.left;
			styles.transform = `scale(${ratio})`;
		}

		$elem.addClass(`closet-preview-shape-${screenConfig.shape}`)
			.removeClass('closet-preview-profile-mobile')
			.removeClass('closet-preview-profile-wearable')
			.addClass(`closet-preview-profile-${screenConfig.profile}`)
			.css(styles);

		$frame.contents().find('head').append();
	}

	/**
	 * Click backward callback
	 */
	onClickBackward() {
		const contentDoc = this.$el.find('.closet-preview-frame')[0].contentDocument;
		let event;

		if (contentDoc) {
			event = new CustomEvent('tizenhwkey', {
				'bubbles': true,
				'cancelable': true
			});
			event.keyName = 'back';
			contentDoc.body.dispatchEvent(event);
		}
	}

	/**
	 * Add temporary document for preview content
	 * @param {string} contents whole HTML code of currently edited document
	 * @param {string} location path to directory where
	 * currently edited HTML file exists
	 * @returns {string} absolute path to temporary file
	 */
	createPreviewDocument(contents, location) {
		const relativePathToFile = pathUtils.joinPaths(location, 'temporary-preview.html'),
			writeFile = promisify(fs.writeFile);
		this.fsPath = pathUtils.createProjectPath(relativePathToFile);
		return writeFile(this.fsPath, contents).then(() => {
			return pathUtils.createProjectPath(relativePathToFile, true);
		}).catch((err) => {throw err;});
	}
}

const PreviewElement = document.registerElement('closet-preview-element', Preview);

export {PreviewElement, Preview};
