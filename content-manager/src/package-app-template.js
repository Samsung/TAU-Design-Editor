'use babel';

import Package from './package';

class PackageAppTemplate extends Package {
    constructor(name, options) {
        super(Package.TYPE.APP_TEMPLATE, name, options);
    }
}

export default PackageAppTemplate;
