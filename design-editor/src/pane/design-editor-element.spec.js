import {DesignEditorElement} from './design-editor-element';

describe('DesignEditorElement', function () {
    it('should be a HTML Element', function () {
        expect(new DesignEditorElement() instanceof HTMLElement).toBe(true);
    });
});
