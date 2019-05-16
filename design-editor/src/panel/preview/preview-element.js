'use babel';

import {StateManager} from '../../system/state-manager';
import {DressElement} from '../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import pathUtils from "../../utils/path-utils";
import fs from 'fs-extra';
import path from 'path';

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
        fs.deleteFile(this.previewPath);
        if (this.eventsListeners.previewElementToolbarBackward) {
            eventEmitter.removeListener(EVENTS.PreviewElementToolbarBackward, this.eventsListeners.previewElementToolbarBackward);
            this.eventsListeners.previewElementToolbarBackward = null;
        }
    }

    /**
     * Render preview screen in Design Editor
     * @param {string} contents - full content of edited HTML file
     * @param {string} basePath - 
     * @param {number} position
     * @param {Function} callback
     * @private
     */
    _render(contents, uri, position, callback) {
        this.previewPath = this.createPreviewDocument(contents, path.dirname(uri));
        this.createFromTemplate(TEMPLATE_PATH, {
            callback: () => {
                const $frame = this.$el.find('.closet-preview-frame');

                this.setProfileStyle(position, $frame);

                $frame.one('load', this.scrollIframe.bind(this, position, callback, $frame));
                $frame.attr('src', this.previewPath);
            }
        });
    }

    /**
     * Show
     * @param {Editor} editor
     * @param {Function} callback
     */
    show({editor, callback}) {
        var $targetFrame = editor && editor.getDesignViewIframe(),
            position = ($targetFrame && $targetFrame[0].getBoundingClientRect()) || {top: 0, left: 0},
            contents = '';

        if ($targetFrame && editor) {
            contents = editor.getModel().export(false, null);
            position.scroll = $targetFrame.contents().find('.ui-scroller').scrollTop();
            this._render(contents, editor.getURI(), position, callback);
        }
    }

    /**
     * Scroll iframe
     * @param {number} position
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
      var $elem = this.$el.find('.closet-preview-container'),
          screenConfig = StateManager.get('screen', {}),
          ratio = screenConfig.ratio,
          styles = {
              width: screenConfig.width + 'px',
              height: screenConfig.height + 'px',
              transform: 'scale(' + ratio + ') translate(-50% -50%)'
          };

      if (position.top) {
          styles.top = position.top;
          styles.left = position.left;
          styles.transform = 'scale(' + ratio + ')';
      }

      $elem.addClass('closet-preview-shape-' + screenConfig.shape)
          .removeClass('closet-preview-profile-mobile')
          .removeClass('closet-preview-profile-wearable')
          .addClass('closet-preview-profile-' + screenConfig.profile)
          .css(styles);

      $frame.contents().find('head').append();
    }

    /**
     * Click backward callback
     */
    onClickBackward() {
        var contentDoc = this.$el.find('.closet-preview-frame')[0].contentDocument,
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

    createPreviewDocument(contents, location) {
        const filePath = pathUtils.joinPaths(location, 'temporary-preview.html')
        fs.writeFile(filePath, contents, (err) => {throw err});
        return filePath;
    }
}

const PreviewElement = document.registerElement('closet-preview-element', Preview);

export {PreviewElement, Preview};
