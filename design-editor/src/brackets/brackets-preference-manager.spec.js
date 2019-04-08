import {brackets} from './brackets-test-config';

import {BracketsPreferenceManager} from './brackets-preference-manager';

describe('BracketsPreferenceManager', function () {
    it('should correct initialize', function () {
        BracketsPreferenceManager.initialize();
        expect(true).toBe(true);
    });
});
