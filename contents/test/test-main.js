(function (window, $, QUnit) {


    var _document = window.document;

    if (!$('#qunit').length) {
        $(_document.body).append($('<div id="qunit"></div>'));
    }

    if (!$('#qunit-fixture').length) {
        $(_document.body).append($('<div id="qunit-fixture"></div>'));
    }

    QUnit.testDone(function () {
        QUnit.getFixtures().clean();
    });

}(window, window.jQuery, window.QUnit));
