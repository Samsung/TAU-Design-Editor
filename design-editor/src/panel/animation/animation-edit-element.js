'use babel';

import $ from 'jquery';
import {CompositeDisposable} from '../../editor';
import {DressElement} from '../../utils/dress-element';
import {elementSelector} from '../../pane/element-selector';
import {EVENTS, eventEmitter} from '../../events-emitter';

var floor = Math.floor;

var settingsClasses = {
    eye: 'fa-eye',
    eyeSlash: 'fa-eye-slash',
    lock: 'fa-lock',
    unlock: 'fa-unlock',
    blockName: 'closet-animation-block-name',
    label: 'fa-tag',
    animationStart: 'animation-start',
    animationSection: 'animation-section',
    animationEnd: 'animation-end',
    animationStartActive: 'animation-start-active',
    animationEndActive: 'animation-end-active'
};

var activeEditor = null;

/**
 * Format number as 2 digit string
 * @param {number} value
 * @returns {string}
 */
function addZero(value) {
    return (value < 10) ? '0' + value : '' + value;
}

/**
 * Format time to mm:ss:ms
 * @param {number} value
 * @returns {string}
 */
function formatTime(value) {
    var string = '',
        minutes = floor(value / 60),
        seconds = floor(value - (minutes * 60)),
        milliseconds = floor((value - seconds) * 100);

    // format minutes
    string += addZero(minutes);
    // format seconds
    string += ':' + addZero(seconds);
    // format milliseconds
    string += ':' + addZero(milliseconds);
    return string;
}

/**
 * Fill classes
 * @param {jQuery} $parent
 * @param {number} startIndex
 * @param {number} endIndex
 */
function addClassesFromInterval($parent, startIndex, endIndex) {
    var siblings = $parent.children(),
        startPoint = siblings.eq(startIndex),
        endPoint = siblings.eq(endIndex);

    startPoint.addClass(settingsClasses.animationSection + ' ' + settingsClasses.animationStart);
    if (startIndex !== endIndex) {
        startPoint
            .nextUntil(endPoint)
            .addClass(settingsClasses.animationSection);
    }
    endPoint.addClass(settingsClasses.animationSection + ' ' + settingsClasses.animationEnd);
}

/**
 * Clear class
 * @param {jQuery} $parent
 * @param {number} startIndex
 * @param {number} endIndex
 */
function removeClassesFromInterval($parent, startIndex, endIndex) {
    var siblings = $parent.children(),
        startPoint = siblings.eq(startIndex),
        endPoint = siblings.eq(endIndex);

    startPoint.removeClass();
    if (startIndex !== endIndex) {
        startPoint
            .nextUntil(endPoint)
            .removeClass();
    }
    endPoint.removeClass();
}

/**
 * Remove active class
 * @param {jQuery} $parent
 */
function removeActiveClasses($parent) {
    var activeStart = $parent.find('.' + settingsClasses.animationStartActive),
        activeEnd = $parent.find('.' + settingsClasses.animationEndActive);

    activeStart.removeClass(settingsClasses.animationStartActive);
    activeEnd.removeClass(settingsClasses.animationEndActive);
}


/*
 We create main element of animation widow
 */
