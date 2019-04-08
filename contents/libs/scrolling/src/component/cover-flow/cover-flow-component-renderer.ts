module Component3d {

    export class CoverFlowComponentRenderer extends I3dComponentRenderer {

        constructor() {
            super(new CoverFlowCollectionRenderer());
        }

        _setComponentDom(model) {
            var directionProperty = "pageX";

            super._setComponentDom(model, directionProperty);
        }
    }

}