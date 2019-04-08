module.exports = {
    SIGNEDINFO_HEAD: '<SignedInfo>\n<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"></CanonicalizationMethod>\n' +
    '<SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"></SignatureMethod>\n',
    SIGNEDINFO_TAIL: '</SignedInfo>',

    AUTHOR_SIGNATURE_HEAD: '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#" Id="AuthorSignature">\n',
    DISTRIBUTOR_SIGNATURE_HEAD: '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#" Id="DistributorSignature">\n',

    SIGNATURE_TAIL: '</Signature>',

    SIGNATURE_ALGORITHM: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    CANONICALIZATION_ALGORITHM: 'http://www.w3.org/2001/10/xml-exc-c14n#',

    AUTHOR_SIGNATURE_FILENAME: 'author-signature.xml',
    DISTRIBUTOR_SIGNATURE_FILENAME: 'signature1.xml',

    REFERENCE_TEMPLATE: '<Reference URI="{$1}">\n' +
        '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"></DigestMethod>\n' +
        '<DigestValue>{$2}</DigestValue>\n' +
        '</Reference>\n',

    PROP_REFERENCE_TEMPLATE: '<Reference URI="#prop">\n' +
        '<Transforms>\n' +
        '<Transform Algorithm="http://www.w3.org/2006/12/xml-c14n11"></Transform>\n' +
        '</Transforms>\n' +
        '<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"></DigestMethod>\n' +
        '<DigestValue>{$1}</DigestValue>\n' +
        '</Reference>\n',

    KEYINFO_TEMPLATE: '<KeyInfo>\n' +
        '<X509Data>\n' +
        '<X509Certificate>\n{$1}</X509Certificate>\n' +
        '<X509Certificate>\n{$2}</X509Certificate>\n' +
        '</X509Data>\n' +
        '</KeyInfo>\n',

    // @TODO this should be calculated
    AUTHOR_PROP_REFERENCE_DIGEST: 'lpo8tUDs054eLlBQXiDPVDVKfw30ZZdtkRs1jd7H5K8=',
    DISTRIBUTOR_PROP_REFERENCE_DIGEST: 'u/jU3U4Zm5ihTMSjKGlGYbWzDfRkGphPPHx3gJIYEJ4=',
    // --

    AUTHOR_PROP_OBJECT: '<Object Id="prop"><SignatureProperties xmlns:dsp="http://www.w3.org/2009/xmldsig-properties"><SignatureProperty Id="profile" Target="#AuthorSignature"><dsp:Profile URI="http://www.w3.org/ns/widgets-digsig#profile"></dsp:Profile></SignatureProperty><SignatureProperty Id="role" Target="#AuthorSignature"><dsp:Role URI="http://www.w3.org/ns/widgets-digsig#role-author"></dsp:Role></SignatureProperty><SignatureProperty Id="identifier" Target="#AuthorSignature"><dsp:Identifier></dsp:Identifier></SignatureProperty></SignatureProperties></Object>\n',
    DISTRIBUTOR_PROP_OBJECT: '<Object Id="prop"><SignatureProperties xmlns:dsp="http://www.w3.org/2009/xmldsig-properties"><SignatureProperty Id="profile" Target="#DistributorSignature"><dsp:Profile URI="http://www.w3.org/ns/widgets-digsig#profile"></dsp:Profile></SignatureProperty><SignatureProperty Id="role" Target="#DistributorSignature"><dsp:Role URI="http://www.w3.org/ns/widgets-digsig#role-distributor"></dsp:Role></SignatureProperty><SignatureProperty Id="identifier" Target="#DistributorSignature"><dsp:Identifier></dsp:Identifier></SignatureProperty></SignatureProperties></Object>\n'
};
