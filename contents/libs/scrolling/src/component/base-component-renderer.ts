module Component3d {

    export class I3dComponentRenderer {
        public _nodeRenderer: any;

        constructor(collectionRenderer) {
            this._nodeRenderer = collectionRenderer;
        }

        _getCollectionRenderer() {
            return this._nodeRenderer;
        }

        _setComponentDom(componentModel, directionDomProperty) {
            var collection = componentModel._getCollection();

            this._set3dComponentWrapperDomStyle(componentModel);
            componentModel._setInitialScrollingPosition();
            this._getCollectionRenderer()._mountOrUpdate(collection);
            this._initScroller(componentModel, directionDomProperty);
        }

        _detachFromParent(componentModel) {
            var collection;

            if (componentModel._getIsMounted() === false) {
                return;
            }

            collection = componentModel._getCollection();
            componentModel._setIsMounted(false);
            this._scrollingOff(componentModel);
            this._getCollectionRenderer()._detachFromParent(collection);
            this._removeDom(componentModel);
        }

        _update(componentModel) {
            var componentParentDom,
                componentDom,
                collection;

            if (componentModel._getIsMounted() === false) {
                componentParentDom = componentModel._getParentDom();
                componentDom = componentModel._getDom();
                componentParentDom.appendChild(componentDom);
                componentModel._setIsMounted(true);
            }

            collection = componentModel._getCollection();
            collection._applyOngoingChanges();
            this._set3dComponentWrapperDomStyle(componentModel);
            this._getCollectionRenderer()._mountOrUpdate(collection);
            componentModel._getScrollingLib()._resetPositionIfNoScrolling(componentModel);
        }

        _scrollingOn(componentModel) {
            componentModel._getScrollingLib().init();
        }

        _scrollingOff(componentModel) {
            componentModel._getScrollingLib().destroy();
        }

        _initScroller(componentModel, domDirection) {
            var componentDom = componentModel._getDom(),
                componentScrollingModule = new ScrollingModule(componentModel, componentDom, domDirection);

            componentModel._setScrollingLib(componentScrollingModule);
        }

        _removeDom(componentModel) {
            var componentDom = componentModel._getDom();

            componentDom.parentNode.removeChild(componentDom);
        }

        _set3dComponentWrapperDom(componentModel) {
            var componentDom = document.createElement("div");

            componentModel._setDom(componentDom);
        }

        _set3dComponentWrapperDomStyle(componentModel) {
            var componentDom = componentModel._getDom(),
                componentCamera = componentModel.getCamera(),
                cameraPerspective = componentCamera.perspective,
                cameraPerspectiveOriginX = componentCamera.perspectiveOriginX,
                cameraPerspectiveOriginY = componentCamera.perspectiveOriginY,
                cameraPerspectiveOrigin = cameraPerspectiveOriginX + "% " + cameraPerspectiveOriginY + "%",
                componentWidthWithMeasure = componentModel.getComponentWidth() + componentModel.getComponentMeasureTypes().measureWidthType,
                componentHeightWithMeasure = componentModel.getComponentHeight() + componentModel.getComponentMeasureTypes().measureHeightType,
                componentBackground = componentModel.getBackground();

            componentDom.style.userSelect = "none";
            componentDom.style.webkitUserSelect = "none";
            componentDom.style.webkitUserDrag = "none";
            componentDom.style.webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
            componentDom.style.touchAction = "none";
            componentDom.style.position = "relative";
            componentDom.style.overflow = "hidden";
            componentDom.style.zIndex = "0";
            componentDom.style.perspective = cameraPerspective + "px";
            componentDom.style["-webkit-perspective"] = cameraPerspective + "px";
            componentDom.style.perspectiveOrigin = cameraPerspectiveOrigin;
            componentDom.style["-webkit-perspective-origin"] = cameraPerspectiveOrigin;
            componentDom.style.width = componentWidthWithMeasure;
            componentDom.style.height = componentHeightWithMeasure;
            componentDom.style.margin = "0px auto";
            componentDom.style.background = componentBackground;
        }
    }
}