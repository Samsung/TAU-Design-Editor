'use babel';

import $ from 'jquery';
import {StateManager} from '../system/state-manager';
import {DressElement} from '../utils/dress-element';
import {EVENTS, eventEmitter} from '../events-emitter';
import {projectManager} from '../system/project-manager';
import {Devices} from '../system/devices';

/**
 * Custom element representing form at status bar to control configuration of design area.
 */
class ConfigurationDesignArea extends DressElement {
    /**
     * Function called on create CE
     */
    onCreated() {
        var templatePath = '/panel/configuration-design-area-element.html',
            config = StateManager.get('screen', {});
        this.events = {
            'change input': '_onChangeViewConfiguration',
            'change select': '_onChangeViewConfiguration',
            'click #fitToScreen': '_onFitToScreen',
            'click #fit100': '_onFit100'
        };

        config.zoom = 100;
        config.ratio *= 100;

        if (config.ratio > 300) {
            config.ratio = 300;
        }
        this.classList.add('inline-block');

        this.createFromTemplate(templatePath, {
            options: config,
            callback: () => {
                this._fillForm(config);
                /*
                 * Definition of events for support zoom
                 */
                document.addEventListener('wheel', this);
            }
        });

        eventEmitter.on(EVENTS.RequestChangeProfile, (profile) => {
            console.log('requested profile change to: ' + profile);

            if (this.$el.length) {
                console.log('changing profile select');
                this._fillForm(StateManager.get('screen'));
                this.$el.find('#statusTauProfile').val(profile);
            }
        });

        eventEmitter.on(EVENTS.RequestChangeDevice, (device) => {
            console.log('requested device change to: ' + device);

            if (this.$el.length) {
                console.log('changing device select');
                this._fillForm(StateManager.get('screen'));
                this.$el.find('#statusDevices').val(device);
            }
        });
    }

    /**
     * Handle event
     * @param {Event} event
     */
    handleEvent(event) {
        var config = null;
        if (event.ctrlKey) {
            config = StateManager.get('screen');
            if (event.wheelDeltaY > 0) {
                config.zoom += 5;
            } else {
                config.zoom -= 5;
            }
            this._fillForm(config);
        }
    }

    /**
     * Fill config data to form
     * @param {Object} config
     * @private
     */
    _fillForm(config) {
        var $el = this.$el,
            profile = config.profile,
            devices = Devices.getDevices(profile),
            device = null,
            $devices = $el.find('#statusDevices');

        // fill profile field
        $el.find('#statusTauProfile').val(profile);

        // fill devices field
        $devices.html('<option value="">(custom)</option>');
        Object.keys(devices).forEach((key) => {
            device = devices[key];
            $devices.append('<option>' + key + '</option>');
        });

        // select device
        $devices.val(config.device);

        if (profile === 'wearable') {
            // select shape
            $el.find('#statusScreenShape').val(config.shape);
            $el.find('#shape').show();
        } else {
            $el.find('#shape').hide();
        }

        if (config.shape === 'circle') {
            $el.find('#rectangleOnly').hide();
        } else {
            $el.find('#rectangleOnly').show();
        }

        $el.find('#statusScreenWidth').val(config.width);
        $el.find('#statusScreenHeight').val(config.height);
        $el.find('#statusScreenRatio').val(config.zoom);
    }

    /**
     * Check that data are correct for selected profile
     * @param {Object} config
     * @param {Function} callback
     * @private
     */
    _validateProfileData(config, callback) {
        projectManager.getActiveProjectInfo((projectInfo) => {
            const profiles = projectInfo.profiles || ['mobile', 'wearable', 'tv'];
            if (profiles.indexOf(config.profile) === -1) {
                eventEmitter.emit(EVENTS.TooltipPanelOpen, {
                    category: 'profile',
                    header: '',
                    text: 'Profile ' + config.profile + ' is incorrect for current project. Available profiles are: ' +
                    profiles.join(', ') + '.'
                });
                config.profile = profiles[0];
            }
            // disable circle for mobile and tv
            if (config.profile !== 'wearable') {
                config.shape = 'rectangle';
            }
            // check that choosed device is correct for profile
            if (!Devices.getDevice(config.profile, config.device)) {
                config.device = '';
            }
            callback();
        });
    }

    /**
     * Change device if not match to any config or clear otherwise
     * @param {Object} config
     * @private
     */
    _validateDeviceData(config) {
        var devices = Devices.getDevices(config.profile),
            device;
        config.device = '';

        if (config.shape === 'circle') {
            config.height = config.width;
        }

        Object.keys(devices).forEach((key) => {
            device = devices[key];

            if (config.width === device.width &&
              config.height === device.height &&
              config.shape === device.shape) {
                config.device = key;
            }
        });
    }

