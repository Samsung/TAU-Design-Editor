module Component3d {

    export class ListZoomableCollection extends BaseCollection {

        constructor() {
            super();
        }

        _getNodeConstructor(): any {
            return ListZoomableNode;
        }
    }
}