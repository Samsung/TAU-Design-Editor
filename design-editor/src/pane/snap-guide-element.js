'use babel';

import {appManager} from '../app-manager';
import {StateManager} from '../system/state-manager';
import {DressElement} from '../utils/dress-element';

class SnapGuide extends DressElement {
    /**
     * attached callback
     */
    onAttached() {
        this.$el.addClass('orientation-' + this.options.orientation);
    }

    /**
     * show callback
     */
    show() {
        this.$el.addClass('in');
    }

    /**
     * hide callback
     */
    hide() {
        this.$el.removeClass('in');
    }

    /**
     * set position callback
     * @param {number} position
     */
    setPosition(position) {
        var designEditorPosition = appManager.getActiveDesignEditor().getIFramePosition(),
            screenConfigRatio = StateManager.get('screen').ratio,
            _position = (position * screenConfigRatio);

        if (this.options.orientation === 'horizontal') {
            this.$el.css('top', (designEditorPosition.top + _position) + 'px');
        } else {
            this.$el.css('left', (designEditorPosition.left + _position) + 'px');
        }
    }
}

const SnapGuideElement = document.registerElement('closet-design-snap-guide', SnapGuide);
export {SnapGuideElement, SnapGuide};