    /**
     * Chack that zoom, width and height is in correct range.
     * @param {Object} config
     * @private
     */
    _validateOtherDataRanges(config) {
        // ratio in [0.1, 3]
        config.ratio = Math.min(3, Math.max(0.1, config.ratio));
        // zoom in [10, 300]
        config.zoom = Math.min(300, Math.max(10, config.zoom));
        // width in [216, 1920]
        config.width = Math.min(1920, Math.max(216, config.width));
        // width in [216, 1080]
        config.height = Math.min(1080, Math.max(216, config.height));
    }

    /**
     * Fill device parameter to config
     * @param {Object} config
     * @private
     */
    _fillDeviceData(config) {
        var device = Devices.getDevice(config.profile, config.device);

        if (device) {
            config.width = device.width;
            config.height = device.height;
            config.shape = device.shape;
        }
    }

    /**
     * Callback for change form data
     * @param {Event} event
     * @private
     */
    _onChangeViewConfiguration(event) {
        var self = this,
            $el = self.$el,
            previousConfig = StateManager.get('screen', {}),
            // read config from form
            config = {
                width: parseInt($el.find('#statusScreenWidth').val(), 10),
                height: parseInt($el.find('#statusScreenHeight').val(), 10),
                ratio: parseInt($el.find('#statusScreenRatio').val() || 100, 10) / 100,
                shape: $el.find('#statusScreenShape').val(),
                profile: $el.find('#statusTauProfile').val(),
                device: $el.find('#statusDevices').val(),
                zoom: parseInt($el.find('#statusScreenRatio').val() || 100, 10)
            },
            lastConfig = StateManager.get('screen');

        // validate data based on profile field
        self._validateProfileData(config, () => {

            // if choose predefined style then move it to inputs
            if (event) {
                switch (event.currentTarget.id) {
                case 'statusDevices':
                    self._fillDeviceData(config);
                    break;
                case 'statusTauProfile':
                    if (config.profile !== lastConfig.profile) {
                        if (!config.device) {
                            config.device = Devices.getDefaultDevice(config.profile);
                        }
                        self._fillDeviceData(config);
                    }
                    break;
                case 'statusScreenWidth':
                case 'statusScreenHeight':
                case 'statusScreenShape':
                case 'statusScreenRatio':
                    self._validateDeviceData(config);
                    break;
                }

                if (['statusTauProfile', 'statusDevices'].indexOf(event.currentTarget.id) > -1 ) {
                    eventEmitter.emit(EVENTS.DocumentSave, true);
                }
            }

            self._validateOtherDataRanges(config);

            // save config
            StateManager.set('screen', config);

            // fill form by validated data
            self._fillForm(config);

            self._sendEvents(previousConfig, config);
        });
    }

    /**
     * Trigger event is properties was changed
     * @param {Object} previousConfig
     * @param {Object} config
     * @private
     */
    _sendEvents(previousConfig, config) {
        if (previousConfig.profile !== config.profile) {
            eventEmitter.emit(EVENTS.ChangeProfile, config.profile);
        }
        if (previousConfig.shape !== config.shape) {
            eventEmitter.emit(EVENTS.ChangeShape, config.shape);
        }
    }

    /**
     * Callback for click on 'fit to screen' button
     * @private
     */
    _onFitToScreen() {
        var $workingArea = $('.closet-design-editor-scroller'),
            designAreaWidth = $workingArea.width(),
            // 120 = correction of status bar + arrows buttons
            designAreaHeight = $workingArea.height() - 120,
            screenConfig = StateManager.get('screen'),
            // calculate max zoom on X axis
            maxZoomX = designAreaWidth / screenConfig.width,
            // calculate max zoom on Y axis
            maxZoomY = designAreaHeight / (screenConfig.height),
            // get recommended zoom
            maxZoom = Math.min(maxZoomX, maxZoomY);

        // set zoom
        this.$el.find('#statusScreenRatio').val(Math.round(maxZoom * 100));

        // recalculate form
        this._onChangeViewConfiguration();
    }

    /**
     * Callback for click on '100%' button
     * @private
     */
    _onFit100() {
        this.$el.find('#statusScreenRatio').val(100);
        this._onChangeViewConfiguration();
    }

    /**
     * Show or hide design editor section
     * @param state
     */
    setViewMode(state) {
        this.$el.toggle(!!state);
    }
}

const ConfigurationDesignAreaElement = document.registerElement('configuration-design-area', ConfigurationDesignArea);

export {ConfigurationDesignAreaElement, ConfigurationDesignArea};
