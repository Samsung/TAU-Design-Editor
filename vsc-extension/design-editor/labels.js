'use babel';

import path from 'path';

export function getDesignEditorRoot() {
    return '/design-editor';
}

export function getProjectRoot(projectId = '') {
    return path.join('/', projectId);
}

export default {
    getDesignEditorRoot,
    getProjectRoot
};
