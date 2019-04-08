module Component3d {

    export class ListComponent extends BaseComponent {
        private _distanceZBetweenNodes: any;

        constructor() {
            var componentRenderer = new ListComponentRenderer(),
                collectionRenderer = new ListCollectionRenderer(),
                componentCamera = new CameraModel(1000, 50, -50),
                componentSizeW = 800,
                componentSizeH = 400,
                nodeSizeW = 250,
                nodeSizeH = 300;

            super(collectionRenderer, componentRenderer);

            this._distanceZBetweenNodes = 500;

            super.setCamera(componentCamera);
            super.setComponentSize(componentSizeW, componentSizeH);
            super.setNodeWidth(nodeSizeW);
            super.setNodeHeight(nodeSizeH);
            super.setComponentWidthMeasure("px");
            super.setComponentHeightMeasure("px");
            super.setDirection(-1);
            this._setCollection();
        }

        _setCollection() {
            this._collection = new ListCollection();
            super._setCollection();
        }

        getDistanceZBetweenNodes() {
            return this._distanceZBetweenNodes;
        }

        setDistanceZBetweenNodes(distanceZBetweenNodes) {

            if (typeof distanceZBetweenNodes !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._distanceZBetweenNodes = distanceZBetweenNodes;

            return this;
        }

        _getNodeMaxWidth(): any {
            return this._getComponentSizePxWithoutMargin().width / this._getCollection()._getNumberOfStacks();
        }

        _getNodeMaxHeight(): any {
            return undefined;
        }

        _getPositionFromIndex() {
            return super._getNodeDefaultPosition();
        }

        _getCentralPos(model) {
            return this.getDistanceZBetweenNodes() * model._getIndexInStack();
        }

        _getNodeXCenterShift() {
            var nodeMaxWidth = this._getNodeMaxWidth() - 2 * this.getNodeMargin().width,
                nodeWidth = this.getNodeWidth();

            return Math.max(0, (nodeMaxWidth - nodeWidth) / 2);
        }

        // TODO: fix back limit
        _getCalculatedYPos() {
            return this._getComponentSizeInPx().height - this.getComponentMargin().height - this.getNodeHeight();
            /*return this._getNodeCenterY();*/
        }

        _getBorders() {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(),
                min = 0,
                max = min + (componentMaxIndexInStacks - 1) * this._distanceZBetweenNodes;

            return  new RangeModel(min, max);
        }
    }

}