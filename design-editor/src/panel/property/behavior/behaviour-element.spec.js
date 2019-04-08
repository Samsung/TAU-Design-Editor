import {BehaviorElement} from './behavior-element';

describe('BehaviorElement', function () {
    it('should be a HTML Element', function () {
        expect(new BehaviorElement() instanceof HTMLElement).toBe(true);
    });
});
