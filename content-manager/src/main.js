'use babel';

import PackageRegister from './package-register';
import Package from './package';

class PackageList {
    constructor() {
        this._packages = {};
    }

    add(pack) {
        this._packages[pack.name] = pack;
    }

    getAll() {
        return Object.keys(this._packages).map(function (packageName) {
            return this._packages[packageName];
        }.bind(this));
    }

    get(packageName) {
        return this._packages[packageName];
    }

    /**
     * Return package which selector match to given element
     * @param {jQuery|HTMLElement} $element element to test
     * @returns {Object}
     */
    getPackageByElement($element) {
        var element = $element && typeof $element.get === 'function' ? $element.get(0) : $element,
            // list of packages
            packages = this._packages,
            selector = '',
            selectedPackage = null;
        if ($element) {
            Object.keys(packages).forEach((key) => {
                // take selector if is defined in component or label as tagname selecotor
                selector = packages[key].options.selector || packages[key].options.label;
                // we need check element.webkitMatchesSelector  because document element hasn't this method
                if (selector && element && element.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
                    // el elemetn match to package seletor we return package object
                    selectedPackage = packages[key];
                }
            });
        }
        return selectedPackage;
    }

    /**
     * Return one strich which is selector for all comonents
     * @returns {string}
     */
    getAllComponentsSelector() {
        var // list of packages
            packages = this._packages,
            // list of selectors
            selectors = [];
        Object.keys(packages).forEach((key) => {
            // push selector for current package
            selectors.push(packages[key].options.selector || packages[key].options.label);
        });
        // join selectors to one string
        return selectors.join(', ');
    }

    deactivateAll() {
        Object.keys(this._packages).forEach(function (packageName) {
            this._packages[packageName].deactivate();
        }.bind(this));
        this._packages = {};
    }
}

class PackageManager {
    constructor() {
        // this.Package = Package;
        this._packages = {};
        Object.keys(Package.TYPE).forEach(function (key) {
            this._packages[Package.TYPE[key]] = new PackageList();
        }.bind(this));
    }

    getRegister(editorPackageName) {
        return new PackageRegister(editorPackageName, {
            addPackage: function (type, pack) {
                pack.active();
                this._packages[type].add(pack);
            }.bind(this)
        });
    }

    getPackages(type) {
        return this._packages[type];
    }

    deactivatePackages() {
        Object.keys(this._packages).forEach(function (type) {
            this._packages[type].deactivateAll();
        }.bind(this));
    }
}

const packageManager = new PackageManager();
export {PackageManager, packageManager as default, Package, packageManager};
