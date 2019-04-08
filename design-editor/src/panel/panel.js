'use babel';

import {DressElement} from '../utils/dress-element';

/**
 *
 */
class Panel extends DressElement {
    /**
     * Hide
     */
    hide() {
        this.classList.remove('closet-editor-panel-visible');
    }

    /**
     * Show
     */
    show() {
        this.classList.add('closet-editor-panel-visible');
    }

    /**
     * Destroy
     */
    onDestroy() {
        this.$el.remove();
    }
}

const PanelElement = document.registerElement('closet-panel', Panel);

export {PanelElement, Panel};
