module Component3d {

    export class TurnableCollectionRenderer extends ICollectionRenderer {

        constructor() {
            super(new TurnableNodeRenderer());
        }
    }
}