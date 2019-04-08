import {PreviewToolbarElement} from './preview-toolbar-element';

describe('PreviewToolbarElement', function () {
    it('should be a HTML Element', function () {
        expect(new PreviewToolbarElement() instanceof HTMLElement).toBe(true);
    });
});
