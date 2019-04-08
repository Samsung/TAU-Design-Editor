/**
 * Created by khanas on 10/19/15.
 */

class ScrollingModule {
    private RAF: any;
    private CAF: any;
    private lastFrameId: any;
    private preventMouseDownEvent: any;
    private preventClickEvent: any;
    private model: any;
    private scrollableDom: any;
    private direction: any;
    private isScrolling: any;
    private isAnimating: any;
    private mouseDownHandler: any;

    constructor(model, scrollableDom, direction) {
        this.RAF = window.requestAnimationFrame.bind(window);
        this.CAF = window.cancelAnimationFrame.bind(window);
        this.lastFrameId = undefined;
        this.preventMouseDownEvent = false;
        this.preventClickEvent = false;
        this.model = model;
        this.scrollableDom = scrollableDom;
        this.direction = direction;
        this.isScrolling = false;
        this.isAnimating = false;
        this.mouseDownHandler = this._getMouseDownHandler(model, scrollableDom, direction);

        this.scrollableDom.addEventListener(ScrollingModuleHelper.SCROLLING_START_EVENT_NAME, this.mouseDownHandler, false);
    }

    scroll(model, animationDestination, animationDuration) {
        if (this.isAnimating === false) {
            this._resetAnimation(model, animationDestination, animationDuration);
        }
    }

    destroy() {
        this._stopScrolling();
        this.scrollableDom.removeEventListener(ScrollingModuleHelper.SCROLLING_START_EVENT_NAME, this.mouseDownHandler, false);
    }

    _getMouseDownHandler(model, scrollableDom, direction) {
        var self = this;

        return function(eStart) {
            var coordinatesWithTime = [],
                firstCoordinate = ScrollingModuleHelper.getCoordinateFromEvent(eStart),
                previousCoordinate,
                coordinateWithTime;

            /*if (self.scrollableDom === eStart.target) {
             return;
             }*/

            // prevent scrolling if there is some selected item
            if (self.preventMouseDownEvent === true) {
                return;
            }

            previousCoordinate = firstCoordinate;
            coordinateWithTime = ScrollingModuleHelper.getTimelineItem(firstCoordinate, ScrollingModuleHelper.CURRENT_TIME);
            coordinatesWithTime.push(coordinateWithTime);

            self.isAnimating = false;

            self._stopScrolling();

            scrollableDom.addEventListener(ScrollingModuleHelper.SCROLLING_MOVE_EVENT_NAME, onTouchMove, false);
            window.addEventListener(ScrollingModuleHelper.SCROLLING_END_EVENT_NAME, onTouchEnd, false);

            function onTouchMove(eMove) {
                var newCoordinate = ScrollingModuleHelper.getCoordinateFromEvent(eMove),
                    shift = newCoordinate[self.direction] - previousCoordinate[self.direction],
                    adjustedValue = model._getScrollingPosition() + self._getAcceleratedVelocity(model, shift);

                // set that were move event
                self.preventClickEvent = true;

                // update previous pos
                previousCoordinate = newCoordinate;

                coordinateWithTime = ScrollingModuleHelper.getTimelineItem(newCoordinate, ScrollingModuleHelper.CURRENT_TIME);
                coordinatesWithTime.push(coordinateWithTime);

                model._setScrollingPosition(adjustedValue);
                model._getCollectionRenderer()._mountOrUpdate(model._getCollection());
            }

            function onTouchEnd(eEnd) {
                var positions,
                    momentum,
                    borders;

                scrollableDom.removeEventListener(ScrollingModuleHelper.SCROLLING_MOVE_EVENT_NAME, onTouchMove, false);
                window.removeEventListener(ScrollingModuleHelper.SCROLLING_END_EVENT_NAME, onTouchEnd, false);

                if (self._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME)) {
                    return;
                }

                self.isScrolling = true;

                borders = model._getBorders();
                positions = ScrollingModuleHelper.getPositionsFromCoordinates(coordinatesWithTime, direction, - model._getDirectionCoefficient());
                momentum = ScrollingModulePhysics.getMomentum(model._getDirectionCoefficient() * model._getScrollingPosition(),
                    positions,
                    borders.min,
                    borders.max,
                    borders.max - borders.min,
                    ScrollingModuleHelper.GET_EASING_BOUNCE);

                self._animateScroller(model, momentum.time, momentum.destination, momentum.bounce);
            }
        }
    }

    _resetPositionIfNoScrolling(model) {
        this._stopScrolling();
        this._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME);
    }

    _stopScrolling() {
        if (this.isScrolling === true) {
            this.isScrolling = false;
            this.CAF(this.lastFrameId);
        }
    }

    _getAcceleratedVelocity(model, velocity) {
        var self = this,
            borders = model._getBorders(),
            min = borders.min,
            max = borders.max,
            current = model._getDirectionCoefficient() * model._getScrollingPosition();

        if (current < min || current > max) {
            return velocity * ScrollingModuleHelper.GET_OUT_OF_THE_BOX_ACCELERATION;
        }

        return velocity;
    }

    _resetPosition(model, time) {
        var self = this,
            borders = model._getBorders(),
            min = borders.min,
            max = borders.max,
            current = model._getDirectionCoefficient() * model._getScrollingPosition();

        if (current < min) {
            self._resetAnimation(model, min, time);
            return true;
        }

        if (current > max) {
            self._resetAnimation(model, max, time);
            return true;
        }

        return false;
    }

    _resetAnimation(model, animationDestination, animationDuration) {
        this._animateScroller(model, animationDuration, animationDestination, ScrollingModuleHelper.GET_EASING_REGULAR);
    }

    _animateScroller(model, animationDuration, animationDestination, easingFn) {
        var self = this,
            animationStartTime = ScrollingModuleHelper.CURRENT_TIME,
            animationEndTime = animationStartTime + animationDuration,
            animationStartPos = model._getScrollingPosition(),
            animationDistance = model._getDirectionCoefficient() * animationDestination - animationStartPos,
            stepValue;

        easingFn || (easingFn = ScrollingModuleHelper.GET_EASING_REGULAR);

        function animationStep() {
            var startStepTime = ScrollingModuleHelper.CURRENT_TIME,
                easing;

            // finish animation
            if (startStepTime >= animationEndTime) {

                self.isAnimating = false;
                self.lastFrameId = null;
                model._setScrollingPosition(model._getDirectionCoefficient() * animationDestination);

                // scroll back if out of the box
                if (!self._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME)) {
                    self.isScrolling = false;
                }

                return;
            }

            startStepTime = (startStepTime - animationStartTime) / animationDuration;
            easing = easingFn.get(startStepTime);
            stepValue = ScrollingModuleHelper.getFloatWithPerception(animationStartPos + animationDistance * easing);

            model._setScrollingPosition(stepValue);
            model._getCollectionRenderer()._mountOrUpdate(model._getCollection());

            if (self.isAnimating) {
                self.lastFrameId = self.RAF(animationStep);
            }
        }

        self.isAnimating = true;
        animationStep();
    }
}
