import { expect } from 'chai';
import { urlJoin } from '@/utils/utils';

describe('utils', () => {
	describe('urlJoin', () => {
		it('should join all URL parts', () => {
			const fullURL = urlJoin('http://test.com', 'subpage1', 'subpage2');

			expect(fullURL).to.equal('http://test.com/subpage1/subpage2');
		});
	});
});
