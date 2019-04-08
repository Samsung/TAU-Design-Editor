module Component3d {

    export class BaseNode {
        public _data: any;
        public _dom: any;
        public _domProps: any;
        public _collection: any;

        constructor(data) {
            this._data = undefined;
            this._dom = undefined;
            this._domProps = {};
            this._collection = undefined;

            this._setData(data);
        }

        _getData() {
            return this._data;
        }

        _setData(data) {
            this._data = data;
        }

        _getCollection() {
            return this._collection;
        }

        _setCollection(collection) {
            this._collection = collection;
        }

        _getComponent() {

            if (!this._collection) {
                throw new OutOfRangeExceptionModel();
            }

            return this._collection._getComponent();
        }

        _getNodeWidth() {
            var component = this._getComponent();

            if (!component) {
                throw new OutOfRangeExceptionModel();
            }

            return component.getNodeWidth();
        }

        _getNodeHeight() {
            var component = this._getComponent();

            if (!component) {
                throw new OutOfRangeExceptionModel();
            }

            return component.getNodeHeight();
        }

        _getDom() {
            return this._dom;
        }

        _setDom(dom) {
            this._dom = dom;
        }

        _getDomProps() {
            return this._domProps;
        }

        _getNumberOfStack() {
            var collection = this._getCollection(),
                collectionNumberOfStacks = collection._getNumberOfStacks(),
                nodeIndex = collection._getIndexOfNodeInCollection(this);

            return nodeIndex % collectionNumberOfStacks;
        }

        _getIndexInStack() {
            var collection = this._getCollection(),
                collectionNumberOfStacks = collection._getNumberOfStacks(),
                nodeIndex = collection._getIndexOfNodeInCollection(this);

            return Math.trunc(nodeIndex / collectionNumberOfStacks);
        }
    }
}