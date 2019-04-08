/* global dress */

(function (QUnit, closet, sinon) {


    var TEST_ELEMENT_ID = 'test',

        _spieNames = ['created', 'attached', 'detached', 'attrchanged', 'changed', 'settestattr'],
        _spies = {},
        _clearLifecycleCallbacks = function () {
            _spieNames.forEach(function (name) {
                _spies[name].reset();
            });
        },

        dressTestElement;

    (function initializeTest() {
        _spieNames.forEach(function (name) {
            _spies[name] = sinon.spy();
        });

        dressTestElement = dress.factory('test1-1', {
            defaults: {
                'testAttr': false
            },
            onCreated: _spies['created'],
            onAttached: _spies['attached'],
            onDetached: _spies['detached'],
            onAttributeChanged: _spies['attrchanged'],
            onChanged: _spies['changed'],
            setTestAttr: function (value) {
                this.options.testAttr = value;
                _spies['settestattr']();
            }
        });
    }());

    QUnit.module('dress.Base', {
        beforeEach: function () {
            _clearLifecycleCallbacks();
        },
        afterEach: function () {
            _clearLifecycleCallbacks();
        }
    });

    QUnit.test('life cycle', function (assert) {
        var testElement;

        _clearLifecycleCallbacks();

    // create element.
        testElement = new dressTestElement();

        assert.ok(_spies['created'].calledOnce
            && !_spies['attached'].called
            && !_spies['detached'].called
            && !_spies['changed'].called, 'onCrated callback called');

    // append element to document.
        QUnit.getFixtures().append(testElement);

        assert.ok(_spies['created'].calledOnce
            && _spies['attached'].calledOnce
            && !_spies['detached'].called
            && !_spies['changed'].called, 'onAttached callback called');

    // change attribute of element.
        testElement.setAttribute('test-attr', 'true');

        assert.ok(_spies['created'].calledOnce
            && _spies['attached'].calledOnce
            && !_spies['detached'].called
            && _spies['changed'].calledOnce, 'onChanged callback called when added attribute');

    // change attribute of element.
        testElement.setAttribute('test-attr', 'false');

        assert.ok(_spies['created'].calledOnce
            && _spies['attached'].calledOnce
            && !_spies['detached'].called
            && _spies['changed'].calledTwice, 'onChanged callback called again when changed attribute');

    // remove elemnt
        testElement.parentNode.removeChild(testElement);

        assert.ok(_spies['created'].calledOnce
            && _spies['attached'].calledOnce
            && _spies['detached'].calledOnce
            && _spies['changed'].called, 'onDetached callback called again when changed attribute');

        _clearLifecycleCallbacks();

    // append again
        QUnit.getFixtures().append(testElement);
        assert.ok(!_spies['created'].called
            && _spies['attached'].calledOnce
            && !_spies['detached'].called
            && !_spies['changed'].called, 'onAttached callback called without onCreated callback call when append again element that already removed.');

    });


    QUnit.test('Component Options', function (assert) {
        var testElement;

    // create element.
        testElement = new dressTestElement();
        assert.ok(testElement.options.testAttr === false
            && testElement.testAttr === false, 'set default option');
        testElement.setAttribute('test-attr', 'true');
        assert.ok(testElement.options.testAttr === true
            && testElement.testAttr === true, 'change option by changing attribute');
        assert.ok(_spies['settestattr'].calledOnce, 'call setXXX method when changed attribute');
        testElement.testAttr = false;
        assert.ok(testElement.options.testAttr === false
        && testElement.testAttr === false, 'change option by changing property');
        assert.ok(_spies['settestattr'].calledTwice, 'call setXXX method when changed property');


    });

}(window.QUnit, window.dress, window.sinon));
