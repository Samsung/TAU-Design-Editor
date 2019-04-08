import {AttributeStylesElement} from './attribute-element-styles';

describe('AttributeStylesElement', function () {
    it('should be a HTML Element', function () {
        expect(new AttributeStylesElement() instanceof HTMLElement).toBe(true);
    });
});
