

var Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    TEMPLATE = [
        '<input class="closet-type-number closet-type-number-input" type="number" value="{{value}}">'
    ].join('');

module.exports = dress.factory('closet-type-number', {

    defaults: {
        value: 0
    },

    events: {
        'change .closet-type-number' : 'onChangeInput'
    },

    onReady: function () {
        this.options.value = window.parseInt(this.options.value);
        this.$el.html(Mustache.render(TEMPLATE, this.options));
    },

    onChangeInput: function (event) {
        var value = event.target.value;
        this.setValue(value);
    }

}, TypeElement);
