(function () {
    window.addEventListener('tizenhwkey', function (ev) {
        var page = document.getElementsByClassName('ui-page-active')[0],
            pageid = page ? page.id : '';
        if (ev.keyName === 'back') {
            if (pageid === 'main') {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                    console.warn(ignore);
                }
            } else {
                window.history.back();
            }
        }
    });

    (function () {
        if (!window.tizen) {
            tau.event.on(window, 'mousewheel', function (e) {
                var direction = 'CCW';
                e.preventDefault();
                if (e.deltaY > 0) {
                    direction = 'CW';
                }
                tau.event.trigger(window.document, 'rotarydetent', {direction: direction});
            }, false);
        }
    }());
}());
