module Component3d {

    export class ChangesStorage {
        private _ongoingChanges: any[];

        constructor() {
            this._ongoingChanges = [];
        }

        _remove(nodeIndex) {
            var ongoingChange = new OngoingChangeModel(OngoingChangeEnum.REMOVE, {
                index: nodeIndex
            });

            this._addOngoingChange(ongoingChange);
        }

        _insert(node, nodeIndex) {
            var ongoingChange = new OngoingChangeModel(OngoingChangeEnum.ADD, {
                element: node,
                index: nodeIndex
            });

            this._addOngoingChange(ongoingChange);
        }

        _getOngoingChanges() {
            return this._ongoingChanges;
        }

        _clearOngoingChanges() {
            this._ongoingChanges = [];
        }

        _addOngoingChange(change) {
            this._ongoingChanges.push(change);
        }
    }
}