'use babel';

import Component from '../utils/component-element';

/**
 * Class map API of Atom StatusBar
 */
class BracketsStatusBar extends Component {
	constructor() {
		super();
	}

	/**
	 * Add item to statub bar at left part
	 * @param item
	 * @returns {Tile}
	 */
	addItem(item) {
		this.appendChild(item);
		return {item};
	}
}

customElements.define('brackets-status-bar', BracketsStatusBar);

export {BracketsStatusBar};
