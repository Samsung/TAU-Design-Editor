module Component3d {

    export class BaseCollection {
        private _component: any;
        private _numberOfStacks: any;
        private _nodes: any;
        private _changesStorage: any;

        constructor() {
            this._component = undefined;
            this._numberOfStacks = 3;
            this._nodes = [];
            this._changesStorage = new Component3d.ChangesStorage();
        }

        _getNumberOfStacks() {
            return this._numberOfStacks;
        }

        _setNumberOfStacks(numberOfStacks) {
            this._numberOfStacks = numberOfStacks;
        }

        _insertNodeIntoChangesStorage(node, nodeIndex) {
            this._changesStorage._insert(node, nodeIndex);
        }

        _removeNodeFromChangesStorage(nodeIndex) {
            this._changesStorage._remove(nodeIndex);
        }

        _getComponent() {
            return this._component;
        }

        _setComponent(component) {
            this._component = component;
        }

        _getNodes() {
            return this._nodes;
        }

        _applyOngoingChanges() {
            var self = this;

            this._changesStorage._getOngoingChanges().map(function(ongoingChange) {
                var nodeIndex = ongoingChange.data.index;

                switch (ongoingChange.type) {
                    case Component3d.OngoingChangeEnum.ADD:
                        self._applyInsertOngoingChange(nodeIndex, ongoingChange.data.element);
                        break;
                    case Component3d.OngoingChangeEnum.REMOVE:
                        self._applyRemoveOngoingChange(nodeIndex);
                        break;
                    default:
                        throw new OutOfRangeExceptionModel();
                        break;
                }
            });

            this._changesStorage._clearOngoingChanges();
        }

        _applyInsertOngoingChange(nodeIndex, node) {
            var nodeComponent,
                nodeRenderer,
                parentDom;

            node._setCollection(this);
            nodeComponent = node._getComponent();
            nodeRenderer = nodeComponent._getCollectionRenderer()._getNodeRenderer();
            parentDom = nodeComponent._getDom();
            nodeRenderer._initNodeDom(node, parentDom);
            this._insertNoteIntoCollection(nodeIndex, node);
        }

        _applyRemoveOngoingChange(nodeIndex) {
            var node,
                nodeComponent,
                nodeRenderer;

            node = this._getNodeFromCollectionByIndex(nodeIndex);
            nodeComponent = this._getComponent();
            nodeRenderer = nodeComponent._getCollectionRenderer()._getNodeRenderer();
            nodeRenderer._detachFromParent(node);
            this._removeNoteFromCollection(nodeIndex);
        }

        _getNodeConstructor(): any;

        _getCollectionLength() {
            return this._getNodes().length;
        }

        _getNodeFromCollectionByIndex(index) {
            return this._getNodes()[index];
        }

        _getIndexOfNodeInCollection(node) {
            return this._getNodes().indexOf(node);
        }

        _insertNoteIntoCollection(nodeIndex, node) {
            this._getNodes().splice(nodeIndex, 0, node);
        }

        _removeNoteFromCollection(nodeIndex) {
            this._getNodes().splice(nodeIndex, 1);
        }

        _getMaxIndexInStacks() {
            var collectionLength = this._getCollectionLength(),
                lastNodeIndex = collectionLength - 1,
                numberOfStacks = this._getNumberOfStacks();

            return 1 + Math.trunc(lastNodeIndex / numberOfStacks);
        }
    }
}