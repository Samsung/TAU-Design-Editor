import atom from '../../atom/atom.test.config';

import {AnimationPreviewElement} from './animation-preview-element';

describe('AnimationPreviewElement', () => {
    it('constructor', (done) => {
        var element = new AnimationPreviewElement();
        expect(AnimationPreviewElement).toBeDefined();
        expect(element instanceof HTMLElement).toEqual(true);

        setTimeout(() => {
            expect(element.children.length).toEqual(1);
            done();
        }, 1000);
    });

    it('should correct show element', (done) => {
        var element = new AnimationPreviewElement();

        setTimeout(() => {
            element.show();
            setTimeout(() => {
                expect(element._visible).toBe(true);
                done();
            }, 1000);
        }, 1000);
    });
});

