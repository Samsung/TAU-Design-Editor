(function () {
    var intervalHandle = null,
        progressValue = 0,
        playButton = null,
        coverElement = null,
        trackElement = null,
        trackId = 1,
        progressBarWidget;

    window.addEventListener('tizenhwkey', function (ev) {
        var activePopup = document.querySelector('.ui-popup-active'),
            page = document.getElementsByClassName('ui-page-active')[0],
            pageid = page ? page.id : '';
        if (ev.keyName === 'back') {

            if (pageid === 'player' && !activePopup) {
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

    function stopProgress() {
        if (intervalHandle) {
            window.clearInterval(intervalHandle);
            intervalHandle = null;
        }
    }

    function startProgress() {
    // emualtion of track progress
        intervalHandle = window.setInterval(function () {
            progressBarWidget.value(progressValue);

            progressValue += 0.1;
            if (progressValue > 100) {
                progressValue = 0;
            }
        }, 100);
    }

    function pause() {
        playButton.classList.remove('on-play');
        playButton.classList.add('on-pause');
        stopProgress();
    }

    function start() {
        playButton.classList.remove('on-pause');
        playButton.classList.add('on-play');
        startProgress();
    }

    function change(direction) {
        pause();
        progressValue = 0;
        coverElement.classList.remove('cover-' + trackId);
        trackId += direction;
        if (trackId < 1) {
            trackId = 4;
        }
        if (trackId > 4) {
            trackId = 1;
        }
        coverElement.classList.add('cover-' + trackId);
        trackElement.textContent = 'Track name ' + trackId;
        start();
    }

    function onNext() {
        change(1);
    }

    function onPrev() {
        change(-1);
    }

    function onPlay() {
        if (!intervalHandle) {
            start();
        } else {
            pause();
        }
    }

    function onRotary(ev) {
        if (ev.detail.direction === 'CW') {
            change(1);
        } else {
            change(-1);
        }
    }

    function init() {
        var progressBar = document.querySelector('.ui-circle-progress'),
            nextButton = document.querySelector('.music-player .ui-next'),
            prevButton = document.querySelector('.music-player .ui-prev');

        document.addEventListener('pageshow', function () {
            progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: 'full'});
            if (tau.support.shape.circle) {
                document.addEventListener('rotarydetent', onRotary);
            }
            playButton.addEventListener('click', onPlay);
            nextButton.addEventListener('click', onNext);
            prevButton.addEventListener('click', onPrev);
        });

        document.addEventListener('pagebeforehide', function () {
            progressBarWidget.destroy();
            if (tau.support.shape.circle) {
                document.removeEventListener('rotarydetent', onRotary);
            }
            playButton.removeEventListener('click', onPlay);
            nextButton.removeEventListener('click', onNext);
            prevButton.removeEventListener('click', onPrev);
        });

        playButton = document.querySelector('.music-player .play');
        coverElement = document.querySelector('.music-player .cover');
        trackElement = document.querySelector('.music-player .track');
        coverElement.classList.add('cover-' + trackId);
        trackElement.textContent = 'Track name ' + trackId;
    }

    document.addEventListener('DOMContentLoaded', init, false);

}());
