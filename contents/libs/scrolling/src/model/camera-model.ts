module Component3d {

    export class CameraModel {
        public perspective: number;
        public perspectiveOriginX: any;
        public perspectiveOriginY: any;

        constructor(perspective: number, perspectiveOriginX: any, perspectiveOriginY: any) {
            this.perspective = perspective;
            this.perspectiveOriginX = perspectiveOriginX;
            this.perspectiveOriginY = perspectiveOriginY;
        }
    }

}