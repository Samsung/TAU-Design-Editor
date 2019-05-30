'use babel';

import path from 'path';


export function getDesignEditorRoot(projectId) {
	return path.join('/brackets', projectId);
}

export function getProjectRoot(projectId, addProjectId) {
	return (addProjectId) ? path.join('/projects', projectId) : '/projects';
}

export default {
	getDesignEditorRoot,
	getProjectRoot
};
