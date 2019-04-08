'use babel';

import $ from 'jquery';
import {appManager} from '../../app-manager';
import {DressElement} from '../../utils/dress-element';
import {EVENTS, eventEmitter} from '../../events-emitter';

var activeEditor = null;

/*
 We create main element of animation widow
 */
class AnimationPreview extends DressElement {
    /**
     * Create callback
      */
    onCreated() {
        var self = this,
            // path to template
            templatePath = '/panel/animation/animation-preview-element.html';

        // get structure from template
        this.createFromTemplate(templatePath);

        this.events = {
            'click .closet-animation-iframe-layer': 'onIframeClick'
        };

        eventEmitter.on(EVENTS.ChangeStyle, this.onStyleChanged.bind(this));
        eventEmitter.on(EVENTS.ChangeAttribute, this.onAttributeChanged.bind(this));
        eventEmitter.on(EVENTS.ElementInserted, this.onElementInserted.bind(this));
        eventEmitter.on(EVENTS.ElementDeleted, this.onElementDeleted.bind(this));
        eventEmitter.on(EVENTS.ScriptInserted, this._onScriptInserted.bind(this));
        eventEmitter.on(EVENTS.StyleInserted, this._onStyleInserted.bind(this));
    }

    /**
     * Get element for id
     * @param {string} id
     * @param {number} time
     * @returns {*|T}
     */
    getElementById(id, time) {
        var $iframe = null;
        if (time) {
            $iframe = this.$el.find('iframe[data-time=' + time + ']');
        } else {
            $iframe = this.$el.find('iframe');
        }
        return $iframe.contents().find('[data-id=' + id + ']');
    }

    /**
     * Callback for event script insert
     * @param {string} dest
     */
    _onScriptInserted(dest) {
        // @TODO remove security exception on insert
        // this.$el.find('iframe').contents().find('head').append($('<script>').attr('type', 'text/javascript').attr('src', dest));
    }

    /**
     * Callback for event style insert
     * @param {string} dest
     * @param {string} fullPath
     */
    _onStyleInserted(dest, fullPath) {
        if (this._visible) {
            this.$el.find('iframe').contents().find('head').append($('<link>').attr('rel', 'stylesheet')
                .attr('href', fullPath + '/' + dest));
        }
    }

    /**
     * Callback for attribute change
     * @param {string} id
     * @param {string} name
     * @param {string} value
     */
    onAttributeChanged(id, name, value) {
        if (this._visible) {
            this.getElementById(id).attr(name, value);
        }
    }

    /**
     * Style change callback
     * @param {string} id
     * @param {string} name
     * @param {string} value
     * @param {string} time
     */
    onStyleChanged(id, name, value, time) {
        var self = this,
            model = null,
            keyFrames = null;

        if (this._visible) {
            if (!time) {
                model = appManager.getActiveDesignEditor().getModel();

                this.getElementById(id).css(name, value);

                // Update styles for rest of keyframe previews
                keyFrames = model.getKeyFrames();
                model.getKeyFrameTimes().forEach((keyFrameTime) => {
                    var keyFrame = keyFrames[keyFrameTime];
                    keyFrame.forEach((changes) => {
                        // apply only recently updated value, affect no other
                        if (name in changes.style) {
                            self.getElementById(changes.id, keyFrameTime).css(name, changes.style[name]);
                        }
                    });
                });
            } else {
                this.getElementById(id, time).css(name, value);
            }
        }
    }

    /**
     * Element insert callback
     * @param {string} parent_id
     * @param {string} id
     * @param {string} content
     * @param {string} prev_id
     */
    onElementInserted(parent_id, id, content, prev_id) {
        var parent = null,
            prev = null,
            element = null;
        if (this._visible) {
            parent = this.getElementById(parent_id);
            prev = this.getElementById(prev_id);
            element = $(content);

            if (prev.length) {
                $(prev).after(element);
            } else {
                $(parent).prepend(element);
            }
        }
    }

    /**
     * Element delete callback
     * @param {string} id
     */
    onElementDeleted(id) {
        if (this._visible) {
            this.getElementById(id).remove();
        }
    }

