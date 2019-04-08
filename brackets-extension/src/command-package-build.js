/* global $ */
var brackets = window.brackets || window.top.brackets;

define(function (require, exports, module) {
    var ProjectManager = brackets.getModule('project/ProjectManager'),
        StatusBar = brackets.getModule('widgets/StatusBar'),
        building = false;

    module.exports = {
        menuTrigger: function () {
            if (building) {
                return;
            }

            building = true;
            StatusBar.showBusyIndicator();

            $.ajax({
                type: 'POST',
                url: '/packages/build',
                data: {
                    project: ProjectManager.getProjectRoot().name
                }
            }).done(function () {
                ProjectManager.refreshFileTree();
            }).fail(function (jqXHR) {
                // @TODO this should be handled with some brackets like window
                console.error(jqXHR.responseText);
            }).always(function () {
                building = false;
                StatusBar.hideBusyIndicator();
            });
        },
        isEnabled: function () {
            // If it's not building and project directory exist
            return !building && !!ProjectManager.getProjectRoot();
        }
    };
});
