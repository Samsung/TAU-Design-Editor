/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {isAbsolute} from 'path';
import '@/brackets/brackets-test-config';
import JSLibrary from '@/system/libraries/js-library';

describe('JSLibrary', () => {

	beforeEach(() => {
		window.globalData = {
			projectId: '5d1f21bba9815c6a27c7db0d'
		};
	});

	describe('createHTMLElement', () => {
		it('creates HTMLScriptElement', () => {
			const jsLibrary = new JSLibrary();

			expect(jsLibrary.createHTMLElement()).to.be.an.instanceof(HTMLScriptElement);
		});

		it('doesn\'t create new Element if the one given in constructor', () => {
			const script = document.createElement('script');
			const jsLibrary = new JSLibrary(null, script);

			expect(jsLibrary.createHTMLElement()).to.be.equal(script);
		});

		it('creates Element with type application/json', () => {
			const jsLibrary = new JSLibrary();

			expect(jsLibrary.createHTMLElement().type).to.be.equal('application/javascript');
		});

		it('with given name creates script[src] element', () => {
			const jsLibrary = new JSLibrary('abc.js');

			expect(jsLibrary.createHTMLElement('aaa').getAttribute('src')).to.exist;
		});

		it('with given name creates script[src] element with relative path', () => {
			const jsLibrary = new JSLibrary('abc.js');
			const elementPath = jsLibrary.createHTMLElement('aaa').getAttribute('src');

			expect(isAbsolute(elementPath)).to.be.false;
		});
	});

	describe('getSelector', () => {
		it('creates selector that matches created element', () => {
			const jsLibrary = new JSLibrary('abc.js');
			const element = jsLibrary.createHTMLElement('aaa');

			expect(element.matches(jsLibrary.getSelector())).to.be.true;
		});

		it('creates selector that doesn\'t match element with similar name', () => {
			const jsLibrary1 = new JSLibrary('abc.js');
			const element1 = jsLibrary1.createHTMLElement('aaa');
			const jsLibrary2 = new JSLibrary('ddd-abc.js');

			jsLibrary2.createHTMLElement('aaa');
			expect(element1.matches(jsLibrary2.getSelector())).to.be.false;
		});
	});
});
