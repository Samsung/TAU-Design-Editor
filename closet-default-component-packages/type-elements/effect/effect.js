

var $ = require('jquery'),
    Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    TEMPLATE = [
        '{{#list}}',
        '<button class="closet-effect-type-btn" id="{{name}}" data-effect="{{name}}">{{label}}</button>',
        '{{/list}}'
    ].join('');

module.exports = dress.factory('closet-type-effect', {

    defaults: {
        list: []
    },

    events: {
        'click .closet-effect-type-btn': 'onClickEffectBtn'
    },

    onReady: function () {
        this._render();
    },

    onChanged: function () {
        this._render();
    },

    onClickEffectBtn: function (event) {
        var $target = $(event.target);

        this.setValue($target.data('effect'));

        this.$el.find('.selected').removeClass('selected');
        $target.addClass('selected');
    },

    _attributeTypeCasting: function (optionName, attributeValue) {
        if (optionName === 'list') {
            if (typeof attributeValue === 'string') {
                return attributeValue.split(/\s*,\s*/).map(function (val) {
                    return {name: val, label: val};
                });
            } else if (!$.isArray(attributeValue)) {
                return [{name: attributeValue, label: attributeValue}];
            }
        }

        return attributeValue;
    },

    _render: function () {
        this.$el.html(Mustache.render(TEMPLATE, this.options));
    }

}, TypeElement);
