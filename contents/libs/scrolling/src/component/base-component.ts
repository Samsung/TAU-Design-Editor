module Component3d {

    export class BaseComponent {

        public _componentDom: any;
        public _componentCamera: any;
        public _componentScrollingLib: any;
        public _componentIsMounted: boolean = false;
        public _componentParentDom: any;
        public _componentScrollingPosition: any;
        public _componentSize: any;
        public _componentSizeMeasureTypes: any;
        public _componentMargin: any;
        public _componentBackground: any;
        public _componentRenderer: any;
        public _componentDirection: number = 1;
        public _componentInitialScrollingIndex: number = 1;

        public _collection: any;

        public _nodeSize: any;
        public _nodeMargin: any;
        public _nodeRenderer: any;

        constructor(collectionRenderer, componentRenderer) {
            this._componentSize = new Size2DModel(undefined, undefined);
            this._componentSizeMeasureTypes = {
                measureWidthType : "px",
                measureHeightType : "px"
            };
            this._componentMargin = new Size2DModel(20, 20);
            this._componentBackground = "rgb(0, 0, 0)";

            this._nodeSize = new Size2DModel(undefined, undefined);
            this._nodeMargin = new Size2DModel(10, 10);

            this._setCollectionRenderer(collectionRenderer);
            this._setComponentRenderer(componentRenderer);
            this._getComponentRenderer()._set3dComponentWrapperDom(this);
        }

        attachToParent(parentDom) {

            if (!(parentDom instanceof HTMLElement)) {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_INSTANCE_OF_HTML_ELEMENT());
            }

            this._componentParentDom = parentDom;

            this._getComponentRenderer()._setComponentDom(this);

            return this;
        }

        detachFromParent() {
            this._componentParentDom = undefined;

            this._getComponentRenderer()._detachFromParent(this);

            return this;
        }

        update() {
            this._getComponentRenderer()._update(this);

            return this;
        }

        insert(nodes, nodeIndex) {
            var self = this,
                i;

            if (nodes instanceof Array) {
                i = nodeIndex;
                nodes.map(function(node) {
                    self._insertNode(node, i++);
                });

                return this;
            }

            this._insertNode(nodes, nodeIndex);

            return this;
        }

        remove(nodeIndex) {
            this._getCollection()._removeNodeFromChangesStorage(nodeIndex);

            return this;
        }

        scrollingOn() {
            this._getComponentRenderer()._scrollingOn(this);
            return this;
        }

        scrollingOff() {
            this._getComponentRenderer()._scrollingOff(this);
            return this;
        }

        getScrollingIndex() {
            return this._componentInitialScrollingIndex;
        }

        setScrollingIndex(initialScrollingIndex) {

            if (typeof initialScrollingIndex !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._componentInitialScrollingIndex = initialScrollingIndex;

            return this;
        }

        getDirection() {
            return this._componentDirection;
        }

        setDirection(direction) {

            if (typeof direction !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._componentDirection = direction;

            return this;
        }

        getBackground() {
            return this._componentBackground;
        }

        setBackground(background) {

            if (typeof background !== "string") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }

            this._componentBackground = background;

            return this;
        }

        getComponentHeight() {
            return this._componentSize.height;
        }

        getComponentWidth() {
            return this._componentSize.width;
        }

        setComponentSize(width, height) {

            if (typeof width !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            if (typeof height !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._componentSize.width = width;
            this._componentSize.height = height;

            return this;
        }

        getComponentMeasureTypes() {
            return this._componentSizeMeasureTypes;
        }

        setComponentWidthMeasure(measureType) {

            if (typeof measureType !== "string") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }

            if (measureType !== "px" && measureType !== "%") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_PX_OR_PERCENT());
            }

            this._componentSizeMeasureTypes.measureWidthType = measureType;

            return this;
        }

        setComponentHeightMeasure(measureType) {

            if (typeof measureType !== "string") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_STRING());
            }

            if (measureType !== "px" && measureType !== "%") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_PX_OR_PERCENT());
            }

            this._componentSizeMeasureTypes.measureHeightType = measureType;

            return this;
        }

        getNumberOfStacks() {
            return this._getCollection()._getNumberOfStacks();
        }

        setNumberOfStacks(numberOfStacks) {

            if (typeof numberOfStacks !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._getCollection()._setNumberOfStacks(numberOfStacks);

            return this;
        }

        getNodeMargin() {
            return this._nodeMargin;
        }

        setNodeMargin(x, y) {

            if (typeof x !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            if (typeof y !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._nodeMargin = new Size2DModel(x, y);

            return this;
        }

        getComponentMargin() {
            return this._componentMargin;
        }

        setComponentMargin(x, y) {

            if (typeof x !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            if (typeof y !== "number") {
                throw new ValidationExceptionModel(ExceptionMessageEnum.SHOULD_BE_TYPE_OF_NUMBER());
            }

            this._componentMargin = new Size2DModel(x, y);

            return this;
        }

        getCamera() {
            return this._componentCamera;
        }

        setCamera(camera) {
            this._componentCamera = camera;

            return this;
        }

        getNodeWidth() {
            return this._nodeSize.width;
        }

        setNodeWidth(nodeWidth) {
            this._nodeSize.width = nodeWidth;

            return this;
        }

        getNodeHeight() {
            return this._nodeSize.height;
        }

        setNodeHeight(nodeHeight) {
            this._nodeSize.height = nodeHeight;

            return this;
        }

        getCollectionLength() {
            return this._getCollection()._getCollectionLength();
        }

        _getParentDom() {
            return this._componentParentDom;
        }

        _getCollection() {
            return this._collection;
        }

        _setCollection() {
            this._collection._setComponent(this);
        }

        _insertNode(node, nodeIndex) {
            var CollectionModelClass = this._getCollection()._getNodeConstructor(),
                model = new CollectionModelClass(node);

            this._getCollection()._insertNodeIntoChangesStorage(model, nodeIndex);

            return this;
        }

        _getComponentSizeInPx() {
            var componentMeasureTypes = this.getComponentMeasureTypes(),
                componentHeight = this.getComponentHeight(),
                componentWidth = this.getComponentWidth(),
                parentDom = this._getDom(),
                res = new Size2DModel(componentWidth, componentHeight);

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
        }

        _getNodeDefaultPosition() {
            return this._getBorders().min;
        }

        _getComponentSizePxWithoutMargin() {
            var componentSizeInPx = this._getComponentSizeInPx(),
                componentMarginW = this._componentMargin.width,
                componentMarginH = this._componentMargin.height;

            return new Size2DModel(componentSizeInPx.width - 2 * componentMarginW, componentSizeInPx.height - 2 * componentMarginH);
        }

        _getIsMounted() {
            return this._componentIsMounted;
        }

        _setIsMounted(mounted) {
            this._componentIsMounted = mounted;
        }

        _getDirectionCoefficient() {
            return - this._componentDirection;
        }

        _getDom() {
            return this._componentDom;
        }

        _setDom(componentDom) {
            this._componentDom = componentDom;
        }

        _getScrollingPosition() {
            return this._componentScrollingPosition;
        }

        _setScrollingPosition(position) {
            this._componentScrollingPosition = position;
        }

        _getScrollingLib() {
            return this._componentScrollingLib;
        }

        _setScrollingLib(scrollingLib) {
            this._componentScrollingLib = scrollingLib;
        }

        _getCollectionRenderer() {
            return this._nodeRenderer;
        }

        _setCollectionRenderer(renderer) {
            this._nodeRenderer = renderer;
        }

        _getComponentRenderer() {
            return this._componentRenderer;
        }

        _setComponentRenderer(componentRenderer) {
            this._componentRenderer = componentRenderer;
        }

        _getNodeMaxWidth(): any;

        _getNodeMaxHeight(): any;

        _getPositionFromIndex(): any;

        _getNodeCenterX() {
            return (this._getComponentSizePxWithoutMargin().width - this.getNodeWidth()) / 2;
        }

        _getNodeCenterY() {
            return (this._getComponentSizePxWithoutMargin().height - this.getNodeHeight()) / 2;
        }

        _setInitialScrollingPosition() {
            var positionFromIndex = this._getPositionFromIndex();

            this._setScrollingPosition(positionFromIndex);
        }

        _getBorders(): any;
    }
}