class AnimationEdit extends DressElement {
    /**
     * Create callback
      */
    onCreated() {
        var self = this,
            // main element
            $element = self.$el,
            // path to template
            templatePath = '/panel/animation/animation-edit-element.html';

        // object with all elements found in iframe and map to li elements
        self._elementsMap = [];
        // max number os seconds which is present on time bar
        self._timeLimit = 10;
        self._timeLimitMin = 0;
        // current time in seconds
        self._currentTime = 0;
        self._scrollLeft = 0;
        self._modalPanel = null;
        self._$timeline = null;
        self._$timelineContainer = null;
        self._$currentTime = null;


        // get structure from template
        this.createFromTemplate(templatePath, {
            callback: () => {

                // find main elements
                self._$list = $element.find('.closet-animation-element-list');
                self._$controlList = $element.find('.closet-animation-element-control');
                self._$timelineScroller = $element.find('.closet-animation-timeline-line');

                // create timeline header
                self._$currentTime = $element.find('.closet-animation-time');
                self._$timeLimitInput = $element.find('.closet-animation-footer-time-limit');
                self._setTimeLimit();

                // binding event for basic options
                self.$el.find('.closet-animation-element-container').on({
                    'click': self._onClick.bind(self)
                });
                self.$el.find('.closet-animation-timeline-container').on({
                    'dblclick': self._onDblClick.bind(self),
                    'mouseup': self._onMouseup.bind(self),
                    'mousedown': self._onMousedown.bind(self)
                });
                self.$el.find('.closet-animation-element-time').on({
                    scroll: self._onScroll.bind(self)
                });

                eventEmitter.on(EVENTS.ElementSelected, self._onElementSelected.bind(self));

                self._setCurrentTime();
                self._prepareTimeBarList();
            }
        });

        eventEmitter.on(EVENTS.ElementInserted, this._onElementInserted.bind(this));
        eventEmitter.on(EVENTS.ElementDeleted, this._onElementDeleted.bind(this));
    }

    /**
     * create timeline manager list
     */
    _prepareTimeBarList() {
        var self = this;
        self._$timeline = self.$el.find('.closet-animation-timeline-inner');
        self._$timelineContainer = self._$timeline.parent();
        self._setTimeScroller();
    }

    /**
     * create elements manager in control / list
     */
    _prepareElementsBar() {
        var self = this,
            i = 0,
            j = 0,
            $li = null,
            $liBlock = null,
            component = null,
            // map with pairs element <> li
            elementsMap = [],
            // find all elements in iframe
            elementsToNavigation = activeEditor && activeEditor
                .getModel()
                .getAllElements(),
            elementsToNavigationLength,
            label,
            $listHeaders = self.$el.find('.closet-animation-element-list'),
            $listBlocks = self.$el.find('.closet-animation-element-time');

        if (elementsToNavigation) {
	        elementsToNavigationLength = elementsToNavigation.length;

	        self._elementsMap = elementsMap;
	        this._prepareTimeLine();

	        // clear list because list is created in every mode switch
	        $listHeaders.empty();
	        $listBlocks.empty();

	        for (; i < elementsToNavigationLength; i += 1) {
		        // control
		        component = elementsToNavigation[i].component;

		        if (component) {
			        // if matched successful we take component label
			        label = component.options.label;
		        } else {
			        // else we take tagname
			        label = component.name;
		        }

		        $li = $('<div class="animation-row"><div class="closet-animation-block-name">' +
			        label +
			        '<button title="Hide layer"><i class="fa fa-eye fa-1x"></i></button>' +
			        '<button title="Lock layer"><i class="fa fa-lock fa-1x"></i></button>' +
			        '</div></div>');
		        $listHeaders.append($li);

		        // list
		        $liBlock = $('<div class="block-element"></div>');

		        // fill map
		        elementsMap.push({
			        li: $li,
			        id: elementsToNavigation[i].id,
			        $liBlock: $liBlock
		        });

		        // create timeline for element every 100ms
		        for (j = 0; j < self._timeLimit * 10; j += 1) {
			        $liBlock.append($('<div>&nbsp;</div>'));
		        }
		        // append li to list
		        $listBlocks.append($liBlock);
	        }
        }
    }

