module Component3d {

    export class INodeRenderer {
        public SELECTING_NODE_ANIMATION_TIME: number;

        constructor() {
            this.SELECTING_NODE_ANIMATION_TIME = 600;
        }

        _update(nodeModel) {
            this._setNodeDomStyle(nodeModel);
        }

        _detachFromParent(nodeModel) {
            var parentDom = nodeModel._getComponent()._getDom();

            this._removeDom(nodeModel, parentDom);
        }

        _initNodeDom(nodeModel, parentDom) {
            var nodeDom = this._createComponentDom();

            this._setComponentDomStyle(nodeDom);
            this._initNodeDomChild(nodeModel, nodeDom);
            this._appendComponentDomToParent(nodeDom, parentDom);

            nodeModel._setDom(nodeDom);
        }

        _createComponentDom() {
            return document.createElement("div");
        }

        _setComponentDomStyle(nodeDom) {
            nodeDom.style.textAlign = "center";
        }

        _appendComponentDomToParent(nodeDom, parentDom) {
            parentDom.appendChild(nodeDom);
        }

        _initNodeDomChild(model, nodeDom) {
            var nodeDomChild = model._getData().dom;

            nodeDomChild.style.maxWidth = "100%";
            nodeDomChild.style.maxHeight = "100%";
            nodeDomChild.style.position = "relative";
            nodeDomChild.style.top = "50%";
            nodeDomChild.style["-webkit-transform"] = "translateY(-50%)";
            nodeDomChild.style["-ms-transform"] = "translateY(-50%)";
            nodeDomChild.style.transform = "translateY(-50%)";

            nodeDom.appendChild(nodeDomChild);
        }

        _removeDom(nodeModel, parentDom) {
            var modelDom = nodeModel._getDom();

            parentDom.removeChild(modelDom);

            nodeModel._setDom(undefined);
        }

        _setNodeDomStyle(nodeModel) {
            throw new NotImplementedExceptionModel();
        }

        _setNodeBaseDomStyle(nodeModel) {
            var self = this,
                component = nodeModel._getComponent(),
                nodeWidth = nodeModel._getNodeWidth(),
                nodeHeight = nodeModel._getNodeHeight(),
                nodeDom = nodeModel._getDom(),
                nodeMaxWidth = component._getNodeMaxWidth(),
                nodeMaxHeight = component._getNodeMaxHeight(),
                nodeMaxWidthWithMargin = nodeMaxWidth - component.getNodeMargin().width * 2,
                nodeMaxHeightWithMargin = nodeMaxHeight - component.getNodeMargin().height * 2;

            nodeDom.className = "component-item-3d";
            nodeDom.style.position = "absolute";
            nodeDom.style.width = nodeWidth + "px";
            nodeDom.style.height = nodeHeight + "px";
            this._setMaxSizeDomStyleProp(nodeDom, "max-width", nodeMaxWidthWithMargin);
            this._setMaxSizeDomStyleProp(nodeDom, "max-height", nodeMaxHeightWithMargin);
            nodeDom.onmousedown = function(e) {
                component._getScrollingLib().preventClickEvent = false;
            };
            nodeDom.onclick = function(e) {

                if (component._getScrollingLib().preventClickEvent === true) {
                    return;
                }

                self._nodeClickHandler(nodeModel);
            };
        }

        _setMaxSizeDomStyleProp(nodeDom, nodeDomPropName, nodeMaxPropValue) {

            if (nodeMaxPropValue >= 0) {
                nodeDom.style[nodeDomPropName] = nodeMaxPropValue + "px";
                return;
            }

            if (nodeMaxPropValue < 0) {
                throw new OutOfRangeExceptionModel();
            }
        }

        _nodeClickHandler(nodeModel) {
            throw new NotImplementedExceptionModel();
        }
    }
}