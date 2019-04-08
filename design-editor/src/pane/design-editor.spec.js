import {Model} from './design-editor';

describe('Model', function () {
    it('should correct generate element id', function () {
        const model = new Model(),
            element = document.createElement('div');

        model._DOM = document;

        model._generateElementId(element);

        expect(element.id).toBe('element-1');

        model._generateElementId(element);

        expect(element.id).toBe('element-1');
    });
});
