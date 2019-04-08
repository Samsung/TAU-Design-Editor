import atom from '../../atom/atom.test.config';

import {StateManager} from '../../system/state-manager';
import {AnimationContainerElement} from './animation-container-element';

describe('AnimationContainerElement', () => {
    it('constructor', (done) => {
        var element = new AnimationContainerElement();
        expect(AnimationContainerElement).toBeDefined();
        expect(element instanceof HTMLElement).toEqual(true);
        expect(element.classList.contains('closet-animation-container-hidden')).toEqual(true);

        setTimeout(() => {
            expect(element.children.length).toEqual(3);
            done();
        }, 1000);
    });

    it('should open correct', () => {
        var element = new AnimationContainerElement();

        StateManager.set('animation-container:visible', true);

        element.open();

        expect(element.classList.contains('closet-animation-container-hidden')).toEqual(false);
    });

    it('should toggle correct', () => {
        var element = new AnimationContainerElement();

        StateManager.set('animation-container:visible', true);

        element.toggle();

        expect(element.classList.contains('closet-animation-container-hidden')).toEqual(true);

        element.toggle();

        expect(element.classList.contains('closet-animation-container-hidden')).toEqual(false);
    });
});

