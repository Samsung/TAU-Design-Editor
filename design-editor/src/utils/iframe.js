'use babel';

export function removeMediaQueryConstraints(htmlText) {
	return htmlText
		.replace(/media="all and \(-tizen-geometric-shape: circle\)"/g, '');
}
