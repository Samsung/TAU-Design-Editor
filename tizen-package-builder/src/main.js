"use strict";

const os = require('os'),
    fs = require('fs-extra'),
    path = require('path'),
    xml2js = require('xml2js'),
    ZipDir = require('zip-dir'),
    WidgetSignature = require('./signature'),
    SigConstants = require('./signature-constants');

const OS_TEMP_PATH = os.tmpdir() + path.sep;
const IGNORED_FILES = ['.build', '.sign', '.settings', '.project', '.tproject'];
const CERT_PROPERTIES = ['privateKey', 'userCertificate', 'caCertificate'];

/**
 * Removes dir with all it's content
 * @param {string} dir directory to cleanup
 */
function cleanUp(dir) {
    fs.removeSync(dir);
}

/**
 * Creates temporary directory and returns path to it
 * @returns {string}
 */
function makeTemporaryDir() {
    var tempPath = '';
    // For compatibility with node v5 up
    if (typeof fs.mkdtempSync === 'function') {
        tempPath = fs.mkdtempSync(OS_TEMP_PATH);
    } else {
        tempPath = OS_TEMP_PATH + 'tizen-app-' + Math.ceil(Math.random() * 1000) + Date.now() + path.sep;
        fs.mkdirSync(tempPath);
    }

    return tempPath;
}

/**
 *
 * @param {array} arrayOfProps
 * @param {object} target
 * @returns {boolean}
 */
function propsAreSet(arrayOfProps, target) {
    var ownPropFn = target.hasOwnProperty.bind(target);
    return arrayOfProps.every(ownPropFn);
}

/**
 * Tizen Package
 * Allows to build Tizen application packages (.wgt) using only node.js and few common npm packages.
 * @author "Piotr Karny <p.karny@samsung.com>"
 */
class TizenPackage {

    /**
     * Parses config.xml file and calls callback(err, resultObject) function
     * with one or two arguments.
     * In case of success resultObject will contain name, packageId and
     * applicationId retrived from given config.xml file.
     *
     * @param configPath
     * @param callback
     */
    static parseConfig(configPath, callback) {
        var parser = new xml2js.Parser();

        fs.readFile(configPath, function (err, data) {
            if (err) {
                callback(err);
                return;
            }

            parser.parseString(data, function (parseErr, result) {
                var widget = null;
                if (parseErr) {
                    callback(parseErr);
                    return;
                }

                widget = result.widget;

                callback(null, {
                    name: widget.name[0],
                    packageId: widget['tizen:application'][0]['$'].package,
                    applicationId: widget['tizen:application'][0]['$'].id
                });
            });
        });
    }

    /**
     * Checks if given path exists and contains a config.xml file
     * @param dir
     * @param callback
     */
    static verifyProjectDir(dir, callback) {
        // Append last path.sep
        dir += dir[dir.length - 1] !== path.sep ? path.sep : '';

        fs.stat(dir, (err, stat) => {
            if (err) {
                callback(err);
                return;
            }

            if (stat.isDirectory()) {
                fs.stat(dir + 'config.xml', (fileErr, fileStat) => {
                    if (fileErr) {
                        callback('config.xml file is missing');
                    } else {
                        callback(null);
                    }
                });
            } else {
                callback('Given path must be a directory');
            }
        });
    }

    /**
     *
     * @param {string} source
     * @param {string} destination
     * @param {object} certificates
     * @param {object} certificates.author
     * @param {object} certificates.distributor
     * @param {function} buildCallback
     */
    static build(source, destination, certificates, buildCallback) {
        const sourceAbsolute = path.resolve(source);

        if (!certificates.author || !certificates.distributor) {
            buildCallback('Certificates for .author or .distributor were not provided');
            return;
        }

        if (!propsAreSet(CERT_PROPERTIES, certificates.author)) {
            buildCallback('certificates.author argument is missing one of [' + CERT_PROPERTIES.join(', ') + '] properties');
            return;
        }

        if (!propsAreSet(CERT_PROPERTIES, certificates.distributor)) {
            buildCallback('certificates.distributor argument is missing one of [' + CERT_PROPERTIES.join(', ') + '] properties');
            return;
        }

        destination += destination[destination.length - 1] !== path.sep ? path.sep : '';

        TizenPackage.verifyProjectDir(source, (projectDirErr) => {
            if (projectDirErr) {
                buildCallback(projectDirErr);
                return;
            }

            const tempPath = makeTemporaryDir();

            // Do a backup copy of all project files
            fs.copy(source, tempPath, {
                preserveTimestamps: true,
                dereference: true,
                filter: function (filename) {
                    filename = filename.replace(sourceAbsolute + path.sep, '');
                    return IGNORED_FILES.indexOf(filename) < 0 && !filename.endsWith('.wgt');
                }
            }, (copyErr) => {
                if (copyErr) {
                    cleanUp(tempPath);
                    buildCallback('Copy of source files failed! ' + copyErr);
                    return;
                }

                // Parse config.xml to get application data
                TizenPackage.parseConfig(tempPath + 'config.xml', (configError, applicationConfig) => {
                    var tempPackageFilename = applicationConfig.applicationId + '.wgt',
                        tempPackagePath = tempPath + tempPackageFilename,
                        applicationFiles = [];

                    if (configError) {
                        buildCallback(configError);
                        return;
                    }

                    fs.walk(tempPath).on('data', function (item) {
                        if (item.stats.isFile()) {
                            applicationFiles.push({
                                absolutePath: item.path,
                                path: item.path.replace(tempPath, ''),
                                sha256: null
                            });
                        }
                    }).on('end', () => {

                        WidgetSignature.authorSignature(applicationFiles, {
                            privateKey: certificates.author.privateKey,
                            userCertificate: certificates.author.userCertificate,
                            caCertificate: certificates.author.caCertificate
                        }, (signatureError, authorSignature) => {
                            var authorSignaturePath = tempPath + SigConstants.AUTHOR_SIGNATURE_FILENAME;

                            if (signatureError) {
                                buildCallback(signatureError);
                                return;
                            }

                            fs.writeFileSync(authorSignaturePath, authorSignature);

                            applicationFiles.unshift({
                                absolutePath: authorSignaturePath,
                                path: SigConstants.AUTHOR_SIGNATURE_FILENAME,
                                sha256: null
                            });

                            WidgetSignature.distributorSignature(applicationFiles, {
                                privateKey: certificates.distributor.privateKey,
                                userCertificate: certificates.distributor.userCertificate,
                                caCertificate: certificates.distributor.caCertificate
                            }, (distributorSignatureError, distributorSignature) => {
                                var distributorSignaturePath = tempPath + SigConstants.DISTRIBUTOR_SIGNATURE_FILENAME;

                                if (distributorSignatureError) {
                                    buildCallback(distributorSignatureError);
                                    return;
                                }

                                fs.writeFileSync(distributorSignaturePath, distributorSignature);

                                ZipDir(tempPath, {
                                    saveTo: tempPackagePath
                                }, (zipError) => {
                                    if (zipError) {
                                        cleanUp(tempPath);
                                        buildCallback('Something went wrong during compressing project directory' + zipError);
                                        return;
                                    }

                                    // Finally copy the package to final destination
                                    fs.copy(tempPackagePath, destination + tempPackageFilename, function (finalCopyErr) {
                                        cleanUp(tempPath);

                                        if (finalCopyErr) {
                                            buildCallback(finalCopyErr);
                                            return;
                                        }

                                        buildCallback(null, destination + tempPackageFilename);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}

module.exports = TizenPackage;
