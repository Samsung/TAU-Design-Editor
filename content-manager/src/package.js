'use babel';

class Package {
    constructor(type, name, options) {
        this.type = type;
        this.name = name;
        this.options = options;
    }

    active() {
    }

    deactivate() {
    }

    isValid() {
    }
}

Package.TYPE = {
    'COMPONENT': 'component',
    'TYPE_ELEMENT': 'type-element',
    'APP_TEMPLATE' : 'app-template',
    'PAGE_TEMPLATE' : 'page-template'
};

export default Package;
