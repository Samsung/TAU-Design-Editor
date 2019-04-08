(function () {
    window.addEventListener('tizenhwkey', function (ev) {
        var activePopup = document.querySelector('.ui-popup-active'),
            page = document.getElementsByClassName('ui-page-active')[0],
            pageid = page ? page.id : '';

        if (ev.keyName === 'back') {
            if (pageid === 'pageIndicatorCirclePage' && !activePopup) {
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

    function init() {
        var page = document.getElementById('pageIndicatorCirclePage'),
            changer = document.getElementById('hsectionchanger'),
            sections = document.querySelectorAll('section'),
            sectionChanger,
            elPageIndicator = document.getElementById('pageIndicator'),
            pageIndicator,
            selector;

        function pageIndicatorHandler(e) {
            pageIndicator.setActive(e.detail.active);
        }

        page.addEventListener('pagebeforeshow', function () {
      // make PageIndicator
            pageIndicator = tau.widget.PageIndicator(elPageIndicator, {
                numberOfPages: sections.length,
                layout: tau.support.shape.circle ? 'circular' : ''
            });
            pageIndicator.setActive(0);
      // make SectionChanger object
            sectionChanger = new tau.widget.SectionChanger(changer, {
                circular: true,
                orientation: 'horizontal',
                useBouncingEffect: true
            });
            changer.addEventListener('sectionchange', pageIndicatorHandler, false);
        });

        page.addEventListener('pagehide', function () {
      // release object
            changer.removeEventListener('sectionchange', pageIndicatorHandler, false);

            sectionChanger.destroy();
            pageIndicator.destroy();
        });

        function rotaryDetentHandler(e) {
      // Get rotary direction
            var direction = e.detail.direction,
                section = sectionChanger.getActiveSectionIndex();

            if (direction === 'CW') {
                section += 1;
            } else if (direction === 'CCW') {
                section -= 1;
            }
            sectionChanger.setActiveSection(section, 100, false);
        }

    // Add rotarydetent handler to document
        document.addEventListener('rotarydetent', rotaryDetentHandler);

    }

    function onClick(event) {
        var activeItem = document.querySelector('.ui-item-active'),
            target = event.target;
    // console.log(activeItem.getAttribute("data-title"));
    /*
     * Default indicator class selector is "ui-selector-indicator".
     * If you want to show custom indicator sample code,
     * check the 'customIndicator.js' please.
     */
        if (target.classList.contains('ui-selector-indicator')) {
      // console.log("Indicator clicked");
        }
    }

    document.addEventListener('DOMContentLoaded', init, false);

}());
