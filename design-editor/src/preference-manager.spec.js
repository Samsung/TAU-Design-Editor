import {PreferenceManager} from './preference-manager';

describe('Preference Manager', function () {

    class TestClass {}
    class TestClass2 {
        static get(group, key) {

        }

        static set() {

        }

        static setDefault() {

        }
    }

    it('should throw an error when it\'s instantialized', function () {
        expect(function () {
            const a = new PreferenceManager();
        }).toThrowError();
    });

    it('should define a register method', function () {
        expect(PreferenceManager.register).toBeDefined();
    });

    it('should define a deregister method', function () {
        expect(PreferenceManager.deregister()).toBeDefined();
    });

    it('should define a get method', function () {
        expect(PreferenceManager.get).toBeDefined();
    });

    it('should define a getInternal method', function () {
        expect(PreferenceManager.getInternal).toBeDefined();
    });

    it('should define a set method', function () {
        expect(PreferenceManager.set).toBeDefined();
    });

    it('should define a setInternal method', function () {
        expect(PreferenceManager.setInternal).toBeDefined();
    });

    it('should define a setDefault method', function () {
        expect(PreferenceManager.setDefault).toBeDefined();
    });

    it('should define a setInternalDefault method', function () {
        expect(PreferenceManager.setInternalDefault).toBeDefined();
    });

    describe('register method', function () {
        afterEach(function () {
            PreferenceManager.deregister();
        });

        it('should register the given class as manager', function () {
            expect(PreferenceManager._getRegisteredClass()).toBeNull();

            expect(PreferenceManager.register(TestClass)).toBe(true);

            expect(PreferenceManager._getRegisteredClass()).toBe(TestClass);
        });

        it('should disallow non function method registration', function () {
            spyOn(console, 'error');

            PreferenceManager.register(TestClass);

            expect(PreferenceManager.register('a')).toBe(false);
            expect(PreferenceManager.register(false)).toBe(false);
            expect(PreferenceManager.register(5)).toBe(false);
            expect(PreferenceManager.register(null)).toBe(false);
            expect(PreferenceManager.register(undefined)).toBe(false);
            expect(PreferenceManager.register({set: 1})).toBe(false);

            expect(console.error).toHaveBeenCalledTimes(6);

            expect(PreferenceManager._getRegisteredClass()).toBe(TestClass);
        });

        it('should disallow second class registration (with console.error)', function () {
            spyOn(console, 'error');

            PreferenceManager.register(TestClass);

            PreferenceManager.register(TestClass2);
            expect(console.error).toHaveBeenCalled();

            expect(PreferenceManager._getRegisteredClass()).toBe(TestClass);
        });
    });

    describe('deregister method', function () {
        afterEach(function () {
            PreferenceManager.deregister();
        });

        it('should return true when registration has been successful', function () {
            PreferenceManager.register(TestClass);

            expect(PreferenceManager.deregister()).toBe(true);
        });

        it('should return false when registration has failed', function () {
            expect(PreferenceManager.deregister()).toBe(false);
        });

        it('should deregister manager', function () {
            PreferenceManager.deregister();
            expect(PreferenceManager._getRegisteredClass()).toBe(null);
        });
    });

    describe('get method', function () {
        it('should throw an error when no class is registered', function () {
            PreferenceManager.deregister();

            expect(function () {
                PreferenceManager.get('group', 'key');
            }).toThrowError();
        });

        it('should call registered class .get method with same parameters', function () {
            PreferenceManager.register(TestClass2);

            spyOn(TestClass2, 'get');

            PreferenceManager.get('group', 'key');

            expect(TestClass2.get).toHaveBeenCalledWith('group', 'key');
        });
    });

    describe('getInternal method', function () {
        it('should throw an error when no class is registered', function () {
            PreferenceManager.deregister();

            expect(function () {
                PreferenceManager.getInternal('group', 'key');
            }).toThrowError();
        });

        it('should call registered class .get method with additional {internal: true} parameter', function () {
            PreferenceManager.register(TestClass2);

            spyOn(TestClass2, 'get');

            PreferenceManager.getInternal('group', 'key');

            expect(TestClass2.get).toHaveBeenCalledWith('group', 'key', {
                internal: true
            });
        });
    });

    describe('set method', function () {
        it('should throw an error when no class is registered', function () {
            PreferenceManager.deregister();

            expect(function () {
                PreferenceManager.set('group', 'key', 'value');
            }).toThrowError();
        });

        it('should call registered class .get method with same parameters', function () {
            PreferenceManager.register(TestClass2);

            spyOn(TestClass2, 'set');

            PreferenceManager.set('group', 'key', 'value');

            expect(TestClass2.set).toHaveBeenCalledWith('group', 'key', 'value');
        });
    });

    describe('setInternal method', function () {
        it('should throw an error when no class is registered', function () {
            PreferenceManager.deregister();

            expect(function () {
                PreferenceManager.setInternal('group', 'key', 'value');
            }).toThrowError();
        });

        it('should call registered class .get  method with additional {internal: true} parameter', function () {
            PreferenceManager.register(TestClass2);

            spyOn(TestClass2, 'set');

            PreferenceManager.setInternal('group', 'key', 'value');

            expect(TestClass2.set).toHaveBeenCalledWith('group', 'key', 'value', {
                internal: true
            });
        });
    });

    describe('setDefault method', function () {
        afterEach(function () {
            PreferenceManager.deregister();
        });

        it('should throw an error when no class is registered', function () {
            PreferenceManager.deregister();

            expect(function () {
                PreferenceManager.setDefault('group', 'key', 'value');
            }).toThrowError();
        });

        it('should call registered class .setDefault method with same parameters', function () {
            PreferenceManager.register(TestClass2);

            spyOn(TestClass2, 'setDefault');

            PreferenceManager.setDefault('group', 'key', 'value');

            expect(TestClass2.setDefault).toHaveBeenCalledWith('group', 'key', 'value', undefined);
        });

        it('should warn if we set preferences without groups', function () {
            PreferenceManager.register(TestClass2);
            spyOn(console, 'warn');

            PreferenceManager.setDefault(null, 'key', 'value');
            PreferenceManager.setDefault(undefined, 'key', 'value');
            PreferenceManager.setDefault('', 'key', 'value');

            expect(console.warn).toHaveBeenCalledTimes(3);
        });
    });

    describe('setInternalDefault method', function () {
        afterEach(function () {
            PreferenceManager.deregister();
        });

        it('should throw an error when no class is registered', function () {
            PreferenceManager.deregister();

            expect(function () {
                PreferenceManager.setInternalDefault('group', 'key', 'value');
            }).toThrowError();
        });

        it('should call registered class .setDefault method with additional {internal: true}', function () {
            PreferenceManager.register(TestClass2);

            spyOn(TestClass2, 'setDefault');

            PreferenceManager.setInternalDefault('group', 'key', 'value');

            expect(TestClass2.setDefault).toHaveBeenCalledWith('group', 'key', 'value', {
                internal: true
            });
        });

        it('should warn if we set preferences without groups', function () {
            PreferenceManager.register(TestClass2);
            spyOn(console, 'warn');

            PreferenceManager.setInternalDefault(null, 'key', 'value');
            PreferenceManager.setInternalDefault(undefined, 'key', 'value');
            PreferenceManager.setInternalDefault('', 'key', 'value');

            expect(console.warn).toHaveBeenCalledTimes(3);
        });
    });
});
