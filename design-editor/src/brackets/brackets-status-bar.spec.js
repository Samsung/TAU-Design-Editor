import {brackets} from './brackets-test-config';

import {BracketsStatusBarElement} from './brackets-status-bar';

describe('BracketsStatusBarElement', function () {
    it('should correct initialize and add item', function () {
        var element = new BracketsStatusBarElement();
        element.addItem('<div>item</div>');
        expect(element.firstElementChild.innerHTML).toBe('item');
    });

});
