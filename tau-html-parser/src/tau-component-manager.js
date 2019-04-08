/* global define, brackets, $ */


var componentsPackagesPath = '../node_modules/tau-component-packages/',
    componentsPackage = require('../node_modules/tau-component-packages/package.js'),
    tauComponentsManager = function () {
        this.components = {};
        this.selectorToComponent = {};
        this.selectorsDictionary = {};
        this.init();
    },
    tauComponentsManagerPrototype = tauComponentsManager.prototype,
    SELECTOR_REGEXP = /\.ui-([^\s]+)$/;

/**
 * Function from ATOM
 * @param component
 * @param selectorsDictionary
 */
function addSelectorToDictionary(component, selectorsDictionary, selectorToComponent) {
    var componentSelectors = component.selector,
        componentClasses = component.class,
        componentAdded = false;

    componentClasses.forEach(function (componentClass) {
        var key = componentSelectors, // if no special selector is defined for class, it means that this class is connected only with component
            classObject = {};

        // prepare information about class
        if (typeof componentClass === 'string') {
            // if class is given as a string, it is now changed to object because
            // we want to store information about component which this class comes from
            classObject.text = componentClass;
            componentAdded = true;
        } else {
            if (componentClass.selector) {
                // if the special selector for class is defined, it means that this class is specified for child of component
                key = componentSelectors.replace(',', componentClass.selector + ',');
                key += componentClass.selector;
            }
            classObject = componentClass;
        }
        // add information about component which this class comes from
        classObject.component = component.label;

        if (selectorsDictionary[key]) {
            selectorsDictionary[key].push(classObject);
        } else {
            selectorsDictionary[key] = [classObject];
        }
        selectorToComponent[key] = component.label;
    });

    if (!componentAdded) {
        if (!selectorsDictionary[componentSelectors]) {
            selectorsDictionary[componentSelectors] = [{}];
        }
        selectorToComponent[componentSelectors] = component.label;
    }
}

/**
 *
 */
tauComponentsManagerPrototype.init = function () {
    var self = this,
        components = self.components,
        selectorToComponent = self.selectorToComponent,
        selectorsDictionary = self.selectorsDictionary,
        componentsPaths = componentsPackage.components,
        component = {};

    Object.keys(componentsPaths).forEach((componentName) => {
        component = require(componentsPackagesPath + componentsPaths[componentName] + '/package.json');
        // filter components, which have classes
        if (component.class) {
            addSelectorToDictionary(component, selectorsDictionary, selectorToComponent);
        }

        components[componentName] = component;
    });
};

/**
 *
 * @param textBefore
 * @returns {*}
 */
tauComponentsManagerPrototype.getCurrentElementInDOM = function (textBefore) {
    var textBeforeObject = null,
        currentElement = null;

    // hack: the whole content is put to <div> element, becuase in other case
    // jquery treat each element as separated element
    textBeforeObject = $('<div>' + textBefore + '</div>');

    // find current element (it is the last child)
    currentElement = textBeforeObject;
    while (currentElement.children().length) {
        currentElement = currentElement.children().last();
    }

    return currentElement;
};

/**
 *
 * @param $element
 * @returns {Array}
 */
tauComponentsManagerPrototype.getMatchingComponentsForElement = function ($element) {
    var self = this,
        components = self.components,
        componentsNames = Object.keys(components),
        matchingComponents = [],
        component;

    componentsNames.forEach(function (componentName) {
        component = components[componentName];
        if ($element.is(component.selector)) {
            matchingComponents.push(component);
        }
    });

    return matchingComponents;
};
/**
 *
 * @param $element
 * @returns {Array}
 */
tauComponentsManagerPrototype.getMatchingClassesForElement = function ($element) {
    var self = this,
        selectorsDictionary = self.selectorsDictionary,
        matchingSelectors = self.getMatchingSelectorsForElement($element),
        result = [],
        lastSelector;

    matchingSelectors.forEach(function (selector) {
        var classes = selectorsDictionary[selector];
        lastSelector = SELECTOR_REGEXP.exec(selector);
        if (lastSelector && lastSelector.length) {
            result.push({
                text: lastSelector[0].replace('.', '')
            });
        }
        classes.forEach(function (classObject) {
            // @todo - prefixRegexp? filterVersion?
            // if (prefixRegexp.test(classObject.text) && filterVersion(classObject)) {
            result.push(classObject);
            // }
        });
    });

    return result;
};
/**
 *
 * @param $element
 * @returns {Array.<*>}
 */
tauComponentsManagerPrototype.getMatchingSelectorsForElement = function ($element) {
    var self = this,
        selectors = Object.keys(self.selectorsDictionary);

    return selectors.filter(function (selector) {
        return $element.is(selector);
    });
};

module.exports = new tauComponentsManager();
