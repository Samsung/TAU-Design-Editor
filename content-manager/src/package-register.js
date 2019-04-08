'use babel';

import path from 'path';
import Package from './package';
import ComponentPackage from './package-component';
import TypeElementPackage from './package-type-element';
import AppTemplatePackage from './package-app-template';
import PageTemplatePackage from './package-page-template';
import editor from './editor';

class PackageRegister {

    constructor(packageName, packageHandler) {
        this.packageHandler = packageHandler;
        this.editorPackage = editor.packages.getLoadedPackage(packageName);
        if (!this.editorPackage) {
            throw new Error(packageName + 'package is not available' +
              ' exception.');
        }
    }

    registerComponents(componentMetas, componentHandler) {
        var self = this,
            promises = [];

        Object.keys(componentMetas).forEach(function (componentName) {
            promises.push(self.registerComponent(componentName, componentMetas[componentName], componentHandler));
        });
        return Promise.all(promises);
    }

    registerComponent(componentName, componentPath, componentHandler) {
        var self = this;

        return new Promise(function (resolve, reject) {
            self._loadPackageConfigFile(componentPath, function (options) {
                options.handler = componentHandler;
                self.packageHandler.addPackage(Package.TYPE.COMPONENT, new ComponentPackage(componentName, options));
                resolve(self);
            });
        });
    }

    registerTypeElements(typeElementMetas) {
        var self = this,
            promises = [];

        Object.keys(typeElementMetas).forEach(function (typeElementName) {
            promises.push(self.registerTypeElement(typeElementName, typeElementMetas[typeElementName]));
        });
        return Promise.all(promises);
    }

    registerTypeElement(typeElementName, typeElementModulePath) {
        var self = this;

        return new Promise(function (resolve, reject) {
            self._loadPackageConfigFile(typeElementModulePath, function (options) {
                self.packageHandler.addPackage(Package.TYPE.TYPE_ELEMENT, new TypeElementPackage(typeElementName, options));
                resolve(self);
            });
        });
    }

    registerAppTemplates(appTemplateMetaData) {
        var self = this,
            promises = [];

        Object.keys(appTemplateMetaData).forEach(function (templateName) {
            promises.push(self.registerAppTemplate(templateName, appTemplateMetaData[templateName]));
        });
        return Promise.all(promises);
    }

    registerAppTemplate(templateName, templatePath) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self._loadPackageConfigFile(templatePath, function (options) {
                self.packageHandler.addPackage(Package.TYPE.APP_TEMPLATE, new AppTemplatePackage(templateName, options));
                resolve(self);
            });
        });
    }

    registerPageTemplates(pageTemplateMetaData) {
        var self = this,
            promises = [];

        Object.keys(pageTemplateMetaData).forEach(function (templateName) {
            promises.push(self.registerPageTemplate(templateName, pageTemplateMetaData[templateName]));
        });
        return Promise.all(promises);
    }

    registerPageTemplate(templateName, templatePath) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self._loadPackageConfigFile(templatePath, function (options) {
                self.packageHandler.addPackage(Package.TYPE.PAGE_TEMPLATE, new PageTemplatePackage(templateName, options));
                resolve(self);
            });
        });
    }

    _loadPackageConfigFile(basePath, callback) {
        var packagePath = this.editorPackage.path,
            absolutePath = path.join(this.editorPackage.path, basePath),
            metaPath = path.join(absolutePath, 'package'),
            config;

        editor.getJSON(metaPath, function (_config) {
            _config.path = absolutePath;
            if (basePath.indexOf('app-template') > -1) {
                _config.packagePath = packagePath;
            }
            callback(_config);
        });

        return config;
    }
}

export default PackageRegister;
