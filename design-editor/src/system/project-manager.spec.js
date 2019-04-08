/* global describe, it, expect*/

import fs from 'fs-extra';
import {projectManager, ProjectManager} from './project-manager';
import {EVENTS, eventEmitter} from '../events-emitter';

window.fileMap.set('path/config.xml', '<?xml version="1.0" encoding="UTF-8"?>\
  <widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="http://yourdomain/UIComponents" version="0.1.0" viewmodes="maximized">\
  <access origin="*"></access>\
  <tizen:application id="vUf39tzQ3s.UIComponents" package="vUf39tzQ3s" required_version="2.2"/>\
  <content src="index.html"/>\
  <feature name="http://tizen.org/feature/screen.size.all"/>\
  <icon src="icon.png"/>\
  <name>UIComponents</name>\
  <tizen:privilege name="http://tizen.org/privilege/fullscreen"/>\
  <tizen:profile name="mobile"/>\
  </widget>');

describe('ProjectManager', () => {
    it('should contain a constructor', () => {
        expect(projectManager).toBeDefined();
        expect(projectManager instanceof ProjectManager).toEqual(true);
    });

    it('initialize', () => {
        eventEmitter.on(EVENTS.ProjectInfoLoaded, (data) => {
            expect(data.has('path')).toEqual(true);
        });
        projectManager.initialize();
        expect(projectManager._projectInfoList.size).toEqual(1);
    });

    it('getActiveProjectInfo return correct info (Atom)', () => {
        var info = projectManager.getActiveProjectInfo();
        expect(info.projectPath).toEqual('path');
        expect(info.profiles).toEqual(['wearable']);
        expect(info.projectName).toEqual('[project]');
        expect(info.config.widget.name.value).toEqual('UIComponents');
    });

    it('getActiveProjectInfo return correct info (Brackets)', () => {
        var oldAtom = window.atom,
            info = null;

        window.atom = null;
        window.top.globalData = {
            fileUrl: 'path/path'
        };

        info = projectManager.getActiveProjectInfo();

        expect(info.projectPath).toEqual('path');
        expect(info.profiles).toEqual(['wearable']);
        expect(info.projectName).toEqual('[project]');
        expect(info.config.widget.name.value).toEqual('UIComponents');

        window.atom = oldAtom;
    });

    it('should create new project after receive event and open in existing window (Atom)', (done) => {
        var oldCopy = fs.copy,
            callCount = 0;

        fs.copy = (from, to, options, callback) => {
            switch (callCount) {
            case 0:
                expect(from).toEqual('path');
                expect(to).toEqual('projectPath');
                break;
            case 1:
                expect(from).toEqual('lib/tau');
                expect(to).toEqual('projectPath/libs/tau');
                break;
            case 2:
                expect(from).toEqual('lib/closet');
                expect(to).toEqual('projectPath/libs/closet');
                break;
            }
            callCount += 1;
            callback();
        };

        window.atom.workspace.open = (path) => {
            expect(path).toEqual('projectPath/index.html');
            fs.copy = oldCopy;
            done();
        };

        window.atom.project.addPath = (path) => {
            expect(path).toEqual('projectPath');
        };
        eventEmitter.emit(EVENTS.OpenNewProject, {
            templatePath: 'path',
            pathToLibs: 'lib',
            libsToInclude: ['tau', 'closet'],
            useExistingWindow: true,
            projectPath: 'projectPath'
        });
    });

    it('should create new project after receive event and open in new window (Atom)', (done) => {
        var oldCopy = fs.copy,
            callCount = 0;

        fs.copy = (from, to, options, callback) => {
            switch (callCount) {
            case 0:
                expect(from).toEqual('path');
                expect(to).toEqual('projectPath');
                break;
            case 1:
                expect(from).toEqual('lib/tau');
                expect(to).toEqual('projectPath/libs/tau');
                break;
            case 2:
                expect(from).toEqual('lib/closet');
                expect(to).toEqual('projectPath/libs/closet');
                break;
            }
            callCount += 1;
            callback();
        };

        window.atom.open = (options) => {
            expect(options.pathsToOpen).toEqual('projectPath');
            fs.copy = oldCopy;
            done();
        };

        eventEmitter.emit(EVENTS.OpenNewProject, {
            templatePath: 'path',
            pathToLibs: 'lib',
            libsToInclude: ['tau', 'closet'],
            useExistingWindow: false,
            projectPath: 'projectPath'
        });
    });
});

