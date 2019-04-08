

var dress = require('dress');

module.exports = dress.factory('closet-type', {

    defaults: {
        value: ''
    },

    setValue: function (value) {
        this.options.value = value;
        this.trigger('change', value);
    }

});
