import atom from '../atom/atom.test.config';

import {ConfigurationDesignAreaElement} from './configuration-design-area-element';

atom.init();

describe('ConfigurationDesignAreaElement', () => {
    it('constructor', (done) => {
        var element = new ConfigurationDesignAreaElement();
        expect(ConfigurationDesignAreaElement).toBeDefined();
        expect(element instanceof HTMLElement).toEqual(true);

        setTimeout(() => {
            expect(element.children.length).toEqual(7);
            done();
        }, 1000);
    });
});

