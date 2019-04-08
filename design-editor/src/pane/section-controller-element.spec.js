import {SectionControllerElement} from './section-controller-element';

describe('SectionControllerElement', function () {
    it('should be a HTML Element', function () {
        expect(new SectionControllerElement() instanceof HTMLElement).toBe(true);
    });
});
