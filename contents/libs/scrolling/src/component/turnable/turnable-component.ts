module Component3d {

    export class TurnableComponent extends BaseComponent {
        private _useRotatePositioning: any;
        private _side: any;
        private _numberOfNodesInCircle: any;
        private _useOpacity: any;

        constructor() {
            var componentRenderer = new TurnableComponentRenderer(),
                collectionRenderer = new TurnableCollectionRenderer(),
                componentCamera = new CameraModel(1000, 50, 50),
                componentSizeW = 800,
                componentSizeH = 400,
                nodeWidth = 250,
                nodeHeight = 300;

            super(collectionRenderer, componentRenderer);

            this._useRotatePositioning = 1;
            this._side = 1;
            this._numberOfNodesInCircle = 1;
            this._useOpacity = true;

            super.setCamera(componentCamera);
            super.setComponentSize(componentSizeW, componentSizeH);
            super.setNodeWidth(nodeWidth);
            super.setNodeHeight(nodeHeight);
            super.setComponentWidthMeasure("px");
            super.setComponentHeightMeasure("px");
            super.setDirection(1);
            this._setCollection();
        }

        _setCollection() {
            this._collection = new TurnableCollection();
            super._setCollection();
        }

        getUseRotatePositioning() {
            return this._useRotatePositioning;
        }

        setUseRotatePositioning(useRotatePositioning) {

            if (typeof useRotatePositioning !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._useRotatePositioning = useRotatePositioning;

            return this;
        }

        getSide() {
            return this._side;
        }

        setSide(side) {

            if (typeof side !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._side = side;

            return this;
        }

        getUseOpacity() {
            return this._useOpacity;
        }

        setUseOpacity(useOpacity) {

            if (typeof useOpacity !== "boolean") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_BOOLEAN());
            }

            this._useOpacity = useOpacity;

            return this;
        }

        getNumberOfNodeInCircle() {
            return this._numberOfNodesInCircle;
        }

        setNumberOfNodesInCircle(numberOfNodesInCircle) {

            if (typeof numberOfNodesInCircle !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._numberOfNodesInCircle = numberOfNodesInCircle;

            return this;
        }

        /**
         * Zoom in if back side mode.
         *
         * @param side
         * @param circleRadius
         * @return {number}
         * @private
         */
        _getZoomIn(side, circleRadius) {
            return side === -1 ? circleRadius : 0;
        }

        _getNodeMaxWidth(): any {
            return undefined;
        }

        _getNodeMaxHeight(): any {
            return this._getComponentSizePxWithoutMargin().height / this._getCollection()._getNumberOfStacks();
        }

        _getCircleLength() {
            var nodeWidth = this.getNodeWidth(),
                numberOfNodesInCircle = this.getNumberOfNodeInCircle();

            return nodeWidth * numberOfNodesInCircle;
        }

        _getCircleRadius() {
            return this._getCircleLength() / (2 * Math.PI);
        }

        _getPositionFromIndex() {
            var componentDirection = this.getDirection(),
                componentCentralPos = super._getNodeDefaultPosition();

            return - componentDirection * componentCentralPos;
        }

        _getCentralPos(nodeIndex) {
            return this._getPosByIndex(nodeIndex);
        }

        _getPosByIndex(nodeIndex) {
            return nodeIndex * 180;
        }

        _getNodeYCenterShift() {
            var nodeMaxHeight = this._getNodeMaxHeight() - 2 * this.getNodeMargin().height,
                nodeHeight = this.getNodeHeight();

            return Math.max(0, (nodeMaxHeight - nodeHeight) / 2);
        }

        _getAngle(nodeIndex) {
            var componentDirection = this.getDirection(),
                numberOfNodesInCircle = this.getNumberOfNodeInCircle();

            return (this._getScrollingPosition() / 90 + componentDirection * nodeIndex * 2) / numberOfNodesInCircle;
        }

        _getPxFromAngle(angle) {
            return angle * this.getNumberOfNodeInCircle() / 2;
        }

        _getBorders() {
            var componentMaxIndexInStacks = this._getCollection()._getMaxIndexInStacks(),
                componentBorderShift = this._getPxFromAngle(90),
                componentMargin = this._getPxFromAngle(this.getComponentMargin().width),
                min = 0 + componentBorderShift - componentMargin,
                max = min + this._getPosByIndex(componentMaxIndexInStacks - 1) - 2 * componentBorderShift + 2 * componentMargin;

            if (max < min) {
                max = min;
            }

            return new RangeModel(min, max);
        }
    }
}