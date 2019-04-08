/**
 * Created by khanas on 10/13/15.
 */

var imagesSrc = [
    "http://images.samsung.com/is/image/samsung/in_SM-A300HZKDINU_000268347_Front-SS_black_thumb?$M-Thumbnail$",
    "http://s.tmocache.com/content/dam/tmo/en-p/cell-phones/samsung-galaxy-s-6-edge/white-pearl/spin/samsung-galaxy-s-6-edge-pearl-white-spin.0001.jpg",
    "http://images.samsung.com/is/image/samsung/my_SM-A800FZDEXME_000000001_Front_gold_thumb?$M-Thumbnail$",
    "http://www.samsung.com/ca/next/img/support/ia_image_type/1903.jpg"
];

function getImageSrc() {
    var src = imagesSrc.shift(),
        dom = document.createElement('img');

    dom.src = src;

    imagesSrc.push(src);

    return dom;
}
