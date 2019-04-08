module Component3d {

    export class ValidationExceptionModel extends BaseExceptionModel {

        constructor(message: string) {
            super("ValidationException", message);
        }
    }

}