'use babel';

import {DressElement} from '../../utils/dress-element';
import {EVENTS} from '../../events-emitter';

var TEMPLATE_PATH = '/panel/preview/interaction-view-toolbar-element.html';
class InteractionViewToolbar extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        this.createFromTemplate(TEMPLATE_PATH);
        this.events = {
            'click .interaction-view-toggle': EVENTS.ToggleInteractionView,
            'click .interaction-view-backward': EVENTS.InteractionViewElementToolbarBackward
        };
    }
}

const InteractionViewToolbarElement = document.registerElement('closet-interaction-view-element-toolbar', InteractionViewToolbar);

export {InteractionViewToolbarElement, InteractionViewToolbar};
