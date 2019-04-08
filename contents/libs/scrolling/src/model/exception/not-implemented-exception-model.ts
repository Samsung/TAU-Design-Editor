module Component3d {

    export class NotImplementedExceptionModel extends BaseExceptionModel {

        constructor() {
            super("NotImplementedException", Component3d.ExceptionMessageEnum.NOT_IMPLEMENTED());
        }
    }

}