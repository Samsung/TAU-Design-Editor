'use babel';

let profiles = {
    wearable: {
        'Gear S2': {
            width: 360,
            height: 360,
            shape: 'circle'
        },
        'Gear2': {
            width: 320,
            height: 320,
            shape: 'rectangle'
        },
        'Gear S': {
            width: 360,
            height: 480,
            shape: 'rectangle'
        }
    },
    tv: {
        'Generic': {
            width: 1920,
            height: 1080,
            shape: 'rectangle'
        }
    },
    mobile: {
        'Z1': {
            width: 360,
            height: 640,
            shape: 'rectangle'
        },
        'Z3': {
            width: 720,
            height: 1280,
            shape: 'rectangle'
        }
    },
    fit2: {
        'Gear Fit 2': {
            width: 216,
            height: 432,
            shape: 'rectangle'
        }
    }
};

class Devices {

    static getDevices(profile) {
        return profiles[profile];
    }

    static setDevices(profile, devices = []) {
        devices.forEach(device => {
            Devices.setDevice(profile, device.name, device.config);
        });
    }

    static setDevice(profie, device, config) {
        if (!profiles[profile]) {
            profiles[profile] = {};
        }
        profiles[profile][device] = config;
    }

    static getDevice(profile, device) {
        if (profiles[profile]) {
            return profiles[profile][device];
        }
    }

    static getAll() {
        return profiles;
    }

    static getDefaultDevice(profile) {
        const devices = Devices.getDevices(profile);
        if (devices) {
            return Object.keys(devices)[0];
        }
    }

    static fillDeviceConfig(profile, device, dstConfig) {
        const srcConfig = Devices.getDevice(profile, device);
        if (srcConfig) {
            Object.assign(dstConfig, srcConfig);
        }
    }
}

export {Devices};
