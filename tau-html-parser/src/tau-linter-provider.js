/* global atom, Promise*/

var $ = require('cheerio'),
    tauComponentsManager = require('./tau-component-manager'),
    TAU_FRAMEWORK_CLASS_PREFIX = 'ui-';

/**
 *
 * @param str
 * @param searchValue
 * @param i
 * @returns {Number}
 */
function getPosition(str, searchValue, i) {
    return str.split(searchValue, i).join(searchValue).length;
}

/**
 *
 * @param html
 * @param elementIndex
 * @param wrongValue
 * @param occurrenceIndex
 * @returns {*}
 */
function countLocation(html, elementIndex, wrongValue, occurrenceIndex) {
    var substr = html.substr(0, elementIndex),
        lastLineBreak = substr.lastIndexOf('\n') || '',
        lineNumber = (substr.match(/\n/g) || []).length + 1,
        columnNumber = getPosition(html.substr(lastLineBreak), wrongValue, occurrenceIndex) - 1;

    if (lineNumber && columnNumber) {
        return {
            first_line: lineNumber,
            first_column: columnNumber,
            last_line: lineNumber,
            last_column: (columnNumber + wrongValue.length)
        };
    }

    return null;
}

/**
 *
 * @param html
 * @param elementString
 * @param elementOccurrenceIndex
 * @param wrongValue
 * @param classIndex
 * @returns {*}
 */
function getElementLocation(html, elementString, elementOccurrenceIndex, wrongValue, classIndex) {
    var elementIndex = getPosition(html, elementString, elementOccurrenceIndex),
        elementLocation = countLocation(html, elementIndex, wrongValue, classIndex);

    if (elementLocation) {
        return elementLocation;
    }

    return {
        first_line: 1,
        first_column: 0,
        last_line: 1,
        last_column: 0,
        line: 1
    };
}

/**
 *
 * @param mismatchedClass
 * @param componentName
 * @param allowedClass
 * @param loc
 * @returns {{type: string, message: string, token: {start: {line: number, ch: number}, end: {line: number, ch: (*|number)}}, pos: {line: number, ch: *}, line: number}}
 */
function notValidClass(mismatchedClass, componentName, allowedClass, loc) {
    return {
        type: 'warning',
        message: "'" + mismatchedClass + "' is not valid TAU class for " + componentName +
        " component. Allowed TAU classes: '" + allowedClass.join(', ') + "'. We recommend not to use ui- prefix for classes.",
        token: {
            start: {
                line: (loc.first_line - 1),
                ch: loc.first_column
            },
            end: {
                line: (loc.last_line - 1),
                ch: loc.last_column
            }
        },
        pos: {
            line: loc.first_line,
            ch: loc.last_column + 1
        },
        line: loc.first_line
    };
}

/**
 *
 * @param mismatchedClass
 * @param loc
 * @returns {{type: string, message: string, token: {start: {line: number, ch: number}, end: {line: number, ch: (number|*)}}, pos: {line: number, ch: *}}}
 */
function notRecognizedClass(mismatchedClass, loc) {
    return {
        type: 'warning',
        message: "No TAU component was recognized. Class '" + mismatchedClass + "' is not valid for TAU." +
            'We recommend not to use ui- prefix for classes.',
        token: {
            start: {
                line: (loc.first_line - 1),
                ch: loc.first_column
            },
            end: {
                line: (loc.last_line - 1),
                ch: loc.last_column
            }
        },
        pos: {
            line: loc.first_line,
            ch: loc.last_column + 1
        }
    };
}

/**
 *
 * @param mismatchedAttribute
 * @param componentName
 * @param allowedAttributes
 * @param loc
 * @returns {{type: string, message: string, token: {start: {line: number, ch: number}, end: {line: number, ch: (number|*)}}, pos: {line: number, ch: *}}}
 */
function notRecognizedAttribute(mismatchedAttribute, componentName, allowedAttributes, loc) {
    return {
        type: 'warning',
        message: "'" + mismatchedAttribute + "' is not valid TAU attribute for " + componentName +
        " component. Allowed TAU attributes: '" + allowedAttributes.join(', ') +
        "'. We recommend not to use ui- prefix for classes.",
        token: {
            start: {
                line: (loc.first_line - 1),
                ch: loc.first_column
            },
            end: {
                line: (loc.last_line - 1),
                ch: loc.last_column
            }
        },
        pos: {
            line: loc.first_line,
            ch: loc.last_column + 1
        }
    };
}


/**
 *
 * @param mismatchedAttribute
 * @param componentName
 * @param allowedAttributes
 * @param loc
 * @returns {{type: string, message: string, token: {start: {line: number, ch: number}, end: {line: number, ch: (number|*)}}, pos: {line: number, ch: *}}}
 */
