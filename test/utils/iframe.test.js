import { expect } from 'chai';
import { removeMediaQueryConstraints } from '@/utils/iframe';

describe('utils', () => {
	describe('iframe', () => {
		it('should remove media query constraints for circle screens', () => {
			const mediaQueryAttr = 'media="all and (-tizen-geometric-shape: circle)"';
			const htmlText = (attributeValue) => `
				<!DOCTYPE html>
				<head>
					<link
						${attributeValue}
						href="index.css"
					/>
				</head>
			`;

			const
				htmlTextWithMediaQuery = htmlText(mediaQueryAttr),
				htmlTextWithoutMediaQuery = htmlText('');

			expect(
				removeMediaQueryConstraints(htmlTextWithMediaQuery)
			).to.equal(htmlTextWithoutMediaQuery);
		});
	});
});
