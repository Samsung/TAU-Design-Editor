import {brackets} from './brackets-test-config';

import {bracketsEditor, BracketsEditor} from './brackets-editor';

describe('BracketsEditor', function () {
    it('should correct initialize', function () {
        expect(bracketsEditor instanceof BracketsEditor).toEqual(true);
    });
});
