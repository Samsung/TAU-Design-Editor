module Component3d {

    export class CoverFlowCollection extends BaseCollection {

        constructor() {
            super();
        }

        _getNodeConstructor(): any {
            return CoverFlowNode;
        }
    }
}