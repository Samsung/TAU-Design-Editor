// @ts-nocheck
'use babel';

import path from 'path';
import utils from './utils';
import pathUtils from './path-utils';
import {appManager as AppManager} from '../app-manager';

export default {

	/**
	 * Set a source to background image or image
	 * @param {Event} event
	 * @param {string} changedAttribute name of changed attribute
	 * @param {string} elementId id of changed element
	 * @param {function} changeImageInfo function that changed info about element in sidebar
	 */
	setImageSource(event, changedAttribute, elementId, changeImageInfo) {
		[].slice.call(event.target.files).forEach(file => {
			const reader = new FileReader();
			reader.addEventListener('loadend', event => {
				if (event.target.readyState === FileReader.DONE) {
					const
						filePath = path.join('images', file.name),
						writePath = pathUtils.createProjectPath(filePath),
						readPath = pathUtils.createProjectPath(filePath, true);

					utils.checkGlobalContext('writeFile') (
						writePath,
						event.target.result, {
							encoding: 'binary'
						},
						() => {
							const getDEModel = AppManager.getActiveDesignEditor().getModel();
							if (changedAttribute === 'src') {
								getDEModel.updateAttribute(
									elementId,
									changedAttribute,
									readPath
								);
							} else {
								getDEModel.updateStyle(
									elementId,
									changedAttribute,
									`url("${readPath}")`
								);
							}
							changeImageInfo(readPath);
						}
					);
				}
			});
			reader.readAsBinaryString(file);
		});
	}

};
