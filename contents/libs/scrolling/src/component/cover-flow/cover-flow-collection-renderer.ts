module Component3d {

    export class CoverFlowCollectionRenderer extends ICollectionRenderer {

        constructor() {
            super(new CoverFlowNodeRenderer());
        }
    }
}