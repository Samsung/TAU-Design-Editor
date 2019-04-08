(function () {
    window.addEventListener('tizenhwkey', function (ev) {
        var activePopup = document.querySelector('.ui-popup-active'),
            page = document.getElementsByClassName('ui-page-active')[0],
            pageid = page ? page.id : '';
        if (ev.keyName === 'back') {

            if (pageid === 'main' && !activePopup) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                    console.warn(ignore);
                }
            } else {
        // window.history.back();
                tau.changePage(tau.engine.getRouter().firstPage, {
                    reverse: true
                });
            }
        }
    });

}());
