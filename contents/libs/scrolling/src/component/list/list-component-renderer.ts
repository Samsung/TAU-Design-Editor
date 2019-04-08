module Component3d {

    export class ListComponentRenderer extends I3dComponentRenderer {

        constructor() {
            super(new ListCollectionRenderer());
        }

        _setComponentDom(model) {
            var directionProperty = "pageY";

            super._setComponentDom(model, directionProperty);
        }
    }

}