    /**
     * Clears or sets hidden flag on all supplied elements, depending of chosen element
     * visibility state
     * @param {Array} elementsMap
     * @param {jQuery} $actionElem
     */
    _toggleVisibilityAll(elementsMap, $actionElem) {
        var $icon = $actionElem.children('i'),
            mode = $icon.hasClass(settingsClasses.eyeSlash) ? 1 : 0; // 0:show, 1:hide
        elementsMap.forEach((map) => {
            const $liIcon = map.li.find('.' + settingsClasses.eye + ', .' + settingsClasses.eyeSlash),
                elementsMappedId = map.id;
            if (mode) {
                $liIcon.removeClass(settingsClasses.eyeSlash).addClass(settingsClasses.eye);
                eventEmitter.emit(EVENTS.Show, elementsMappedId);
            } else {
                $liIcon.removeClass(settingsClasses.eye).addClass(settingsClasses.eyeSlash);
                $(map.element).css('visibility', 'hidden');
                eventEmitter.emit(EVENTS.Hide, elementsMappedId);
            }
        });

        if (mode) {
            $icon.removeClass(settingsClasses.eyeSlash).addClass(settingsClasses.eye);
        } else {
            $icon.removeClass(settingsClasses.eye).addClass(settingsClasses.eyeSlash);
        }
    }

    /**
     * Add animation selection
     * @param $firstElement
     * @param elementMappedId
     * @private
     */
    static _addAnimationSection($firstElement, elementMappedId) {
        var designEditor = activeEditor,
            designEditorModel = designEditor && designEditor.getModel(),
            allSiblings = $firstElement.parent().children(),
            firstElementIndex = $firstElement.index(),
            lastElement = allSiblings.eq(firstElementIndex + 4);


        if (!designEditorModel.animationsInInterval(elementMappedId, firstElementIndex * 100, (firstElementIndex + 5) * 100).length) {
            // add a new animation if there is no conflict with other animations
            if (!lastElement.length) {
                lastElement = allSiblings.last();
            }

            addClassesFromInterval($firstElement.parent(), firstElementIndex, lastElement.index());
            designEditorModel.addAnimation(elementMappedId, firstElementIndex * 100, (firstElementIndex + 5) * 100, 'linear');
        }
    }

    /**
     * Edit animation selection
     * @param animationInfo
     * @param newStartPoint
     * @param newEndPoint
     * @private
     */
    static _editAnimationSection(animationInfo, newStartPoint, newEndPoint) {
        var designEditor = activeEditor,
            designEditorModel = designEditor && designEditor.getModel(),
            editedAnimation = animationInfo.animation,
            $parent = animationInfo.$parentElement,
            collidingAnimations = designEditorModel.animationsInInterval(editedAnimation.id, newStartPoint, newEndPoint);

        if (newStartPoint < 0) {
            newStartPoint = 0;
        }

        removeActiveClasses($parent);

        if (newStartPoint < newEndPoint) {
            // the section has to be correct
            if (collidingAnimations.length === 0
                || (collidingAnimations.length === 1 && collidingAnimations[0].id === editedAnimation.id
                && collidingAnimations[0].fromTime === editedAnimation.fromTime
                && collidingAnimations[0].toTime === editedAnimation.toTime)) {
                // if this change is not in conflict with others, we can change it
                removeClassesFromInterval($parent, editedAnimation.fromTime / 100, (editedAnimation.toTime / 100) - 1);
                addClassesFromInterval($parent, newStartPoint / 100, (newEndPoint / 100) - 1);

                // change values in model
                designEditorModel.changeAnimation(editedAnimation, newStartPoint, newEndPoint);
            }
        } else {
            removeClassesFromInterval($parent, editedAnimation.fromTime / 100, (editedAnimation.toTime / 100) - 1);
            designEditorModel.deleteAnimation(editedAnimation);
        }
    }

