module Component3d {

    export class ICollectionRenderer {
        public _i3dNodeRenderer: any;

        constructor(i3dNodeRenderer) {
            this._i3dNodeRenderer = i3dNodeRenderer;
        }

        _getNodeRenderer() {
            return this._i3dNodeRenderer;
        }

        _mountOrUpdate(collectionModel) {
            var self = this;

            collectionModel._getNodes().map(function(node) {
                self._getNodeRenderer()._update(node);
            });
        }

        _detachFromParent(model) {
            var i,
                nodes = model._getNodes(),
                nodesLength = nodes.length,
                node;

            for (i = nodesLength - 1; i >= 0; i--) {
                node = nodes[i];
                this._getNodeRenderer()._detachFromParent(node);
                nodes.splice(i, 1);
            }
        }
    }

}