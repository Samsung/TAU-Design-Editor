const INITIAL_COLOR = '#000';
class BackgroundGradient {
	constructor(doc) {
		this.doc = doc;
		this.elementsSelectors = {
			gradientType: '#backgroundGradientType',
			color1: '#gradientColor1',
			color2: '#gradientColor2'
		};
		this.gradientType = 'linear-gradient';
		this.patterns = {
			// gradient type eg. linear-gradient
			gradientType: /[\w-]+gradient/,
			// color in rgba or rgb string example: rgba(1, 2, 123)
			color: /rgba*\((\d{1,3}[, ]*){3}[\d.]*\)/,
			// path or url to file with image 
			filePath: /(?<=url\(["']?)([\w\/:\.]+)?(?=["']?\))/
		};
	}

	changeGradientElement() {
		this.outputElement = this.doc.querySelector('#gradientOut');
		this.getValues();
		this.outputElement.value = this.createGradientCSS(this.gradientType, this.color1, this.color2);
	}

	/**
	 * Parse css text using regexes to logical values
	 * @param {string} CSSRule string with css rule
	 */
	parseCSSText(CSSRule) {
		const colorPattern = this.patterns.color.exec(CSSRule);
		this.gradientType = this.patterns.gradientType.test(CSSRule) && this.patterns.gradientType.exec(CSSRule)[0];
		this.color1 = (colorPattern && colorPattern.length) && colorPattern[0];
		this.color2 = colorPattern && (colorPattern.length == 2) ? colorPattern[1] : INITIAL_COLOR;
		this.filePath = this.patterns.filePath.test(CSSRule) && this.patterns.filePath.exec(CSSRule)[0];
	}

	/**
	 * Creating css rule for color gradient
	 * @param {string} gradientType type of css gradient. Possible values:
	 * - linear-gradient
	 * - conic-gradient
	 * - radial-gradient etc.
	 * [MDN](@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients)
	 * @param {string} color1 first gradient color
	 * @param {string} color2 second gradient color
	 * @returns {string} creating CSS rule for basic gradient
	 */
	createGradientCSS() {
		return `${this.gradientType}(${this.color1}, ${this.color2})`;
	}

	createImageCSS(rule) {
		this.parseCSSText(rule)
		return this.patterns.filePath.test(rule) ? `url(${this.filePath})` : ''; 
	}


	/**
	 * Getting values from user inputs
	 */
	getValues() {
		this.gradientType = this.doc.querySelector(this.elementsSelectors.gradientType).value;
		this.color1 = this.doc.querySelector(this.elementsSelectors.color1).value;
		this.color2 = this.doc.querySelector(this.elementsSelectors.color2).value;
	}

}

export default BackgroundGradient;
