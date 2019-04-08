(function (window, $, QUnit) {


    var _document = window.document,
        instance,
        Fixtures;

    QUnit.extend(QUnit, {
        getFixtures: function () {
            return QUnit.Fixtures.getInstance();
        },

        fixuresConfig: QUnit.fixuresConfig || {
            fixtureId: 'qunit-fixture-test1'
        },

        Fixtures: {
            getInstance: function () {
                if (!instance) {
                    instance = new Fixtures();
                }
                return instance;
            }
        }
    });

    Fixtures = function () {
        var config = QUnit.fixuresConfig;

        this._fixtureId = config.fixtureId;
        this._$fixture = $('<div id="' + this._fixtureId + '"></div>').appendTo(_document.body);
    };

    Fixtures.prototype = {
        constructor: QUnit.Fixtures,

        set: function (html) {
            this._$fixture.html(html);
        },

        load: function (url) {

            $.ajax({
                url: url,
                async: false,
                cache: true
            }).done(this.set.bind(this));

        },

        append: function (html) {
            this._$fixture.append(html);
        },

        clean: function () {
            this._$fixture.html('');
        },

        find: function (selector) {
            return this._$fixture.find(selector);
        }
    };

}(window, window.jQuery, window.QUnit));
