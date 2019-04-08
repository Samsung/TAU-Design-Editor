module Component3d {

    export class ListZoomableCollectionRenderer extends ICollectionRenderer {

        constructor() {
            super(new ListZoomableNodeRenderer());
        }
    }

}