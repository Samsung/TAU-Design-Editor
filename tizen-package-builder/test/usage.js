const fs = require('fs'),
    TizenPackage = require('../src/main');

/**
 *
 */
TizenPackage.build('path/to/source',
    'path/to/destination', {
        author: {
            privateKey: fs.readFileSync('../keystore/private_key.pem').toString(),
            userCertificate: fs.readFileSync('../keystore/cert_1.pem').toString(),
            caCertificate: fs.readFileSync('../keystore/cert_2.pem').toString()
        },
        distributor: {
            privateKey: fs.readFileSync('../keystore/distributor_private_key.pem').toString(),
            userCertificate: fs.readFileSync('../keystore/distributor_cert1.pem').toString(),
            caCertificate: fs.readFileSync('../keystore/distributor_cert2.pem').toString()
        }
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Packing done');
        }
    });
