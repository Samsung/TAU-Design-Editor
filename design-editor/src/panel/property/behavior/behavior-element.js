'use babel';

import $ from 'jquery';
import async from 'async';
import {DressElement} from '../../../utils/dress-element';
import {appManager} from '../../../app-manager';
import {projectManager} from '../../../system/project-manager';

const OPTION_PLACEHOLDER = 'Choose File...';
/**
 *
 */
class Behavior extends DressElement {
    /**
     * Create callback
     */
    onCreated() {
        this.$el.addClass('closet-behavior-element-container closet-property');
        this.events = {
            'click .closet-behavior-add': this._onClickAdd.bind(this),
            'change .behavior-type': this._onChangeType.bind(this),
            'change .behavior-event': this._onChangeEvent.bind(this),
            'change .behavior-option': this._onChangeOption.bind(this),
            'click .closet-behavior-remove': this._onClickRemove.bind(this)
        };

        this.createFromTemplate('/panel/property/behavior/behavior-element.html', {
            callback: () => {
                this._$list = this.$el.find('.closet-property-list');
            }
        });
    }

    /**
     * Show option
     * @param {jQuery} $parent
     * @param {string} type
     * @private
     */
    _showOption($parent, type) {
        $parent.find('select').hide();
        $parent.find('.behavior-' + type + '-name').show();
    }

    /**
     * Change Type
     * @param {Event} event
     * @private
     */
    _onChangeType(event) {
        const target = event.target,
            type = target.value,
            model = appManager.getActiveDesignEditor().getModel(),
            number = this._$list.find('.behavior-type').index(target);
        this._showOption($(target).closest('li').next(), type);
        model.updateBehavior(this._selectedElementId, number, {
            type
        });
    }

    /**
     * on change event callback
     * @param {Event} eventObject
     * @private
     */
    _onChangeEvent(eventObject) {
        const target = eventObject.target,
            event = target.value,
            model = appManager.getActiveDesignEditor().getModel(),
            number = this._$list.find('.behavior-event').index(target);
        model.updateBehavior(this._selectedElementId, number, {
            event
        });
    }

    /**
     *
      * @param {Event} eventObject
     * @private
     */
    _onChangeOption(eventObject) {
        const target = eventObject.target,
            name = target.name,
            model = appManager.getActiveDesignEditor().getModel(),
            number = this._$list.find('.closet-behavior-last').index(target.parentElement),
            options = model.getBehaviors(this._selectedElementId)[number].options;

        options[name] = this._checkOptionValue(target.value);
        model.updateBehavior(this._selectedElementId, number, {
            options
        });
    }

    /**
     * on click add callback
     * @private
     */
    _onClickAdd() {
        const model = appManager.getActiveDesignEditor().getModel();
        this.createFromTemplate('/panel/property/behavior/behavior-item.html', {
            before: this._$list.find('.li-add-button'),
            callback: ($content) => {
                this._refreshForm(() => {
                    const event = $content.find('.behavior-event').val(),
                        type = $content.find('.behavior-type').val(),
                        animationName = this._checkOptionValue($content.find('.behavior-animation-name').val()),
                        pageName = this._checkOptionValue($content.find('.behavior-animation-name').val()),
                        options = {
                            'animation-name': animationName,
                            'page-name': pageName
                        };
                    model.createBehavior(this._selectedElementId, {event, type, options});
                });
            }
        });
    }

    _onClickRemove(event) {
      const model = appManager.getActiveDesignEditor().getModel(),
      target = event.target,
      listItem = this._$list.find(target.parentNode),
      number = this._$list.find('.closet-behavior-remove').index(target.parentElement);
      let current = listItem;
      do {
        let temp = current.prev()
        current.remove();
        current = temp;
      } while (!current.hasClass('closet-behavior-remove')  && current.length !== 0);
      model.removeBehavior(this._selectedElementId, number);
    }

    /**
     * Return element title
     * @returns {string}
     */
    getElementTitle() {
        return 'Behavior';
    }

    /**
     * Refresh form
     * @param {Function} callback
     * @private
     */
    _refreshForm(callback) {
        var self = this,
            $el = self.$el,
            model = appManager.getActiveDesignEditor().getModel(),
            animationGroups = model.getAnimationGroups();
        $el.find('.behavior-animation-name').empty();
        $el.find('.behavior-animation-name').append(`<option>${OPTION_PLACEHOLDER}</option>`);
        for (const name of animationGroups) {
            $el.find('.behavior-animation-name').append('<option>' + name + '</option>');
        }
        projectManager.getPageNames((names) => {
            $el.find('.behavior-page-name').empty();
            $el.find('.behavior-page-name').append(`<option>${OPTION_PLACEHOLDER}</option>`);
            names.forEach((name) => {
                $el.find('.behavior-page-name').append('<option>' + name + '</option>');
            });
            $el.find('.behavior-type').each((index, element) => {
                const type = $(element).val();
                self._showOption($(element).closest('li').next(), type);
            });

            if (callback) {
                callback();
            }
        });
    }

    /**
     * Render
     * @param {string} selectedElementId
     */
    render(selectedElementId) {
        const model = appManager.getActiveDesignEditor().getModel(),
            behaviors = model.getBehaviors(selectedElementId),
            $el = this._$list;

        this._selectedElementId = selectedElementId;

        if (selectedElementId) {
            if (behaviors) {
                async.forEach(behaviors, (behavior, callback) => {
                    this.createFromTemplate('/panel/property/behavior/behavior-item.html', {
                        before: $el.find('.li-add-button'),
                        callback: () => {
                            callback();
                        }
                    });
                }, () => {
                    this._refreshForm(() => {
                        $el.find('.behavior-event').each((index, element) => {
                            let $content = $(element).parent();
                            const behavior = behaviors[index];
                            $content.find('.behavior-event').val(behavior.event);
                            $content = $content.next();
                            $content.find('.behavior-type').val(behavior.type);
                            $content = $content.next();
                            Object.keys(behavior.options).forEach((key) => {
                                $content.find('.behavior-' + key).val(behavior.options[key]);
                                if (behavior.type === "page") {
                                  $content.find('.behavior-page-name').css('display', 'inline-block');
                                  $content.find('.behavior-animation-name').css('display', 'none');
                                } else {
                                  $content.find('.behavior-animation-name').css('display', 'inline-block');
                                  $content.find('.behavior-page-name').css('display', 'none');
                                }
                            });
                        });
                    });
                });
            }
        } else {
            $el.find('li:not(.li-add-button)').remove();
        }
    }

    /**
     * Show
     */
    show() {
        this._refreshForm(() => {
            this.$el.removeClass('fast-hide');
            this.$el.addClass('fast-show');
        });
    }

    /**
     * Hide
     */
    hide() {
        this.$el.addClass('fast-hide');
        this.$el.removeClass('fast-show');
    }

    _checkOptionValue(value) {
      return value === OPTION_PLACEHOLDER ? null : value;
    }
}

const BehaviorElement = document.registerElement('closet-behavior-element', Behavior);

export {BehaviorElement, Behavior};
