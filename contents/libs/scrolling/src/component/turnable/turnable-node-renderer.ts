module Component3d {

    export class TurnableNodeRenderer extends INodeRenderer {

        constructor() {
            super();
        }

        _setNodeDomStyle(nodeModel) {
            var nodeNumberOfStack = nodeModel._getNumberOfStack(),
                nodeIndexInStack = nodeModel._getIndexInStack();

            super._setNodeBaseDomStyle(nodeModel);

            this._set3NodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack);
        }

        _nodeClickHandler(nodeModel) {
            var component = nodeModel._getComponent(),
                nodeIndexInStack = nodeModel._getIndexInStack(),
                nodeCentralPos = component._getCentralPos(nodeIndexInStack);

            component._getScrollingLib().scroll(component, nodeCentralPos, this.SELECTING_NODE_ANIMATION_TIME);
        }

        _set3NodeDomStyleTransform(nodeModel, nodeNumberOfStack, nodeIndexInStack) {
            var PI = 180,
                component = nodeModel._getComponent(),
                componentMargin = component.getComponentMargin(),
                componentCenterX = componentMargin.width + component._getNodeCenterX(),
                componentRadius = component._getCircleRadius(),
                componentSide = component.getSide(),
                nodeDom = nodeModel._getDom(),
                nodeDomProps = nodeModel._getDomProps(),
                nodeMaxHeight = component._getNodeMaxHeight(),
                useCurvePositioning = component.getUseRotatePositioning(),
                useOpacity = component.getUseOpacity(),
                nodeAngle = component._getAngle(nodeIndexInStack),
                nodeAngleShifted = nodeAngle + 0.5,
                nodeDegree = nodeAngle * PI,
                nodeRotateValue = componentSide * useCurvePositioning * nodeDegree,
                nodeIsVisible = nodeModel._isVisible(nodeDegree),
                nodeYCenterShift = component._getNodeYCenterShift(),
            //nodeMarginX = component.getNodeMargin().width,
                nodeMarginY = component.getNodeMargin().height,
                nodePosX = componentCenterX - componentRadius * Math.cos(Math.PI * nodeAngleShifted),
                nodePosY = componentMargin.height + nodeMarginY + nodeNumberOfStack * nodeMaxHeight + nodeYCenterShift,
                nodePosZ = - componentRadius + component._getZoomIn(componentSide, componentRadius) +  componentSide * componentRadius * Math.sin(Math.PI * nodeAngleShifted);

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
        }
    }
}