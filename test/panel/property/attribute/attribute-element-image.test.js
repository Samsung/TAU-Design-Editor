const assert = require('assert');
const {
	AttributeImage
} = require('@/panel/property/attribute/attribute-element-image');

describe('AttributeImage', () => {
	describe('#indexOf()', () => {
		it('should return -1 when the value is not present', () => {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});
});
