import JSLibrary from './js-library';

class JSONLibrary extends JSLibrary {
	constructor(filename, element) {
		super(filename, element);
		this.type = 'application/json';
	}
}

export default JSONLibrary;
