/* global $ */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
/* global define */
    define([
        '../dress.closet'
    ], function (dress) {
    

// >>excludeEnd("buildExclude");
        var eventType = {
                CHANGE: 'change'
            },
            CLASSES_PREFIX = 'ui-progressbar',

            classes = {
                uiProgressbar: CLASSES_PREFIX,
                uiProgressbarBg: CLASSES_PREFIX + '-bg',
                uiProgressbarValue: CLASSES_PREFIX + '-value',
                uiProgressbarValueLeft: CLASSES_PREFIX + '-value-left',
                uiProgressbarValueRight: CLASSES_PREFIX + '-value-right',
                uiProgressbarHalf: CLASSES_PREFIX + '-half'
            },

            selectors = {
                progressContainer: '.' + classes.uiProgressbar,
                progressBg: '.' + classes.uiProgressbarBg,
                progressValue: '.' + classes.uiProgressbarValue,
                progressValueLeft: '.' + classes.uiProgressbarValueLeft,
                progressValueRight: '.' + classes.uiProgressbarValueRight
            },

            size = {
                FULL: 'full',
                LARGE: 'large',
                MEDIUM: 'medium',
                SMALL: 'small'
            };

    /* make widget refresh with new value */
        function refreshProgressBar(self, value) {
            var percentValue = (value / self._maxValue) * 100,
                rotateValue,
                ui = self._ui;

            if (percentValue >= 50) {
                ui.progressValue.classList.add(classes.uiProgressbarHalf);
            } else {
                ui.progressValue.classList.remove(classes.uiProgressbarHalf);
            }

            rotateValue = 360 * (percentValue / 100);
            ui.progressValueLeft.style.webkitTransform = 'rotate(' + rotateValue + 'deg)';
        }

        function setThicknessStyle(self, value) {
            var ui = self._ui;

            ui.progressValueLeft.style.borderWidth = value + 'px';
            ui.progressValueRight.style.borderWidth = value + 'px';
            ui.progressValueBg.style.borderWidth = value + 'px';
        }

        function setProgressBarSize(self, progressSize) {
            var sizeToNumber = parseFloat(progressSize),
                ui = self._ui;

            if (!isNaN(sizeToNumber)) {
                ui.progressContainer.style.fontSize = progressSize + 'px';
                ui.progressContainer.style.width = progressSize + 'px';
                ui.progressContainer.style.height = progressSize + 'px';
            } else {
                switch (progressSize) {
                case size.FULL:
                case size.LARGE:
                case size.MEDIUM:
                case size.SMALL:
                    ui.progressContainer.classList.add(CLASSES_PREFIX + '-' + progressSize);
                    break;
                }
                ui.progressContainer.style.fontSize = $(ui.progressContainer).outerWidth() + 'px';
            }
        }

        function checkOptions(self, option) {
            if (option.thickness) {
                setThicknessStyle(self, option.thickness);
            }

            if (option.size) {
                setProgressBarSize(self, option.size);
            }

            if (option.containerClassName) {
                self._ui.progressContainer.classList.add(option.containerClassName);
            }
        }

        dress.TauCircleProgress = dress.factory('tau-circle-progress', {
            defaults: {},

            onCreated: function () {
                var self = this,
                    ui = {},
                    progressElement = self.$el[0],
                    progressbarContainer, progressbarBg, progressbarValue, progressbarValueLeft, progressbarValueRight;

                ui.progressContainer = null;
                ui.progressValue = null;
                ui.progressValueLeft = null;
                ui.progressValueRight = null;
                ui.progressValueBg = null;

                self.options = {};
                self._ui = ui;
                self._callbacks = {};

                self._maxValue = null;
                self._value = null;
                self.options = {
                    thickness: null,
                    size: size.FULL,
                    containerClassName: null
                };

                ui.progressContainer = progressbarContainer = document.createElement('div');
                ui.progressValueBg = progressbarBg = document.createElement('div');
                ui.progressValue = progressbarValue = document.createElement('div');
                ui.progressValueLeft = progressbarValueLeft = document.createElement('div');
                ui.progressValueRight = progressbarValueRight = document.createElement('div');

            // set classNames of progressbar DOMs.
                progressbarContainer.className = classes.uiProgressbar;
                progressbarBg.className = classes.uiProgressbarBg;
                progressbarValue.className = classes.uiProgressbarValue;
                progressbarValueLeft.className = classes.uiProgressbarValueLeft;
                progressbarValueRight.className = classes.uiProgressbarValueRight;

            // set id for progress container using "container" prefix
                progressbarContainer.id = progressElement.id ? progressElement.id + '-container' : '';

                progressbarValue.appendChild(progressbarValueLeft);
                progressbarValue.appendChild(progressbarValueRight);
                progressbarContainer.appendChild(progressbarValue);
                progressbarContainer.appendChild(progressbarBg);
                progressElement.appendChild(progressbarContainer);

                return self.$el[0];
            },

            onAttached: function () {
                var self = this,
                    ui = self._ui,
                    progressElement = self.$el[0],
                    elementParent = progressElement,
                    options = self.options;

                ui.progressContainer = ui.progressContainer || elementParent.querySelector(selectors.progressContainer);
                ui.progressValueBg = ui.progressValueBg || elementParent.querySelector(selectors.progressValueBg);
                ui.progressValue = ui.progressValue || elementParent.querySelector(selectors.progressValue);
                ui.progressValueLeft = ui.progressValueLeft || elementParent.querySelector(selectors.progressValueLeft);
                ui.progressValueRight = ui.progressValueRight || elementParent.querySelector(selectors.progressValueRight);

                self._maxValue = parseInt($(progressElement).attr('max'), 10);

            // max value must be positive number bigger than 0
                if (self._maxValue <= 0) {
                    self._maxValue = 100;
                }

                self._value = parseInt($(progressElement).attr('value'), 10);

                checkOptions(self, options);
                refreshProgressBar(self, self._value);

                self._callbacks.rotaryDetentHandler = self._onRotaryDetent.bind(self);
                window.addEventListener('rotarydetent', self._callbacks.rotaryDetentHandler, false);

                return self.$el[0];
            },

            onDetached: function () {
                window.removeEventListener('rotarydetent', this._callbacks.rotaryDetentHandler);
            },

            _onRotaryDetent: function (event) {
                var direction = event.detail.direction,
                    currentValue = this._getValue();

                if (direction === 'CW') {
                    this._setValue(currentValue += 1);
                } else if (direction === 'CCW') {
                    this._setValue(currentValue -= 1);
                }
            },

            _getValue: function () {
                return this.$el.attr('value');
            },

            _setValue: function (inputValue) {
                var self = this,
                    value;

                if (inputValue > self._maxValue) {
                    value = self._maxValue;
                } else if (inputValue < 0) {
                    value = 0;
                } else if (isNaN(inputValue)) {
                    value = 0;
                } else {
                    value = inputValue;
                }

                self.$el.attr('value', value);

                if (self._value !== value) {
                    self._value = value;
                    this.dispatchEvent(new CustomEvent(eventType.CHANGE, {
                        bubbles: true,
                        cancelable: false,
                        detail: {
                            value: value
                        }
                    }));
                    refreshProgressBar(self, value);
                }
            },

            _refresh: function () {
                var self = this;

                self._reset();
                checkOptions(self, self.options);
                refreshProgressBar(self, self._getValue());
                return null;
            },

            _reset: function () {
                var self = this,
                    ui = self._ui;

                ui.progressValue.classList.remove(classes.uiProgressbarHalf);
                ui.progressValueLeft.style.webkitTransform = '';
                if (self.options.thickness) {
                    ui.progressValueLeft.style.borderWidth = '';
                    ui.progressValueRight.style.borderWidth = '';
                    ui.progressValueBg.style.borderWidth = '';
                }
            },

            value: function () {
                return this._value;
            }
        });
// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.TauCircleProgress;
    });
// >>excludeEnd("buildExclude");
}());
