'use babel';

import {DressElement} from '../../utils/dress-element';
import {EVENTS} from '../../events-emitter';

var TEMPLATE_PATH = '/panel/preview/preview-toolbar-element.html';
class PreviewToolbar extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        this.createFromTemplate(TEMPLATE_PATH);
        this.events = {
            'click .preview-toggle': EVENTS.TogglePreviewView,
            'click .preview-backward': EVENTS.PreviewElementToolbarBackward
        };
    }
}

const PreviewToolbarElement = document.registerElement('closet-preview-element-toolbar', PreviewToolbar);

export {PreviewToolbarElement, PreviewToolbar};
