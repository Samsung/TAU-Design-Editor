module Component3d {

    export class TurnableCollection extends BaseCollection {

        constructor() {
            super();
        }

        _getNodeConstructor(): any {
            return TurnableNode;
        }
    }
}