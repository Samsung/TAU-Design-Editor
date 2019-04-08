'use babel';

import $ from 'jquery';
import {EVENTS, eventEmitter} from '../events-emitter';
import {componentGenerator} from './component-generator';
import {guideInfo} from './guide-info';
import {StateManager} from '../system/state-manager';

const CLASS_NAME = {
    GUIDE_ELEMENT: 'closet-guide-element'
};
const INTERNAL_ID_ATTRIBUTE = 'data-id';

class Guide {
    /**
     * Constructor
     */
    constructor() {
        this._$lastGuideElement = null;
        this._$lastGuideElementContainer = null;
        this._guideElementPostGenerated = null;
        this._lastRule = null;
        this._designEditor = null;
        this._bindEvents();
    }

    /**
     * Bind events
     * @private
     */
    _bindEvents() {
        eventEmitter.on(EVENTS.SetNewGuide, this._onSetNewGuide.bind(this));
        eventEmitter.on(EVENTS.DeleteAllGuide, this._onDestroyGuide.bind(this));
    }

    /**
     * Set Guideline component on target element
     * @param {Object} targetInfo : info of the given target that is detected on current mouse point
     * @param {Object} containerInfo : info of the closest container of the given target detected on current ms point
     * @param {Object} packageInfo : info of a component package that needs to show guide
     * @param {Object} designEditor : designEditor related to the given infos.
     */
    _onSetNewGuide(targetInfo, containerInfo, packageInfo, designEditor, isRestrict) {
        var context = null,
            element = null,
            $guideComponent = null,
            $target = null,
            $scriptChild = null,
            allowedPackagenameListInContainer = null,
            isComponentAllowedInThisContainer = null,
            guideElementPostGenerated = null,
            contentScroller = null,
            beforeTop = 0,
            afterTop = 0,
            rule = null,
            wrapperElement = null,
            $wrapperElement = null,
            profile = StateManager.get('screen').profile || 'mobile',
            childrenLocation = (containerInfo.package && containerInfo.package.options
                && containerInfo.package.options.childrenLocation &&
                containerInfo.package.options.childrenLocation.hasOwnProperty(profile)) ?
                containerInfo.package.options.childrenLocation[profile] : '';

        this._designEditor = designEditor;
        // create a fragment and make a component that will be shown as a guide.
        context = designEditor.getDesignViewIframe()[0].contentWindow.document;
        element = context.createElement('div');
        element.innerHTML = packageInfo.options.template;
        $guideComponent = $(element.firstElementChild);
        $guideComponent.addClass(CLASS_NAME.GUIDE_ELEMENT);

        $target = $(targetInfo.element);

        if (!containerInfo) {
            return;
        }
        allowedPackagenameListInContainer = containerInfo.package.options.constraint;

        contentScroller = designEditor.getContentScroller();
        /*
         * Make guide element and guide line when user point element on design-view
         */

        // TODO: translate korean to English
        if (!$target.hasClass(CLASS_NAME.GUIDE_ELEMENT) && !$target.closest('.' + CLASS_NAME.GUIDE_ELEMENT).hasClass(CLASS_NAME.GUIDE_ELEMENT)) {
            isComponentAllowedInThisContainer = $.inArray(packageInfo.name, allowedPackagenameListInContainer) !== -1;

            // $target is mouse cursor 밑의 element
            // $target 이 container 인 경우, flag

            // parent-constraint가 있는 경우는
            // popup의 경우는 containerInfo.$element가 page다
            // _getInsertedRule 이 방향설정

            /*
             * TODO: Refactoring the making rule algorithm
             */
            if (packageInfo.options['parent-constraint']) {
                if (!$target.closest(containerInfo.$element).length) {
                    return;
                }
                rule = {
                    direction: 'append',
                    element: containerInfo.$element
                };
            } else if ($target.is(containerInfo.$element) && isComponentAllowedInThisContainer === false) {
                // element exisis in container
                // designEditor.getUIInfo($target.parent()).package.options.constraint 에 packageInfo.name 이 있는지 체크
                // 내 위에 packageInfo.name 의 component 를 붙있을수 있는 container 가 있는지 확인하고 있으면 거기에 붙인다.
                // 예를 들면:
                let parentComponent = designEditor.getUIInfo($target.parent());
                if (parentComponent) {
                    if ($.inArray(packageInfo.name, parentComponent.package.options.constraint) !== -1) {
                        rule = this._getInsertedRule(targetInfo, $target.parent(), isRestrict, containerInfo);
                        isComponentAllowedInThisContainer = true;
                    }
                }
            } else {
                // element does not exists in container or element is outside container
                rule = this._getInsertedRule(targetInfo, containerInfo.$element, isRestrict, containerInfo);
            }

            if (rule && this._lastRule && this._lastRule.direction === rule.direction && this._lastRule.element.is(rule.element)) {
                return;
            }

            // destroy wrapper
            if (this._guideElementPostGenerated) {
                this._guideElementPostGenerated.destroy();
                this._guideElementPostGenerated.element.remove();
                this._guideElementPostGenerated = null;
            }

            if (rule) {
                beforeTop = rule.element.offset().top;
                if (this._$lastGuideElement) {
                    this._$lastGuideElement.remove();
                }
            }
            if (!isComponentAllowedInThisContainer) {
                // 만들수 없다.
                this._onDestroyGuide();
                if (rule) {
                    afterTop = rule.element.offset().top;
                    guideInfo.setGuideInfo({
                        relativeElement: rule.element
                    }, 'reject', designEditor);
                }
                contentScroller.scrollTop((contentScroller.scrollTop() + afterTop) - beforeTop);

                return;
            }

            if (rule && isComponentAllowedInThisContainer) {
                if (rule.direction === 'before') {
                    rule.element.before($guideComponent);
                    afterTop = rule.element.offset().top;
                    contentScroller.scrollTop((contentScroller.scrollTop() + afterTop) - beforeTop);
                } else if (rule.direction === 'after') {
                    rule.element.after($guideComponent);
                    afterTop = rule.element.offset().top;
                    contentScroller.scrollTop((contentScroller.scrollTop() + afterTop) - beforeTop);
                } else {
                    $scriptChild = this._getScriptTagInElement(rule.element);
                    if ($scriptChild) {
                        $scriptChild.before($guideComponent);
                    } else if (childrenLocation) {
                            let element = rule.element.find(childrenLocation);
                            if (element) {
                                element.append($guideComponent);
                            }
                        } else {
                        rule.element.append($guideComponent);
                    }
                }

                // if compenent require post generating
                guideElementPostGenerated = componentGenerator.generateComponent($guideComponent.get(0), designEditor);
                if (guideElementPostGenerated) {
                    wrapperElement = guideElementPostGenerated.getContainer();
                    if (wrapperElement && wrapperElement != $guideComponent.get(0)) {
                        $wrapperElement = $(wrapperElement);
                        $wrapperElement.addClass(CLASS_NAME.GUIDE_ELEMENT);
                    }    
                }

                guideInfo.setGuideInfo({
                    guideElement: $wrapperElement || $guideComponent,
                    relativeElement: rule.element,
                    containerElement: rule.direction === 'append' ? rule.element : rule.element.parent()
                }, rule.direction, designEditor);

                // component hidden인 경우, active-class 를 붙여서 visiable하게 변경
                if (packageInfo.options['active-class']) {
                    if ($wrapperElement) {
                        $wrapperElement.addClass(packageInfo.options['active-class']);
                    } else {
                        $guideComponent.addClass(packageInfo.options['active-class']);
                    }
                }

                this._lastRule = rule;
                this._$lastGuideElement = $guideComponent;
                this._$lastGuideElementContainer = $wrapperElement;
                this._guideElementPostGenerated = guideElementPostGenerated;

            } else {
                this._onDestroyGuide();
            }

            if (packageInfo.options['parent-modifiers']) {
                packageInfo.options['parent-modifiers'].forEach((modifier) => {
                    $guideComponent.parents(modifier.selector).each((_notused, filteredParent) => {
                        var $filteredParent = $(filteredParent);
                        if (modifier.className !== undefined && $filteredParent.hasClass(modifier.className) === false) { // when more are added, this could be a switch
                            $filteredParent.addClass(modifier.className);
                        }
                    });
                });
            }
        }
    }

