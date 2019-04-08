module Component3d {

    export class TurnableComponentRenderer extends I3dComponentRenderer {

        constructor() {
            super(new TurnableCollectionRenderer());
        }

        _setComponentDom(model) {
            var directionProperty = "pageX";

            super._setComponentDom(model, directionProperty);
        }
    }
}