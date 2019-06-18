import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { removeMediaQueryConstraints } from '@/utils/iframe';


describe('utils', () => {
	describe('iframe', () => {
		it('should remove media query constraints for circle screens', () => {
			const mediaQueryAttr = 'media="all and (-tizen-geometric-shape: circle)"';
			const dom = new JSDOM(`
				<!DOCTYPE html>
				<head>
					<link
						${mediaQueryAttr}
						href="index.css"
					/>
				</head>
			`);
			const { document } = dom.window;

			removeMediaQueryConstraints(document, '/');

			expect(
				document.querySelectorAll('link').length
			).to.equal(1);

			expect(
				document.querySelectorAll(`link[${mediaQueryAttr}]`).length
			).to.equal(0);
		});
	});
});
