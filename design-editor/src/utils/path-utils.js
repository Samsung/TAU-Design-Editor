// @ts-nocheck
'use babel';

import path from 'path';
import labels from 'labels';
import utils from './utils';

const origin = window.location.origin || '';


/**
 * Creates URL for file located in project directory
 * @param {string} filePath relative path to file
 * @returns {URL} url to file
 */
export const createProjectURL = (filePath = '', addProjectId) => {
	const projectPath = this.createProjectPath(filePath, addProjectId);
	return new URL(projectPath, origin);
};

/**
 * Returns full path for resource specified by filePath
 * @param {string} filePath - path of the resource
 * @param {boolean} addProjectId - add id after 'projects' in path
 * (for paths resolved by WATT)
 * @returns {string} full path for resource specified by filePath
 */
export const createProjectPath = (filePath = '', addProjectId) => {
	const { projectId } = utils.checkGlobalContext('globalData');
	return this.joinPaths(labels.getProjectRoot(projectId, addProjectId), filePath);
};

/**
 * Smart joining paths - base endpoint from server and relative path to file
 * If one folder is end of first and beginning of second path
 * then this function can prevent duplication of it.
 * @param  {string} basePath - path as endpoint to file
 * @param  {string} additionPath - relative path to file
 * @returns {string} joined path
 */
export const joinPaths = (basePath, ...additionalPaths) => {
	const pathToArr = item => item.split(path.sep).filter(item => item !== '');

	const [basePathArr, additionalPathsArr] = [
		basePath,
		path.join(...additionalPaths)
	].map(pathToArr);

	return (basePathArr[basePathArr.length - 1] === additionalPathsArr[0]) ?
		path.join('/', ...basePathArr, '..', ...additionalPathsArr) :
		path.join('/', ...basePathArr, ...additionalPathsArr);
};


/**
 * Gets filename from path
 * @param  {string} pathName
 * @param {boolean} ext  true if returned filename should have extension
 * @returns {string} filename with extension
 */
export const getFileName = (pathName, ext) => {
	return ext ? path.basename(pathName) : path.basename(pathName, path.extname(pathName));
};
