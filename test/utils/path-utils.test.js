import { expect } from 'chai';
import { joinPaths } from '@/utils/path-utils';

describe('path-utils', () => {
	describe('joinPaths', () => {
		it('should join all specified paths', () => {
			const joinedPaths = joinPaths('/root', 'sub1', 'sub2');

			expect(joinedPaths).to.equal('/root/sub1/sub2');
		});
	});
});
