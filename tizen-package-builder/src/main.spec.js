const TizenPackage = require('./main');

describe('Tizen Package Manager', function () {
    it('Should contain a build method', function () {
        expect(TizenPackage.build).toBeDefined();
    });

    it('Should define a verifyProjectDir method', function () {
        expect(TizenPackage.verifyProjectDir).toBeDefined();
    });
});
