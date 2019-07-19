'use babel';

import {eventEmitter, EVENTS} from '../events-emitter';
import editor from '../editor';
import {PanelElement} from './../panel/panel';

/**
 *
 */
class PanelManager {
	/**
	 * Init
	 * @param {Object} itemViews
	 */
	initialize(itemViews) {
		let panelContainer = null,
			containers = {},
			closetContainer = null,
			panelCenter = null,
			panelMiddle = null;
		const document = itemViews && itemViews.ownerDocument;
		// list of modal panels
		this._panels = new WeakMap();
		this._dimmed = false;
		this._bindClosetEvent();

		closetContainer = document.createElement('div');
		closetContainer.className = 'closet-container';

		panelContainer = document.createElement('div');
		panelContainer.className = 'closet-panel-container';

		panelCenter = panelContainer.cloneNode();
		panelCenter.classList.add('closet-panel-container-center');

		panelMiddle = panelContainer.cloneNode();
		panelMiddle.classList.add('closet-panel-container-middle');

		containers = {
			top: panelContainer.cloneNode(),
			right: panelContainer.cloneNode(),
			left: panelContainer.cloneNode(),
			bottom: panelContainer.cloneNode()
		};

		Object.keys(containers).forEach((name) => {
			containers[name].classList.add(`closet-panel-container-${name}`);
		});
		closetContainer.appendChild(containers.left);
		panelMiddle.appendChild(containers.top);
		panelMiddle.appendChild(panelCenter);
		panelMiddle.appendChild(containers.bottom);
		closetContainer.appendChild(panelMiddle);
		closetContainer.appendChild(containers.right);
		itemViews.appendChild(closetContainer);

		this.containers = containers;
	}

	/**
	 * Bind closet event
	 * @private
	 */
	_bindClosetEvent() {
		eventEmitter.on(EVENTS.OpenPanel, this._onOpenPanel.bind(this));
		eventEmitter.on(EVENTS.ClosePanel, this._onClosePanel.bind(this));
	}

	/**
	 * Open panel callback
	 * @param {Object} options
	 * @private
	 */
	_onOpenPanel(options /* type, item */) {
		this.openPanel(options);
	}

	/**
	 * event handler for close displayed modal panel.
	 * if clean flag is true, modal panel will be deleted in panel list.
	 * @param {object} options
	 *      {HTMLElement} item
	 *      {boolean} clean
	 */
	_onClosePanel(options /* item, clean */) {
		this.closePanel(options.item);
		if (options.clean === true) {
			this.deletePanel(options.item);
		}
	}

	/**
	 * Create panel
	 * @param {string} side
	 * @param {Object} opt
	 * @returns {*}
	 */
	createPanel(side, opt) {
		let options = opt,
			panel = null,
			container = this.containers[side];

		options = options || {};

		panel = new PanelElement();

		panel.hide();
		if (side !== 'modal') {
			container = this.containers[side];
		} else {
			container = this.containers.left.parentElement;
			panel.classList.add('modal');
		}

		if (container === undefined) {
			return null;
		}

		panel.classList.add('closet-editor-panel');

		panel.style.zIndex = options.priority || 100;

		if (options.item) {
			panel.appendChild(options.item);
		}

		container.appendChild(panel);

		setTimeout(() => {
			panel.show();
		}, 0);

		return panel;
	}

	/**
	 * Open New Panel
	 * @param {Object} options
	 * @returns {Object}
	 */
	openPanel(options /* type, item. visible, priority */) {
		let panelInstance = this.getPanel(options.item);

		if (panelInstance) {
			panelInstance.show();
		} else {
			if (options.type === 'modal') {
				if (editor.isAtom()) {
					panelInstance = editor.workspace.addModalPanel({
						item: options.item,
						visible: options.visible || true,
						priority: options.priority || 100
					});
				} else {
					panelInstance = this.createPanel(options.type, options);
				}
				this._dimmed = true;
			} else {
				panelInstance = this.createPanel(options.type, options);
			}
			this._panels.set(options.item, panelInstance);
		}
		if (options.type !== 'modal' && (options.visible || options.visible === undefined)) {
			panelInstance.classList.add('closet-editor-panel-visible');
		}

		return panelInstance;
	}

	/**
	 * close panel
	 * @param {HTMLElement} panelItem
	 */
	closePanel(panelItem) {
		const panelInstance = this.getPanel(panelItem);

		if (panelInstance && !panelInstance.item) {
			panelInstance.hide();
			this._dimmed = false;
		}
	}

	/**
	 * delete panel from panel list(weakmap)
	 * @param {HTMLElement} panelItem
	 */
	deletePanel(panelItem) {
		const panelInstance = this.getPanel(panelItem);

		if (panelInstance) {
			panelInstance.destroy();
			this._panels.delete(panelItem);
		}
	}

	/**
	 * get panel from panel list (weakmap)
	 * @param {HTMLElement} panelItem
	 * @returns {Object}
	 */
	getPanel(panelItem) {
		return this._panels.get(panelItem);
	}

	/**
	 * Return top panels
	  * @returns {*}
	 */
	getTopPanels() {
		return editor.workspace.getTopPanels();
	}

	/**
	 * Return bottom panels
	  * @returns {*}
	 */
	getBottomPanels() {
		return editor.workspace.getBottomPanels();
	}

	/**
	 * Return left panels
	  * @returns {*}
	 */
	getLeftPanels() {
		return editor.workspace.getLeftPanels();
	}

	/**
	 * Return right panels
	  * @returns {*}
	 */
	getRightPanels() {
		return editor.workspace.getRightPanels();
	}

	/**
	 * Return modal panels
	  * @returns {*}
	 */
	getModalPanels() {
		return editor.workspace.getModalPanels();
	}

	/**
	 *
	  * @returns {boolean}
	 */
	isDimmed() {
		return this._dimmed;
	}
}

const panelManager = new PanelManager();

export {panelManager};
