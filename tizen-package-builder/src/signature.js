const fs = require('fs-extra'),
    async = require('async'),
    path = require('path'),
    SignedXml = require('xml-crypto').SignedXml,
    Dom = require('xmldom').DOMParser,
    crypto = require('crypto');

const SigConstants = require('./signature-constants');

/**
 *
 * @param file
 * @returns {*|boolean}
 */
function everyContainsAbsolutePath(file) {
    return file && !!file.absolutePath;
}


/**
 *
 * @param certificate
 * @returns {XML|string}
 */
function removeCertificateSeparators(certificate) {
    return certificate.replace('-----BEGIN CERTIFICATE-----\n', '').replace('-----END CERTIFICATE-----', '');
}

/**
 *
 * @param file
 * @returns {XML|string}
 */
function prepareSignedInfoReference(file) {
    return SigConstants.REFERENCE_TEMPLATE
    .replace('{$1}', encodeURIComponent(file.path))
    .replace('{$2}', file.sha256);
}

/**
 * Calculates SHA256 hashes for file.
 * On finishCallback the currentFile will contain a property sha256 set to value of that hash.
 * @param {object} currentFile
 * @param {number} currentIndex
 * @param {function} finishCallback
 */
function calculateHashOfFile(currentFile, currentIndex, finishCallback) {
    var hash = null,
        input = null;

    hash = crypto.createHash('sha256');
    input = fs.createReadStream(currentFile.absolutePath);

    input.on('readable', () => {
        var data = input.read();
        if (data) {
            hash.update(data);
        } else {
            currentFile.sha256 = hash.digest('base64');
            finishCallback(null);
        }
    });
}

/**
 *
 * @param target
 * @param fileList
 * @param certificates
 * @param callback
 */
function generateSignature(target, fileList, certificates, callback) {
    var signedXml = null,
        signatureString = '',
        signedInfoString = '',
        prefix = target.toLowerCase() === 'distributor' ? 'DISTRIBUTOR' : 'AUTHOR';

    if (typeof callback !== 'function') {
        throw Error('Missing callback function, this method won\'t do anything');
    }

    if (!Array.isArray(fileList)) {
        callback('Given fileList is not an array');
        return;
    }

    if (!fileList.every(everyContainsAbsolutePath)) {
        callback('Every element of given file list should contain a .absolutePath property!');
        return;
    }

    if (!certificates || !certificates.privateKey || !certificates.userCertificate || !certificates.caCertificate) {
        callback('Missing one or more certificate! .privateKey, .userCertificate and .caCertificate');
        return;
    }

    signedXml = new SignedXml();
    signedXml.signatureAlgorithm = SigConstants.SIGNATURE_ALGORITHM;
    signedXml.canonicalizationAlgorithm = SigConstants.CANONICALIZATION_ALGORITHM;
    signedXml.signingKey = certificates.privateKey;

    signatureString += SigConstants[prefix + '_SIGNATURE_HEAD'];
    signedInfoString += SigConstants.SIGNEDINFO_HEAD;

  // Calculating sha256 hashes for all given files
    async.eachOf(fileList, calculateHashOfFile, () => {

    // Create reference blocks for all files
        fileList.forEach((file) => {
            signedInfoString += prepareSignedInfoReference(file);
        });

    // Append #prop reference block
    // @TODO for standard compatibility needs to be calculated. As for 2016-08 this part is equal for all generated signatures
        signedInfoString += SigConstants.PROP_REFERENCE_TEMPLATE.replace('{$1}', SigConstants[prefix + '_PROP_REFERENCE_DIGEST']);

        signedInfoString += SigConstants.SIGNEDINFO_TAIL;

    // Append signedInfo to signature
        signatureString += signedInfoString + '\n';

    // Calculate signature based on signedInfo
        signatureString += signedXml.createSignature(
      // Signature is created based on canoncialized XML
      signedXml.getCanonXml(
        // Array of transform algorithms
        [SigConstants.CANONICALIZATION_ALGORITHM],
        // Parsing concated XML as DOM tree, to enable transformation algorithms
        //
        new Dom().parseFromString(signedInfoString).firstChild
      )
    );

        signatureString += SigConstants.KEYINFO_TEMPLATE
      .replace('{$1}', removeCertificateSeparators(certificates.userCertificate))
      .replace('{$2}', removeCertificateSeparators(certificates.caCertificate));

        signatureString += SigConstants[prefix + '_PROP_OBJECT'];

        signatureString += SigConstants.SIGNATURE_TAIL;

        if (typeof callback === 'function') {
            callback(null, signatureString);
        }
    });
}

class WidgetSignature {
    /**
     * Generates author signature and returns it as string
     * @param {array} fileList
     * @param {object} certificates
     * @param {string} certificates.privateKey Private key
     * @param {string} certificates.userCertificate First certificate from .p12 file
     * @param {string} certificates.caCertificate Second certificate from .p12 file
     * @param {function} callback
     */
    static authorSignature(fileList, certificates, callback) {
        generateSignature('author', fileList, certificates, callback);
    }

    /**
     * Generates distributor signature and returns it as string
     * @param {array} fileList
     * @param {object} certificates
     * @param {string} certificates.privateKey Private key
     * @param {string} certificates.userCertificate First certificate from .p12 file
     * @param {string} certificates.caCertificate Second certificate from .p12 file
     * @param {function} callback
     */
    static distributorSignature(fileList, certificates, callback) {
        generateSignature('distributor', fileList, certificates, callback);
    }
}

module.exports = WidgetSignature;
