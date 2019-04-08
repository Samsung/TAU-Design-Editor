module Component3d {

    export  class OngoingChangeModel {
        public type: OngoingChangeEnum;
        public data: any;

        constructor(type: OngoingChangeEnum, data: any) {
            this.type = type;
            this.data = data;
        }
    }

}
