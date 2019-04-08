(function () {
    var page = document.getElementById('main'),
        scroller = null;

    page.addEventListener('pagebeforeshow', function () {
        if (tau.support.shape.circle) {
      // Extend standard listview widget to SnapList
            tau.helper.SnapListStyle.create(document.getElementById('calllog-list'), {
                animate: 'scale'}
      );
            scroller = page.querySelector('.ui-scroller');
            if (scroller) {
        // Attribute enable circular scrollbar
                scroller.setAttribute('tizen-circular-scrollbar', '');
            }
        }
    });

    page.addEventListener('pagebeforehide', function (e) {
        if (scroller) {
      // Disable circular scrollbar
            scroller.removeAttribute('tizen-circular-scrollbar');
        }
    });

}());