function notRecognizedAttributeValue(mismatchedAttribute, componentName, allowedAttributes, loc) {
    return {
        type: 'warning',
        message: "'" + mismatchedAttribute + "' has not valid TAU attribute" +
        ' value for ' + componentName + ' component. Allowed TAU attribute' +
        ' values: ' + allowedAttributes.join(', ') + '.',
        token: {
            start: {
                line: (loc.first_line - 1),
                ch: loc.first_column
            },
            end: {
                line: (loc.last_line - 1),
                ch: loc.last_column
            }
        },
        pos: {
            line: loc.first_line,
            ch: loc.last_column + 1
        }
    };
}

/**
 *
 * @param allowedClass
 * @returns {string}
 */
function classMapFn(allowedClass) {
    return (typeof allowedClass === 'string') ?
        allowedClass : allowedClass && allowedClass.text;
}

/**
 *
 * @param item
 * @returns {string|string|*|string|string|string}
 */
function getLabel(item) {
    return item.label;
}

/**
 *
 * @param name
 * @returns {void|XML|string|*}
 */
function toDash(name) {
    return name.replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); });
}

module.exports = {

    /**
     *
     */
    initialize: function () {
    },

    /**
     *
     * @param data
     * @returns {Array}
     */
    validate: function (data) {
        var $doc = $.load(data),
            $elements = $doc('body *'),
            results = [],
            elementsIndexes = {};

        $elements.each(function (index, item) {
            var $item = $(item),
                itemString = $.html($item),
                itemClasses = $item.attr('class'),
                dataAttributes = $item.data(),
                keys = null,
                availableClassesObjects = tauComponentsManager.getMatchingClassesForElement($item),
                components = tauComponentsManager.getMatchingComponentsForElement($item),
                componentName = components.map(getLabel).join(' or '),
                availableClasses,
                currentValue,
                availabledAttributes = [],
                availabledAttributesValue = [],
                position;

            availableClasses = availableClassesObjects.map(classMapFn);

            // find index of such element's occurrence
            if (elementsIndexes[itemString]) {
                elementsIndexes[itemString] += 1;
            } else {
                elementsIndexes[itemString] = 1;
            }

            // if element has classes
            if (itemClasses) {
                // if element is a TAU component and has classes
                if (componentName) {
                    itemClasses = itemClasses.split(/\s+/);
                    currentValue = '';
                    itemClasses.forEach(function (itemClass) {
                        // remember the current analyzed string
                        currentValue += ' ' + itemClass;
                        if (itemClass.indexOf(TAU_FRAMEWORK_CLASS_PREFIX) === 0) {
                            if (availableClasses.indexOf(itemClass) < 0) {
                                // this class is not from TAU, so we have to add warning
                                position = getElementLocation(data, itemString, elementsIndexes[itemString], itemClass, currentValue.split(itemClass).length - 1);
                                results.push(notValidClass(itemClass, componentName, availableClasses, position));
                            }
                        }
                    });
                } else {
                    itemClasses = itemClasses.split(/\s+/);
                    currentValue = '';
                    itemClasses.forEach(function (itemClass) {
                        currentValue += ' ' + itemClass;
                        if (itemClass.indexOf(TAU_FRAMEWORK_CLASS_PREFIX) === 0) {
                            // this class is not from TAU and it is not connected with any component
                            position = getElementLocation(data, itemString, elementsIndexes[itemString], itemClass, currentValue.split(itemClass).length - 1);
                            results.push(notRecognizedClass(itemClass, position));
                        }
                    });
                }
            }
            keys = Object.keys(dataAttributes);
            keys.forEach(function (key) {
                var value = dataAttributes[key] + '',
                    dashKey = toDash(key),
                    correct = false,
                    correctValue = false;

                components.forEach(function (component) {
                    availabledAttributes = [];
                    if (Array.isArray(component.data)) {
                        component.data.forEach(function (dataAttr) {
                            if (dashKey === dataAttr.option) {
                                correct = true;
                                if (Array.isArray(dataAttr.values)) {
                                    dataAttr.values.forEach(function (possibleValue) {
                                        if (typeof possibleValue === 'string') {
                                            if (possibleValue === value) {
                                                correctValue = true;
                                            }
                                            availabledAttributesValue.push(possibleValue);
                                        } else {
                                            if (possibleValue.text === value) {
                                                correctValue = true;
                                            }
                                            availabledAttributesValue.push(possibleValue.text);
                                        }
                                    });
                                }
                            }
                            availabledAttributes.push(dataAttr.option);
                        });
                    }
                });
                if (!correct) {
                    position = getElementLocation(data, item, 'data-' + dashKey, 1);
                    results.push(notRecognizedAttribute('data-' + dashKey, componentName, availabledAttributes, position));
                } else if (!correctValue) {
                    position = getElementLocation(data, item, value, 1);
                    results.push(notRecognizedAttributeValue('data-' + dashKey, componentName, availabledAttributesValue, position));
                }
            });
        });

        return results;
    },

    /**
     *
     * @param data
     * @returns {*|Array}
     */
    lint: function (data) {
        return this.validate(data);
    }
};
