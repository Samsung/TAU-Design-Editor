const path = require('path');

module.exports = {
	removeMediaQueryConstraints: (documentElement, basePath) => {
		const linkElementArray = documentElement
			.querySelectorAll('link[media="all and (-tizen-geometric-shape: circle)"]');

		linkElementArray.forEach(linkElement => {
			linkElement.removeAttribute('media');
			linkElement.setAttribute(
				'href',
				path.join(basePath, linkElement.getAttribute('href'))
			);
		});
	}
};
