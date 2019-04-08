/**
 * Created by khanas on 10/19/15.
 */

class ScrollingModuleHelper {

    static getFloatWithPerception(value) {
        var perception = 1000;

        return Math.round(value * perception) / perception;
    }

    static get IS_TOUCH_EVENT_TYPE() {
        return "ontouchstart" in window;
    }

    static get SCROLLING_START_EVENT_NAME() {
        return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchstart" : "mousedown";
    }

    static get SCROLLING_MOVE_EVENT_NAME() {
        return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchmove" : "mousemove";
    }

    static get SCROLLING_END_EVENT_NAME() {
        return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchend" : "mouseup";
    }

    static get CURRENT_TIME() {
        return (Date.now || function () { return new Date().getTime();})();
    }

    static get GET_EASING_BOUNCE() {
        return BezierEasing(0.33, 0.33, 0.66, 0.81);
    }

    static get GET_EASING_REGULAR() {
        return BezierEasing(0.33, 0.66, 0.66, 1);
    }

    static get GET_BOUNCE_TIME() {
        return 300;
    }

    static get GET_OUT_OF_THE_BOX_ACCELERATION() {
        return 0.3;
    }

    static getCoordinateFromEvent(e) {
        return e.touches ? e.touches[0] : e;
    }

    static getTimelineItem(value, time) {
        return {
            value : value,
            time : time
        }
    }

    static getPositionsFromCoordinates(coordinates, direction, directionKoef) {
        var positions = [];

        coordinates.map(function(coordinate) {
            var positionWithTime = ScrollingModuleHelper.getTimelineItem(directionKoef * (- coordinate.value[direction]), coordinate.time);

            positions.push(positionWithTime);
        });

        return positions;
    }
}
