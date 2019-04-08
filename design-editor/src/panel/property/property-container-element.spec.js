import {PropertyContainerElement} from './property-container-element';

describe('PropertyContainerElement', function () {
    it('should be a HTML Element', function () {
        expect(new PropertyContainerElement() instanceof HTMLElement).toBe(true);
    });
});
