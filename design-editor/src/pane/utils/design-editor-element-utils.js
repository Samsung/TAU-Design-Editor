/**
 * It expands container to the height of
 * sum of height of its children to make them possible
 * to view and edit in edit mode.
 */
export const containerExpander = {
	initialStyle: {},
	element: null,
	wasExtended: false,
	rollOut: function(element, { packageManager, Package }) {
		this._reset();

		if (!this._isContainer(element, { packageManager, Package })) {
			return;
		}

		this.element = element;
		this.initialStyle.height = element.style.height;
		this.initialStyle.overflowY = element.style.overflowY;

		const extendedHeight = [...element.children]
			.reduce((acc, value) => acc + parseInt(getComputedStyle(value).height), 0);

		if (extendedHeight > parseInt(this.initialStyle.height)) {
			this.wasExtended = true;
			element.style.height = `${extendedHeight}px`;
			element.style.overflow = 'hidden';
		}
	},
	rollBack: function(elementId) {
		if (this.wasExtended && elementId == this.element.getAttribute('data-id')) {
			this.element.style.height = this.initialStyle.height;
			this.element.style.overflowY = this.initialStyle.overflowY;
		}

		this._reset();
	},
	_reset: function() {
		this.initialStyle = {};
		this.elementId = '';
		this.wasExtended = false;
	},
	_isContainer: function(element, { packageManager, Package }) {
		const packageElement = packageManager
			.getPackages(Package.TYPE.COMPONENT)
			.getPackageByElement(element);

		return packageElement &&
			packageElement.options &&
			packageElement.options.type === 'container-component';
	}
};
