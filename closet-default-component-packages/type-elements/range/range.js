

var Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    TEMPLATE = [
        '<input class="closet-attr-range" type="range" min="{{min}}" max="{{max}}" step="{{step}}" defaultValue="{{value}}"/>'
    ].join('');

module.exports = dress.factory('closet-type-range', {
    defaults: {
        min: 0,
        max: 10,
        step: 1
    },

    events: {
        'change .closet-attr-range': 'onChange'
    },

    onReady: function () {
        this.$el.html(Mustache.render(TEMPLATE, this.options));
    },

    onChange: function (event) {
        this.setValue(event.target.value);
    }

}, TypeElement);
