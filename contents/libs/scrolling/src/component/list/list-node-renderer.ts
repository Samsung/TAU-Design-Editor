module Component3d {

    export class ListNodeRenderer extends INodeRenderer {

        constructor() {

            super();
        }

        _setNodeDomStyle(nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(),
                nodeIndexInStack = nodeModel._getIndexInStack();

            super._setNodeBaseDomStyle(nodeModel);

            if (nodeModel._getIsSelected()) {
                this._setNodeDomStyleTransformSelected(nodeModel);
            } else {
                this._setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
            }
        }

        _nodeClickHandler(nodeModel) {
            this._setSelectOrDeselect(nodeModel);
            nodeModel._getComponent()._getCollectionRenderer()._mountOrUpdate(nodeModel._getCollection());
        }

        _setSelectOrDeselect(nodeModel) {

            // deselection
            if (nodeModel._getIsSelected() === true) {
                nodeModel._setIsSelected(false);
                nodeModel._getComponent()._getScrollingLib().preventMouseDownEvent = false;
                return;
            }

            // if anyone else is selected then ignore click
            if (nodeModel._getCollection()._getIsAnySelectedNode() === true) {
                return;
            }

            // set selected
            nodeModel._setIsSelected(true);
            nodeModel._getComponent()._getScrollingLib().preventMouseDownEvent = true;
        }

        _setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var component = nodeModel._getComponent(),
                componentMargin = component.getComponentMargin(),
                componentDom = nodeModel._getDom(),
                nodeMaxWidth = component._getNodeMaxWidth(),
                nodeXCenterShift = component._getNodeXCenterShift(),
                nodeMarginX = component.getNodeMargin().width,
                nodeMarginY = 0, //component.getNodeMargin().height,
                nodePosX = componentMargin.width + nodeMarginX + nodeNumberOfStack * nodeMaxWidth + nodeXCenterShift,
                nodePosY = component._getCalculatedYPos() + nodeMarginY,
                nodePosZ = component._getScrollingPosition() - nodeIndexInStack * component.getDistanceZBetweenNodes();

            componentDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            componentDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            componentDom.style.zIndex = Math.trunc(nodePosZ);
        }

        _setNodeDomStyleTransformSelected(nodeModel) {
            var component = nodeModel._getComponent(),
                componentDom = nodeModel._getDom(),
                nodePosX = component.getComponentMargin().width + component._getNodeCenterX(),
                nodePosY = component.getComponentMargin().height + component._getNodeCenterY(),
                nodePosZ = 0,
                nodeScaleValue = 1.5,
                nodeZIndex = 999999999;

            componentDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) scale(" + nodeScaleValue + ")";
            componentDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px) scale(" + nodeScaleValue + ")";
            componentDom.style.zIndex = nodeZIndex;
        }
    }
}