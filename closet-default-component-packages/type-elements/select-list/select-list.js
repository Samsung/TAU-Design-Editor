var $ = require('jquery'),
    Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    OPTIONS_TEMPLATE = [
        '{{#list}}',
        '<option value="{{value}}"> {{label}}</option>',
        '{{/list}}'
    ].join(''),

    TEMPLATE = [
        '<button class="btn closet-attr-select-list-add-button">Add Item</button>',
        '<ul class="closet-attr-select-list">',
        '{{#values}}',
        '<li class="closet-attr-select-list-item">',
        '<select title="Select" class="closet-attr-select">{{{.}}}</select>',
        '<button class="btn closet-attr-select-list-remove-button">X</button>',
        '</li>',
        '{{/values}}',
        '</ul>'
    ].join('');

module.exports = dress.factory('closet-type-select-list', {

    events: {
        'click .closet-attr-select-list-add-button' : '_addItem',
        'change .closet-attr-select' : '_applyChanges',
        'click .closet-attr-select-list-remove-button' : '_removeItem'
    },

    onReady: function () {
        var options = this.options;

        if (options) {
            options.value = options.value || '';
            options.values = options.value.split(/\s/mg).map(function (value) {
                return options.list.reduce(function (prev, item) {
                    return prev + '<option value="' + item.value + '" ' +
                        (item.value === value ? 'selected' : '') + '> ' +
                        item.label + '</option>';
                }, '');
            });
            this.$el.html(Mustache.render(TEMPLATE, options));    
        }
    },

    _applyChanges: function () {
        var selectList = this.$el.find('.closet-attr-select'),
            contentsList = {},
            i,
            length;

        length = selectList.length;

        for (i = 0; i < length; i += 1) {
            contentsList[selectList[i].value] = true;
        }

        this.setValue(Object.keys(contentsList).join(' '));
        return this;
    },

    _addItem: function () {
        var $list = this.$el.find('.closet-attr-select-list'),
            $listItem = $(document.createElement('li')),
            $select = $(document.createElement('select')),
            $removeButton = $(document.createElement('button'));

        $listItem.addClass('closet-attr-select-list-item');
        $select.addClass('closet-attr-select');
        $select.html(Mustache.render(OPTIONS_TEMPLATE, this.options));
        $removeButton.addClass('btn closet-attr-select-list-remove-button').text('X');
        $list.append($listItem);
        $listItem.append($select);
        $listItem.append($removeButton);

        return this;
    },

    _removeItem: function (e) {
        $(e.target.parentElement).remove();
        this._applyChanges();
        return this;
    }

}, TypeElement);
