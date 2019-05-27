'use babel';

import $ from 'jquery';
import {packageManager, Package} from 'content-manager';

let _instance = null;
const INTERNAL_ID_ATTRIBUTE = 'data-id';

function isElementElementSelectable($element, componentPackage, filter) {
	return (
		$element.length &&
        $element.attr(INTERNAL_ID_ATTRIBUTE) &&
        ElementDetector._isSelectable(componentPackage, filter)
	);
}

class ElementDetector {

	constructor() {
		this._componentPackages = packageManager.getPackages(Package.TYPE.COMPONENT);
	}

	/**
     * Return instance (it's a singleton)
     * @returns {ElementDetector}
     */
	static getInstance() {
		if (_instance === null) {
			_instance = new ElementDetector();
		}

		return _instance;
	}

	/**
     * Return true if given element is selectable
     * @param {Object} pack
     * @param {String} filter
     * @returns {boolean}
     * @protected
     */
	static _isSelectable(pack, filter) {
		return pack && (
			!filter || filter === Package.TYPE.COMPONENT || filter === pack.options.type
		);
	}

	/**
     * find selectable element from argument to body and return that element.
     * @param {HTMLElement} element
     * @param {String} filter
     * @returns {Object | null}
     */
	detect(element, filter) {
		let $currentTarget = $(element),
			$baseElement = null,
			baseElement = null,
			matchedPackage = null,
			found = false;

		if ($currentTarget.length && !$currentTarget.is('.lock, .lock *')) {

			while (!found && $currentTarget && $currentTarget.length) {
				matchedPackage = this._componentPackages.getPackageByElement($currentTarget);
				if (isElementElementSelectable($currentTarget, matchedPackage, filter)) {
					found = true;
				} else if (matchedPackage && matchedPackage.options.baseElementSelector) {
					$baseElement = $currentTarget.find(matchedPackage.options.baseElementSelector);

					if (isElementElementSelectable($baseElement, matchedPackage, filter)) {
						baseElement = $baseElement.get(0);
						// copy internal ID on wrapper element
						$currentTarget.attr(INTERNAL_ID_ATTRIBUTE, $baseElement.attr(INTERNAL_ID_ATTRIBUTE));
						found = true;
					}
				}
				$currentTarget = $currentTarget.parent();
			}

		}

		return found ? {
			$element: $currentTarget,
			package: matchedPackage,
			element: $currentTarget[0],
			baseElement: baseElement
		} : null;
	}
}

export {ElementDetector};
