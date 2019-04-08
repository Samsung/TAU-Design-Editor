if (typeof module !== "undefined" && module !== null && module.exports) {
    module.exports = Component3d;
} else if (typeof define === "function" && define.amd) {
    define([], function() {
        return Component3d;
    });
} else if (typeof window !== "undefined" && Component3d) {
    window.Component3d = Component3d;
}