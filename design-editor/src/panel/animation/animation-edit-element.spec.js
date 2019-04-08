import atom from '../../atom/atom.test.config';

import {AnimationEditElement} from './animation-edit-element';

describe('AnimationContainerElement', () => {
    it('constructor', (done) => {
        var element = new AnimationEditElement();
        expect(AnimationEditElement).toBeDefined();
        expect(element instanceof HTMLElement).toEqual(true);

        setTimeout(() => {
            expect(element.children.length).toEqual(2);
            done();
        }, 1000);
    });
});

