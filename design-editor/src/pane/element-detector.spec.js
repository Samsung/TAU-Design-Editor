import {ElementDetector} from './element-detector';

describe('ElementDetector', function () {
    it('should always return the same instance', function () {
        const elementDetector = ElementDetector.getInstance();
        expect(ElementDetector.getInstance()).toBe(elementDetector);
    });
});
