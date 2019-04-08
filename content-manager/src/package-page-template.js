'use babel';

import Package from './package';

class PackagePageTemplate extends Package {
    constructor(name, options) {
        super(Package.TYPE.PAGE_TEMPLATE, name, options);
    }
}

export default PackagePageTemplate;