    /**
     * Set script in element
     * @param {jQuery} $element
     * @returns {*}
     * @private
     */
    _getScriptTagInElement($element) {
        var children = $element.children(),
            i, length,
            $scriptChild = null;

        length = children.length;

        for (i = 0; i < length; i += 1) {
            if (children[i].tagName.toLowerCase() === 'script') {
                $scriptChild = $(children[i]);
                break;
            }
        }

        return $scriptChild;
    }

    /**
     * Get component's children
     * - only children with data-id (children which exist in html file)
     * @param  {jQuery} $container
     * @param {Object} containerInfo : info of the closest container of the given target detected on current ms point
     * @param {string} [selector] : select specific children
     * @returns {jQuery}
     * @private
     */
    _getComponentChildren($container, containerInfo, selector) {
        let profile = StateManager.get('screen').profile || 'mobile';
        let childrenLocation = (containerInfo.package && containerInfo.package.options
            && containerInfo.package.options.childrenLocation &&
            containerInfo.package.options.childrenLocation.hasOwnProperty(profile)) ?
            containerInfo.package.options.childrenLocation[profile] : '';

        if (childrenLocation) {
            $container = $container.find(childrenLocation);
        }
        selector = selector || '';
        return $container.children('[' + INTERNAL_ID_ATTRIBUTE + ']' + selector);
    }

