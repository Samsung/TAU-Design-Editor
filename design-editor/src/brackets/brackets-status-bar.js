'use babel';

import {DressElement} from '../utils/dress-element';

/**
 * Class map API of Atom StatusBar
 */
class BracketsStatusBar extends DressElement {
    /**
     * Add item to statub bar at left part
     * @param item
     * @returns {Tile}
     */
    addItem(item) {
        var tile = {
            item: item
        };
        this.$el.append(item);
        return tile;
    }
}

const BracketsStatusBarElement = document.registerElement('brackets-status-bar', BracketsStatusBar);

export {BracketsStatusBar, BracketsStatusBarElement};