    /**
     * Locks or unlocks all supplied elements, depending of chosen element lock state
     * @param {Array} elementsMap
     * @param {jQuery} $actionElem
     */
    _toggleLockAll(elementsMap, $actionElem) {
        var $icon = $actionElem.children('i'),
            mode = $icon.hasClass(settingsClasses.unlock) ? 1 : 0;// 0:unlock, 1:lock

        elementsMap.forEach((map) => {
            var $liIcon = map.li.find('.' + settingsClasses.lock + ', .' + settingsClasses.unlock);
            if (mode) {
                $liIcon.removeClass(settingsClasses.unlock).addClass(settingsClasses.lock);
                eventEmitter.emit(EVENTS.Unlock, map.id);
            } else {
                $liIcon.removeClass(settingsClasses.lock).addClass(settingsClasses.unlock);
                eventEmitter.emit(EVENTS.Lock, map.id);
            }
        });

        if (mode) {
            $icon.removeClass(settingsClasses.unlock).addClass(settingsClasses.lock);
        } else {
            $icon.removeClass(settingsClasses.lock).addClass(settingsClasses.unlock);
        }
    }

    /**
     * Delegation of animation control buttons
     * @param {Event} event
     */
    _onClick(event) {
        var self = this,
            $listIndex = $(event.target).closest('.animation-row').index(),
            // targetElement is a button mounted in the animation tab
            targetElem = event.target,
            $targetElem = $(targetElem),
            $actionElem = $targetElem.closest('[data-action]'),
            targetClasses = targetElem.classList,
            visible = targetClasses.contains(settingsClasses.eye),
            hidden = targetClasses.contains(settingsClasses.eyeSlash),
            lock = targetClasses.contains(settingsClasses.lock),
            unlock = targetClasses.contains(settingsClasses.unlock),
            elementsMappedId = self._elementsMap[$listIndex] && self._elementsMap[$listIndex].id;

        switch ($actionElem.data('action')) {
        case 'toggle-hide-all':
            return self._toggleVisibilityAll(self._elementsMap, $actionElem);
        case 'toggle-lock-all':
            return self._toggleLockAll(self._elementsMap, $actionElem);
        default:

            // hiding showing mapped elements
            if (visible || hidden) {
                $(targetElem).toggleClass(settingsClasses.eye + ' ' + settingsClasses.eyeSlash);
                if (hidden) {
                    eventEmitter.emit(EVENTS.Show, elementsMappedId);
                } else {
                    eventEmitter.emit(EVENTS.Hide, elementsMappedId);
                }
            }

            // lock unlock mapped elements
            if (lock || unlock) {
                $targetElem.toggleClass(settingsClasses.lock + ' ' + settingsClasses.unlock);
                if (lock) {
                    // we trigger event that component was locked, as a option we send that element which should response on event
                    eventEmitter.emit(EVENTS.Lock, elementsMappedId);
                } else {
                    // we trigger event that component was unlocked, as a option we send that element which should response on event
                    eventEmitter.emit(EVENTS.Unlock, elementsMappedId);
                }
            }
            if (elementsMappedId) {
                elementSelector.select(elementsMappedId);
            }
        }
        return null;
    }

    /**
     * DBL click callback
      * @param {Event} event
     * @private
     */
    _onDblClick(event) {
        var self = this,
            targetElem = event.target,
            $targetElem = $(targetElem),
            $listIndex = $targetElem.closest('.block-element').index(),
            $actionElem = $targetElem.closest('[data-action]'),
            elementsMappedId = self._elementsMap[$listIndex] && self._elementsMap[$listIndex].id;

        if ($actionElem.data('action') === 'animation-create') {
            if (elementsMappedId) {
                AnimationEdit._addAnimationSection($targetElem, elementsMappedId);
                elementSelector.select(elementsMappedId);
            }
        }
    }

