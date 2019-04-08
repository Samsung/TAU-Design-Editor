'use babel';

import $ from 'jquery';
import {StateManager} from '../system/state-manager';
import {ElementDetector} from './element-detector';

class GuideInfo {

    /**
     * Constructor
     */
    constructor() {
        this._guideInfo = null;
    }

    /**
     * set guide info
     * @param {Object} elements
     * @param rule
     * @param {DesignEditor} designEditor
     * @returns {GuideInfo}
     */
    setGuideInfo(elements, rule, designEditor) {
        var selectLayer = designEditor.getSelectLayer(),
            infoElements = this._makeElements(selectLayer, rule, elements);

        this._setLayout(elements, infoElements);

        return this;
    }

    /**
     * Set layout
     * @param {Object} elements
     * @param {Object} infoElement
     * @private
     */
    _setLayout(elements, infoElement) {
        var $guideElement = elements.guideElement,
            geOffset = null,
            $relativeElement = elements.relativeElement,
            reOffset = null,
            $containerElement = elements.containerElement,
            ceOffset = null,
            $guideElementInfo = infoElement.$guideElementInfo,
            $guideElementBorder = infoElement.$guideElementBorder,
            $relativeElementInfo = infoElement.$relativeElementInfo,
            $relativeElementBorder = infoElement.$relativeElementBorder,
            $containerElementInfo = infoElement.$containerElementInfo,
            $containerElementBorder = infoElement.$containerElementBorder,
            ratio = StateManager.get('screen').ratio;

        if ($guideElement && $guideElement.length) {
            geOffset = $guideElement.offset();
            $guideElementInfo.css({
                top: (geOffset.top * ratio) - $guideElementInfo.outerHeight(),
                left: geOffset.left * ratio
            });
            $guideElementBorder.css({
                width: $guideElement.outerWidth() * ratio,
                height: $guideElement.outerHeight() * ratio,
                top: $guideElementInfo.outerHeight()
            });
        }
        if ($relativeElement && $relativeElement.length) {
            reOffset = $relativeElement.offset();
            $relativeElementInfo.css({
                top: (reOffset.top * ratio) - $relativeElementInfo.outerHeight(),
                left: reOffset.left * ratio
            });
            $relativeElementBorder.css({
                width: $relativeElement.outerWidth() * ratio,
                height: $relativeElement.outerHeight() * ratio,
                top: $relativeElementInfo.outerHeight()
            });
        }
        if ($containerElement && $containerElement.length) {
            ceOffset = $containerElement.offset();
            $containerElementInfo.css({
                top: (ceOffset.top * ratio) - $containerElementInfo.outerHeight(),
                left: ceOffset.left * ratio
            });
            $containerElementBorder.css({
                width: $containerElement.outerWidth() * ratio,
                height: $containerElement.outerHeight() * ratio,
                top: $containerElementInfo.outerHeight()
            });
        }
    }

    /**
     * Make elements
     * @param {jQuery} selectLayer
     * @param {string} rule
     * @param {Object} elements
     * @returns {null|*}
     * @private
     */
    _makeElements(selectLayer, rule, elements) {
        var $guideElementInfo,
            $guideElementBorder,
            $relativeElementInfo,
            $relativeElementBorder,
            $containerElementInfo,
            $containerElementBorder,
            reComponentInfo = ElementDetector.getInstance().detect(elements.relativeElement),
            ceComponentInfo = ElementDetector.getInstance().detect(elements.containerElement),
            reName = reComponentInfo ? reComponentInfo.package.name : '',
            ceName = ceComponentInfo ? ceComponentInfo.package.name : '',
            $guideInfo = $('.closet-guide-info');

        if ($guideInfo.length) {
            $guideElementInfo = $('.closet-guide-element-info');
            $guideElementBorder = $guideElementInfo.children();
            $relativeElementInfo = $('.closet-guide-relative-info');
            $relativeElementBorder = $relativeElementInfo.children();
            $containerElementInfo = $('.closet-guide-container-info');
            $containerElementBorder = $containerElementInfo.children();
        } else {
            $guideElementInfo = $(document.createElement('div')).addClass('closet-guide-info closet-guide-element-info');
            $guideElementBorder = $(document.createElement('div')).addClass('closet-guide-border');
            $relativeElementInfo = $(document.createElement('div')).addClass('closet-guide-info closet-guide-relative-info');
            $relativeElementBorder = $(document.createElement('div')).addClass('closet-guide-border');
            $containerElementInfo = $(document.createElement('div')).addClass('closet-guide-info closet-guide-container-info');
            $containerElementBorder = $(document.createElement('div')).addClass('closet-guide-border');

            $(selectLayer).append($guideElementInfo).append($relativeElementInfo).append($containerElementInfo);
            $guideInfo = $('.closet-guide-info');
        }
        $guideInfo.removeClass('closet-guide-info-reject');
        $relativeElementInfo.text(reName);
        $containerElementInfo.text(ceName);
        switch (rule) {
        case 'after':
            $guideElementInfo.text('after');
            break;
        case 'before':
            $guideElementInfo.text('before');
            break;
        case 'append':
            $guideElementInfo.text('append');
            break;
        case 'reject':
            $guideInfo.addClass('closet-guide-info-reject');
            $relativeElementInfo.text('X');
            break;
        }
        $guideElementInfo.append($guideElementBorder);
        $relativeElementInfo.append($relativeElementBorder);
        $containerElementInfo.append($containerElementBorder);

        this._guideInfo = {
            $guideElementInfo: $guideElementInfo,
            $guideElementBorder: $guideElementBorder,
            $relativeElementInfo: $relativeElementInfo,
            $relativeElementBorder: $relativeElementBorder,
            $containerElementInfo: $containerElementInfo,
            $containerElementBorder: $containerElementBorder
        };
        return this._guideInfo;
    }

    /**
     * Destroy
     */
    destroyGuideInfo() {
        if (this._guideInfo) {
            this._guideInfo.$guideElementInfo.remove();
            this._guideInfo.$relativeElementInfo.remove();
            this._guideInfo.$containerElementInfo.remove();
        }
    }
}

const guideInfo = new GuideInfo();
export {guideInfo, GuideInfo};

