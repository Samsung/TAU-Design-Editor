

var Mustache = require('mustache'),
    dress = require('dress'),
    TypeElement = require('../type-element'),

    TEMPLATE = [
        '<input type="color" value="{{value}}" class="closet-colorpicker" />'
    ].join('');

module.exports = dress.factory('closet-type-color', {

    events: {
        'change .closet-colorpicker': 'onChangeColor'
    },

    onReady: function () {
        this.$el.html(Mustache.render(TEMPLATE, this.options));
    },

    onChangeColor: function (event) {
        this.setValue(event.target.value);
    }

}, TypeElement);
