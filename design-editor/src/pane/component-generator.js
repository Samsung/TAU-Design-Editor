'use babel';

import {packageManager, Package} from 'content-manager';

class ComponentGenerator {

	/*
     * Generate TAU Components
     *
     */
	generateComponent(componentElement, designView) {
		const info = this._getPackageInfo(componentElement);
		let constructorArray,
			i, len,
			method,
			component,
			$iframe,
			dependencyComponentPackage,
			dependencyComponent,
			dependencyComponentElement,
			dcpConstructorArray,
			activePage,
			toggleSwitch,
			tau,
			parentComponentToBuildInfo,
			parentComponentToBuild,
			contextElement;

		if (info && designView) {
			$iframe = designView.getDesignViewIframe();

			constructorArray = info.constructor.split('.');

			len = constructorArray.length;

			method = $iframe[0].contentWindow;

			if (info.dependencyComponent) {
				dependencyComponentPackage = packageManager.getPackages(Package.TYPE.COMPONENT)
					.get(info.dependencyComponent);

				dcpConstructorArray = dependencyComponentPackage.options.generator.constructor.split('.');
				len = dcpConstructorArray.length;
				for (i = 0; i < len; i += 1) {
					method = method[dcpConstructorArray[i]];
				}
				dependencyComponentElement = componentElement.closest(dependencyComponentPackage.options.selector);

				dependencyComponent = method(dependencyComponentElement,
					dependencyComponentPackage.options.generator.parameter.options);

				if (info.parentMethodToCall) {
					component = dependencyComponent[info.parentMethodToCall](componentElement);
				} else {
					component = dependencyComponent['refresh']();
				}
			} else {
				for (i = 0; i < len; i += 1) {
					method = method[constructorArray[i]];
				}

				if (method) {
					component = method(componentElement, info.parameter.options);
				} else {
					// eslint-disable-next-line no-console
					console.warn(`Method ${  info.constructor  } not exists.`);
				}

			}
			this._$iframe = $iframe;
			return component;
		} else if (designView) {
			$iframe = designView.getDesignViewIframe();
			method = $iframe[0].contentWindow;
			tau = method.tau;
			// @todo patch for iot template
			activePage = method.document.querySelector('.ui-page-active');
			tau.widget.Page(activePage).refresh();
			toggleSwitch = activePage.querySelector('.ui-toggleswitch');
			if (toggleSwitch) {
				tau.widget.ToggleSwitch(toggleSwitch);
			} else {
				contextElement = componentElement;
				parentComponentToBuildInfo = this._getPackageParentToBuildInfo(componentElement);
				if (parentComponentToBuildInfo) {
					parentComponentToBuild = componentElement.closest(parentComponentToBuildInfo.selector);
					if (parentComponentToBuild) {
						contextElement = parentComponentToBuild;
					}
				}
				tau.engine.createWidgets(contextElement);
			}
			// end patch
		}
		return false;
	}

	/**
     * Get Package info
     * @param {Object} componentElement
     * @returns {*}
     * @private
     */
	_getPackageInfo(componentElement) {
		const info = packageManager.getPackages(Package.TYPE.COMPONENT).getPackageByElement(componentElement);
		if (info && info.options.generator) {
			return {
				constructor: info.options.generator.constructor,
				parameter: info.options.generator.parameter,
				dependencyComponent: info.options.generator['dependency-component'],
				parentMethodToCall: info.options.generator['parent-call-method']
			};
		}
		return null;
	}

	/**
     * Get Package parent component selector to build widget
     * @param {Object} componentElement
     * @returns {*}
     * @private
     */
	_getPackageParentToBuildInfo(componentElement) {
		const info = packageManager.getPackages(Package.TYPE.COMPONENT).getPackageByElement(componentElement);
		return (info && info.options) ? { selector: info.options.buildParentSelector } : null;
	}
}

const componentGenerator = new ComponentGenerator();

export {componentGenerator};