    /**
     * Mouse down callback
      * @param {Event} event
     * @private
     */
    _onMousedown(event) {
        var self = this,
            designEditor = activeEditor,
            designEditorModel = designEditor && designEditor.getModel(),
            eventTarget = $(event.target),
            startPoint = eventTarget.index(),
            editedAnimation,
            clickPositionFromMiddle = event.clientX - (eventTarget.offset().left + (eventTarget.width() / 2)),
            elementIndex = eventTarget.closest('.block-element').index(),
            id = self._elementsMap[elementIndex] && self._elementsMap[elementIndex].id;

        if (eventTarget.hasClass(settingsClasses.animationStart) && clickPositionFromMiddle < 0) {
            editedAnimation = designEditorModel.animationsInInterval(id, startPoint * 100, startPoint * 100)[0];
            eventTarget.addClass(settingsClasses.animationStartActive);
            self._animationChangingInfo = {
                type: 'start',
                animation: editedAnimation,
                startPoint: startPoint,
                $parentElement: eventTarget.parent()
            };
        } else if (eventTarget.hasClass(settingsClasses.animationEnd) && clickPositionFromMiddle > 0) {
            editedAnimation = designEditorModel.animationsInInterval(id, startPoint * 100, startPoint * 100)[0];
            eventTarget.addClass(settingsClasses.animationEndActive);
            self._animationChangingInfo = {
                type: 'end',
                animation: editedAnimation,
                startPoint: startPoint,
                $parentElement: eventTarget.parent()
            };
        } else if (eventTarget.hasClass(settingsClasses.animationSection)) {
            editedAnimation = designEditorModel.animationsInInterval(id, startPoint * 100, startPoint * 100)[0];
            self._animationChangingInfo = {
                type: 'section',
                animation: editedAnimation,
                startPoint: startPoint,
                $parentElement: eventTarget.parent()
            };
        }
        if (editedAnimation) {
            elementSelector.select(id);
        }
    }

    /**
     * Mouse up callback
      * @param {Event} event
     * @private
     */
    _onMouseup(event) {
        var self = this,
            eventTarget = $(event.target),
            endPoint = eventTarget.index(),
            animationInfo = self._animationChangingInfo,
            animation = null,
            change = 0;

        if (animationInfo) {
            animation = animationInfo.animation;
            if (animation) {
                switch (animationInfo.type) {
                case 'section':
                    change = (endPoint - animationInfo.startPoint) * 100;
                    AnimationEdit._editAnimationSection(animationInfo, animation.fromTime + change, animation.toTime + change);
                    break;
                case 'start':
                    change = (endPoint - animationInfo.startPoint) * 100;
                    AnimationEdit._editAnimationSection(animationInfo, animation.fromTime + change, animation.toTime);
                    break;
                case 'end':
                    change = (endPoint - animationInfo.startPoint) * 100;
                    AnimationEdit._editAnimationSection(animationInfo, animation.fromTime, animation.toTime + change);
                    break;
                }
                self._animationChangingInfo = null;
                event.preventDefault();
            }
        }
    }

    /**
     * Function take elements from design editor and create list of elements to animation.
     * @param {jQuery} editor
     */
    updateList(editor = null) {
        var self = this,
            model = null,
            animations = null;

        if (editor) {
            activeEditor = editor;
        }

        if (activeEditor) {
            model = activeEditor.getModel();
            animations = model.getAnimations();
        }

        self._timeLimitMin = 1;

        if (animations) {
            animations.forEach((animation) => {
                if (self._timeLimitMin < animation.toTime) {
                    self._timeLimitMin = animation.toTime;
                }
            });
        }

        // round up to 0.5 sec
        self._timeLimitMin = Math.ceil(self._timeLimitMin / 500) * 0.5;

        if (self._timeLimit < self._timeLimitMin) {
            self._timeLimit = self._timeLimitMin;
        }

        // create elements manager in control / list
        self._prepareElementsBar();


        if (animations) {
            animations.forEach((animation) => {
                self._elementsMap.forEach((elementMap) => {
                    // is li is connected with selected element then we mark as selected
                    if (elementMap.id === animation.id) {
                        addClassesFromInterval(elementMap.$liBlock, animation.fromTime / 100, (animation.toTime / 100) - 1);
                    }
                });
            });
        }
    }

