

var $ = require('jquery'),
    Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    TEMPLATE = [
        '<button class="btn closet-attr-string-list-add-button">Add Item</button>',
        '<ul class="closet-attr-string-list">',
        '{{#values}}',
        '<li class="closet-attr-string-list-item">',
        '<input class="closet-attr-string-list-item-input" type="text" value="{{.}}">',
        '<button class="btn closet-attr-string-list-remove-button">X</button>',
        '</li>',
        '{{/values}}',
        '</ul>'
    ].join('');

module.exports = dress.factory('closet-type-string-list', {

    events: {
        'click .closet-attr-string-list-add-button' : '_addItem',
        'change .closet-attr-string-list-item-input' : '_applyChanges',
        'click .closet-attr-string-list-remove-button' : '_removeItem'
    },

    onReady: function () {
        let options = this.options;

        if (typeof(options.value) === "string") {
            options.values = (options.value) ? options.value.split(',') : "";
        } else {
            options.values = options.value;
        }

        this.$el.html(Mustache.render(TEMPLATE, options));
    },

    _applyChanges : function () {
        var inputList = this.$el.find('.closet-attr-string-list-item-input'),
            contentsList = [],
            i,
            length;

        length = inputList.length;

        for (i = 0; i < length; i += 1) {
            contentsList.push(inputList[i].value);
        }

        this.setValue(contentsList);
        return this;
    },

    _addItem : function () {
        var $list = this.$el.find('.closet-attr-string-list'),
            $listItem = $(document.createElement('li')),
            $inputItem = $(document.createElement('input')),
            $removeButton = $(document.createElement('button'));

        $listItem.addClass('closet-attr-string-list-item');
        $inputItem.addClass('closet-attr-string-list-item-input').attr('type', 'text').val('');
        $removeButton.addClass('btn closet-attr-string-list-remove-button').text('X');
        $list.append($listItem);
        $listItem.append($inputItem);
        $listItem.append($removeButton);

        return this;
    },

    _removeItem : function (e) {
        $(e.target.parentElement).remove();
        this._applyChanges();
        return this;
    }

}, TypeElement);
