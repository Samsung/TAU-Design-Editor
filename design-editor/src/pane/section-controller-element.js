'use babel';

import $ from 'jquery';
import {packageManager, Package} from 'content-manager';
import {StateManager} from '../system/state-manager';
import {DressElement} from '../utils/dress-element';
import {EVENTS, eventEmitter} from '../events-emitter';
import {elementSelector} from './element-selector';

const DURATION = 100;

class SectionController extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        var $rightAddButton = $(document.createElement('i')),
            $leftAddButton = $(document.createElement('i')),
            $rightMove = $(document.createElement('i')),
            $leftMove = $(document.createElement('i'));

        this.$el.append($rightAddButton).append($leftAddButton).append($rightMove).append($leftMove);
        $rightAddButton.addClass('closet-section-add-btn closet-section-add-btn-right fa fa-plus-square fa-3x');
        $leftAddButton.addClass('closet-section-add-btn closet-section-add-btn-left fa fa-plus-square fa-3x');
        $rightMove.addClass('closet-section-move-btn closet-section-move-btn-right fa fa-angle-right fa-4x');
        $leftMove.addClass('closet-section-move-btn closet-section-move-btn-left fa fa-angle-left fa-4x');
    }

    /**
     * Attached callback
     */
    onAttached() {
        this._bindEditorEvents();
    }

    /**
     * Bind events callback
     * @private
     */
    _bindEditorEvents() {
        eventEmitter.on(EVENTS.ActiveEditorUpdated, this._onActiveEditorUpdated.bind(this));
        eventEmitter.on(EVENTS.ElementSelected, this._onElementSelected.bind(this));
        eventEmitter.on(EVENTS.ElementDeselected, this._onElementDeselected.bind(this));
        eventEmitter.on(EVENTS.ElementDeleted, this._onElementDeleted.bind(this));
        this.$el.find('.closet-section-add-btn').on('click', this._onAddClick.bind(this));
        this.$el.find('.closet-section-move-btn').on('click', this._onMoveClick.bind(this));
    }

    /**
     * mouse click callback
     * @param {Event} event
     * @private
     */
    _onMoveClick(event) {
        var self = this,
            sectionChangerComponent = this._sectionChangerComponent,
            target = event.target,
            index;

        if (this._elementInfo) {
            index = sectionChangerComponent.getActiveSectionIndex();
        }
        if ($(target).hasClass('closet-section-move-btn-right')) {
            if (index < sectionChangerComponent.sections.length - 1) {
                sectionChangerComponent.setActiveSection(index += 1, DURATION);
            }
        } else if (index > 0) {
            sectionChangerComponent.setActiveSection(index -= 1, DURATION);
        }
        setTimeout(() => {
            elementSelector.select($(sectionChangerComponent.sections[index]).attr('data-id'));
            self._designView.getSelectLayer().syncSelector($(sectionChangerComponent.sections[index]));
        }, DURATION + 100);

        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * add click callback
     * @param {Event} event
     * @private
     */
    _onAddClick(event) {
        var $target = $(event.target),
            packageInfo = packageManager.getPackages(Package.TYPE.COMPONENT).get('section'),
            $activeSectionElement,
            sectionChangerComponent = this._sectionChangerComponent,
            index;

        if (this._elementInfo) {
            index = sectionChangerComponent.getActiveSectionIndex();
        }

        $activeSectionElement = $(sectionChangerComponent.sections[index]);
        if ($target.hasClass('closet-section-add-btn-right')) {
            // add section to right side
            $activeSectionElement.after($(packageInfo.options.template).addClass('closet-guide-element'));
            this._model.insert($activeSectionElement.parent().attr('data-id'), packageInfo, $activeSectionElement.attr('data-id'));
            index += 1;
        } else {
            // add section to left side
            $activeSectionElement.before($(packageInfo.options.template).addClass('closet-guide-element'));
            this._model.insert($activeSectionElement.parent().attr('data-id'), packageInfo, $activeSectionElement.prev().attr('data-id'));
        }
        sectionChangerComponent.refresh();
        sectionChangerComponent.setActiveSection(index);
        elementSelector.select($(sectionChangerComponent.sections[index]).attr('data-id'));
    }

    /**
     * Element selected callback
     * @param {string} elementId
     * @private
     */
    _onElementSelected(elementId) {
        /*
         * If selected element is 'section-changer', section controller should be appeared.
         */
        var self = this,
            selectLayer,
            elementInfo,
            closestSectionChangerElement,
            closestSectionElement,
            sections,
            activeIndex,
            i, len,
            ratio = StateManager.get('screen').ratio;

        console.log("_onElementSelected", elementId);
        if (this._designView) {
            this._tau = this._designView.getDesignViewIframe()[0].contentWindow.tau;
            elementInfo = this._designView.getUIInfo(this._designView._getElementById(elementId));
            if (elementInfo) {
                closestSectionChangerElement = elementInfo.$element.closest('.ui-section-changer');
                if (closestSectionChangerElement.length) {
                    this._sectionChangerComponent = this._tau.widget.SectionChanger(closestSectionChangerElement[0]);
                    activeIndex = this._sectionChangerComponent.getActiveSectionIndex();
                    closestSectionElement = elementInfo.$element.closest('section');
                    sections = this._sectionChangerComponent.sections;
                    if (sections && !$(sections[activeIndex]).is(closestSectionElement)) {
                        len = sections.length;
                        for (i = 0; i < len; i += 1) {
                            if ($(sections[i]).is(closestSectionElement)) {
                                activeIndex = i;
                                break;
                            }
                        }
                        selectLayer = self._designView.getSelectLayer();
                        selectLayer.hideSelector(elementInfo.$element);
                        //@TODO from where this method comes from?
                        // select layer has no method like this :/
                        // please find out
                        // selectLayer.hideElementInfo();
                        this._sectionChangerComponent.setActiveSection(activeIndex, DURATION);
                        setTimeout(() => {
                            selectLayer.showSelector(elementInfo.$element[0]);
                        }, DURATION + 100);
                    }
                }
				// Make 'sectionchanger' and 'section' elements visible.
				if (elementInfo.package.name === 'sectionchanger' || elementInfo.package.name === 'section') {
                    this.$el.css({
                        'display': 'block',
                        'width': (this._designView.getDesignViewIframe().outerWidth() * ratio) + 80,
                        'transform': `translate(-50%, -50%) scale3d(${ratio})`
                    });
                    this._elementInfo = elementInfo;
                    this._model = this._designView.getModel();

                } else {
                    this.$el.css({
                        'display': 'none'
                    });
                }
            }
        }
    }

    /**
     * Element deleted callback
     * @private
     */
    _onElementDeleted() {
        if (this._sectionChangerComponent) {
            this._sectionChangerComponent.refresh();
        }
    }

    /**
     * Deselected element callback
     * @private
     */
    _onElementDeselected() {
        this.$el.css({
            'display': 'none'
        });
    }

    /**
     * Active editor update callback
     * @param type
     * @param editor
     * @private
     */
    _onActiveEditorUpdated(type, editor) {
        this._onElementDeselected();
        this._designView = editor;
    }
}

const SectionControllerElement = document.registerElement('closet-section-controller', SectionController);

export {SectionControllerElement, SectionController};
