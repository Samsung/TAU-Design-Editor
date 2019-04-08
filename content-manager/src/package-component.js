'use babel';

import $ from 'jquery';
import fs from 'fs';
import path from 'path';
import async from 'async';
import Package from './package';
import editor from './editor';


var COMMON_ATTRIBUTE = {
    'id': {
        'label': 'ID',
        'type': 'text',
        'value': ''
    },
    'class': {
        'label': 'CLASS',
        'type': 'text',
        'value': ''
    },
    'data-options': {
        'label': 'Widget options',
        'type': 'text',
        'value': ''
    },
    'model': {
        'label': 'Model',
        'widget-option': true,
        'value': '',
        'type': {
            'name': 'empty'
        }
    },
    'directives': {
        'label': 'Directives',
        'widget-option': true,
        'value': '',
        'type': {
            'name': 'empty'
        }
    }
};

var COMMON_EVENTS = [
    'click', 'change', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout',
    'mouseenter', 'mouseleave', 'mousewheel', 'wheel',
    'focus', 'blur', 'select', 'scroll', 'resize', 'zoom', 'load',
    'keydown', 'keyup', 'keypress'
];

var COMPONENT_PATH_IN_PROJECT = '/libs/component/';

// @TODO try find better module for this function
function getActivePagePath() {
    var activePaneItem,
        activeItemPathArray,
        activeItemPath;
    if (window.atom) {
        activePaneItem = editor.workspace.getActivePaneItem();

        if (activePaneItem) {
            activeItemPathArray = activePaneItem.getPath().split(path.sep);
            activeItemPathArray.pop();
            activeItemPath = activeItemPathArray.join(path.sep);
        }
        return activeItemPath;
    }
    // @TODO for brackets add this function
    return '/';
}

class PackageComponent extends Package {
    constructor(name, options) {
        options = $.extend(true, {}, {
            'attributes': COMMON_ATTRIBUTE
        }, options);

        if (!options.events) {
            options.events = [];
        }

        options.events = options.events.concat(COMMON_EVENTS);

        super(Package.TYPE.COMPONENT, name, options);
    }

    getAttributes() {
        var attributes = this.options.attributes;
        return Object.keys(attributes).map(function (key) {
            var attribute = attributes[key],
                type = attribute.type;

            if (typeof type === 'string') {
                type = {name: type};
            }

            attribute.name = key;
            attribute.type = type;

            return attribute;
        });
    }

    copyToProject(dest, targetDocument) {
        var src = this.options.path;
        dest = path.join(dest, COMPONENT_PATH_IN_PROJECT, this.name);

        this._createComponentPackageDir(dest).then(
            function () {
                return this._createSrcToDestPair(this.options.resources, src, dest);
            }.bind(this),
            function (err) {
                throw err;
            }
        ).then(
            function (pathList) {
                this._copyResource(pathList);
                this._insertScriptAndStyleSheet(pathList, targetDocument);
            }.bind(this),
            function (err) {
                throw err;
            }
        );
    }

    _createSrcToDestPair(resources, srcDir, destDir) {
        var resource,
            pathList = [];

        return new Promise(function (resolve, reject) {
            Object.keys(resources).map(function (key) {
                var type = $.type(resource);

                if (key !== 'icon') {
                    resource = resources[key];

                    switch (type) {
                    case 'string':
                        pathList = pathList.concat(this._createSrcToDestPairStringType(resource, srcDir, destDir));
                        break;
                    case 'array':
                        pathList = pathList.concat(this._createSrcToDestPairArrayType(resource, srcDir, destDir));
                        break;
                    case 'object':
                        pathList = pathList.concat(this._createSrcToDestPairObjectType(resource, srcDir, destDir));
                        break;
                    }
                }
            }.bind(this));

            if (pathList.length > 0) {
                resolve(pathList);
            } else {
                reject(new Error('Resource Array is Empty'));
            }
        }.bind(this));
    }

    _insertScriptAndStyleSheet(pathList, targetDocument) {
        var jsRegex = /.*(\.[jJ][sS])$/g,
            cssRegex = /.*(\.[cC][sS][sS])$/g,
            dest,
            length,
            i,
            createdElement,
            targetHeadElement,
            activeItemPath = getActivePagePath();

        targetHeadElement = $(targetDocument).find('head')[0];
        length = pathList.length || 0;
        for (i = 0; i < length; i += 1) {
            dest = path.relative(activeItemPath, pathList[i].dest).replace(/\\/g, '/');

            if (jsRegex.test(dest)) {
                if (this._isScriptExists(dest, targetHeadElement, activeItemPath) === false) {
                    createdElement = $('<script>').attr('type', 'text/javascript').attr('src', dest)[0];
                }
            } else if (cssRegex.test(dest)) {
                if (this._isStyleSheetExists(dest, targetHeadElement, activeItemPath) === false) {
                    createdElement = $('<link>').attr('rel', 'stylesheet').attr('href', dest)[0];
                }
            }

            if (createdElement instanceof HTMLElement) {
                targetHeadElement.appendChild(createdElement);
                createdElement = null;
            }
        }
    }

    _isFileExists(targetPath, callback) {
        return fs.exists(targetPath, callback);
    }

