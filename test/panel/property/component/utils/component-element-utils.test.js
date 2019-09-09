import { expect } from 'chai';
import { _compareVersions } from '@/panel/property/component/utils/component-element-utils';

/* eslint-disable no-unused-expressions */

describe('component-element', () => {
	describe('_compareVersions', () => {
		it ('returns true for equal versions', () => {
			const required = '1.1';
			const current = '1.1';

			const versionMatch = _compareVersions(current, required);

			expect(versionMatch).to.be.true;
		});

		it ('returns true if current version is more precise', () => {
			const required = '1.1';
			const current = '1.1.1';

			const versionMatch = _compareVersions(current, required);

			expect(versionMatch).to.be.true;
		});

		it ('returns false if required version is more precise', () => {
			const required = '1.1.1';
			const current = '1.1';

			const versionMatch = _compareVersions(current, required);

			expect(versionMatch).to.be.false;
		});

		it ('returns false if required version is greater than current version', () => {
			const required = '1.2';
			const current = '1.1.1';

			const versionMatch = _compareVersions(current, required);

			expect(versionMatch).to.be.false;
		});

		it ('returns true if current version is greater than required', () => {
			const required = '1.1';
			const current = '2.1.1';

			const versionMatch = _compareVersions(current, required);

			expect(versionMatch).to.be.true;
		});

		it ('returns true if one of versions is undefined', () => {
			const v1 = '1.1';

			expect(_compareVersions(v1, undefined)).to.be.true;
			expect(_compareVersions(undefined, v1)).to.be.true;
			expect(_compareVersions(undefined, undefined)).to.be.true;
		});
	});
});
