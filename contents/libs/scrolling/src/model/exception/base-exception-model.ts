module Component3d {

    export class BaseExceptionModel {
        public name: string;
        public message: string;

        constructor(name: string, message: string) {
            this.name = name;
            this.message = message;
        }
    }

}