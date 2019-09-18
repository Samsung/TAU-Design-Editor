/*global tau */
/*jslint unparam: true */

// this file should work with node 5.1

document.addEventListener("tauinit", function () {
	// This logic works only on circular device.
	if (tau.support.shape.circle) {
		document.addEventListener("pageshow", onShow, true);
		document.addEventListener("popupshow", onShow, true);
	}
});

function onShow(event) {
	var target = event.target;

	function Component(selector, tauConstructor) {
		this.selector = selector;
		this.tauConstructor = tauConstructor;
	}

	var components = {
		pageIndicators: new Component(".ui-page-indicator", tau.widget.PageIndicator),
		listViews: new Component(".ui-listview", tau.widget.Listview),
		selectors: new Component(".ui-selector", tau.widget.Selector),
		sliders: new Component("input[type=range], .ui-slider", tau.widget.Slider),
		toggleSwitches: new Component("input[data-appearance]", tau.widget.ToggleSwitch),
		dimmers: new Component(".ui-dimmer", tau.widget.Dimmer),
		graphs: new Component(".ui-graph", tau.widget.Graph),
		progressBars: new Component(".ui-circle-progress", tau.widget.CircleProgressBar)
	};

	Object.keys(components).forEach(function(componentName) {
		var componentData = components[componentName];
		var selectedComponents = target.querySelectorAll(componentData.selector);

		selectedComponents.forEach(function (componentEl) {
			var closestPopup = tau.util.selectors.getClosestBySelector(componentEl, ".ui-popup");
			if (closestPopup && event.type === "popupshow" || !closestPopup) {
				componentData.tauConstructor(componentEl);
			}
		});

	});
}
