module Component3d {

    export class CoverFlowNodeRenderer extends INodeRenderer {

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
                componentDirection = component.getDirection(),
                componentMargin = component.getComponentMargin(),
                nodeDom = nodeModel._getDom(),
                nodeDomProps = nodeModel._getDomProps(),
                nodeMaxHeight = component._getNodeMaxHeight(),
                nodeYCenterShift = component._getNodeYCenterShift(),
                nodeXPos = component._getNodeXPos(nodeIndexInStack),
                nodeMarginX = 0, //component.getNodeMargin().width,
                nodeMarginY = component.getNodeMargin().height,
                nodePosX = componentMargin.width + nodeMarginX + component._getScrollingPosition() + componentDirection * nodeXPos,
                nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift,
                nodePosZ = 0,
                nodeDegree = nodeModel._getDegree(component, nodePosX),
                nodeZIndex = nodeModel._getZIndex(nodePosX),
                nodeIsVisible = nodeModel._isVisible(nodePosX);

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
        }
    }
}