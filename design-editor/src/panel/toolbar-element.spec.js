import {ToolbarElement} from './toolbar-element';

describe('ToolbarElement', function () {
    it('should be a HTML Element', function () {
        expect(new ToolbarElement() instanceof HTMLElement).toBe(true);
    });
});
