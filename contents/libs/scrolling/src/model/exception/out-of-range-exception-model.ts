module Component3d {

    export class OutOfRangeExceptionModel extends BaseExceptionModel {

        constructor() {
            super("OutOfRangeException", Component3d.ExceptionMessageEnum.OUT_OF_RANGE());
        }
    }

}