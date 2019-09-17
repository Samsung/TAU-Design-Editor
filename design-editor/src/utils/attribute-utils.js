// @ts-nocheck
'use babel';

import path from 'path';
import utils from './utils';
import pathUtils from './path-utils';
import {appManager as AppManager} from '../app-manager';

export default {
	/**
	 * Write a loaded file which was selected by input
	 * @param {Event} event event of input which was selected
	 * @param {function} callback function that changed info about element in sidebar
	 */
	writeMediaFileWhenIsLoaded(event, callback) {
		const filesToUpdate = event.target.files;
		[].slice.call(filesToUpdate).forEach(file => {
			const reader = new FileReader();
			reader.addEventListener('loadend', event => {
				if (event.target.readyState === FileReader.DONE) {
					const
						filePath = path.join(this.checkFileTypeByMime(filesToUpdate[0]['type']), file.name),
						writePath = pathUtils.createProjectPath(filePath);

					utils.checkGlobalContext('writeFile') (
						writePath,
						event.target.result, {
							encoding: 'binary'
						},
						() => {
							callback(filePath);
						}
					);
				}
			});
			reader.readAsBinaryString(file);
		});
	},
	/**
	 * Set a source to background image or image
	 * @param {string} filePath path of the file which is changed
	 * @param {string} changedAttribute name of changed attribute
	 * @param {string} elementId id of changed element
	 * @param {function} changeAttributeInfo function that changed info about element in sidebar
	 */
	setImageSource(filePath, changedAttribute, elementId, changeAttributeInfo) {
		const getDEModel = AppManager.getActiveDesignEditor().getModel();
		if (changedAttribute === 'src') {
			getDEModel.updateAttribute(
				elementId,
				changedAttribute,
				filePath
			);
		} else {
			getDEModel.updateStyle(
				elementId,
				changedAttribute,
				`url("${filePath}")`
			);
		}
		changeAttributeInfo(filePath);
	},

	/**
	 * Check type of the file based on mime type
	 * @param {string} type mime type of the file
	 */
	checkFileTypeByMime(type) {
		const typeOfFile = type.substr(0, type.indexOf('/'));
		switch (typeOfFile) {
		case 'audio':
		case 'video':
			return typeOfFile;
		case 'image':
			return 'images';
		}
	},

	copyToImagesForCoverFlow(event, count) {
		for (let i = 0; i < count; i++) {
			[].slice.call(event.target.files).forEach(file => {
				const reader = new FileReader();
				reader.addEventListener('loadend', event => {
					if (event.target.readyState === FileReader.DONE) {
						const
							filePath = path.join('images', file.name),
							writePath = pathUtils.createProjectPath(filePath);

						utils.checkGlobalContext('writeFile') (
							writePath,
							event.target.result, {
								encoding: 'binary'
							},
							() => {
							}
						);
					}
				});
				reader.readAsBinaryString(file);
			});
		}
	},

	/**
	 * Set a source to interactive model
	 * @param {Event} event
	 * @param {string} targetPath path of target directory
	 * @param {string} elementId id of changed element
	 * @param {function} changeModelInfo function that changed info about element in sidebar
	 */
	setModelSource(event, targetPath, elementId, changeModelInfo) {
		[].slice.call(event.target.files).forEach(file => {
			const reader = new FileReader();
			reader.addEventListener('loadend', event => {
				if (event.target.readyState === FileReader.DONE) {
					const
						filePath = path.join(targetPath, file.name),
						writePath = pathUtils.createProjectPath(filePath);

					utils.checkGlobalContext('writeFile') (
						writePath,
						event.target.result, {
							encoding: 'binary'
						},
						() => {
							const ext = file.name.match(/.(\w*)$/)[1];
							if (ext === undefined) {
								return;
							}

							const getDEModel = AppManager.getActiveDesignEditor().getModel();
							if (['obj', 'fbx', 'gltf'].indexOf(ext) !== -1) {
								getDEModel.updateAttribute(elementId, 'src', filePath);
								// Remove default background color when selecting model file
								getDEModel.updateStyle(elementId, 'background', 'none');

								if (ext !== 'obj') {
									getDEModel.removeAttribute(elementId,'mtl');
								}
							} else if (ext === 'mtl') {
								getDEModel.updateAttribute(elementId, 'mtl', filePath);
							}

							changeModelInfo(filePath, ext);
						}
					);
				}
			});
			reader.readAsBinaryString(file);
		});
	}
};
