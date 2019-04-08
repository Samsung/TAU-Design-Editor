/**
 * # dress.Scroller
 * Scrollable component.
 * @class dress.Scroller
 * @author Rostyslav Khanas <r.khanas@samsung.com>
 */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
    /* global define */
    define([
        '../dress.closet',
        '../../../libs/bezier-easing.min',
        '../../../libs/scrolling-component'
    ], function (dress, BezierEasing, Component3d) {
        

        // >>excludeEnd("buildExclude");

        dress.Scroller = dress.factory('scroller', {

            component: undefined,

            classPrefix: 'closet-scroller',

            defaults: {

            },

            onCreated: function () {
                var nodes = this.getNodes();

                this.component = new Component3d.CoverFlowComponent();

                this.className = this.classPrefix;

                this.component.setBackground('rgb(5, 5, 5)')
                    .setComponentMargin(0, 50)
                    .setScrollingIndex(0)
                    .setComponentSize(100, 100)
                    .setComponentWidthMeasure('%')
                    .setComponentHeightMeasure('%')
                    .setNodeWidth(500)
                    .setNodeHeight(500)
                    .setNodeMargin(0, 20)
                    .insert(nodes, 0)
                    .setNumberOfStacks(2)
                    .setDirection(1)
                    .attachToParent(this);

                console.debug('onCreated');
            },

            onAttached: function () {
                this.component.update();
            },

            onDetached: function () {
                this.component.detachFromParent();
            },

            // TODO: should be empty and load data from somewhere
            getNodes: function () {
                var i,
                    numberOfNodes = 150,
                    nodes = [];

                var imagesSrc = [
                    'http://images.samsung.com/is/image/samsung/in_SM-A300HZKDINU_000268347_Front-SS_black_thumb?$M-Thumbnail$',
                    'http://s.tmocache.com/content/dam/tmo/en-p/cell-phones/samsung-galaxy-s-6-edge/white-pearl/spin/samsung-galaxy-s-6-edge-pearl-white-spin.0001.jpg',
                    'http://images.samsung.com/is/image/samsung/my_SM-A800FZDEXME_000000001_Front_gold_thumb?$M-Thumbnail$',
                    'http://www.samsung.com/ca/next/img/support/ia_image_type/1903.jpg'
                ];

                function getImageSrc() {
                    var src = imagesSrc.shift(),
                        dom = document.createElement('img');

                    dom.src = src;

                    imagesSrc.push(src);

                    return dom;
                }

                for (i = 0; i < numberOfNodes; i += 1) {
                    nodes.push({
                        dom : getImageSrc()
                    });
                }

                return nodes;
            }
        });

        // >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.Scroller;
    });
// >>excludeEnd("buildExclude");
}());
