

var $ = require('jquery'),
    Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    TEMPLATE = [
        '<select title="Select" class="closet-attr-select closet-attr-long-button">',
        '{{#list}}',
        '<option class="closet-attr-long-input" value="{{value}}" {{checkSelected}}> {{label}}</option>',
        '{{/list}}',
        '</select>'
    ].join('');

module.exports = dress.factory('closet-type-select', {

    defaults: {
        list: []
    },

    events: {
        'change .closet-attr-select' : 'onChangeSelect'
    },

    onReady: function () {
        var value = this.options.value,
            options = $.extend(this.options, {
                checkSelected: function () {
                    if (this.value === value) {
                        return 'selected';
                    }
                    return '';
                }
            });
        this.$el.html(Mustache.render(TEMPLATE, options));
    },

    onChangeSelect: function (event) {
        this.setValue(event.currentTarget.value);
    }

}, TypeElement);
