import { expect } from 'chai';
import '@/brackets/brackets-test-config';
import LibraryCreator from '@/system/libraries/library-creator';
import Library from '@/system/libraries/library';
import JSLibrary from '@/system/libraries/js-library';
import CSSLibrary from '@/system/libraries/css-library';
import JSONLibrary from '@/system/libraries/json-library';

describe('LibraryCreator', () => {
	describe('createLibrary', () => {
		it('creates a library', () => {
			const creator = new LibraryCreator();
			expect(creator.createLibrary(null, null, 'js')).to.be.an.instanceof(Library);
		});

		it('creates library type based on file extension', () => {
			const creator = new LibraryCreator();
			expect(creator.createLibrary('abc.js')).to.be.an.instanceof(JSLibrary);
		});

		it('creates library type based on element type if name not given', () => {
			const creator = new LibraryCreator();
			const style = document.createElement('style');
			expect(creator.createLibrary(null, style)).to.be.an.instanceof(CSSLibrary);
		});

		it('creates library type based on given type if neither file nor element given', () => {
			const creator = new LibraryCreator();
			expect(creator.createLibrary(null, null, 'json')).to.be.an.instanceof(JSONLibrary);
		});
	});

});
