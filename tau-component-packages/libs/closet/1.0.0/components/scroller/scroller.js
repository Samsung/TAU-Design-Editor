(function(factory) {

  var root = window !== "undefined" ? window : this;

  if (typeof define === 'function' && define.amd) {

    define(['jquery', 'dress'], function($, dress) {
      factory($, dress);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if ( typeof module === "object" && typeof module.exports === "object" ) {
      factory(require('jquery'), require('dress'));

  // Finally, as a browser global.
  } else {
    factory((root.jQuery || root.Zepto || root.ender || root.$), root.dress);
  }

}(function($, dress) {
'use strict';

    if (!$ || !dress) {
        return;
    }
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define('components/../../libs/bezier-easing.min',[],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.BezierEasing=e()}}(function(){return function e(t,n,r){function i(s,u){if(!n[s]){if(!t[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(o)return o(s,!0);var f=new Error("Cannot find module '"+s+"'");throw f.code="MODULE_NOT_FOUND",f}var p=n[s]={exports:{}};t[s][0].call(p.exports,function(e){var n=t[s][1][e];return i(n?n:e)},p,p.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t){function n(e,t){return 1-3*t+3*e}function r(e,t){return 3*t-6*e}function i(e){return 3*e}function o(e,t,o){return((n(t,o)*e+r(t,o))*e+i(t))*e}function s(e,t,o){return 3*n(t,o)*e*e+2*r(t,o)*e+i(t)}function u(e,t,n,r,i){var s,u,a=0;do u=t+(n-t)/2,s=o(u,r,i)-e,s>0?n=u:t=u;while(Math.abs(s)>h&&++a<l);return u}function a(e,t,n,r){for(var i=0;p>i;++i){var u=s(t,n,r);if(0===u)return t;var a=o(t,n,r)-e;t-=a/u}return t}function f(e,t,n,r){if(4===arguments.length)return new f([e,t,n,r]);if(!(this instanceof f))return new f(e);if(!e||4!==e.length)throw new Error("BezierEasing: points must contains 4 values");for(var i=0;4>i;++i)if("number"!=typeof e[i]||isNaN(e[i])||!isFinite(e[i]))throw new Error("BezierEasing: points should be integers.");if(e[0]<0||e[0]>1||e[2]<0||e[2]>1)throw new Error("BezierEasing x values must be in [0, 1] range.");this._str="BezierEasing("+e+")",this._css="cubic-bezier("+e+")",this._p=e,this._mSampleValues=m?new Float32Array(_):new Array(_),this._precomputed=!1,this.get=this.get.bind(this)}var p=4,c=.001,h=1e-7,l=10,_=11,d=1/(_-1),m="function"==typeof Float32Array;f.prototype={get:function(e){var t=this._p[0],n=this._p[1],r=this._p[2],i=this._p[3];return this._precomputed||this._precompute(),t===n&&r===i?e:0===e?0:1===e?1:o(this._getTForX(e),n,i)},getPoints:function(){return this._p},toString:function(){return this._str},toCSS:function(){return this._css},_precompute:function(){var e=this._p[0],t=this._p[1],n=this._p[2],r=this._p[3];this._precomputed=!0,(e!==t||n!==r)&&this._calcSampleValues()},_calcSampleValues:function(){for(var e=this._p[0],t=this._p[2],n=0;_>n;++n)this._mSampleValues[n]=o(n*d,e,t)},_getTForX:function(e){for(var t=this._p[0],n=this._p[2],r=this._mSampleValues,i=0,o=1,f=_-1;o!==f&&r[o]<=e;++o)i+=d;--o;var p=(e-r[o])/(r[o+1]-r[o]),h=i+p*d,l=s(h,t,n);return l>=c?a(e,h,t,n):0===l?h:u(e,i,i+d,t,n)}},f.css={ease:f.ease=f(.25,.1,.25,1),linear:f.linear=f(0,0,1,1),"ease-in":f.easeIn=f(.42,0,1,1),"ease-out":f.easeOut=f(0,0,.58,1),"ease-in-out":f.easeInOut=f(.42,0,.58,1)},t.exports=f},{}]},{},[1])(1)});
var Component3d;
(function (Component3d) {
    var BaseComponent = (function () {
        function BaseComponent(collectionRenderer, componentRenderer) {
            this._componentIsMounted = false;
            this._componentDirection = 1;
            this._componentInitialScrollingIndex = 1;
            this._componentSize = new Component3d.Size2DModel(undefined, undefined);
            this._componentSizeMeasureTypes = {
                measureWidthType: "px",
                measureHeightType: "px"
            };
            this._componentMargin = new Component3d.Size2DModel(20, 20);
            this._componentBackground = "rgb(0, 0, 0)";
            this._nodeSize = new Component3d.Size2DModel(undefined, undefined);
            this._nodeMargin = new Component3d.Size2DModel(10, 10);
            this._setCollectionRenderer(collectionRenderer);
            this._setComponentRenderer(componentRenderer);
            this._getComponentRenderer()._set3dComponentWrapperDom(this);
        }
        BaseComponent.prototype.attachToParent = function (parentDom) {
            if (!(parentDom instanceof HTMLElement)) {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_INSTANCE_OF_HTML_ELEMENT());
            }
            this._componentParentDom = parentDom;
            this._getComponentRenderer()._setComponentDom(this);
            return this;
        };
        BaseComponent.prototype.detachFromParent = function () {
            this._componentParentDom = undefined;
            this._getComponentRenderer()._detachFromParent(this);
            return this;
        };
        BaseComponent.prototype.update = function () {
            this._getComponentRenderer()._update(this);
            return this;
        };
        BaseComponent.prototype.insert = function (nodes, nodeIndex) {
            var self = this, i;
            if (nodes instanceof Array) {
                i = nodeIndex;
                nodes.map(function (node) {
                    self._insertNode(node, i++);
                });
                return this;
            }
            this._insertNode(nodes, nodeIndex);
            return this;
        };
        BaseComponent.prototype.remove = function (nodeIndex) {
            this._getCollection()._removeNodeFromChangesStorage(nodeIndex);
            return this;
        };
        BaseComponent.prototype.scrollingOn = function () {
            this._getComponentRenderer()._scrollingOn(this);
            return this;
        };
        BaseComponent.prototype.scrollingOff = function () {
            this._getComponentRenderer()._scrollingOff(this);
            return this;
        };
        BaseComponent.prototype.getScrollingIndex = function () {
            return this._componentInitialScrollingIndex;
        };
        BaseComponent.prototype.setScrollingIndex = function (initialScrollingIndex) {
            if (typeof initialScrollingIndex !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentInitialScrollingIndex = initialScrollingIndex;
            return this;
        };
        BaseComponent.prototype.getDirection = function () {
            return this._componentDirection;
        };
        BaseComponent.prototype.setDirection = function (direction) {
            if (typeof direction !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentDirection = direction;
            return this;
        };
        BaseComponent.prototype.getBackground = function () {
            return this._componentBackground;
        };
        BaseComponent.prototype.setBackground = function (background) {
            if (typeof background !== "string") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }
            this._componentBackground = background;
            return this;
        };
        BaseComponent.prototype.getComponentHeight = function () {
            return this._componentSize.height;
        };
        BaseComponent.prototype.getComponentWidth = function () {
            return this._componentSize.width;
        };
        BaseComponent.prototype.setComponentSize = function (width, height) {
            if (typeof width !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            if (typeof height !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentSize.width = width;
            this._componentSize.height = height;
            return this;
        };
        BaseComponent.prototype.getComponentMeasureTypes = function () {
            return this._componentSizeMeasureTypes;
        };
        BaseComponent.prototype.setComponentWidthMeasure = function (measureType) {
            if (typeof measureType !== "string") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }
            if (measureType !== "px" && measureType !== "%") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_PX_OR_PERCENT());
            }
            this._componentSizeMeasureTypes.measureWidthType = measureType;
            return this;
        };
        BaseComponent.prototype.setComponentHeightMeasure = function (measureType) {
            if (typeof measureType !== "string") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }
            if (measureType !== "px" && measureType !== "%") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_PX_OR_PERCENT());
            }
            this._componentSizeMeasureTypes.measureHeightType = measureType;
            return this;
        };
        BaseComponent.prototype.getNumberOfStacks = function () {
            return this._getCollection()._getNumberOfStacks();
        };
        BaseComponent.prototype.setNumberOfStacks = function (numberOfStacks) {
            if (typeof numberOfStacks !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._getCollection()._setNumberOfStacks(numberOfStacks);
            return this;
        };
        BaseComponent.prototype.getNodeMargin = function () {
            return this._nodeMargin;
        };
        BaseComponent.prototype.setNodeMargin = function (x, y) {
            if (typeof x !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            if (typeof y !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._nodeMargin = new Component3d.Size2DModel(x, y);
            return this;
        };
        BaseComponent.prototype.getComponentMargin = function () {
            return this._componentMargin;
        };
        BaseComponent.prototype.setComponentMargin = function (x, y) {
            if (typeof x !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            if (typeof y !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentMargin = new Component3d.Size2DModel(x, y);
            return this;
        };
        BaseComponent.prototype.getCamera = function () {
            return this._componentCamera;
        };
        BaseComponent.prototype.setCamera = function (camera) {
            this._componentCamera = camera;
            return this;
        };
        BaseComponent.prototype.getNodeWidth = function () {
            return this._nodeSize.width;
        };
        BaseComponent.prototype.setNodeWidth = function (nodeWidth) {
            this._nodeSize.width = nodeWidth;
            return this;
        };
        BaseComponent.prototype.getNodeHeight = function () {
            return this._nodeSize.height;
        };
        BaseComponent.prototype.setNodeHeight = function (nodeHeight) {
            this._nodeSize.height = nodeHeight;
            return this;
        };
        BaseComponent.prototype.getCollectionLength = function () {
            return this._getCollection()._getCollectionLength();
        };
        BaseComponent.prototype._getParentDom = function () {
            return this._componentParentDom;
        };
        BaseComponent.prototype._getCollection = function () {
            return this._collection;
        };
        BaseComponent.prototype._setCollection = function () {
            this._collection._setComponent(this);
        };
        BaseComponent.prototype._insertNode = function (node, nodeIndex) {
            var CollectionModelClass = this._getCollection()._getNodeConstructor(), model = new CollectionModelClass(node);
            this._getCollection()._insertNodeIntoChangesStorage(model, nodeIndex);
            return this;
        };
        BaseComponent.prototype._getComponentSizeInPx = function () {
            var componentMeasureTypes = this.getComponentMeasureTypes(), componentHeight = this.getComponentHeight(), componentWidth = this.getComponentWidth(), parentDom = this._getDom(), res = new Component3d.Size2DModel(componentWidth, componentHeight);
            if (!parentDom || !parentDom.parentNode) {
                return res;
            }
            if (componentMeasureTypes.measureWidthType === "%") {
                res.width = res.width * parentDom.parentNode.clientWidth / 100;
            }
            if (componentMeasureTypes.measureHeightType === "%") {
                res.height = res.height * parentDom.parentNode.clientHeight / 100;
            }
            return res;
        };
        BaseComponent.prototype._getNodeDefaultPosition = function () {
            return this._getBorders().min;
        };
        BaseComponent.prototype._getComponentSizePxWithoutMargin = function () {
            var componentSizeInPx = this._getComponentSizeInPx(), componentMarginW = this._componentMargin.width, componentMarginH = this._componentMargin.height;
            return new Component3d.Size2DModel(componentSizeInPx.width - 2 * componentMarginW, componentSizeInPx.height - 2 * componentMarginH);
        };
        BaseComponent.prototype._getIsMounted = function () {
            return this._componentIsMounted;
        };
        BaseComponent.prototype._setIsMounted = function (mounted) {
            this._componentIsMounted = mounted;
        };
        BaseComponent.prototype._getDirectionCoefficient = function () {
            return -this._componentDirection;
        };
        BaseComponent.prototype._getDom = function () {
            return this._componentDom;
        };
        BaseComponent.prototype._setDom = function (componentDom) {
            this._componentDom = componentDom;
        };
        BaseComponent.prototype._getScrollingPosition = function () {
            return this._componentScrollingPosition;
        };
        BaseComponent.prototype._setScrollingPosition = function (position) {
            this._componentScrollingPosition = position;
        };
        BaseComponent.prototype._getScrollingLib = function () {
            return this._componentScrollingLib;
        };
        BaseComponent.prototype._setScrollingLib = function (scrollingLib) {
            this._componentScrollingLib = scrollingLib;
        };
        BaseComponent.prototype._getCollectionRenderer = function () {
            return this._nodeRenderer;
        };
        BaseComponent.prototype._setCollectionRenderer = function (renderer) {
            this._nodeRenderer = renderer;
        };
        BaseComponent.prototype._getComponentRenderer = function () {
            return this._componentRenderer;
        };
        BaseComponent.prototype._setComponentRenderer = function (componentRenderer) {
            this._componentRenderer = componentRenderer;
        };
        BaseComponent.prototype._getNodeCenterX = function () {
            return (this._getComponentSizePxWithoutMargin().width - this.getNodeWidth()) / 2;
        };
        BaseComponent.prototype._getNodeCenterY = function () {
            return (this._getComponentSizePxWithoutMargin().height - this.getNodeHeight()) / 2;
        };
        BaseComponent.prototype._setInitialScrollingPosition = function () {
            var positionFromIndex = this._getPositionFromIndex();
            this._setScrollingPosition(positionFromIndex);
        };
        return BaseComponent;
    })();
    Component3d.BaseComponent = BaseComponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var BaseNode = (function () {
        function BaseNode(data) {
            this._data = undefined;
            this._dom = undefined;
            this._domProps = {};
            this._collection = undefined;
            this._setData(data);
        }
        BaseNode.prototype._getData = function () {
            return this._data;
        };
        BaseNode.prototype._setData = function (data) {
            this._data = data;
        };
        BaseNode.prototype._getCollection = function () {
            return this._collection;
        };
        BaseNode.prototype._setCollection = function (collection) {
            this._collection = collection;
        };
        BaseNode.prototype._getComponent = function () {
            if (!this._collection) {
                throw new Component3d.OutOfRangeExceptionModel();
            }
            return this._collection._getComponent();
        };
        BaseNode.prototype._getNodeWidth = function () {
            var component = this._getComponent();
            if (!component) {
                throw new Component3d.OutOfRangeExceptionModel();
            }
            return component.getNodeWidth();
        };
        BaseNode.prototype._getNodeHeight = function () {
            var component = this._getComponent();
            if (!component) {
                throw new Component3d.OutOfRangeExceptionModel();
            }
            return component.getNodeHeight();
        };
        BaseNode.prototype._getDom = function () {
            return this._dom;
        };
        BaseNode.prototype._setDom = function (dom) {
            this._dom = dom;
        };
        BaseNode.prototype._getDomProps = function () {
            return this._domProps;
        };
        BaseNode.prototype._getNumberOfStack = function () {
            var collection = this._getCollection(), collectionNumberOfStacks = collection._getNumberOfStacks(), nodeIndex = collection._getIndexOfNodeInCollection(this);
            return nodeIndex % collectionNumberOfStacks;
        };
        BaseNode.prototype._getIndexInStack = function () {
            var collection = this._getCollection(), collectionNumberOfStacks = collection._getNumberOfStacks(), nodeIndex = collection._getIndexOfNodeInCollection(this);
            return Math.trunc(nodeIndex / collectionNumberOfStacks);
        };
        return BaseNode;
    })();
    Component3d.BaseNode = BaseNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var BaseCollection = (function () {
        function BaseCollection() {
            this._component = undefined;
            this._numberOfStacks = 3;
            this._nodes = [];
            this._changesStorage = new Component3d.ChangesStorage();
        }
        BaseCollection.prototype._getNumberOfStacks = function () {
            return this._numberOfStacks;
        };
        BaseCollection.prototype._setNumberOfStacks = function (numberOfStacks) {
            this._numberOfStacks = numberOfStacks;
        };
        BaseCollection.prototype._insertNodeIntoChangesStorage = function (node, nodeIndex) {
            this._changesStorage._insert(node, nodeIndex);
        };
        BaseCollection.prototype._removeNodeFromChangesStorage = function (nodeIndex) {
            this._changesStorage._remove(nodeIndex);
        };
        BaseCollection.prototype._getComponent = function () {
            return this._component;
        };
        BaseCollection.prototype._setComponent = function (component) {
            this._component = component;
        };
        BaseCollection.prototype._getNodes = function () {
            return this._nodes;
        };
        BaseCollection.prototype._applyOngoingChanges = function () {
            var self = this;
            this._changesStorage._getOngoingChanges().map(function (ongoingChange) {
                var nodeIndex = ongoingChange.data.index;
                switch (ongoingChange.type) {
                    case Component3d.OngoingChangeEnum.ADD:
                        self._applyInsertOngoingChange(nodeIndex, ongoingChange.data.element);
                        break;
                    case Component3d.OngoingChangeEnum.REMOVE:
                        self._applyRemoveOngoingChange(nodeIndex);
                        break;
                    default:
                        throw new Component3d.OutOfRangeExceptionModel();
                        break;
                }
            });
            this._changesStorage._clearOngoingChanges();
        };
        BaseCollection.prototype._applyInsertOngoingChange = function (nodeIndex, node) {
            var nodeComponent, nodeRenderer, parentDom;
            node._setCollection(this);
            nodeComponent = node._getComponent();
            nodeRenderer = nodeComponent._getCollectionRenderer()._getNodeRenderer();
            parentDom = nodeComponent._getDom();
            nodeRenderer._initNodeDom(node, parentDom);
            this._insertNoteIntoCollection(nodeIndex, node);
        };
        BaseCollection.prototype._applyRemoveOngoingChange = function (nodeIndex) {
            var node, nodeComponent, nodeRenderer;
            node = this._getNodeFromCollectionByIndex(nodeIndex);
            nodeComponent = this._getComponent();
            nodeRenderer = nodeComponent._getCollectionRenderer()._getNodeRenderer();
            nodeRenderer._detachFromParent(node);
            this._removeNoteFromCollection(nodeIndex);
        };
        BaseCollection.prototype._getCollectionLength = function () {
            return this._getNodes().length;
        };
        BaseCollection.prototype._getNodeFromCollectionByIndex = function (index) {
            return this._getNodes()[index];
        };
        BaseCollection.prototype._getIndexOfNodeInCollection = function (node) {
            return this._getNodes().indexOf(node);
        };
        BaseCollection.prototype._insertNoteIntoCollection = function (nodeIndex, node) {
            this._getNodes().splice(nodeIndex, 0, node);
        };
        BaseCollection.prototype._removeNoteFromCollection = function (nodeIndex) {
            this._getNodes().splice(nodeIndex, 1);
        };
        BaseCollection.prototype._getMaxIndexInStacks = function () {
            var collectionLength = this._getCollectionLength(), lastNodeIndex = collectionLength - 1, numberOfStacks = this._getNumberOfStacks();
            return 1 + Math.trunc(lastNodeIndex / numberOfStacks);
        };
        return BaseCollection;
    })();
    Component3d.BaseCollection = BaseCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var INodeRenderer = (function () {
        function INodeRenderer() {
            this.SELECTING_NODE_ANIMATION_TIME = 600;
        }
        INodeRenderer.prototype._update = function (nodeModel) {
            this._setNodeDomStyle(nodeModel);
        };
        INodeRenderer.prototype._detachFromParent = function (nodeModel) {
            var parentDom = nodeModel._getComponent()._getDom();
            this._removeDom(nodeModel, parentDom);
        };
        INodeRenderer.prototype._initNodeDom = function (nodeModel, parentDom) {
            var nodeDom = this._createComponentDom();
            this._setComponentDomStyle(nodeDom);
            this._initNodeDomChild(nodeModel, nodeDom);
            this._appendComponentDomToParent(nodeDom, parentDom);
            nodeModel._setDom(nodeDom);
        };
        INodeRenderer.prototype._createComponentDom = function () {
            return document.createElement("div");
        };
        INodeRenderer.prototype._setComponentDomStyle = function (nodeDom) {
            nodeDom.style.textAlign = "center";
        };
        INodeRenderer.prototype._appendComponentDomToParent = function (nodeDom, parentDom) {
            parentDom.appendChild(nodeDom);
        };
        INodeRenderer.prototype._initNodeDomChild = function (model, nodeDom) {
            var nodeDomChild = model._getData().dom;
            nodeDomChild.style.maxWidth = "100%";
            nodeDomChild.style.maxHeight = "100%";
            nodeDom.appendChild(nodeDomChild);
        };
        INodeRenderer.prototype._removeDom = function (nodeModel, parentDom) {
            var modelDom = nodeModel._getDom();
            parentDom.removeChild(modelDom);
            nodeModel._setDom(undefined);
        };
        INodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            throw new Component3d.NotImplementedExceptionModel();
        };
        INodeRenderer.prototype._setNodeBaseDomStyle = function (nodeModel) {
            var self = this, component = nodeModel._getComponent(), nodeWidth = nodeModel._getNodeWidth(), nodeHeight = nodeModel._getNodeHeight(), nodeDom = nodeModel._getDom(), nodeMaxWidth = component._getNodeMaxWidth(), nodeMaxHeight = component._getNodeMaxHeight(), nodeMaxWidthWithMargin = nodeMaxWidth - component.getNodeMargin().width * 2, nodeMaxHeightWithMargin = nodeMaxHeight - component.getNodeMargin().height * 2;
            nodeDom.className = "component-item-3d";
            nodeDom.style.position = "absolute";
            nodeDom.style.width = nodeWidth + "px";
            nodeDom.style.height = nodeHeight + "px";
            this._setMaxSizeDomStyleProp(nodeDom, "max-width", nodeMaxWidthWithMargin);
            this._setMaxSizeDomStyleProp(nodeDom, "max-height", nodeMaxHeightWithMargin);
            nodeDom.onmousedown = function (e) {
                component._getScrollingLib().preventClickEvent = false;
            };
            nodeDom.onclick = function (e) {
                if (component._getScrollingLib().preventClickEvent === true) {
                    return;
                }
                self._nodeClickHandler(nodeModel);
            };
        };
        INodeRenderer.prototype._setMaxSizeDomStyleProp = function (nodeDom, nodeDomPropName, nodeMaxPropValue) {
            if (nodeMaxPropValue >= 0) {
                nodeDom.style[nodeDomPropName] = nodeMaxPropValue + "px";
                return;
            }
            if (nodeMaxPropValue < 0) {
                throw new Component3d.OutOfRangeExceptionModel();
            }
        };
        INodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            throw new Component3d.NotImplementedExceptionModel();
        };
        return INodeRenderer;
    })();
    Component3d.INodeRenderer = INodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ICollectionRenderer = (function () {
        function ICollectionRenderer(i3dNodeRenderer) {
            this._i3dNodeRenderer = i3dNodeRenderer;
        }
        ICollectionRenderer.prototype._getNodeRenderer = function () {
            return this._i3dNodeRenderer;
        };
        ICollectionRenderer.prototype._mountOrUpdate = function (collectionModel) {
            var self = this;
            collectionModel._getNodes().map(function (node) {
                self._getNodeRenderer()._update(node);
            });
        };
        ICollectionRenderer.prototype._detachFromParent = function (model) {
            var i, nodes = model._getNodes(), nodesLength = nodes.length, node;
            for (i = nodesLength - 1; i >= 0; i--) {
                node = nodes[i];
                this._getNodeRenderer()._detachFromParent(node);
                nodes.splice(i, 1);
            }
        };
        return ICollectionRenderer;
    })();
    Component3d.ICollectionRenderer = ICollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var I3dComponentRenderer = (function () {
        function I3dComponentRenderer(collectionRenderer) {
            this._nodeRenderer = collectionRenderer;
        }
        I3dComponentRenderer.prototype._getCollectionRenderer = function () {
            return this._nodeRenderer;
        };
        I3dComponentRenderer.prototype._setComponentDom = function (componentModel, directionDomProperty) {
            var collection = componentModel._getCollection();
            this._set3dComponentWrapperDomStyle(componentModel);
            componentModel._setInitialScrollingPosition();
            this._getCollectionRenderer()._mountOrUpdate(collection);
            this._initScroller(componentModel, directionDomProperty);
        };
        I3dComponentRenderer.prototype._detachFromParent = function (componentModel) {
            var collection;
            if (componentModel._getIsMounted() === false) {
                return;
            }
            collection = componentModel._getCollection();
            componentModel._setIsMounted(false);
            this._scrollingOff(componentModel);
            this._getCollectionRenderer()._detachFromParent(collection);
            this._removeDom(componentModel);
        };
        I3dComponentRenderer.prototype._update = function (componentModel) {
            var componentParentDom, componentDom, collection;
            if (componentModel._getIsMounted() === false) {
                componentParentDom = componentModel._getParentDom();
                componentDom = componentModel._getDom();
                componentParentDom.appendChild(componentDom);
                componentModel._setIsMounted(true);
            }
            collection = componentModel._getCollection();
            collection._applyOngoingChanges();
            this._set3dComponentWrapperDomStyle(componentModel);
            this._getCollectionRenderer()._mountOrUpdate(collection);
            componentModel._getScrollingLib()._resetPositionIfNoScrolling(componentModel);
        };
        I3dComponentRenderer.prototype._scrollingOn = function (componentModel) {
            componentModel._getScrollingLib().init();
        };
        I3dComponentRenderer.prototype._scrollingOff = function (componentModel) {
            componentModel._getScrollingLib().destroy();
        };
        I3dComponentRenderer.prototype._initScroller = function (componentModel, domDirection) {
            var componentDom = componentModel._getDom(), componentScrollingModule = new ScrollingModule(componentModel, componentDom, domDirection);
            componentModel._setScrollingLib(componentScrollingModule);
        };
        I3dComponentRenderer.prototype._removeDom = function (componentModel) {
            var componentDom = componentModel._getDom();
            componentDom.parentNode.removeChild(componentDom);
        };
        I3dComponentRenderer.prototype._set3dComponentWrapperDom = function (componentModel) {
            var componentDom = document.createElement("div");
            componentModel._setDom(componentDom);
        };
        I3dComponentRenderer.prototype._set3dComponentWrapperDomStyle = function (componentModel) {
            var componentDom = componentModel._getDom(), componentCamera = componentModel.getCamera(), cameraPerspective = componentCamera.perspective, cameraPerspectiveOriginX = componentCamera.perspectiveOriginX, cameraPerspectiveOriginY = componentCamera.perspectiveOriginY, cameraPerspectiveOrigin = cameraPerspectiveOriginX + "% " + cameraPerspectiveOriginY + "%", componentWidthWithMeasure = componentModel.getComponentWidth() + componentModel.getComponentMeasureTypes().measureWidthType, componentHeightWithMeasure = componentModel.getComponentHeight() + componentModel.getComponentMeasureTypes().measureHeightType, componentBackground = componentModel.getBackground();
            componentDom.style.userSelect = "none";
            componentDom.style.webkitUserSelect = "none";
            componentDom.style.webkitUserDrag = "none";
            componentDom.style.webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
            componentDom.style.touchAction = "none";
            componentDom.style.position = "relative";
            componentDom.style.overflow = "hidden";
            componentDom.style.zIndex = "0";
            componentDom.style.perspective = cameraPerspective + "px";
            componentDom.style["-webkit-perspective"] = cameraPerspective + "px";
            componentDom.style.perspectiveOrigin = cameraPerspectiveOrigin;
            componentDom.style["-webkit-perspective-origin"] = cameraPerspectiveOrigin;
            componentDom.style.width = componentWidthWithMeasure;
            componentDom.style.height = componentHeightWithMeasure;
            componentDom.style.margin = "0px auto";
            componentDom.style.background = componentBackground;
        };
        return I3dComponentRenderer;
    })();
    Component3d.I3dComponentRenderer = I3dComponentRenderer;
})(Component3d || (Component3d = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Component3d;
(function (Component3d) {
    var CoverFlowComponent = (function (_super) {
        __extends(CoverFlowComponent, _super);
        function CoverFlowComponent() {
            var componentRenderer = new Component3d.CoverFlowComponentRenderer(), collectionRenderer = new Component3d.CoverFlowCollectionRenderer(), componentCamera = new Component3d.CameraModel(1000, 50, 50), componentSizeW = 800, componentSizeH = 400, nodeSizeW = 250, nodeSizeH = 300;
            _super.call(this, collectionRenderer, componentRenderer);
            _super.prototype.setCamera.call(this, componentCamera);
            _super.prototype.setComponentSize.call(this, componentSizeW, componentSizeH);
            _super.prototype.setNodeWidth.call(this, nodeSizeW);
            _super.prototype.setNodeHeight.call(this, nodeSizeH);
            _super.prototype.setComponentWidthMeasure.call(this, "px");
            _super.prototype.setComponentHeightMeasure.call(this, "px");
            _super.prototype.setDirection.call(this, 1);
            this._setCollection();
        }
        CoverFlowComponent.prototype._setCollection = function () {
            this._collection = new Component3d.CoverFlowCollection();
            _super.prototype._setCollection.call(this);
        };
        CoverFlowComponent.prototype._getNodeMaxWidth = function () {
            return undefined;
        };
        CoverFlowComponent.prototype._getNodeMaxHeight = function () {
            return this._getComponentSizePxWithoutMargin().height / this._getCollection()._getNumberOfStacks();
        };
        CoverFlowComponent.prototype._getPositionFromIndex = function () {
            return _super.prototype._getNodeDefaultPosition.call(this);
        };
        CoverFlowComponent.prototype._getCentralPos = function (nodeModel, direction) {
            var nodeIndexInStack = nodeModel._getIndexInStack(), nodeXPos = this._getNodeXPos(nodeIndexInStack);
            return this._getNodeCenterX() - direction * nodeXPos;
        };
        CoverFlowComponent.prototype._getNodeYCenterShift = function () {
            var nodeMaxHeight = this._getNodeMaxHeight() - 2 * this.getNodeMargin().height, nodeHeight = this.getNodeHeight();
            return Math.max(0, (nodeMaxHeight - nodeHeight) / 2);
        };
        CoverFlowComponent.prototype._getNodeXPos = function (nodeIndex) {
            return nodeIndex * this.getNodeWidth();
        };
        CoverFlowComponent.prototype._getBorders = function () {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(), componentMargin = this._getNodeCenterX(), componentDirection = this.getDirection(), componentBorderShift = this._getNodeCenterX(), min = -componentMargin * componentDirection + componentBorderShift, max = min + this._getNodeXPos(componentMaxIndexInStacks - 1) - 2 * componentBorderShift;
            if (max < min) {
                max = min;
            }
            return new Component3d.RangeModel(min, max);
        };
        return CoverFlowComponent;
    })(Component3d.BaseComponent);
    Component3d.CoverFlowComponent = CoverFlowComponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowNode = (function (_super) {
        __extends(CoverFlowNode, _super);
        function CoverFlowNode(data) {
            _super.call(this, data);
            this._setDefaultProps();
        }
        CoverFlowNode.prototype._setDefaultProps = function () {
            _super.prototype._getDomProps.call(this).style = {};
            _super.prototype._getDomProps.call(this).style.visibility = "visible";
        };
        CoverFlowNode.prototype._getDegree = function (component, xPos) {
            var maxDegree = 45, componentWidth = component._getComponentSizeInPx().width, nodeWidth = this._getNodeWidth(), leftEdge = componentWidth / 2 - nodeWidth - nodeWidth / 2, rightEdge = componentWidth / 2 + nodeWidth + nodeWidth / 2, xPosCenter = xPos + nodeWidth / 2;
            if (xPosCenter < leftEdge) {
                return maxDegree;
            }
            if (xPosCenter > rightEdge) {
                return -maxDegree;
            }
            return (componentWidth / 2 - xPosCenter) / (3 * nodeWidth / 2) * maxDegree;
        };
        CoverFlowNode.prototype._getZIndex = function (xPos) {
            var componentWidth = this._getComponent()._getComponentSizeInPx().width;
            return -Math.abs(Math.round(componentWidth / 2 - xPos));
        };
        CoverFlowNode.prototype._isVisible = function (xPos) {
            var componentWidth = this._getComponent()._getComponentSizeInPx().width, leftBorderXPos = 0, rightBorderXPos = leftBorderXPos + componentWidth, nodeWidth = this._getNodeWidth(), isLeftBorderIsOk = xPos + nodeWidth >= leftBorderXPos, isRightBorderIsOk = xPos <= rightBorderXPos;
            return isLeftBorderIsOk && isRightBorderIsOk;
        };
        return CoverFlowNode;
    })(Component3d.BaseNode);
    Component3d.CoverFlowNode = CoverFlowNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowCollection = (function (_super) {
        __extends(CoverFlowCollection, _super);
        function CoverFlowCollection() {
            _super.call(this);
        }
        CoverFlowCollection.prototype._getNodeConstructor = function () {
            return Component3d.CoverFlowNode;
        };
        return CoverFlowCollection;
    })(Component3d.BaseCollection);
    Component3d.CoverFlowCollection = CoverFlowCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowNodeRenderer = (function (_super) {
        __extends(CoverFlowNodeRenderer, _super);
        function CoverFlowNodeRenderer() {
            _super.call(this);
        }
        CoverFlowNodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(), nodeIndexInStack = nodeModel._getIndexInStack();
            _super.prototype._setNodeBaseDomStyle.call(this, nodeModel);
            this._setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
        };
        CoverFlowNodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            var component = nodeModel._getComponent(), componentDirection = component.getDirection(), componentCentralPos = component._getCentralPos(nodeModel, componentDirection), componentDestination = -componentCentralPos * componentDirection;
            component._getScrollingLib().scroll(component, componentDestination, this.SELECTING_NODE_ANIMATION_TIME);
        };
        CoverFlowNodeRenderer.prototype._setNodeDomStyleTransform = function (nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var component = nodeModel._getComponent(), componentDirection = component.getDirection(), componentMargin = component.getComponentMargin(), nodeDom = nodeModel._getDom(), nodeDomProps = nodeModel._getDomProps(), nodeMaxHeight = component._getNodeMaxHeight(), nodeYCenterShift = component._getNodeYCenterShift(), nodeXPos = component._getNodeXPos(nodeIndexInStack), nodeMarginX = 0, nodeMarginY = component.getNodeMargin().height, nodePosX = componentMargin.width + nodeMarginX + component._getScrollingPosition() + componentDirection * nodeXPos, nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift, nodePosZ = 0, nodeDegree = nodeModel._getDegree(component, nodePosX), nodeZIndex = nodeModel._getZIndex(nodePosX), nodeIsVisible = nodeModel._isVisible(nodePosX);
            if (nodeIsVisible) {
                nodeDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) rotate3d(0, 1, 0, " + nodeDegree + "deg)";
                nodeDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) rotate3d(0, 1, 0, " + nodeDegree + "deg)";
                nodeDom.style["z-index"] = nodeZIndex;
                nodeDom.style.visibility = "visible";
                nodeDomProps.style.visibility = "visible";
                return;
            }
            if (nodeDomProps.style.visibility !== "hidden") {
                nodeDom.style.visibility = "hidden";
                nodeDomProps.style.visibility = "hidden";
            }
        };
        return CoverFlowNodeRenderer;
    })(Component3d.INodeRenderer);
    Component3d.CoverFlowNodeRenderer = CoverFlowNodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowCollectionRenderer = (function (_super) {
        __extends(CoverFlowCollectionRenderer, _super);
        function CoverFlowCollectionRenderer() {
            _super.call(this, new Component3d.CoverFlowNodeRenderer());
        }
        return CoverFlowCollectionRenderer;
    })(Component3d.ICollectionRenderer);
    Component3d.CoverFlowCollectionRenderer = CoverFlowCollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CoverFlowComponentRenderer = (function (_super) {
        __extends(CoverFlowComponentRenderer, _super);
        function CoverFlowComponentRenderer() {
            _super.call(this, new Component3d.CoverFlowCollectionRenderer());
        }
        CoverFlowComponentRenderer.prototype._setComponentDom = function (model) {
            var directionProperty = "pageX";
            _super.prototype._setComponentDom.call(this, model, directionProperty);
        };
        return CoverFlowComponentRenderer;
    })(Component3d.I3dComponentRenderer);
    Component3d.CoverFlowComponentRenderer = CoverFlowComponentRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListComponent = (function (_super) {
        __extends(ListComponent, _super);
        function ListComponent() {
            var componentRenderer = new Component3d.ListComponentRenderer(), collectionRenderer = new Component3d.ListCollectionRenderer(), componentCamera = new Component3d.CameraModel(1000, 50, -50), componentSizeW = 800, componentSizeH = 400, nodeSizeW = 250, nodeSizeH = 300;
            _super.call(this, collectionRenderer, componentRenderer);
            this._distanceZBetweenNodes = 500;
            _super.prototype.setCamera.call(this, componentCamera);
            _super.prototype.setComponentSize.call(this, componentSizeW, componentSizeH);
            _super.prototype.setNodeWidth.call(this, nodeSizeW);
            _super.prototype.setNodeHeight.call(this, nodeSizeH);
            _super.prototype.setComponentWidthMeasure.call(this, "px");
            _super.prototype.setComponentHeightMeasure.call(this, "px");
            _super.prototype.setDirection.call(this, -1);
            this._setCollection();
        }
        ListComponent.prototype._setCollection = function () {
            this._collection = new Component3d.ListCollection();
            _super.prototype._setCollection.call(this);
        };
        ListComponent.prototype.getDistanceZBetweenNodes = function () {
            return this._distanceZBetweenNodes;
        };
        ListComponent.prototype.setDistanceZBetweenNodes = function (distanceZBetweenNodes) {
            if (typeof distanceZBetweenNodes !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._distanceZBetweenNodes = distanceZBetweenNodes;
            return this;
        };
        ListComponent.prototype._getNodeMaxWidth = function () {
            return this._getComponentSizePxWithoutMargin().width / this._getCollection()._getNumberOfStacks();
        };
        ListComponent.prototype._getNodeMaxHeight = function () {
            return undefined;
        };
        ListComponent.prototype._getPositionFromIndex = function () {
            return _super.prototype._getNodeDefaultPosition.call(this);
        };
        ListComponent.prototype._getCentralPos = function (model) {
            return this.getDistanceZBetweenNodes() * model._getIndexInStack();
        };
        ListComponent.prototype._getNodeXCenterShift = function () {
            var nodeMaxWidth = this._getNodeMaxWidth() - 2 * this.getNodeMargin().width, nodeWidth = this.getNodeWidth();
            return Math.max(0, (nodeMaxWidth - nodeWidth) / 2);
        };
        ListComponent.prototype._getCalculatedYPos = function () {
            return this._getComponentSizeInPx().height - this.getComponentMargin().height - this.getNodeHeight();
        };
        ListComponent.prototype._getBorders = function () {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(), min = 0, max = min + (componentMaxIndexInStacks - 1) * this._distanceZBetweenNodes;
            return new Component3d.RangeModel(min, max);
        };
        return ListComponent;
    })(Component3d.BaseComponent);
    Component3d.ListComponent = ListComponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListNode = (function (_super) {
        __extends(ListNode, _super);
        function ListNode(data) {
            _super.call(this, data);
            this._isSelected = false;
        }
        ListNode.prototype._getIsSelected = function () {
            return this._isSelected;
        };
        ListNode.prototype._setIsSelected = function (isSelected) {
            this._isSelected = isSelected;
        };
        return ListNode;
    })(Component3d.BaseNode);
    Component3d.ListNode = ListNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListCollection = (function (_super) {
        __extends(ListCollection, _super);
        function ListCollection() {
            _super.call(this);
        }
        ListCollection.prototype._getNodeConstructor = function () {
            return Component3d.ListNode;
        };
        ListCollection.prototype._getIsAnySelectedNode = function () {
            var isAnySelected = false;
            this._getNodes().map(function (node) {
                if (node._getIsSelected() === true) {
                    isAnySelected = true;
                }
            });
            return isAnySelected;
        };
        return ListCollection;
    })(Component3d.BaseCollection);
    Component3d.ListCollection = ListCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListNodeRenderer = (function (_super) {
        __extends(ListNodeRenderer, _super);
        function ListNodeRenderer() {
            _super.call(this);
        }
        ListNodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(), nodeIndexInStack = nodeModel._getIndexInStack();
            _super.prototype._setNodeBaseDomStyle.call(this, nodeModel);
            if (nodeModel._getIsSelected()) {
                this._setNodeDomStyleTransformSelected(nodeModel);
            }
            else {
                this._setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
            }
        };
        ListNodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            this._setSelectOrDeselect(nodeModel);
            nodeModel._getComponent()._getCollectionRenderer()._mountOrUpdate(nodeModel._getCollection());
        };
        ListNodeRenderer.prototype._setSelectOrDeselect = function (nodeModel) {
            if (nodeModel._getIsSelected() === true) {
                nodeModel._setIsSelected(false);
                nodeModel._getComponent()._getScrollingLib().preventMouseDownEvent = false;
                return;
            }
            if (nodeModel._getCollection()._getIsAnySelectedNode() === true) {
                return;
            }
            nodeModel._setIsSelected(true);
            nodeModel._getComponent()._getScrollingLib().preventMouseDownEvent = true;
        };
        ListNodeRenderer.prototype._setNodeDomStyleTransform = function (nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var component = nodeModel._getComponent(), componentMargin = component.getComponentMargin(), componentDom = nodeModel._getDom(), nodeMaxWidth = component._getNodeMaxWidth(), nodeXCenterShift = component._getNodeXCenterShift(), nodeMarginX = component.getNodeMargin().width, nodeMarginY = 0, nodePosX = componentMargin.width + nodeMarginX + nodeNumberOfStack * nodeMaxWidth + nodeXCenterShift, nodePosY = component._getCalculatedYPos() + nodeMarginY, nodePosZ = component._getScrollingPosition() - nodeIndexInStack * component.getDistanceZBetweenNodes();
            componentDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            componentDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            componentDom.style.zIndex = Math.trunc(nodePosZ);
        };
        ListNodeRenderer.prototype._setNodeDomStyleTransformSelected = function (nodeModel) {
            var component = nodeModel._getComponent(), componentDom = nodeModel._getDom(), nodePosX = component.getComponentMargin().width + component._getNodeCenterX(), nodePosY = component.getComponentMargin().height + component._getNodeCenterY(), nodePosZ = 0, nodeScaleValue = 1.5, nodeZIndex = 999999999;
            componentDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) scale(" + nodeScaleValue + ")";
            componentDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) scale(" + nodeScaleValue + ")";
            componentDom.style.zIndex = nodeZIndex;
        };
        return ListNodeRenderer;
    })(Component3d.INodeRenderer);
    Component3d.ListNodeRenderer = ListNodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListCollectionRenderer = (function (_super) {
        __extends(ListCollectionRenderer, _super);
        function ListCollectionRenderer() {
            _super.call(this, new Component3d.ListNodeRenderer());
        }
        return ListCollectionRenderer;
    })(Component3d.ICollectionRenderer);
    Component3d.ListCollectionRenderer = ListCollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListComponentRenderer = (function (_super) {
        __extends(ListComponentRenderer, _super);
        function ListComponentRenderer() {
            _super.call(this, new Component3d.ListCollectionRenderer());
        }
        ListComponentRenderer.prototype._setComponentDom = function (model) {
            var directionProperty = "pageY";
            _super.prototype._setComponentDom.call(this, model, directionProperty);
        };
        return ListComponentRenderer;
    })(Component3d.I3dComponentRenderer);
    Component3d.ListComponentRenderer = ListComponentRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomablecomponent = (function (_super) {
        __extends(ListZoomablecomponent, _super);
        function ListZoomablecomponent() {
            var componentRenderer = new Component3d.ListZoomableComponentRenderer(), collectionRenderer = new Component3d.ListZoomableCollectionRenderer(), componentCamera = new Component3d.CameraModel(1000, 50, 50), componentSizeW = 800, componentSizeH = 400, nodeSizeW = 250, nodeSizeH = 300;
            _super.call(this, collectionRenderer, componentRenderer);
            this._componentZoomDirection = 1;
            this._componentDepth = 2;
            _super.prototype.setCamera.call(this, componentCamera);
            _super.prototype.setComponentSize.call(this, componentSizeW, componentSizeH);
            _super.prototype.setNodeWidth.call(this, nodeSizeW);
            _super.prototype.setNodeHeight.call(this, nodeSizeH);
            _super.prototype.setComponentWidthMeasure.call(this, "px");
            _super.prototype.setComponentHeightMeasure.call(this, "px");
            _super.prototype.setDirection.call(this, 1);
            this._setCollection();
        }
        ListZoomablecomponent.prototype._setCollection = function () {
            this._collection = new Component3d.ListZoomableCollection();
            _super.prototype._setCollection.call(this);
        };
        ListZoomablecomponent.prototype.getZoomDirection = function () {
            return this._componentZoomDirection;
        };
        ListZoomablecomponent.prototype.setZoomDirection = function (componentZoomDirection) {
            if (typeof componentZoomDirection !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentZoomDirection = componentZoomDirection;
            return this;
        };
        ListZoomablecomponent.prototype.getDepth = function () {
            return this._componentDepth;
        };
        ListZoomablecomponent.prototype.setDepth = function (componentDepth) {
            if (typeof componentDepth !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._componentDepth = componentDepth;
            return this;
        };
        ListZoomablecomponent.prototype._getNodeMaxWidth = function () {
            return undefined;
        };
        ListZoomablecomponent.prototype._getNodeMaxHeight = function () {
            return this._getComponentSizePxWithoutMargin().height / this._getCollection()._getNumberOfStacks();
        };
        ListZoomablecomponent.prototype._getPositionFromIndex = function () {
            return _super.prototype._getNodeDefaultPosition.call(this);
        };
        ListZoomablecomponent.prototype._getCentralPos = function (nodeModel, nodeDirection) {
            var nodeIndexInStack = nodeModel._getIndexInStack(), nodeXPos = this._getNodeXPos(nodeIndexInStack);
            return this._getNodeCenterX() - nodeDirection * nodeXPos;
        };
        ListZoomablecomponent.prototype._getNodeYCenterShift = function () {
            var nodeMaxHeight = this._getNodeMaxHeight() - 2 * this.getNodeMargin().height, nodeHeight = this.getNodeHeight();
            return Math.max(0, (nodeMaxHeight - nodeHeight) / 2);
        };
        ListZoomablecomponent.prototype._getNodeXPos = function (nodeIndex) {
            return nodeIndex * this.getNodeWidth();
        };
        ListZoomablecomponent.prototype._getBorders = function () {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(), componentMargin = this._getNodeCenterX(), componentDirection = this.getDirection(), componentBorderShift = this._getNodeCenterX(), min = -componentMargin * componentDirection + componentBorderShift, max = min + this._getNodeXPos(componentMaxIndexInStacks - 1) - 2 * componentBorderShift;
            if (max < min) {
                max = min;
            }
            return new Component3d.RangeModel(min, max);
        };
        return ListZoomablecomponent;
    })(Component3d.BaseComponent);
    Component3d.ListZoomablecomponent = ListZoomablecomponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableNode = (function (_super) {
        __extends(ListZoomableNode, _super);
        function ListZoomableNode(data) {
            _super.call(this, data);
        }
        return ListZoomableNode;
    })(Component3d.BaseNode);
    Component3d.ListZoomableNode = ListZoomableNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableCollection = (function (_super) {
        __extends(ListZoomableCollection, _super);
        function ListZoomableCollection() {
            _super.call(this);
        }
        ListZoomableCollection.prototype._getNodeConstructor = function () {
            return Component3d.ListZoomableNode;
        };
        return ListZoomableCollection;
    })(Component3d.BaseCollection);
    Component3d.ListZoomableCollection = ListZoomableCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableNodeRenderer = (function (_super) {
        __extends(ListZoomableNodeRenderer, _super);
        function ListZoomableNodeRenderer() {
            _super.call(this);
        }
        ListZoomableNodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(), nodeIndexInStack = nodeModel._getIndexInStack();
            _super.prototype._setNodeBaseDomStyle.call(this, nodeModel);
            this._setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
        };
        ListZoomableNodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            var component = nodeModel._getComponent(), componentDirection = component.getDirection(), componentCentralPos = component._getCentralPos(nodeModel, componentDirection), componentDestination = -componentCentralPos * componentDirection;
            component._getScrollingLib().scroll(component, componentDestination, this.SELECTING_NODE_ANIMATION_TIME);
        };
        ListZoomableNodeRenderer.prototype._setNodeDomStyleTransform = function (nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var component = nodeModel._getComponent(), componentZoomDirection = component.getZoomDirection(), componentDirection = component.getDirection(), componentDepth = component.getDepth(), componentMargin = component.getComponentMargin(), nodeDom = nodeModel._getDom(), nodeMaxHeight = component._getNodeMaxHeight(), nodeYCenterShift = component._getNodeYCenterShift(), nodeXPos = component._getNodeXPos(nodeIndexInStack), nodeMarginX = 0, nodeMarginY = component.getNodeMargin().height, nodePosX = componentMargin.width + nodeMarginX + component._getScrollingPosition() + componentDirection * nodeXPos, nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift, nodePosZ = componentZoomDirection - componentZoomDirection * Math.abs(nodePosX - component._getNodeCenterX() - componentMargin.width) + componentDepth;
            nodeDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            nodeDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            nodeDom.style.zIndex = Math.round(nodePosZ);
        };
        return ListZoomableNodeRenderer;
    })(Component3d.INodeRenderer);
    Component3d.ListZoomableNodeRenderer = ListZoomableNodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableCollectionRenderer = (function (_super) {
        __extends(ListZoomableCollectionRenderer, _super);
        function ListZoomableCollectionRenderer() {
            _super.call(this, new Component3d.ListZoomableNodeRenderer());
        }
        return ListZoomableCollectionRenderer;
    })(Component3d.ICollectionRenderer);
    Component3d.ListZoomableCollectionRenderer = ListZoomableCollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ListZoomableComponentRenderer = (function (_super) {
        __extends(ListZoomableComponentRenderer, _super);
        function ListZoomableComponentRenderer() {
            _super.call(this, new Component3d.ListZoomableCollectionRenderer());
        }
        ListZoomableComponentRenderer.prototype._setComponentDom = function (model) {
            var directionProperty = "pageX";
            _super.prototype._setComponentDom.call(this, model, directionProperty);
        };
        return ListZoomableComponentRenderer;
    })(Component3d.I3dComponentRenderer);
    Component3d.ListZoomableComponentRenderer = ListZoomableComponentRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableComponent = (function (_super) {
        __extends(TurnableComponent, _super);
        function TurnableComponent() {
            var componentRenderer = new Component3d.TurnableComponentRenderer(), collectionRenderer = new Component3d.TurnableCollectionRenderer(), componentCamera = new Component3d.CameraModel(1000, 50, 50), componentSizeW = 800, componentSizeH = 400, nodeWidth = 250, nodeHeight = 300;
            _super.call(this, collectionRenderer, componentRenderer);
            this._useRotatePositioning = 1;
            this._side = 1;
            this._numberOfNodesInCircle = 1;
            this._useOpacity = true;
            _super.prototype.setCamera.call(this, componentCamera);
            _super.prototype.setComponentSize.call(this, componentSizeW, componentSizeH);
            _super.prototype.setNodeWidth.call(this, nodeWidth);
            _super.prototype.setNodeHeight.call(this, nodeHeight);
            _super.prototype.setComponentWidthMeasure.call(this, "px");
            _super.prototype.setComponentHeightMeasure.call(this, "px");
            _super.prototype.setDirection.call(this, 1);
            this._setCollection();
        }
        TurnableComponent.prototype._setCollection = function () {
            this._collection = new Component3d.TurnableCollection();
            _super.prototype._setCollection.call(this);
        };
        TurnableComponent.prototype.getUseRotatePositioning = function () {
            return this._useRotatePositioning;
        };
        TurnableComponent.prototype.setUseRotatePositioning = function (useRotatePositioning) {
            if (typeof useRotatePositioning !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._useRotatePositioning = useRotatePositioning;
            return this;
        };
        TurnableComponent.prototype.getSide = function () {
            return this._side;
        };
        TurnableComponent.prototype.setSide = function (side) {
            if (typeof side !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._side = side;
            return this;
        };
        TurnableComponent.prototype.getUseOpacity = function () {
            return this._useOpacity;
        };
        TurnableComponent.prototype.setUseOpacity = function (useOpacity) {
            if (typeof useOpacity !== "boolean") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_BOOLEAN());
            }
            this._useOpacity = useOpacity;
            return this;
        };
        TurnableComponent.prototype.getNumberOfNodeInCircle = function () {
            return this._numberOfNodesInCircle;
        };
        TurnableComponent.prototype.setNumberOfNodesInCircle = function (numberOfNodesInCircle) {
            if (typeof numberOfNodesInCircle !== "number") {
                throw new Component3d.ValidationExceptionModel(Component3d.ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }
            this._numberOfNodesInCircle = numberOfNodesInCircle;
            return this;
        };
        TurnableComponent.prototype._getZoomIn = function (side, circleRadius) {
            return side === -1 ? circleRadius : 0;
        };
        TurnableComponent.prototype._getNodeMaxWidth = function () {
            return undefined;
        };
        TurnableComponent.prototype._getNodeMaxHeight = function () {
            return this._getComponentSizePxWithoutMargin().height / this._getCollection()._getNumberOfStacks();
        };
        TurnableComponent.prototype._getCircleLength = function () {
            var nodeWidth = this.getNodeWidth(), numberOfNodesInCircle = this.getNumberOfNodeInCircle();
            return nodeWidth * numberOfNodesInCircle;
        };
        TurnableComponent.prototype._getCircleRadius = function () {
            return this._getCircleLength() / (2 * Math.PI);
        };
        TurnableComponent.prototype._getPositionFromIndex = function () {
            var componentDirection = this.getDirection(), componentCentralPos = _super.prototype._getNodeDefaultPosition.call(this);
            return -componentDirection * componentCentralPos;
        };
        TurnableComponent.prototype._getCentralPos = function (nodeIndex) {
            return this._getPosByIndex(nodeIndex);
        };
        TurnableComponent.prototype._getPosByIndex = function (nodeIndex) {
            return nodeIndex * 180;
        };
        TurnableComponent.prototype._getNodeYCenterShift = function () {
            var nodeMaxHeight = this._getNodeMaxHeight() - 2 * this.getNodeMargin().height, nodeHeight = this.getNodeHeight();
            return Math.max(0, (nodeMaxHeight - nodeHeight) / 2);
        };
        TurnableComponent.prototype._getAngle = function (nodeIndex) {
            var componentDirection = this.getDirection(), numberOfNodesInCircle = this.getNumberOfNodeInCircle();
            return (this._getScrollingPosition() / 90 + componentDirection * nodeIndex * 2) / numberOfNodesInCircle;
        };
        TurnableComponent.prototype._getPxFromAngle = function (angle) {
            return angle * this.getNumberOfNodeInCircle() / 2;
        };
        TurnableComponent.prototype._getBorders = function () {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(), componentBorderShift = this._getPxFromAngle(90), componentMargin = this._getPxFromAngle(this.getComponentMargin().width), min = 0 + componentBorderShift - componentMargin, max = min + this._getPosByIndex(componentMaxIndexInStacks - 1) - 2 * componentBorderShift + 2 * componentMargin;
            if (max < min) {
                max = min;
            }
            return new Component3d.RangeModel(min, max);
        };
        return TurnableComponent;
    })(Component3d.BaseComponent);
    Component3d.TurnableComponent = TurnableComponent;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableNode = (function (_super) {
        __extends(TurnableNode, _super);
        function TurnableNode(data) {
            _super.call(this, data);
            this._setDefaultProps();
        }
        TurnableNode.prototype._setDefaultProps = function () {
            _super.prototype._getDomProps.call(this).style = {};
            _super.prototype._getDomProps.call(this).style.visibility = "visible";
        };
        TurnableNode.prototype._isVisible = function (degree) {
            return -90 <= degree && degree <= 90;
        };
        return TurnableNode;
    })(Component3d.BaseNode);
    Component3d.TurnableNode = TurnableNode;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableCollection = (function (_super) {
        __extends(TurnableCollection, _super);
        function TurnableCollection() {
            _super.call(this);
        }
        TurnableCollection.prototype._getNodeConstructor = function () {
            return Component3d.TurnableNode;
        };
        return TurnableCollection;
    })(Component3d.BaseCollection);
    Component3d.TurnableCollection = TurnableCollection;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableNodeRenderer = (function (_super) {
        __extends(TurnableNodeRenderer, _super);
        function TurnableNodeRenderer() {
            _super.call(this);
        }
        TurnableNodeRenderer.prototype._setNodeDomStyle = function (nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(), nodeIndexInStack = nodeModel._getIndexInStack();
            _super.prototype._setNodeBaseDomStyle.call(this, nodeModel);
            this._set3NodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
        };
        TurnableNodeRenderer.prototype._nodeClickHandler = function (nodeModel) {
            var component = nodeModel._getComponent(), nodeIndexInStack = nodeModel._getIndexInStack(), nodeCentralPos = component._getCentralPos(nodeIndexInStack);
            component._getScrollingLib().scroll(component, nodeCentralPos, this.SELECTING_NODE_ANIMATION_TIME);
        };
        TurnableNodeRenderer.prototype._set3NodeDomStyleTransform = function (nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var PI = 180, component = nodeModel._getComponent(), componentMargin = component.getComponentMargin(), componentCenterX = componentMargin.width + component._getNodeCenterX(), componentRadius = component._getCircleRadius(), componentSide = component.getSide(), nodeDom = nodeModel._getDom(), nodeDomProps = nodeModel._getDomProps(), nodeMaxHeight = component._getNodeMaxHeight(), useCurvePositioning = component.getUseRotatePositioning(), useOpacity = component.getUseOpacity(), nodeAngle = component._getAngle(nodeIndexInStack), nodeAngleShifted = nodeAngle + 0.5, nodeDegree = nodeAngle * PI, nodeRotateValue = componentSide * useCurvePositioning * nodeDegree, nodeIsVisible = nodeModel._isVisible(nodeDegree), nodeYCenterShift = component._getNodeYCenterShift(), nodeMarginY = component.getNodeMargin().height, nodePosX = componentCenterX - componentRadius * Math.cos(Math.PI * nodeAngleShifted), nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift, nodePosZ = -componentRadius + component._getZoomIn(componentSide, componentRadius) + componentSide * componentRadius * Math.sin(Math.PI * nodeAngleShifted);
            if (nodeIsVisible) {
                nodeDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) rotate3d(0, 1, 0, " + nodeRotateValue + "deg)";
                nodeDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) rotate3d(0, 1, 0, " + nodeRotateValue + "deg)";
                nodeDom.style.zIndex = Math.round(nodePosZ);
                nodeDom.style.visibility = "visible";
                nodeDom.style.opacity = useOpacity ? 1 - Math.abs(nodeDegree) / 90 : 1;
                nodeDomProps.style.visibility = "visible";
                return;
            }
            if (nodeDomProps.style.visibility !== "hidden") {
                nodeDom.style.visibility = "hidden";
                nodeDomProps.style.visibility = "hidden";
            }
        };
        return TurnableNodeRenderer;
    })(Component3d.INodeRenderer);
    Component3d.TurnableNodeRenderer = TurnableNodeRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableCollectionRenderer = (function (_super) {
        __extends(TurnableCollectionRenderer, _super);
        function TurnableCollectionRenderer() {
            _super.call(this, new Component3d.TurnableNodeRenderer());
        }
        return TurnableCollectionRenderer;
    })(Component3d.ICollectionRenderer);
    Component3d.TurnableCollectionRenderer = TurnableCollectionRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var TurnableComponentRenderer = (function (_super) {
        __extends(TurnableComponentRenderer, _super);
        function TurnableComponentRenderer() {
            _super.call(this, new Component3d.TurnableCollectionRenderer());
        }
        TurnableComponentRenderer.prototype._setComponentDom = function (model) {
            var directionProperty = "pageX";
            _super.prototype._setComponentDom.call(this, model, directionProperty);
        };
        return TurnableComponentRenderer;
    })(Component3d.I3dComponentRenderer);
    Component3d.TurnableComponentRenderer = TurnableComponentRenderer;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ExceptionMessageEnum = (function () {
        function ExceptionMessageEnum() {
        }
        ExceptionMessageEnum.NOT_IMPLEMENTED = function () {
            return "Method should be implemented";
        };
        ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING = function () {
            return "Should be type of string";
        };
        ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER = function () {
            return "Should be type of number";
        };
        ExceptionMessageEnum.SHOULD_BE_TYPE_OF_BOOLEAN = function () {
            return "Should be type of boolean";
        };
        ExceptionMessageEnum.SHOULD_BE_INSTANCE_OF_HTML_ELEMENT = function () {
            return "Should be instance of HTMLElement";
        };
        ExceptionMessageEnum.SHOULD_BE_INSTANCE_OF_ARRAY = function () {
            return "Should be instance of Array";
        };
        ExceptionMessageEnum.SHOULD_BE_PX_OR_PERCENT = function () {
            return "Should be 'px' or '%'";
        };
        ExceptionMessageEnum.OUT_OF_RANGE = function () {
            return "Out of range";
        };
        return ExceptionMessageEnum;
    })();
    Component3d.ExceptionMessageEnum = ExceptionMessageEnum;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    (function (OngoingChangeEnum) {
        OngoingChangeEnum[OngoingChangeEnum["ADD"] = 1] = "ADD";
        OngoingChangeEnum[OngoingChangeEnum["REMOVE"] = 2] = "REMOVE";
    })(Component3d.OngoingChangeEnum || (Component3d.OngoingChangeEnum = {}));
    var OngoingChangeEnum = Component3d.OngoingChangeEnum;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var BaseExceptionModel = (function () {
        function BaseExceptionModel(name, message) {
            this.name = name;
            this.message = message;
        }
        return BaseExceptionModel;
    })();
    Component3d.BaseExceptionModel = BaseExceptionModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var NotImplementedExceptionModel = (function (_super) {
        __extends(NotImplementedExceptionModel, _super);
        function NotImplementedExceptionModel() {
            _super.call(this, "NotImplementedException", Component3d.ExceptionMessageEnum.NOT_IMPLEMENTED());
        }
        return NotImplementedExceptionModel;
    })(Component3d.BaseExceptionModel);
    Component3d.NotImplementedExceptionModel = NotImplementedExceptionModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var ValidationExceptionModel = (function (_super) {
        __extends(ValidationExceptionModel, _super);
        function ValidationExceptionModel(message) {
            _super.call(this, "ValidationException", message);
        }
        return ValidationExceptionModel;
    })(Component3d.BaseExceptionModel);
    Component3d.ValidationExceptionModel = ValidationExceptionModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var OutOfRangeExceptionModel = (function (_super) {
        __extends(OutOfRangeExceptionModel, _super);
        function OutOfRangeExceptionModel() {
            _super.call(this, "OutOfRangeException", Component3d.ExceptionMessageEnum.OUT_OF_RANGE());
        }
        return OutOfRangeExceptionModel;
    })(Component3d.BaseExceptionModel);
    Component3d.OutOfRangeExceptionModel = OutOfRangeExceptionModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var CameraModel = (function () {
        function CameraModel(perspective, perspectiveOriginX, perspectiveOriginY) {
            this.perspective = perspective;
            this.perspectiveOriginX = perspectiveOriginX;
            this.perspectiveOriginY = perspectiveOriginY;
        }
        return CameraModel;
    })();
    Component3d.CameraModel = CameraModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var Size2DModel = (function () {
        function Size2DModel(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size2DModel;
    })();
    Component3d.Size2DModel = Size2DModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var RangeModel = (function () {
        function RangeModel(min, max) {
            this.min = min;
            this.max = max;
        }
        return RangeModel;
    })();
    Component3d.RangeModel = RangeModel;
})(Component3d || (Component3d = {}));
var Component3d;
(function (Component3d) {
    var OngoingChangeModel = (function () {
        function OngoingChangeModel(type, data) {
            this.type = type;
            this.data = data;
        }
        return OngoingChangeModel;
    })();
    Component3d.OngoingChangeModel = OngoingChangeModel;
})(Component3d || (Component3d = {}));
/**
 * Created by khanas on 10/21/15.
 */
