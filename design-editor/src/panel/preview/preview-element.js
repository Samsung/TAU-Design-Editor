'use babel';

import {StateManager} from '../../system/state-manager';
import {DressElement} from '../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../events-emitter';
import path from "../../utils/path-utils";

const TEMPLATE_PATH = '/panel/preview/preview-element.html';
class Preview extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        var self = this;
        this.eventsListeners = {};
    }

    /**
     * attached callback
     */
    onAttached() {
        var self = this;
        self.eventsListeners.previewElementToolbarBackward = self.onClickBackward.bind(self);
        eventEmitter.on(EVENTS.PreviewElementToolbarBackward, self.eventsListeners.previewElementToolbarBackward);
    }

    /**
     * detached callback
     */
    onDetached() {
        var self = this;
        if (self.eventsListeners.previewElementToolbarBackward) {
            eventEmitter.removeListener(EVENTS.PreviewElementToolbarBackward, self.eventsListeners.previewElementToolbarBackward);
            self.eventsListeners.previewElementToolbarBackward = null;
        }
    }

    /**
     * Render
     * @param {string} contents
     * @param {string} basePath
     * @param {string} uri
     * @param {number} position
     * @param {Function} callback
     * @private
     */
    _render(contents, basePath, uri, position, callback) {
        var self = this,
            projectURL = uri;//path.createProjectURL(path.getFileName(uri, true), true);

        this.createFromTemplate(TEMPLATE_PATH, {
            callback: () => {
                var $elem,
                    $frame,
                    iframeDocument;

                $frame = self.$el.find('.closet-preview-frame');

                self.setProfileStyle(position, $frame);

                $frame.one('load', self.scrollIframe.bind(self, position, callback, $frame));

                $frame.attr('src', projectURL);
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
            this._render(contents, editor.getBasePath(), editor.getURI(), position, callback);
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
}

const PreviewElement = document.registerElement('closet-preview-element', Preview);

export {PreviewElement, Preview};
