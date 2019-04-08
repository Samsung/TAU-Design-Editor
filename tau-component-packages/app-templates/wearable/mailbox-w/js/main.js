(function () {
    window.addEventListener('tizenhwkey', function (ev) {
        var page = document.getElementsByClassName('ui-page-active')[0],
            pageid = page ? page.id : '';
        if (ev.keyName === 'back') {
            if (pageid === 'one') {
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
