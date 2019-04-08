(function (window, tau, TComm) {
    "use strict";
    var page = get('main');;
    var tcom;
    var tries = 0;

    function get(id) {
        return document.getElementById(id);
    }

    function requestChangeBackgroundColor(id, color) {
        tcom.send('colorChange', {id: id, color: color});
    }

    function changeBackgroundColor(id, color) {
        var element = get(id);
        if (element) {
            console.log('changing color #' + id + '.backgroundColor: ' + color);
            element.style.backgroundColor = color;
        }
    }

    function startApp() {
        var greenBtn = get('greenBtn');
        var blueBtn = get('blueBtn');
        var canvas = get('canvas');

        console.log('app initialized!');

        if (canvas) {
            if (greenBtn) {
                tau.event.on(greenBtn, 'click', requestChangeBackgroundColor.bind(null, canvas.id, '#80e080'));
            }

            if (blueBtn) {
                tau.event.on(blueBtn, 'click', requestChangeBackgroundColor.bind(null, canvas.id, '#72beff'));
            }
        }
    }

    function startComm() {
        if (tries === 0) {
            console.log('connecting to network');
        } else {
            console.log('trying again');
        }

        tcom = new TComm();
        tcom.start().then(function () {
            console.log('connected');
            startApp();
        }).catch(function(err) {
            console.error(err);
            if (++tries <= 3) {
                window.setTimeout(startComm, 3000);
            } else {
                console.log('connection failed');
            }
        });
        tcom.on('colorChange', function (data) {
            console.log('got event!', data);
            changeBackgroundColor(data.id, data.color);
        });
    }

    if (page) {
        tau.event.one(page, 'pageshow', startComm);
    }
}(window, window.tau, window.TComm && window.TComm.default));

