'use babel';

import mustache from 'mustache';
import $ from 'jquery';
import path from 'path';

import {appManager as AppManager} from '../../../app-manager';
import {DressElement} from '../../../utils/dress-element';
import {projectManager} from '../../../system/project-manager';
import {EVENTS, eventEmitter} from '../../../events-emitter';

const TEMPLATE_FILE = 'panel/property/attribute/templates/attribute-checkbox.html'

class AttributeCheckbox extends DressElement {

  constructor() {
    this._target;
    this._model;
    this._imgEnable;
    this._imgDisable;
    this._styleEl;
  }
  /**
   * Create callback
    */
  onCreated() {
      var self = this;
      $.get(path.join(AppManager.getAppPath().src, TEMPLATE_FILE), (template) => {
          self.$el.append(mustache.render(template, self._data));
      });
      self.events = {
        'change #checkboxColorVal': this._onColorChange.bind(this),
        'change #checkedImagePath': this._onImageEnabledChange.bind(this),
        'change #uncheckedImagePath': this._onImageDisabledChange.bind(this)
      };
  }


  setData(target, model) {
      this._target = target;
      this._model = model;
      this._view = target[0].ownerDocument;
      this.styleEl = this._view.querySelector('style[data-style=checkbox]');
      this.styles = {};
      this._color = this._convertColor(window.getComputedStyle(target[0], 'before').backgroundColor);
      document.querySelector('#checkboxColorVal').value = this._color;
      document.querySelector('#checkedImagePath').value = "";
      document.querySelector('#uncheckedImagePath').value = "";
      this._imgDisable = 'images/' + this._getImageName(target[0], 'before');
      this._imgEnable = 'images/' + this._getImageName(target[0], 'after');
      document.querySelector('#checkedImageValue').innerHTML = this._imgEnable;
      document.querySelector('#uncheckedImageValue').innerHTML = this._imgDisable;
  }

  _onColorChange(event) {
    this._enableCustomCheckbox(this._target[0], this._model);
    this._color = event.target.value;
    const model = AppManager.getActiveDesignEditor().getModel(),
    style = this._editStyles(this._color , this._imgDisable, this._imgEnable);
    this.styleEl.innerHTML = style;
  }

  _onImageDisabledChange(event) {
    const model = AppManager.getActiveDesignEditor().getModel();
    this._enableCustomCheckbox(this._target[0], this._model);
    this._onImageAdded(event, (readpath) => {
      this._imgDisable = readpath;
      const style = this._editStyles(this._color , this._imgDisable, this._imgEnable);
      this.styleEl.innerHTML = style;
      document.querySelector('#uncheckedImageValue').innerHTML = this._imgDisable;
    });

  }

  _onImageEnabledChange(event) {
    const model = AppManager.getActiveDesignEditor().getModel();
    this._enableCustomCheckbox(this._target[0], this._model);
    this._onImageAdded(event, (readpath) => {
      this._imgEnable = readpath;
      const style = this._editStyles(this._color , this._imgDisable, this._imgEnable);
      this.styleEl.innerHTML = style;
      document.querySelector('#checkedImageValue').innerHTML = this._imgEnable;
    });
  }


  _generateRandomClass(core) {
    return `${core}-${Math.floor(Math.random()*1000)}`;
  }

  _generateInitialTemplate(selector, color, imgDisabled, imgEnabled) {
    return `\n${selector}::before {\n\tbackground: ${color || '#000000'}; ${ imgDisabled ? `\n\t-webkit-mask-image: url(${imgDisabled}); \n\t-webkit-mask-position: center; -webkit-mask-repeat: no-repeat;` : ''} \n}\n
    \n${selector}::after {\n\tbackground: ${color || '#000000'};\n\t${imgEnabled ? `-webkit-mask-image: url(${imgEnabled}); \n\t-webkit-mask-position: center; -webkit-mask-repeat: no-repeat;` : ''}\n}\n
    \n${selector}:checked::before {\n\ttransform: scale(0)\n}\n
    \n${selector}:not(:checked)::before {\n\ttransform: scale(1);\n\ttransition: transform 300ms, 300ms, 300ms;\n}\n`;
  }

  _onImageAdded(e, callback) {
    [].slice.call(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.addEventListener('loadend', event => {
            if (event.target.readyState === FileReader.DONE) {
                const dir = window.top.globalData.fileUrl.replace(/[^\/]+$/gi, '');
                const writepath = (dir + '/images/' + file.name).replace(/\/+/gi, '/');
                const readpath = ('images/' + file.name).replace(/\/+/gi, '/');

                window.top.writeFile(
                    writepath,
                    event.target.result, {
                        encoding: 'binary'
                    },() => {
                      callback(readpath);
                    }
                );
            }
        });
        reader.readAsBinaryString(file);
    });
  }

  _enableCustomCheckbox(target, element) {
    const model = AppManager.getActiveDesignEditor().getModel();
    target.classList.add('favorite');
    this._getCustomClass(target);
    model.updateAttribute(element.id, 'class', target.classList.value);
  }

  _getCustomClass(target) {
    const baseClass = 'custom-checkbox',
    classList = target.classList.value,
    pattern = new RegExp(`${baseClass}-\\d{1,}`);
    if(classList.search(pattern)=== -1){
      this._class = this._generateRandomClass(baseClass);
      target.classList.add(this._class);
    } else {
      this._class = target.classList.value.match(pattern);
    }
  }

  _editStyles(color, imgDisabled, imgEnabled) {
    const model = AppManager.getActiveDesignEditor().getModel(),
    styles = model.exportStyles();
    styles[this._class] = {
      color,
      imgDisabled,
      imgEnabled
    };
    const styleContent = this._getStyleContent(styles)
    model.insertStyles(styles, styleContent);
    return styleContent;
  }

  _getStyleContent(styles) {
    let content = "";
    for(var item in styles) {
      const selector = `input[type="checkbox"].favorite.${item}`;
        content += this._generateInitialTemplate(
          selector,
           styles[item].color,
           styles[item].imgDisabled,
           styles[item].imgEnabled)
      console.log(item, content)
    }
    return content;
  }

  _convertColor(value) {
    const num = value.match(/\d{1,3}/g);
    let hex = '#';
    num.forEach((item, index) => {
      item = (+item).toString(16);
      item = item.length == 1 ? '0' + item : item;
      hex += item;
    });
    return hex;
  }

  _convertPathToName(value) {
    const image = value.match(/\w+\.\w{3}/);
    return image[0];
  }

  _getImageName(target, pseudoelement) {
    if(target.classList.value.match(/custom-checkbox-\d{1,}/gm)) {
      return this._convertPathToName(window.getComputedStyle(target, pseudoelement).webkitMaskImage);
    }
    return;
  }
}


customElements.define('closet-checkbox-element', AttributeCheckbox);

export {AttributeCheckbox};