    /**
     * Create iframe callback
     * @param {jQuery} $container
     * @param {number} time
     */
    createIframe($container, time) {
        var clone = null,
            cloneSrc = null,
            srcArray = null,
            src = '',
            iframe = null,
            iframeContainer = null;
        if (activeEditor) {
            clone = activeEditor.getIframeClone();
            cloneSrc = clone.attr('src') || '';
            src = '';
            iframe = $('<iframe src="' + src + '" data-time="' + time + '">');
            iframeContainer = $('<div class="closet-animation-iframe-container">' +
                '<div class="closet-animation-iframe-layer" data-time="' + time + '"></div></div>');

            srcArray = cloneSrc.split('/');

            // On Windows split using \\...
            if (srcArray.length === 1) {
                srcArray = cloneSrc.split('\\');
            }

            srcArray.pop();
            if (!window.atom) {
                // add path to filesystem of brackets
                srcArray.unshift('fs/fread/raw');
                src = srcArray.join('/') + '/';
            } else {
                src = 'file:///' + srcArray.join('/') + '/';
            }

            // Attach listener to load event
            iframe.on('load', () => {
                var iframeDocument = iframe[0].contentWindow.document,
                    model = activeEditor.getModel(),
                    keyFrame = model.getKeyFrame(time),
                    $iframeBody = null,
                    html = model.getDOM().querySelector('html').outerHTML;

                // @TODO find better solution, base not work
                html = html.replace(/href="/g, 'href="' + src);
                html = html.replace(/src="/g, 'src="' + src);

                iframeDocument.open('text/html');
                iframeDocument.write(html);
                iframeDocument.close();

                // If keyframe with style changes exist
                if (keyFrame) {
                    $iframeBody = $(iframeDocument.body);

                    // Filter only elements with style changes
                    keyFrame.filter(changes => Object.keys(changes.style).length > 0).forEach((changes) => {
                        $iframeBody.find('[data-id="' + changes.id + '"]').css(changes.style);
                    });
                }
                requestAnimationFrame(() => {
                    iframe.css('opacity', 1);
                    iframe.parent().prev().css('opacity', 1);
                });
            });

            // And now append it to the container
            iframeContainer.append(iframe);
            $container.append(iframeContainer);
        }
    }

    /**
     * Iframe click callback
     * @param {Event} event
     */
    onIframeClick(event) {
        var target = event.target,
            time = target.dataset.time,
            $container = $(target).closest('.closet-animation-keyframes-container'),
            model = appManager.getActiveDesignEditor().getModel();

        if (target.classList.contains('closet-animation-iframe-layer')) {
            model.setActiveKeyFrame(time);
            $container.find('.closet-animation-iframe-layer-active').removeClass('closet-animation-iframe-layer-active');
            $(target).addClass('closet-animation-iframe-layer-active');
        }
    }

    /**
     * update list callback
     * @param {Editor} editorInstance
     */
    updateList(editorInstance) {
        var self = this,
            keyframesTime = null,
            $container = this.$el.find('.closet-animation-keyframes-container'),
            prevTime = 0,
            i,
            model = appManager.getActiveDesignEditor().getModel();

        if (editorInstance) {
            activeEditor = editorInstance;
        }

        $container.empty();
        if (model.getAnimationGroup()) {
            if (activeEditor) {
                keyframesTime = activeEditor
                    .getModel()
                    .getKeyFrameTimes();
            }

            self.createIframe($container, '');
            $container.find('[data-time=0]').addClass('closet-animation-iframe-layer-active');

            for (i = 1; i < keyframesTime.length; i += 1) {
                if (i > 0) {
                    prevTime = parseInt(keyframesTime[i - 1], 10);
                }
                $container.append('<div class="closet-animation-keyframe-divider">' +
                    '<span class="closet-animation-keyframe-divider-time"><span class="animation-time">' +
                    ((parseInt(keyframesTime[i], 10) - prevTime) / 1000) + '</span> s</span></div>');
                prevTime = keyframesTime[i];

                self.createIframe($container, keyframesTime[i]);
            }
        }
    }

    /**
     * Show
      */
    show() {
        this._visible = true;
        this.$el.show();
    }

    /**
     * Hide
      */
    hide() {
        this._visible = false;
        this.$el.hide();
    }

    /**
     * destroy callback
      */
    onDestroy() {
        this._callbacks = null;
    }
}


const AnimationPreviewElement = document.registerElement('closet-animation-simple', AnimationPreview);

export {AnimationPreviewElement, AnimationPreview};
