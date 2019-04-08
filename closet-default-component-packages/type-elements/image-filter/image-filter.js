

var $ = require('jquery'),
    Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    FILTER_NORMAL = 'normal',


    // TODO Have to get image resource path.
    TEMPLATE = [
        '{{#list}}',
        '<button class="closet-image-filter-btn {{name}} {{#selected}}selected{{/selected}}" style="background-image: url({{imageSrc}})" data-preset-type="{{name}}">{{label}}</button>',
        '{{/list}}'
    ].join('');

module.exports = dress.factory('closet-type-image-filter', {

    defaults: {
        list: []
    },

    events: {
        'click .closet-image-filter-btn': 'onClickFilterBtn'
    },

    onReady: function () {
        this._render();
    },

    onChanged: function () {
        this._render();
    },

    onClickFilterBtn: function (event) {
        var $target = $(event.target);

        if ($target.hasClass('.selected')) {
            this.setValue(FILTER_NORMAL);
            $target.removeClass('selected');
        } else {
            this.setValue($target.data('preset-type'));
            this.$el.find('.selected').removeClass('selected');
            $target.addClass('selected');
        }
    },

    _attributeTypeCasting: function (optionName, attributeValue) {
        if (optionName === 'list') {
            if (typeof attributeValue === 'string') {
                return attributeValue.split(/\s*,\s*/).map(function (val) {
                    return {name: val, label: val};
                });
            } else if (!$.isArray(attributeValue)) {
                return [
                    {name: attributeValue, label: attributeValue}
                ];
            }
        }

        return attributeValue;
    },

    _render: function () {
        var options = this.options;
        options.list = options.list.map(function (item) {
            if (options.value === item.name) {
                item.selected = true;
            }
            return item;
        });

        this.$el.html(Mustache.render(TEMPLATE, options));
    }

}, TypeElement);
