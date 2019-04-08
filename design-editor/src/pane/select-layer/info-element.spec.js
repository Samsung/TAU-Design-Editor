import $ from 'jquery';
import {InfoElement, Info} from './info-element';
import {EVENTS, eventEmitter} from '../../events-emitter';

describe('Info Element', function () {
    it('should be a HTML Element', function () {
        expect(new InfoElement() instanceof HTMLElement).toBe(true);
    });

    it('should proper initialize', function () {
        var infoElement = new InfoElement();
        expect(infoElement.classList.contains('info-bar')).toBe(true);
        expect(infoElement._curSelectedElementInfo).toBeDefined();
    });

    it('should proper show', function () {
        var infoElement = new InfoElement();
        infoElement.show();
        expect(infoElement.style.display).toBe('block');
    });

    it('should proper hide', function () {
        var infoElement = new InfoElement();
        infoElement.hide();
        expect(infoElement.style.display).toBe('none');
    });

    it('should correct collect information about element', function () {
        var infoElement = new InfoElement();

        infoElement._setElementInfo($('<div id="test-id" class="test-class"></div>'));

        expect(infoElement._curSelectedElementInfo).toBeDefined();
        expect(infoElement._curSelectedElementInfo.tag).toBe('div');
        expect(infoElement._curSelectedElementInfo.id).toBe('#test-id');
        expect(infoElement._curSelectedElementInfo.class).toBe('.test-class');
    });

    it('should correct create HTML of element', function () {
        var stringHTML = Info._getRenderedHTMLString({
            tag: 'span',
            id: '#test-id',
            class: '.test-class',
            parentTag: 'div',
            parentId: '#test-id2',
            parentClass: '.test-class2',
            parentInternalId: '23'
        });

        expect(stringHTML).toBe('<div class="parent-info" data-id="23"><span class="tag-field">div</span><span class="id-field">#test-id2</span><span class="class-field">.test-class2</span></div><span> &raquo; </span><span class="tag-field">span</span><span class="id-field">#test-id</span><span class="class-field">.test-class</span>');
    });

    it('should correct render', function (done) {
        var infoElement = new InfoElement();

        infoElement._setElementInfo($('<div id="test-id" class="test-class"></div>'));
        infoElement._render();

        requestAnimationFrame(() => {
            expect(infoElement.innerHTML).toBe('<span class="tag-field">div</span><span class="id-field">#test-id</span><span class="class-field">.test-class</span>');
            done();
        });
    });

    it('should proper destroy', function () {
        var infoElement = new InfoElement();
        infoElement = null;
        expect(infoElement).toBeNull();
    });


    it('should work on event click', function (done) {
        var infoElement = new InfoElement(),
            count = 0;

        infoElement._setElementInfo($('<div class="ui-content" data-id="cl-1"><div id="test-id" class="test-class"></div></div>').children('div'));
        infoElement._render();

        requestAnimationFrame(() => {
            expect(infoElement.innerHTML).toBe('<div class="parent-info" data-id="cl-1"><span class="tag-field">div</span><span class="id-field"></span><span class="class-field">.ui-content</span></div><span> » </span><span class="tag-field">div</span><span class="id-field">#test-id</span><span class="class-field">.test-class</span>');
            eventEmitter.on(EVENTS.ElementSelected, (elementId) => {
                expect(elementId).toBe('cl-1');
                count += 1;
                done();
            });
            infoElement.lastElementChild.click();
            setTimeout(() => {
                infoElement.firstElementChild.click();
            }, 100);
        });
    });
});
