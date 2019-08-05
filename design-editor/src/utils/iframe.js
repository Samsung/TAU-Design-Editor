'use babel';

export function removeMediaQueryConstraints(htmlText) {
	return htmlText
		.replace(/media="all and \(-tizen-geometric-shape: circle\)"/g, '');
}

export function writeIframeContent(iframe, htmlTextContent) {
	iframe.open();
	iframe.write(htmlTextContent);
	iframe.close();
}

export function addDoctypeDeclaration(htmlText) {
	return `<!DOCTYPE html>\n ${htmlText}`;
}

export default {
	removeMediaQueryConstraints,
	writeIframeContent,
	addDoctypeDeclaration
};
