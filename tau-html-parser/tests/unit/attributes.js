var linter = require('../../src/tau-linter-provider'),
    assert = require('chai').assert;

describe('attribute name validate - incorrect', function () {
    it('incorrect attribute name data-d', function () {
        var results = linter.lint('<body><div class="ui-popup" data-d="a"' +
      ' data-full-size="false"></div></body>');
        assert.equal(results.length, 1);
        assert.equal(results[0].message, "'data-d' is not valid TAU attribute for Popup component. Allowed TAU attributes: 'full-size, enable-popup-scroll, transition, position-to, dismissible, overlay, header, footer, content, overlay-class, close-link-selector, history'. We recommend not to use ui- prefix for classes.");
        assert.equal(results[0].pos.ch, 7);
        assert.equal(results[0].pos.line, 1);
        assert.equal(results[0].type, 'warning');
    });

    it('incorrect attribute value data-full-size', function () {
        var results = linter.lint('<body><div class="ui-popup"' +
      ' data-full-size="false1"></div></body>');
        assert.equal(results.length, 1);
        assert.equal(results[0].message, "'data-full-size' has not valid TAU" +
      ' attribute value for Popup component. Allowed TAU attribute' +
      ' values: true, false.');
        assert.equal(results[0].pos.ch, 7);
        assert.equal(results[0].pos.line, 1);
        assert.equal(results[0].type, 'warning');
    });
});