    /**
     * Function set current time in time counter and write time line in correct position
     */
    _setCurrentTime() {
        var self = this,
            model = null;
        // if the panel is already declared just show it

        self._$currentTime.html(formatTime(self._currentTime));
        self._$timelineScroller.css('left', ((self._currentTime * 200) - this._scrollLeft) + 'px');

        if (activeEditor) {
            model = activeEditor.getModel();
            if (model) {
                model.setActiveKeyFrame(self._currentTime * 1000);
            }
        }
    }

    /**
     * Add support of clicking on time bar to change current time
     */
    _setTimeScroller() {
        var self = this,
            timeModulo;

        self._$timelineContainer.on('click mousemove', (event) => {
            var $timeLineContainer = self._$timelineContainer,
                offset = $timeLineContainer.offset(),
                positionX = (event.pageX - offset.left) + self._scrollLeft;

            if (event.which === 1) {
                self._$timelineContainer.css('cursor', 'ew-resize');
                // calibrate to nearest
                timeModulo = positionX % 20;
                if (timeModulo !== 0) {
                    if (timeModulo <= 10) {
                        self._currentTime = (positionX - timeModulo) / 200;
                    } else {
                        self._currentTime = ((positionX + 20) - timeModulo) / 200;
                    }
                }
                if (self._currentTime > self._timeLimit) {
                    self._currentTime = self._timeLimit;
                }
                self._setCurrentTime();
            } else {
                self._$timelineContainer.css('cursor', '');
            }
        });
    }

    /**
     * Set time limit value in input and add callback to change input value
     */
    _setTimeLimit() {
        var self = this;
        self._$timeLimitInput.val(self._timeLimit);
        self._$timeLimitInput.on('change', () => {
            var value = self._$timeLimitInput.val();
            if (value < self._timeLimitMin) {
                value = self._timeLimitMin;
            }
            if (value > 1000) {
                value = 1000;
            }
            self._timeLimit = value;
            self._$timeLimitInput.val(value);

            self.updateList();
        });
    }

    /**
     * Prepare time line
      * @private
     */
    _prepareTimeLine() {
        var i = 0,
            $timeline = this._$timeline;
        // create timeline every 0.5 s
        $timeline.empty();
        for (; i < this._timeLimit; i += 0.5) {
            $timeline.append($('<div>' + formatTime(i) + '</div>'));
        }
    }

    /**
     * Return title of element
      * @returns {string}
     */
    getElementTitle() {
        return this.querySelector('.closet-animation-element-title').textContent;
    }

    /**
     * Callback for select element
      * @param selectedElementId
     * @private
     */
    _onElementSelected(selectedElementId) {
        var self = this,
            elementsMap = self._elementsMap;
        elementsMap.forEach((elementMap) => {
            // is li is connected with selected element then we mark as selected
            if (elementMap.id === selectedElementId) {
                elementMap.li.css('font-weight', 'bolder');
            } else {
                elementMap.li.css('font-weight', 'normal');
            }
        });
    }

    /**
     * On element inser callback
      * @private
     */
    _onElementInserted() {
        this.updateList();
    }

    /**
     * on element delete callback
      * @private
     */
    _onElementDeleted() {
        this.updateList();
    }

    /**
     * on scroll callback
      * @param {Event} event
     * @private
     */
    _onScroll(event) {
        var left = event.target.scrollLeft,
            top = event.target.scrollTop;

        this._scrollLeft = left;
        this.$el.find('.closet-animation-element-list')[0].scrollTop = top;
        this.$el.find('.closet-animation-timeline-inner')[0].scrollLeft = left;
        this._$timelineScroller.css('left', ((this._currentTime * 200) - left) + 'px');
    }

    /**
     * Show
      */
    show() {
        this.$el.show();
    }

    /**
     * Hide
      */
    hide() {
        this.$el.hide();
    }

    /**
     * Destroy callback
      */
    onDestroy() {
        this._callbacks = null;
    }
}


const AnimationEditElement = document.registerElement('closet-animation', AnimationEdit);

export {AnimationEditElement, AnimationEdit};

