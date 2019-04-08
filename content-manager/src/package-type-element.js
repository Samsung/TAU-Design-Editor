'use babel';

import path from 'path';
import Package from './package';

class PackageTypeElement extends Package {
    constructor(name, options) {
        super(Package.TYPE.TYPE_ELEMENT, name, options);
    }

    active() {
        this.loadResources();
    }

    getModule() {
        var options = this.options,
            resources = options.resources,
            js = resources && resources.js;
        /**
         * @TODO this needs a fix for webpack!
        if (window.atom) {
            options = this.options;
            resources = options.resources;
            js = resources && resources.js;

            return require(path.join(this.options.path, js));
        }*/
        return require('closet-default-component-packages/type-elements/' + this.name + '/' + this.name);
    }

    loadResources() {
        var options = this.options,
            resources = options.resources,
            css = resources && resources.css,
            cssPath,
            link;

        if (css) {
            cssPath = path.join(options.path, css);

            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            document.head.appendChild(link);
        }

    }

}

export default PackageTypeElement;