var ScrollingModulePhysics = (function () {
    function ScrollingModulePhysics() {
    }
    Object.defineProperty(ScrollingModulePhysics, "ACCELERATION_CONSTANT", {
        get: function () {
            return 0.010;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModulePhysics, "MIN_VELOCITY", {
        get: function () {
            return 0.005;
        },
        enumerable: true,
        configurable: true
    });
    ScrollingModulePhysics.getMomentum = function (current, positions, lowerMargin, upperMargin, wrapperSize, EASING_BOUNCE) {
        var velocity = ScrollingModulePhysics.getVelocity(positions), momentum = ScrollingModulePhysics.computeMomentum(velocity, current);
        if (momentum.destination < lowerMargin) {
            momentum = ScrollingModulePhysics.computeSnap(lowerMargin, wrapperSize, velocity, current);
            momentum.bounce = EASING_BOUNCE;
        }
        else if (momentum.destination > upperMargin) {
            momentum = ScrollingModulePhysics.computeSnap(upperMargin, wrapperSize, velocity, current);
            momentum.bounce = EASING_BOUNCE;
        }
        return momentum;
    };
    ScrollingModulePhysics.getVelocity = function (positions) {
        var i, velocity, positionsLength = positions.length, lastTime, lastPos, firstTime, firstPos, period = 100;
        if (positionsLength < 2) {
            return 0;
        }
        lastTime = positions[positionsLength - 1].time;
        lastPos = positions[positionsLength - 1].value;
        i = positionsLength - 2;
        while (i >= 0 && (positions[i].time - lastTime < period)) {
            firstTime = positions[i].time;
            firstPos = positions[i].value;
            i--;
        }
        if (lastTime - firstTime === 0) {
            return 0;
        }
        velocity = (lastPos - firstPos) / (lastTime - firstTime);
        if (Math.abs(velocity) < ScrollingModulePhysics.MIN_VELOCITY) {
            return 0;
        }
        return velocity;
    };
    ScrollingModulePhysics.computeMomentum = function (velocity, current) {
        var acceleration = ScrollingModulePhysics.ACCELERATION_CONSTANT, time = Math.abs(velocity) / acceleration, distance = velocity / 2 * time;
        return {
            destination: current + distance,
            time: time
        };
    };
    ScrollingModulePhysics.computeSnap = function (start, end, velocity, current) {
        var destination = start + Math.sqrt(end) * (velocity / 16);
        return {
            destination: destination,
            time: Math.abs((destination - current) / velocity)
        };
    };
    return ScrollingModulePhysics;
})();
/**
 * Created by khanas on 10/19/15.
 */
var ScrollingModuleHelper = (function () {
    function ScrollingModuleHelper() {
    }
    ScrollingModuleHelper.getFloatWithPerception = function (value) {
        var perception = 1000;
        return Math.round(value * perception) / perception;
    };
    Object.defineProperty(ScrollingModuleHelper, "IS_TOUCH_EVENT_TYPE", {
        get: function () {
            return "ontouchstart" in window;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "SCROLLING_START_EVENT_NAME", {
        get: function () {
            return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchstart" : "mousedown";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "SCROLLING_MOVE_EVENT_NAME", {
        get: function () {
            return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchmove" : "mousemove";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "SCROLLING_END_EVENT_NAME", {
        get: function () {
            return ScrollingModuleHelper.IS_TOUCH_EVENT_TYPE ? "touchend" : "mouseup";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "CURRENT_TIME", {
        get: function () {
            return (Date.now || function () { return new Date().getTime(); })();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "GET_EASING_BOUNCE", {
        get: function () {
            return BezierEasing(0.33, 0.33, 0.66, 0.81);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "GET_EASING_REGULAR", {
        get: function () {
            return BezierEasing(0.33, 0.66, 0.66, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "GET_BOUNCE_TIME", {
        get: function () {
            return 300;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollingModuleHelper, "GET_OUT_OF_THE_BOX_ACCELERATION", {
        get: function () {
            return 0.3;
        },
        enumerable: true,
        configurable: true
    });
    ScrollingModuleHelper.getCoordinateFromEvent = function (e) {
        return e.touches ? e.touches[0] : e;
    };
    ScrollingModuleHelper.getTimelineItem = function (value, time) {
        return {
            value: value,
            time: time
        };
    };
    ScrollingModuleHelper.getPositionsFromCoordinates = function (coordinates, direction, directionKoef) {
        var positions = [];
        coordinates.map(function (coordinate) {
            var positionWithTime = ScrollingModuleHelper.getTimelineItem(directionKoef * (-coordinate.value[direction]), coordinate.time);
            positions.push(positionWithTime);
        });
        return positions;
    };
    return ScrollingModuleHelper;
})();
/**
 * Created by khanas on 10/19/15.
 */
var ScrollingModule = (function () {
    function ScrollingModule(model, scrollableDom, direction) {
        this.RAF = window.requestAnimationFrame.bind(window);
        this.CAF = window.cancelAnimationFrame.bind(window);
        this.lastFrameId = undefined;
        this.preventMouseDownEvent = false;
        this.preventClickEvent = false;
        this.model = model;
        this.scrollableDom = scrollableDom;
        this.direction = direction;
        this.isScrolling = false;
        this.isAnimating = false;
        this.mouseDownHandler = this._getMouseDownHandler(model, scrollableDom, direction);
        this.scrollableDom.addEventListener(ScrollingModuleHelper.SCROLLING_START_EVENT_NAME, this.mouseDownHandler, false);
    }
    ScrollingModule.prototype.scroll = function (model, animationDestination, animationDuration) {
        if (this.isAnimating === false) {
            this._resetAnimation(model, animationDestination, animationDuration);
        }
    };
    ScrollingModule.prototype.destroy = function () {
        this._stopScrolling();
        this.scrollableDom.removeEventListener(ScrollingModuleHelper.SCROLLING_START_EVENT_NAME, this.mouseDownHandler, false);
    };
    ScrollingModule.prototype._getMouseDownHandler = function (model, scrollableDom, direction) {
        var self = this;
        return function (eStart) {
            var coordinatesWithTime = [], firstCoordinate = ScrollingModuleHelper.getCoordinateFromEvent(eStart), previousCoordinate, coordinateWithTime;
            if (self.preventMouseDownEvent === true) {
                return;
            }
            previousCoordinate = firstCoordinate;
            coordinateWithTime = ScrollingModuleHelper.getTimelineItem(firstCoordinate, ScrollingModuleHelper.CURRENT_TIME);
            coordinatesWithTime.push(coordinateWithTime);
            self.isAnimating = false;
            self._stopScrolling();
            scrollableDom.addEventListener(ScrollingModuleHelper.SCROLLING_MOVE_EVENT_NAME, onTouchMove, false);
            window.addEventListener(ScrollingModuleHelper.SCROLLING_END_EVENT_NAME, onTouchEnd, false);
            function onTouchMove(eMove) {
                var newCoordinate = ScrollingModuleHelper.getCoordinateFromEvent(eMove), shift = newCoordinate[self.direction] - previousCoordinate[self.direction], adjustedValue = model._getScrollingPosition() + self._getAcceleratedVelocity(model, shift);
                self.preventClickEvent = true;
                previousCoordinate = newCoordinate;
                coordinateWithTime = ScrollingModuleHelper.getTimelineItem(newCoordinate, ScrollingModuleHelper.CURRENT_TIME);
                coordinatesWithTime.push(coordinateWithTime);
                model._setScrollingPosition(adjustedValue);
                model._getCollectionRenderer()._mountOrUpdate(model._getCollection());
            }
            function onTouchEnd(eEnd) {
                var positions, momentum, borders;
                scrollableDom.removeEventListener(ScrollingModuleHelper.SCROLLING_MOVE_EVENT_NAME, onTouchMove, false);
                window.removeEventListener(ScrollingModuleHelper.SCROLLING_END_EVENT_NAME, onTouchEnd, false);
                if (self._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME)) {
                    return;
                }
                self.isScrolling = true;
                borders = model._getBorders();
                positions = ScrollingModuleHelper.getPositionsFromCoordinates(coordinatesWithTime, direction, -model._getDirectionCoefficient());
                momentum = ScrollingModulePhysics.getMomentum(model._getDirectionCoefficient() * model._getScrollingPosition(), positions, borders.min, borders.max, borders.max - borders.min, ScrollingModuleHelper.GET_EASING_BOUNCE);
                self._animateScroller(model, momentum.time, momentum.destination, momentum.bounce);
            }
        };
    };
    ScrollingModule.prototype._resetPositionIfNoScrolling = function (model) {
        this._stopScrolling();
        this._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME);
    };
    ScrollingModule.prototype._stopScrolling = function () {
        if (this.isScrolling === true) {
            this.isScrolling = false;
            this.CAF(this.lastFrameId);
        }
    };
    ScrollingModule.prototype._getAcceleratedVelocity = function (model, velocity) {
        var self = this, borders = model._getBorders(), min = borders.min, max = borders.max, current = model._getDirectionCoefficient() * model._getScrollingPosition();
        if (current < min || current > max) {
            return velocity * ScrollingModuleHelper.GET_OUT_OF_THE_BOX_ACCELERATION;
        }
        return velocity;
    };
    ScrollingModule.prototype._resetPosition = function (model, time) {
        var self = this, borders = model._getBorders(), min = borders.min, max = borders.max, current = model._getDirectionCoefficient() * model._getScrollingPosition();
        if (current < min) {
            self._resetAnimation(model, min, time);
            return true;
        }
        if (current > max) {
            self._resetAnimation(model, max, time);
            return true;
        }
        return false;
    };
    ScrollingModule.prototype._resetAnimation = function (model, animationDestination, animationDuration) {
        this._animateScroller(model, animationDuration, animationDestination, ScrollingModuleHelper.GET_EASING_REGULAR);
    };
    ScrollingModule.prototype._animateScroller = function (model, animationDuration, animationDestination, easingFn) {
        var self = this, animationStartTime = ScrollingModuleHelper.CURRENT_TIME, animationEndTime = animationStartTime + animationDuration, animationStartPos = model._getScrollingPosition(), animationDistance = model._getDirectionCoefficient() * animationDestination - animationStartPos, stepValue;
        easingFn || (easingFn = ScrollingModuleHelper.GET_EASING_REGULAR);
        function animationStep() {
            var startStepTime = ScrollingModuleHelper.CURRENT_TIME, easing;
            if (startStepTime >= animationEndTime) {
                self.isAnimating = false;
                self.lastFrameId = null;
                model._setScrollingPosition(model._getDirectionCoefficient() * animationDestination);
                if (!self._resetPosition(model, ScrollingModuleHelper.GET_BOUNCE_TIME)) {
                    self.isScrolling = false;
                }
                return;
            }
            startStepTime = (startStepTime - animationStartTime) / animationDuration;
            easing = easingFn.get(startStepTime);
            stepValue = ScrollingModuleHelper.getFloatWithPerception(animationStartPos + animationDistance * easing);
            model._setScrollingPosition(stepValue);
            model._getCollectionRenderer()._mountOrUpdate(model._getCollection());
            if (self.isAnimating) {
                self.lastFrameId = self.RAF(animationStep);
            }
        }
        self.isAnimating = true;
        animationStep();
    };
    return ScrollingModule;
})();
var Component3d;
(function (Component3d) {
    var ChangesStorage = (function () {
        function ChangesStorage() {
            this._ongoingChanges = [];
        }
        ChangesStorage.prototype._remove = function (nodeIndex) {
            var ongoingChange = new Component3d.OngoingChangeModel(Component3d.OngoingChangeEnum.REMOVE, {
                index: nodeIndex
            });
            this._addOngoingChange(ongoingChange);
        };
        ChangesStorage.prototype._insert = function (node, nodeIndex) {
            var ongoingChange = new Component3d.OngoingChangeModel(Component3d.OngoingChangeEnum.ADD, {
                element: node,
                index: nodeIndex
            });
            this._addOngoingChange(ongoingChange);
        };
        ChangesStorage.prototype._getOngoingChanges = function () {
            return this._ongoingChanges;
        };
        ChangesStorage.prototype._clearOngoingChanges = function () {
            this._ongoingChanges = [];
        };
        ChangesStorage.prototype._addOngoingChange = function (change) {
            this._ongoingChanges.push(change);
        };
        return ChangesStorage;
    })();
    Component3d.ChangesStorage = ChangesStorage;
})(Component3d || (Component3d = {}));
if (typeof module !== "undefined" && module !== null && module.exports) {
    module.exports = Component3d;
}
else if (typeof define === "function" && define.amd) {
    define('components/../../libs/scrolling-component',[], function () {
        return Component3d;
    });
}
else if (typeof window !== "undefined" && Component3d) {
    window.Component3d = Component3d;
}
;
/**
 * # dress.Scroller
 * Scrollable component.
 * @class dress.Scroller
 * @author Rostyslav Khanas <r.khanas@samsung.com>
 */
(function () {

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

        }());

}));
