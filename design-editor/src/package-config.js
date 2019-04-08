'use babel';

// Default config in JSON Schema
const defaultConfiguration = {
    'snap.active': {
        'type': 'boolean',
        'default': true,
        'title': 'Snap',
        'description': 'Activates snapping to chosen objects'
    },
    'snap.threshold': {
        'type': 'integer',
        'default': 5,
        'minimum': 1,
        'title': 'Snap threshold',
        'description': 'Snap threshold in pixels'
    },
    'snap.container': {
        'type': 'boolean',
        'default': true,
        'title': 'Snap to container',
        'description': 'Enables snapping selected component to it\'s parent container'
    }
};

export default defaultConfiguration;
