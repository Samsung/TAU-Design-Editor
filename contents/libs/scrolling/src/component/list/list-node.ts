module Component3d {

    export class ListNode extends BaseNode {
        private _isSelected: any;

        constructor(data) {
            super(data);
            this._isSelected = false;
        }

        _getIsSelected() {
            return this._isSelected;
        }

        _setIsSelected(isSelected) {
            this._isSelected = isSelected;
        }
    }
}