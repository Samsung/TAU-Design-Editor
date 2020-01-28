'use babel';

import utils from '../../../utils/utils';


const brackets = utils.checkGlobalContext('brackets');

const classes = {
	BLOCK: 'block',
	DEFAULT_FILE_EXPLORER_WRAPPER: 'closet-file-picker',
	DEFAULT_FILE_EXPLORER_TEXT: 'closet-file-picker-text'
};

const BracketsProjectManager = brackets.getModule('project/ProjectManager');


/**
 * Get all directories from project
 * @param {function} onSuccess - success callback
 */
function getDirectories(onSuccess = () => { }) {
	BracketsProjectManager
		.getAllFiles()
		.then((files) => {
			const directories = files
				.map(file => file.parentPath)
				.filter((dir, index, array) => { // remove duplicates
					return array.indexOf(dir) == index;
				})
				.sort((a, b) => {
					const slashPattern = new RegExp(/\//, 'g');
					return (a.match(slashPattern) || []).length - (b.match(slashPattern) || []).length;
				});

			onSuccess(directories);

		});
}

/**
 *
 */
class FilePicker extends HTMLElement {
	/**
	 * Create callback
	 */
	constructor() {
		super();
		this.options = {
			path: ''
		};
		this._textElement = null;
	}

	/**
	 * attached callback
	 */
	attachedCallback() {
		this._setDefaultContents();
	}

	/**
	 * Set element
	 * @private
	 */
	connectedCallback() {
		this.classList.add(classes.BLOCK);
		this._selectPath = document.createElement('select');
		this._selectPath.addEventListener('change', () => {
			this._customPath.value = this._selectPath.value;
			this.path = this._customPath.value;
		});
		this._customPath = document.createElement('input');
		this._customPath.addEventListener('change', () => {
			this._selectPath.value = this._customPath.value;
			this.path = this._customPath.value;
		});


		getDirectories((directories) => {
			directories.forEach((dir) => {
				const option = document.createElement('option');
				option.value = dir;
				option.innerText = dir;
				this._selectPath.appendChild(option);
			});
		});

		// fill select
		this.appendChild(this._selectPath);
		this.appendChild(this._customPath);

		this.setPath(this.options.path);
	}


	/**
	 * set path
	 * @param {string} path
	 */
	setPath(path) {
		this.options.path = path;

		this._selectPath.value = path;
		this._customPath.value = path;
	}
}

customElements.define('closet-file-picker', FilePicker);

export {FilePicker};
