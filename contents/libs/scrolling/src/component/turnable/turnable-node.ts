module Component3d {

    export class TurnableNode extends BaseNode {

        constructor(data) {
            super(data);
            this._setDefaultProps();
        }

        _setDefaultProps() {
            super._getDomProps().style = {};
            super._getDomProps().style.visibility = "visible";
        }

        _isVisible(degree) {
            return -90 <= degree && degree <= 90;
        }
    }
}