

var Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    TEMPLATE = [
        '<input class="closet-attr-checkbox" title="single-checkbox" type="checkbox" {{#value}}checked{{/value}}>'
    ].join('');

module.exports = dress.factory('closet-type-checkbox', {

    defaults: {
        value: false
    },

    events: {
        'click .closet-attr-checkbox' : 'onClickCheckbox'
    },

    onReady: function () {
        this.$el.html(Mustache.render(TEMPLATE, this.options));
    },

    onClickEffectBtn: function () {
        this.setValue(this.querySelector('.closet-attr-checkbox').checked);
    }

}, TypeElement);
