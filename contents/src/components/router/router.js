/* global $ */
/**
 * # closet.router
 * Object contains main framework methods.
 * @class closet.router
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function () {
// >>excludeStart("buildExclude", pragmas.buildExclude);
    /* global define */
    define([
        '../dress.closet'
    ], function (dress) {
        

// >>excludeEnd("buildExclude");

        var ACTIVE_PAGE = 'active',
            HISTORY = window.history,
            HTML_REGEX = /([^/]+)(?=\.\w+$)(.html)/,
            ID_REGEX = /[^#][A-z\W\d]*/;

        dress.Router = dress.factory('router', {
            defaults: {
                disable: false
            },

            setRoute: function (key, route) {
                this.routes[key] = route;
            },

            onCreated: function () {
                var pages = this.$el.find('closet-page'),
                    i, len;
                this.activePage = null;
                this.pageTransition = null;
                this.routes = {};

                len = pages.length;
                for (i = 0; i < len; i += 1) {
                    // Find activated page
                    if ($(pages[i]).hasClass(ACTIVE_PAGE)) {
                        this.activePage = pages[i];
                    }
                }
                if (!this.activePage) {
                    $(pages[0]).addClass(ACTIVE_PAGE);
                    this.activePage = pages[0];
                }
                this.getPageModel();
                this.getTransitionData();
                this.bindLinkHandler();
            },

            bindLinkHandler: function () {
                document.addEventListener('click', function (event) {
                    var link = $(event.target).closest('a'),
                        href;

                    event.stopPropagation();
                    event.preventDefault();
                    if (link.length && event.which === 1) {
                        href = link.attr('href');

                        if (this.routes[href.match(ID_REGEX)]) {
                            this.changePage(href);
                        }

                    }
                }.bind(this));

                window.addEventListener('popstate', function (event) {
                    var href = event.state;
                    this.setActive($(this.$el.find('#' + href)).get(0));
                }.bind(this));

                $(document).on('change.page', function (event, id) {
                    this.changePage('#' + id);
                    event.preventDefault();
                    event.stopPropagation();
                }.bind(this));
            },

            changePage: function (href) {
                var self = this,
                    $toPage,
                    id = href.match(ID_REGEX),
                    path = this.routes[id[0]],
                    address = location.origin + location.pathname.replace(HTML_REGEX, '') + path.match(HTML_REGEX)[0];

                if (self.$el.find(href).length) {
                    $toPage = self.$el.find(href);
                    self.setActive($toPage.get(0));
                    HISTORY.pushState(id, null, address);
                    return;
                }

                $.ajax({
                    url: address,
                    success: function (data) {
                        var $data = $(data),
                            result;
                        $data.wrap('<div></div>');
                        result = $data.parent().find(href);
                        self.$el.append(result);
                        $toPage = self.$el.find(href);
                        self.setActive($toPage.get(0));

                        HISTORY.pushState(id, null, address);
                    }
                });
            },

            getPageModel: function () {
                var self = this,
                    id;
                $.getJSON('pageModel.json', function (data) {
                    Object.key(data).forEach((i) => {
                        self.setRoute(i, data[i].path.match(HTML_REGEX)[0]);
                    });
                    id = $(self.activePage).attr('id');
                    HISTORY.pushState(id, null, location.origin + location.pathname + self.routes[id]);
                })
                    .fail(function () {
                        console.log('error');
                    });
            },

            getTransitionData: function () {
                var self = this;
                $.getJSON('transition.json', function (data) {
                    self.setTransition(data);
                })
                    .fail(function () {
                        console.log('error');
                    });
            },

            setActive: function (toPage) {
                if (this.activePage === toPage) {
                    return;
                }

                if (this.activePage) {
                    this.pageTransition.from = this.activePage;
                }
                this.pageTransition.to = toPage;
                this.activePage = toPage;

                this.pageTransition.start();
            },

            setTransition: function (data) {
                this.pageTransition = new window.PageTransition({
                    effect: data.name,
                    effectConfig: {
                        color: data.color
                    }
                });
            }
        });

// >>excludeStart("buildExclude", pragmas.buildExclude);
        return dress.Router;
    });
// >>excludeEnd("buildExclude");
}());
