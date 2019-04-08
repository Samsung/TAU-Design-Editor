module Component3d {

    export class ListZoomableNodeRenderer extends INodeRenderer {

        constructor() {
            super();
        }

        _setNodeDomStyle(nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(),
                nodeIndexInStack = nodeModel._getIndexInStack();

            super._setNodeBaseDomStyle(nodeModel);

            this._setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
        }

        _nodeClickHandler(nodeModel) {
            var component = nodeModel._getComponent(),
                componentDirection = component.getDirection(),
                componentCentralPos = component._getCentralPos(nodeModel, componentDirection),
                componentDestination = - componentCentralPos * componentDirection;

            component._getScrollingLib().scroll(component, componentDestination, this.SELECTING_NODE_ANIMATION_TIME);
        }

        _setNodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var component = nodeModel._getComponent(),
                componentZoomDirection = component.getZoomDirection(),
                componentDirection = component.getDirection(),
                componentDepth = component.getDepth(),
                componentMargin = component.getComponentMargin(),
                nodeDom = nodeModel._getDom(),
                nodeMaxHeight = component._getNodeMaxHeight(),
                nodeYCenterShift = component._getNodeYCenterShift(),
                nodeXPos = component._getNodeXPos(nodeIndexInStack),
                nodeMarginX = 0, //component.getNodeMargin().width,
                nodeMarginY = component.getNodeMargin().height,
                nodePosX = componentMargin.width + nodeMarginX + component._getScrollingPosition() + componentDirection * nodeXPos,
                nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift,
                nodePosZ = componentZoomDirection - componentZoomDirection * Math.abs(nodePosX - component._getNodeCenterX() - componentMargin.width) + componentDepth;

            nodeDom.style.transform = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            nodeDom.style["-webkit-transform"] = "translate3d(" + nodePosX + "px, " + nodePosY + "px, " + nodePosZ + "px)";
            nodeDom.style.zIndex = Math.round(nodePosZ);
        }
    }
}