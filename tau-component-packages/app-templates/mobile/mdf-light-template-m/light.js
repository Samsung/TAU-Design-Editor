/*global tau */
(function () {

	var page = document.getElementById("light-template-page"),
		dimmer = document.getElementById("dimmer"),
		slider = document.getElementById("slider"),
		inputBound,
		dimmerWidget;

	page.addEventListener("pagebeforeshow", function () {
		inputBound = onInput.bind(null);
		dimmerWidget = tau.widget.Dimmer(dimmer);
		slider.addEventListener("input", inputBound, false);
	});

	function onInput(event) {
		var newVal = parseInt(event.target.getAttribute("value"));

		dimmerWidget.value(newVal);
	}

	/**
	 * pagebeforehide event handler
	 * Destroys and removes event listeners
	 */
	page.addEventListener("pagebeforehide", function () {
		dimmerWidget.destroy();
	});
}());