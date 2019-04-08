module Component3d {

    export class ExceptionMessageEnum {

        static NOT_IMPLEMENTED() {
            return "Method should be implemented";
        }

        static SHOULD_BE_TYPE_OF_STRING() {
            return "Should be type of string";
        }

        static SHOULD_BE_TYPE_OF_NUMBER() {
            return "Should be type of number";
        }

        static SHOULD_BE_TYPE_OF_BOOLEAN() {
            return "Should be type of boolean";
        }

        static SHOULD_BE_INSTANCE_OF_HTML_ELEMENT() {
            return "Should be instance of HTMLElement";
        }

        static SHOULD_BE_INSTANCE_OF_ARRAY() {
            return "Should be instance of Array";
        }

        static SHOULD_BE_PX_OR_PERCENT() {
            return "Should be 'px' or '%'";
        }

        static OUT_OF_RANGE() {
            return "Out of range";
        }
    }

}
