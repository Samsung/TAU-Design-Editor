import {appManager} from './app-manager';
import {EVENTS, eventEmitter} from './events-emitter';


describe('App Manager', function () {

    it('should change active editor after update editor', function () {
        const editor = {};
        eventEmitter.emit(EVENTS.ActiveEditorUpdated, 1, editor);
        expect(appManager.getActiveDesignEditor()).toBe(editor);
        eventEmitter.emit(EVENTS.ActiveEditorUpdated, 0, editor);
        expect(appManager.getActiveDesignEditor()).toBeNull();
    });

});
