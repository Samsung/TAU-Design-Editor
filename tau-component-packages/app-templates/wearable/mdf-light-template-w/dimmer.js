/*global tau */
(function () {
	/**
	 * page - Progress page element
	 * progressBar - Circle progress element
	 * resultDiv - Indicator element for the progress percentage
	 * progressBarWidget - TAU circle progress instance
	 * resultText - Text value for the progress percentage
	 * pageBeforeShowHandler - pagebeforeshow event handler
	 * pageHideHandler - pagehide event handler
	 */
	var page = document.getElementById("brightness-page"),
		pageLabel = document.getElementById("light-page"),
		progressBar = null,
		resultDiv = null,
		resultElement = null,
		progressBarWidget,
		resultText,
		pageBeforeShowHandler,
		pageHideHandler,
		i;

	/**
	 * Updates the percentage of the progress
	 */
	function printResult() {
		resultText = progressBarWidget.value();
		resultDiv.innerHTML = resultText + "%";
		resultElement.innerHTML = "Brightness: " + resultText + "%";
	}

	/**
	 * Initializes global variables
	 */
	function clearVariables() {
		page = null;
		progressBar = null;
		resultDiv = null;
	}

	/**
	 * Rotary event handler
	 */
	function rotaryDetentHandler() {
		// Get rotary direction
		var direction = event.detail.direction,
			value = parseInt(progressBarWidget.value(), 10);

		if (direction === "CW") {
			// Right direction
			if (value < 100) {
				value += 10;
			} else {
				value = 100;
			}
		} else if (direction === "CCW") {
			// Left direction
			if (value > 0) {
				value -= 10;
			} else {
				value = 0;
			}
		}

		progressBarWidget.value(value);
		brightness = progressBarWidget.value();
		printResult();
	}

	/**
	 * Removes event listeners
	 */
	function unbindEvents() {
		page.removeEventListener("pageshow", pageBeforeShowHandler);
		page.removeEventListener("pagehide", pageHideHandler);
		document.removeEventListener("rotarydetent", rotaryDetentHandler);
	}

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	pageBeforeShowHandler = function () {
		progressBar = page.querySelector(".ui-circle-progress");
		resultDiv = page.querySelector(".result");
		resultElement = pageLabel.querySelector("#brightness-label");

		progressBarWidget = new tau.widget.CircleProgressBar(progressBar);
		progressBarWidget.value(brightness);
		document.addEventListener("rotarydetent", rotaryDetentHandler);

		i = parseInt(progressBarWidget.value(), 10);

		if (resultDiv) {
			resultDiv.innerHTML = i + "%";
		}
	};

	/**
	 * pagehide event handler
	 * Destroys and removes event listeners
	 */
	pageHideHandler = function () {
		unbindEvents();
		clearVariables();
		// release object
		progressBarWidget.destroy();
	};

	page.addEventListener("pagebeforeshow", pageBeforeShowHandler);
	page.addEventListener("pagehide", pageHideHandler);
}());
