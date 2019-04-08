import {PreviewElement} from './preview-element';

describe('PreviewElement', function () {
    it('should be a HTML Element', function () {
        expect(new PreviewElement() instanceof HTMLElement).toBe(true);
    });
});
