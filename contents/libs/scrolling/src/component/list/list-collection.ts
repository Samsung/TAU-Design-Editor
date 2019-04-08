module Component3d {

    export class ListCollection extends BaseCollection {

        constructor() {
            super();
        }

        _getNodeConstructor(): any {
            return ListNode;
        }

        _getIsAnySelectedNode() {
            var isAnySelected = false;

            this._getNodes().map(function(node: any) {
                if (node._getIsSelected() === true) {
                    isAnySelected = true;
                }
            });

            return isAnySelected;
        }
    }

}