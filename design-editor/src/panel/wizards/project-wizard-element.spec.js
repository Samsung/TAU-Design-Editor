import atom from '../../atom/atom.test.config';

import {ProjectWizardElement} from './project-wizard-element';

atom.init();

describe('ProjectWizardElement', () => {
    it('constructor', (done) => {
        var element = new ProjectWizardElement();
        expect(ProjectWizardElement).toBeDefined();
        expect(element instanceof HTMLElement).toEqual(true);

        setTimeout(() => {
            expect(element.children.length).toEqual(0);
            done();
        }, 1000);
    });
});

