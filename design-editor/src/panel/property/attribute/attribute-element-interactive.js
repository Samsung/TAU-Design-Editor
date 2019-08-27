import mustache from 'mustache';
import $ from 'jquery';
import path from 'path';
import utils from '../../../utils/utils';
import {DressElement} from '../../../utils/dress-element';
import {appManager as AppManager} from '../../../app-manager';

var brackets = utils.checkGlobalContext('brackets');
var PreferencesManager = brackets ? brackets.getModule('preferences/PreferencesManager') : {};
var ProjectManager     = brackets ? brackets.getModule('project/ProjectManager') : {};
var NodeDomain         = brackets ? brackets.getModule('utils/NodeDomain') : {};

var TEMPLATE_FILE = 'panel/property/attribute/attribute-element-interactive.html';

// FIXME: I could't find a way to find the root directory of the project.
// So I used a specific location of the domain of the interactive.
var domainPath = '../../../../../../brackets-server/embedded-ext/interactive3D/node/interactiveDomain';
var nodeDomain = brackets ? new NodeDomain('interactiveDomain', domainPath): {};

function getBasePath (path) {
    var newPath = path.split('/');
    newPath.splice(newPath.length-1, 1);
    newPath.splice(0, 2);
    return newPath.join('/');
}

class AttributeInterative extends DressElement {
    onAttached() {
        this._render();
    }

    onCreated() {
    }

    _clearElement(empty) {
        var self = this;

        if (empty) {
            self.$el.empty();
        }
    }

    setData(element) {
        var self = this,
            $el = self.$el;
        var globalData = utils.checkGlobalContext('globalData');
        var designEditor = AppManager.getActiveDesignEditor();
        var basePath = getBasePath(globalData.fileUrl);

        var modelContainer = $el.find('#model-editor-container');
        modelContainer.hide();

        var projectId = PreferencesManager.getViewState('projectId');

        if (nodeDomain) {
            nodeDomain.exec('getModel', projectId).done(data => {
                var models = JSON.parse(data);
                var modelImage = $el.find('#model-image');
                var modelSelect = $el.find('#model-selector');
                var typeSelect = $el.find('#type-selector');
                
                modelSelect.empty();

                var seedOption = document.createElement('option');
                seedOption.text = 'Choose model';
                seedOption.setAttribute('selected', true);
                modelSelect.append(seedOption);
                
                for (var model of models) {
                    var option = document.createElement('option');
                    option.text = model.title;
                    option.setAttribute('value', model.title);
                    option.setAttribute('i3d-model', model.id);

                    modelSelect.append(option);
                }

                var objects;

                // Remove registered event handlers
                typeSelect.off();
                typeSelect.change(function() {
                    var selectedIndex = this.options.selectedIndex;
                    var selectedOption = this.options.item(selectedIndex);
                    var selectedModel = selectedOption.getAttribute('i3d-model');
                    var selectedId = selectedOption.getAttribute('id');
                    var selectedType = selectedOption.getAttribute('type');

                    for (var object of objects) {
                        if (object.id === selectedId) {
                            if (designEditor) {
                                var model = designEditor.getModel();
                                model.updateAttribute(element.id, 'type', selectedType);
                                if (selectedType === 'obj') {
                                    var mtl = object.files.find(function(f) { return f.type === 'mtl' });
                                    if (mtl) {
                                        model.updateAttribute(element.id, 'mtl', path.join('i3d', 'models', selectedModel, selectedId, mtl.file));
                                    }
                                } else {
                                    // Remove the mtl attribute
                                    model.removeAttribute(element.id, 'mtl');
                                }
                            }
                        }
                    }
                });

                // Remove registered event handlers
                modelSelect.off();
                modelSelect.change(function() {
                    var selectedIndex = this.options.selectedIndex;
                    if (selectedIndex !== 0) {
                        var selectedOption = this.options.item(selectedIndex);
                        var modelID = selectedOption.getAttribute('i3d-model');

                        for (var model of models) {
                            if (model.id === modelID) {
                                objects = model.objects;

                                typeSelect.empty();
                                for (var object of objects) {
                                    var option = document.createElement('option');
                                    option.setAttribute('id', object.id);
                                    option.setAttribute('type', object.type);
                                    option.setAttribute('i3d-model', modelID);
                                    option.text = object.type;

                                    typeSelect.append(option);
                                }

                                object = model.objects[0];
                                break;
                            }
                        }
    
                        nodeDomain.exec('copyModel', projectId, basePath, modelID).done(() => {
                            if (designEditor) {
                                var model = designEditor.getModel();
                                model.updateAttribute(element.id, 'name', selectedOption.getAttribute('value'));
                                model.updateAttribute(element.id, 'i3d-model', modelID);
                                var file = objects[0].files.find(function(f) { return f.type === objects[0].type; });
                                model.updateAttribute(element.id, 'src', path.join('i3d', 'models', modelID, objects[0].id, file.file));
                                model.updateAttribute(element.id, 'i3d-model', modelID);
								model.updateStyle(element.id, 'background', 'none');
                            }

                            modelContainer.show();
                            modelImage.attr('src', path.join('/projects', projectId, basePath, 'i3d', 'models', modelID, 'model.png'));

                            ProjectManager.refreshFileTree();
                        });
                    }
                });

                if (designEditor) {
                    // Clear all previous data
                    $el.find('input[name^="i3d-"][type=text]').val('');
                    $el.find('input[name^="i3d-"][type=checkbox]').attr('checked', false);

                    for (var attr of element.attributes) {
                        if (attr.name.name === 'name') {
                            modelSelect.val(attr.name.value).change();
                        } else if (attr.name.name === 'type') {
                            typeSelect.val(attr.name.value).change();
                        } else if (['width', 'height', 'position', 'scale', 'rotation', 'light'].indexOf(attr.name.name) !== -1) {
                            $el.find('input[name=i3d-'+attr.name.name+']').val(attr.name.value);
                        } else if (['autoplay', 'controls'].indexOf(attr.name.name) !== -1) {
                            $el.find('input[name=i3d-'+attr.name.name+']').attr('checked', true);
                        }
                    }
                }
            });
        }
    }

    _render() {
        var self = this;
        $.get(path.join(AppManager.getAppPath().src, TEMPLATE_FILE), (template) => {
            self._clearElement(true);
            self.$el.append(mustache.render(template, self._data));
        });
    }
}

var AttributeInteractiveElement = document.registerElement('closet-attribute-interactive', AttributeInterative);
export {AttributeInteractiveElement, AttributeInterative};