    _isScriptExists(scriptPath, parentDOM, activeItemPath) {
        var scriptList = $(parentDOM).find('script'),
            length, i,
            url = '',
            result = false;

        length = scriptList.length;
        for (i = 0; i < length; i += 1) {
            url = path.join.apply(null, scriptList[i].getAttribute('src').split('/'));
            if (path.resolve(activeItemPath, url) === path.resolve(activeItemPath, scriptPath.replace(/\//g, path.sep))) {
                result = true;
                break;
            }
        }
        return result;
    }

    _isStyleSheetExists(styleSheetPath, parentDOM, activeItemPath) {
        var scriptList = $(parentDOM).find('link'),
            length, i,
            url = '',
            result = false;

        length = scriptList.length;
        for (i = 0; i < length; i += 1) {
            url = path.join.apply(null, scriptList[i].getAttribute('href').split('/'));
            if (path.resolve(activeItemPath, url) === path.resolve(activeItemPath, styleSheetPath.replace(/\//g, path.sep))) {
                result = true;
                break;
            }
        }
        return result;
    }

    _copyResource(pathList) {
        var srcPath,
            destPath,
            length, i;
        length = pathList.length;

        for (i = 0; i < length; i += 1) {
            try {
                srcPath = pathList[i].src;
                destPath = pathList[i].dest;
                this._isFileExists(destPath, function (error, exists) {
                    if (exists === false) {
                        fs.copy(srcPath, destPath);
                    }
                });
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    _createSrcToDestPairStringType(resource, srcDir, destDir) {
        var srcPath = path.join(srcDir, resource),
            destPath = path.join(destDir, resource);

        return [{
            src : srcPath,
            dest : destPath
        }];
    }

    _createSrcToDestPairArrayType(resource, srcDir, destDir) {
        var length, i,
            paths = [];

        length = resource.length;
        for (i = 0; i < length; i += 1) {
            paths.push({
                src : path.join(srcDir, resource[i]),
                dest : path.join(destDir, resource[i])
            });
        }

        return paths;
    }

    _findRemainingElements(rootElement) {
        var i,
            selector = this.options.selector,
            $rootElement = $(rootElement);

        if (!rootElement) {
            console.error('[package-component.js]_findRemainingElements');
            console.error('1st argument, \'doc\' is empty');
        }

        return $rootElement.find(selector);
    }

    isElementRemained(rootElement) {
        var $remainingElements = this._findRemainingElements(rootElement),
            result = true;

        if ($remainingElements.length === 0) {
            result = false;
        }

        return result;
    }

    /* TODO: unused chunk of code, do we need this?
     removeImportedResources: function() {
     var resources = this.options.resources,
     src = this.options.path,
     dest = path.join(atom.project.getPaths()[0], COMPONENT_PATH_IN_PROJECT, this.name);//TODO : Need Project Manager

     this._createSrcToDestPair(resources, src, dest).then(
     function(pathList) {
     this._removeImportedMarkup(pathList, $document);
     this._removeImportedFiles(dest);
     }.bind(this),
     function(err) {
     throw err;
     }
     );
     },

     _removeImportedFiles: function(compDir) {
     if(this._isFileExists(compDir)){
     fs.removeSync(compDir);
     }
     },

     _removeImportedMarkup: function(pathList, targetDocument) {
     var jsRegex = /.*(\.js)$/igm,
     cssRegex = /.*(\.css)$/igm,
     dest,
     length,
     i,
     $targetHeadElement,
     $targetElement;

     $targetHeadElement = $(targetDocument).find('head');
     length = pathList.length || 0;
     for(i = 0 ; i < length ; i++ ) {
     dest = pathList[i].dest;

     if(jsRegex.test(dest)) {
     $targetElement = $targetHeadElement.find('script[src="' + dest +'"]');
     } else if(cssRegex.test(dest)) {
     $targetElement = $targetHeadElement.find('style[href="' + dest +'"]');
     }

     if($targetElement.length > 0) {
     $targetElement.remove();
     }
     }
     },*/

    /*

     Type1)
     images : {
     src : ['1.png', '2.png'],
     dest : resources/
     }

     Type2)
     images : {
     src : ['1.png', '2.png'],
     dest : ['12.png', '22.png']
     }
     */
    _createSrcToDestPairObjectType(resource, srcDir, destDir) {
        var srcArr = [],
            destArr = [],
            paths = [],
            src = resource.src,
            dest = resource.dest,
            length, i;

        if ($.isArray(src)) {
            srcArr = src;
        } else {
            srcArr.push(src);
        }

        if ($.isArray(dest)) {
            destArr = dest;
        } else {
            destArr.push(dest);
        }

        try {
            length = srcArr.length;
            for (i = 0; i < length; i += 1) {
                paths.push({
                    src : path.join(srcDir, srcArr[i]),
                    dest : path.join(destDir, destArr[i] || destArr[0])
                });
            }

            return paths;
        } catch (e) {
            throw new Error(e);
        }
    }

    _createComponentPackageDir(destPath) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var paths = destPath.split('/'),
                dirPath = '';
            async.eachSeries(paths, function iteratee(item, callback) {
                if (item) {
                    dirPath += '/' + item;
                    self._isFileExists(dirPath, function (error, exists) {
                        if (!exists) {
                            fs.makeDir(dirPath, function (err) {
                                callback(err);
                            });
                        } else {
                            callback();
                        }
                    });
                } else {
                    callback();
                }
            }, function done(err) {
                if (!err) {
                    resolve();
                } else {
                    reject(new Error(err));
                }
            });
        });
    }
}

export default PackageComponent;
