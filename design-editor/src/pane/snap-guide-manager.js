'use babel';

import {StateManager} from '../system/state-manager';
import {SnapGuideElement} from './snap-guide-element';
import {PreferenceManager} from '../preference-manager';

const mathAbs = Math.abs;

let _instance = null;

class SnapGuideManager {
    /**
     * constructor
     */
    constructor() {
        // Cannot call constructor with arguments
        this.vertical = new SnapGuideElement();
        this.vertical.options.orientation = 'vertical';

        this.horizontal = new SnapGuideElement();
        this.horizontal.options.orientation = 'horizontal';

        this.screenConfig = StateManager.get('screen');
    }

    /**
     * get instance
     * @returns {*}
     */
    static getInstance() {
        if (_instance === null) {
            _instance = new SnapGuideManager();
        }

        return _instance;
    }

    /**
     * get guides
     * @returns {{vertical: (SnapGuideElement|*), horizontal: (SnapGuideElement|*)}}
     */
    getGuides() {
        return {
            vertical: this.vertical,
            horizontal: this.horizontal
        };
    }

    /**
     * Can snap?
     * @param {Object} elementPosition
     * @param {Object} elementDimensions
     * @param {Object} containerDimensions
     * @returns {{top: boolean, bottom: boolean, left: boolean, right: boolean, hCenter: boolean, vCenter: boolean, any: boolean}|*}
     */
    canSnapToContainerEdge(elementPosition, elementDimensions, containerDimensions) {
        var elementRight = elementPosition.left + elementDimensions.width,
            elementBottom = elementPosition.top + elementDimensions.height,
            top = mathAbs(elementPosition.top),
            bottom = mathAbs(containerDimensions.height - elementBottom),
            left = mathAbs(elementPosition.left),
            right = mathAbs(containerDimensions.width - elementRight),
            snapObject;

        const SNAP_THRESHOLD = PreferenceManager.get('snap', 'threshold');

        snapObject = {
            top: top <= bottom && top <= SNAP_THRESHOLD,
            bottom: bottom < top && bottom <= SNAP_THRESHOLD,
            left: left <= right && left <= SNAP_THRESHOLD,
            right: right < left && right <= SNAP_THRESHOLD,

            hCenter: mathAbs((containerDimensions.width / 2) - ((elementDimensions.width / 2) + elementPosition.left)) <= SNAP_THRESHOLD,
            vCenter: mathAbs((containerDimensions.height / 2) - ((elementDimensions.height / 2) + elementPosition.top)) <= SNAP_THRESHOLD,

            // Useful to tell if anything will snap
            any: false
        };

        // snapObject.top || snapObject.bottom || snapObject.left || snapObject.right || snapObject.hCenter || snapObject.vCenter;
        snapObject.any = Object.keys(snapObject).some(key => snapObject[key]);

        return snapObject;
    }

    /**
     * Set horizontal
     */
    showHorizontal() {
        this.horizontal.show();
    }

    /**
     * Set vertical
     */
    showVertical() {
        this.vertical.show();
    }

    /**
     * hide horizontal
     */
    hideHorizontal() {
        this.horizontal.hide();
    }

    /**
     * Hide vertical
     */
    hideVertical() {
        this.vertical.hide();
    }

    /**
     * Set guide position
     * @param {Object} snappingObject
     * @param {Object} containerOffset
     * @param {Object} containerDimensions
     */
    setGuidePosition(snappingObject, containerOffset, containerDimensions) {
        if (snappingObject.left) {
            this.vertical.setPosition(containerOffset.left);
        }

        if (snappingObject.right) {
            this.vertical.setPosition(containerOffset.left + containerDimensions.width);
        }

        if (snappingObject.hCenter) {
            this.vertical.setPosition(containerOffset.left + (containerDimensions.width / 2));
        }

        if (snappingObject.top) {
            this.horizontal.setPosition(containerOffset.top);
        }

        if (snappingObject.bottom) {
            this.horizontal.setPosition(containerOffset.top + containerDimensions.height);
        }

        if (snappingObject.vCenter) {
            this.horizontal.setPosition(containerOffset.top + (containerDimensions.height / 2));
        }
    }
}

export {SnapGuideManager};
