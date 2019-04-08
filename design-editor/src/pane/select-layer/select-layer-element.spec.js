import atom from '../../atom/atom.test.config';

import {SelectLayerElement} from './select-layer-element';

describe('SelectLayerElement', function () {
    it('should be a HTML Element', function () {
        expect(new SelectLayerElement() instanceof HTMLElement).toBe(true);
    });
});
