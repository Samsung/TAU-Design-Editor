module Component3d {

    export class ListCollectionRenderer extends ICollectionRenderer {

        constructor() {
            super(new ListNodeRenderer());
        }
    }

}