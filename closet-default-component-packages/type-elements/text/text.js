

var Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    TEMPLATE = [
        '<input type="text" value="{{value}}" class="closet-attr-long-input closet-attr-text native-key-bindings">'
    ].join('');

module.exports = dress.factory('closet-type-text', {

    events: {
        'keyup .closet-attr-text': 'onChangeText'
    },

    onReady: function () {
        this.$el.html(Mustache.render(TEMPLATE, this.options));
    },

    onChangeText: function (event) {
        this.setValue(event.target.value);
    },

    onAttributeChanged : function (attrName, oldValue, newValue) {
        if (attrName === 'value') {
            this.firstElementChild.value = newValue;
        }
    }
}, TypeElement);
