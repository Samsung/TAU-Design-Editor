'use babel';

export default {
    workspace: {
        getActivePaneItem: function () {
            return atom.workspace.getActivePaneItem();
        }
    },
    packages: {
        getLoadedPackage: function (packageName) {
            return atom.packages.getLoadedPackage(packageName);
        }
    },
    getJSON: function (path, callback) {
        /**
         * @TODO this needs to be fixed for webpack!
         *
        try {
            callback(require(path));
        } catch (e) {
            console.error(path + '.json');
        }
        */
    }
};
