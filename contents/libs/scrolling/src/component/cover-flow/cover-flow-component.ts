module Component3d {

    export class CoverFlowComponent extends BaseComponent {

        constructor() {
            var componentRenderer = new CoverFlowComponentRenderer(),
                collectionRenderer = new CoverFlowCollectionRenderer(),
                componentCamera = new CameraModel(1000, 50, 50),
                componentSizeW = 800,
                componentSizeH = 400,
                nodeSizeW = 250,
                nodeSizeH = 300;

            super(collectionRenderer, componentRenderer);

            super.setCamera(componentCamera);
            super.setComponentSize(componentSizeW, componentSizeH);
            super.setNodeWidth(nodeSizeW);
            super.setNodeHeight(nodeSizeH);
            super.setComponentWidthMeasure("px");
            super.setComponentHeightMeasure("px");
            super.setDirection(1);
            this._setCollection();
        }

        _setCollection() {
            this._collection = new CoverFlowCollection();
            super._setCollection();
        }

        _getNodeMaxWidth(): any {
            return undefined;
        }

        _getNodeMaxHeight(): any {
            return this._getComponentSizePxWithoutMargin().height / this._getCollection()._getNumberOfStacks();
        }

        _getPositionFromIndex() {
            return super._getNodeDefaultPosition();
        }

        _getCentralPos(nodeModel, direction) {
            var nodeIndexInStack = nodeModel._getIndexInStack(),
                nodeXPos = this._getNodeXPos(nodeIndexInStack);

            return this._getNodeCenterX() - direction * nodeXPos;
        }

        _getNodeYCenterShift() {
            var nodeMaxHeight = this._getNodeMaxHeight() - 2 * this.getNodeMargin().height,
                nodeHeight = this.getNodeHeight();

            return Math.max(0, (nodeMaxHeight - nodeHeight) / 2);
        }

        _getNodeXPos(nodeIndex) {
            return nodeIndex * this.getNodeWidth();
        }

        _getBorders() {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(),
                componentMargin = this._getNodeCenterX(),
                componentDirection = this.getDirection(),
                componentBorderShift = this._getNodeCenterX(),
                min = - componentMargin * componentDirection + componentBorderShift,
                max = min + this._getNodeXPos(componentMaxIndexInStacks - 1) - 2 * componentBorderShift;

            if (max < min) {
                max = min;
            }

            return new RangeModel(min, max);
        }
    }

}