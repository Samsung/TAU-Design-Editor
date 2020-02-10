import mustache from 'mustache';
import {appManager} from '../app-manager';
import path from 'path';

const EVENT_SPLIT_REG = /^(\S+)\s*(.*)$/;

class Component extends HTMLElement {
	constructor() {
		super();
	}

	/**
	 * Creates elements content from template
	 * @param {string} url template path
	 * @param {Object} templateConfig config of mustashe template
	 * @returns {Promise}
	 */
	createFromTemplate(url, templateConfig = {}) {
		const templateUrl = path.join(appManager.getAppPath().src, url);

		return fetch(templateUrl)
			.then(response => response.text())
			.then(template => {
				const content = mustache.render(template, templateConfig.options={});
				this.innerHTML = content;
			}).catch(err => {throw err;});
	}

	/**
	 * Binds events to components based on this.events config
	 */
	bindEvents() {
		if (!this.events) return;

		Object.keys(this.events).forEach((key) => {
			const match = key.match(EVENT_SPLIT_REG),
				eventName = match[1],
				selector = match[2],
				method = this.events[key];

			if (this[method] instanceof Function) {
				document.querySelector(selector)
					.addEventListener(eventName, () => {
						this[method]();
					});
			}
		});
	}

}

export default Component;
