'use babel';

import $ from 'jquery';

export default {
    workspace: {
        getActivePaneItem: function () {
            return;
        }
    },
    packages: {
        getLoadedPackage: function (packageName) {
            return {
                path: './node_modules/' + packageName + '/'
            };
        }
    },
    getJSON: function (path, callback) {
        try {
            $.ajax({
                dataType: 'json',
                url: path + '.json',
                success: function (config) {
                    callback(config);
                },
                async: true
            });
        } catch (e) {
            console.error(path + '.json');
        }
    }
};