    /**
     * Insert Rule
     * @param {Object} targetInfo
     * @param {jQuery} $container
     * @param {boolean} isRestrict
     * @returns {*}
     * @private
     */
    _getInsertedRule(targetInfo, $container, isRestrict, containerInfo) {
        var $target = $(targetInfo.element),
            pos = targetInfo.pointFromIFrame,
            $targetOffset = $target.offset(),
            $targetHeight = $target.outerHeight(),
            finded = false,
            direction,
            top,
            $children,
            $first, $last;

        if ($target.is($container)) {
            $children = this._getComponentChildren($container, containerInfo, ':not(.' + CLASS_NAME.GUIDE_ELEMENT + ')');
            if ($children.length) {
                $first = $children.first();
                $last = $children.last();
                top = $first.offset().top + ($first.outerHeight() / 2);
                if (pos.y < top) {
                    return {
                        direction: 'before',
                        element: $first
                    };
                } else if (pos.y > $last.offset().top + $last.outerHeight()) {
                    return {
                        direction: 'after',
                        element: $last
                    };
                } else if ($first.is($last)) {
                    $targetHeight = $first.outerHeight();
                    $targetOffset = $first.offset();
                    direction = $targetHeight - (pos.y - $targetOffset.top) > (pos.x - $targetOffset.left) * ($targetHeight / $target.outerWidth()) ? 'before' : 'after';
                    return {
                        direction: direction,
                        element: $first
                    };
                }
                if (this._lastRule) {
                    return {
                        direction: this._lastRule.direction,
                        element: this._lastRule.element
                    };
                }
            }
            return {
                direction: 'append',
                element: $container
            };

        }
        if ($targetOffset) {
            direction = $targetHeight - (pos.y - $targetOffset.top) > (pos.x - $targetOffset.left) * ($targetHeight / $target.outerWidth()) ? 'before' : 'after';

            if (isRestrict) {
                if (this._getComponentChildren($container, containerInfo).is($target)) {
                    return {
                        direction: direction,
                        element: $target
                    };
                }
                this._onDestroyGuide();
                return null;

            }
            while (!finded) {
                this._getComponentChildren($container, containerInfo).each(function () {
                    if ($target.is($(this))) {
                        finded = true;
                    }
                });
                if (!finded) {
                    $target = $target.parent('[' + INTERNAL_ID_ATTRIBUTE + ']');
                }
                if (!$target.length) {
                    return null;
                }
            }

            return {
                direction: direction,
                element: $target
            };
        }

        return null;
    }

    /**
     * Destroy callback
     * @private
     */
    _onDestroyGuide() {
        var beforeTop = 0,
            afterTop = 0,
            contentScroller = this._designEditor ? this._designEditor.getContentScroller() : null;

        if (this._guideElementPostGenerated) {
            this._guideElementPostGenerated.destroy();
            this._guideElementPostGenerated.element.remove();
            this._guideElementPostGenerated = false;
        }

        beforeTop = this._lastRule && this._lastRule.element.offset().top;

        if (this._$lastGuideElement) {
            this._$lastGuideElement.remove();
        }

        if (this._$lastGuideElementContainer) {
            this._$lastGuideElementContainer.remove();
        }

        afterTop = this._lastRule && this._lastRule.element.offset().top;
        if (contentScroller) {
            contentScroller.scrollTop((contentScroller.scrollTop() + afterTop) - beforeTop);
        }
        this._lastRule = null;
        guideInfo.destroyGuideInfo();
    }
}

export {Guide};
