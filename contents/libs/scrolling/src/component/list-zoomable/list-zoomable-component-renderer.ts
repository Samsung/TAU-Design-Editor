module Component3d {

    export class ListZoomableComponentRenderer extends I3dComponentRenderer {

        constructor() {
            super(new ListZoomableCollectionRenderer());
        }

        _setComponentDom(model) {
            var directionProperty = "pageX";

            super._setComponentDom(model, directionProperty);
        }
    }
}