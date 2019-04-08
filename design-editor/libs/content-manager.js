const packageManager = {
    Package: {
        TYPE: {

        }
    },
    getPackages() {
        return {
            getPackageByElement() {
                return {};
            }
        };
    },
    getRegister() {
        return {
            registerComponents() {
                return new Promise((resolve) => {
                    resolve();
                });
            }
        };
    },
    deactivatePackages() {

    }
};

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

export {packageManager, Package};
