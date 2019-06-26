'use babel';

export const removeMediaQueryConstraints = htmlText => {
	return htmlText
		.replace(/media="all and \(-tizen-geometric-shape: circle\)"/g, '');
};
