// @ts-nocheck
/* eslint-disable no-console */
'use babel';
import fs from 'fs-extra';
import async from 'async';
import path from 'path';
import $ from 'jquery';
import editor from '../editor';
import {EVENTS, eventEmitter} from '../events-emitter';
import {appManager} from '../app-manager';
import pathUtils from '../utils/path-utils';

const PROJECT_INFO_FILE_NAME = 'config.xml';

const forEach = [].forEach;

/**
 * Class responsible for manage project information like path config info.
 * Also responsible for create new project after confirm in project wizard.
 */
class ProjectManager {
	/**
     * Constructor
     */
	constructor() {
		this._projectInfoList = new Map();
	}

	/**
     * Init
     */
	initialize() {
		this._onDidChangePathList();
	}

	/**
     * Create lib from template
     * @param {string} name
     * @param {Function} callback
     */
	createLibFromTemplate(name, callback) {
		const projectPath = this.getActiveProjectInfo().projectPath,
			src = `${appManager.getAppPath().src  }/templates/${name}`,
			dst = `${projectPath  }/lib/${  name}`;

		console.log(`[GET] createLibFromTemplate: ${  src  } ...`);

		fs.exists(dst, (err, exists) => {
			// if file not exists then create for templates;
			if (!exists) {
				$.get(src, (content) => {
					console.log(`[GET-DONE] createLibFromTemplate: ${  name  } ...`);
					fs.writeFile(dst, content, () => {
						console.log(`[WRITE-DONE] createLibFromTemplate: ${  dst  } ...`);
						if (callback) {
							callback();
						}
					});
				}, 'text');
			} else {
				console.log(`File: ${  name  } already exists in destination.`);
			}
		});
	}

	/**
     * Parse config file
     * @param {string} pathName
     * @param {Function} callback
     * @private
     */
	_parseConfigFile(pathName, callback) {
		fs.readFile(path.join(pathName, PROJECT_INFO_FILE_NAME), 'utf8', (err, data) => {
			if (!err) {
				this._projectInfoList.set(pathName, this._convertXMLtoJSON($.parseXML(data)));
			} else if (err.code === 'ENOENT') {
				console.warn('There is no project information in', pathName);
			} else {
				throw err;
			}
			callback();
		});
	}

	/**
     * did change path list callback
     * @private
     */
	_onDidChangePathList() {
		this._projectInfoList.clear();
		async.forEach(editor.project.getPaths(), (pathName, callback) => {
			this._parseConfigFile(pathName, callback);
		}, () => {
			eventEmitter.emit(EVENTS.ProjectInfoLoaded, this._projectInfoList);
		});
	}

	/**
     * Open project in existing window
     * @param {string} newProjectPath
     * @private
     */
	_openProjectToExistingWindow(newProjectPath) {
		const paths = editor.project.getPaths(),
			panes = editor.workspace.getPanes();
		panes.forEach((pane) => {
			pane.destroy();
		});

		paths.forEach((pathToRemove) => {
			editor.project.removePath(pathToRemove);
		});
		editor.project.addPath(newProjectPath);
		// open editor with index.html
		editor.workspace.open(`${newProjectPath  }/index.html`);
	}

	/**
     * Convert XML to JSON
     * @param {Element} xml
     * @returns {{}}
     * @private
     */
	_convertXMLtoJSON(xml) {
		const data = {};
		forEach.call(xml.children, (node) => {
			if (node.children.length) {
				data[node.tagName] = this._convertXMLtoJSON(node);
			} else {
				data[node.tagName] = {};
			}
			data[node.tagName].attributes = {};
			forEach.call(node.attributes, (attribute) => {
				data[node.tagName].attributes[attribute.name] = attribute.value;
			});
			data[node.tagName].value = node.textContent;
		});
		return data;
	}

	/**
     * Return informations about current project
     * @param {Function} callback
     * @returns {{projectPath: string, profiles: string[], projectName: string, config: *}}
     */
	getActiveProjectInfo(callback) {
		const projectPath = pathUtils.createProjectPath(),
			profiles = ['wearable', 'mobile', 'tv'],
			config = this._projectInfoList.get(projectPath),
			projectName = '[project]',
			tauDir = pathUtils.joinPaths(projectPath, 'libs/tau');

		// in some cases function doesn't require profiles info and
		// callback is not set
		if (callback) {
			fs.exists(tauDir, (err, exists) => {
				if (exists) {
					fs.readdir(tauDir, (err, profileNames) => {
						callback({
							projectPath,
							profileNames,
							projectName,
							config
						});
					});
				} else {
					callback({
						projectPath,
						profiles,
						projectName,
						config
					});
				}
			});
		}

		return {
			projectPath,
			profiles,
			projectName,
			config
		};
	}

	/**
     * Get page names
     * @param {Function} callback
     */
	getPageNames(callback) {
		fs.readdir(pathUtils.createProjectPath('/'), (err, files) => {
			callback(files.filter(file => file.match(/\.html$/)));
		});
	}
}

const projectManager = new ProjectManager();

export {ProjectManager, projectManager};
