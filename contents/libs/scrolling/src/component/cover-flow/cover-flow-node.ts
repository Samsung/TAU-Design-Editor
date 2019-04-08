module Component3d {

    export class CoverFlowNode extends BaseNode {

        constructor(data) {
            super(data);
            this._setDefaultProps();
        }

        _setDefaultProps() {
            super._getDomProps().style = {};
            super._getDomProps().style.visibility = "visible";
        }

        _getDegree(component, xPos) {
            var maxDegree = 90,
                componentWidth = component._getComponentSizeInPx().width,
                nodeWidth = this._getNodeWidth(),
                leftEdge = componentWidth / 2 - nodeWidth - nodeWidth / 2,
                rightEdge = componentWidth / 2 + nodeWidth + nodeWidth / 2,
                xPosCenter = xPos + nodeWidth / 2;

            if (xPosCenter < leftEdge) {
                return maxDegree;
            }

            if (xPosCenter > rightEdge) {
                return -maxDegree;
            }

            return (componentWidth / 2 - xPosCenter) / (3 * nodeWidth / 2) * maxDegree;
        }

        _getZIndex(xPos) {
            var componentWidth = this._getComponent()._getComponentSizeInPx().width;

            return - Math.abs(Math.round(componentWidth / 2 - xPos));
        }

        _isVisible(xPos) {
            var componentWidth = this._getComponent()._getComponentSizeInPx().width,
                leftBorderXPos = 0,
                rightBorderXPos = leftBorderXPos + componentWidth,
                nodeWidth = this._getNodeWidth(),
                isLeftBorderIsOk = xPos + nodeWidth >= leftBorderXPos,
                isRightBorderIsOk = xPos <= rightBorderXPos;

            return isLeftBorderIsOk && isRightBorderIsOk;
        }
    }

}