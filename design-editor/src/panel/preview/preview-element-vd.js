/* eslint-disable no-console */
/* eslint-disable max-len */
function startVD (profile) {
	let stDevice, stProperty, stValue, eventType;
	const previewEl = document.querySelector('.closet-preview-frame').contentWindow;
	const tau = previewEl.tau;

	/* iFrame Element */
	const textData = previewEl.document.querySelector('input[type=\'text\']');
	const sliderData = previewEl.document.querySelector('input[type=\'range\']');
	const dimmerData = previewEl.document.querySelector('.ui-dimmer');
	const graphData = previewEl.document.querySelector('.ui-graph');
	/* TAU widget Element */
	const dimmer = tau.widget.Dimmer(dimmerData);
	const graph = tau.widget.Graph(graphData);
	const slider = tau.widget.Slider(sliderData);
	const text = tau.widget.TextInput(textData);

	const connection = new WebSocket('ws://localhost:8000');

	connection.onopen = function () {
		console.log('WebSocket is connected.');
	};

	connection.onerror = function (error) {
		console.log(`not connect or server is down, ${error}`);
	};

	connection.onmessage = function (message) {
		const json = JSON.parse(message.data);
		const elementsArray = [];
		if (json.type === 'oic.r.light.dimming') {
			stDevice = json.type;
			stProperty = json.data.text;
			stValue = json.data.id;
			console.log(`stDevice : ${stDevice} / stProperty : ${stProperty} / stValue : ${stValue}`);

			if (textData) {
				elementsArray.push(textData);
			}
			if (sliderData) {
				elementsArray.push(sliderData);
			}
			if (dimmerData) {
				elementsArray.push(dimmerData);
			}
			if (graphData) {
				elementsArray.push(graphData);
			}
			compareAttribute(elementsArray);
		} else {
			console.log(`Incorrect data : ${json}`);
		}
	};

	if (profile === 'mobile') {
		eventType = 'input';
	} else {
		eventType = 'change';
	}

	if (sliderData != undefined || sliderData != null) {
		sliderData.addEventListener(eventType, (event) => {
			const data = event.target.value;
			const dataInfo = {
				device: 'oic.r.light.dimming',
				property: 'dimmingSetting',
				value: data
			};
			if (textData) {
				text.value(parseInt(data, 10));
			}
			slider.value(parseInt(data, 10));
			connection.send(JSON.stringify(dataInfo));
		});
	}

	if (textData != undefined || textData != null) {
		textData.addEventListener('change', (event) => {
			const data = event.target.value;
			const dataInfo = {
				device: 'oic.r.light.dimming',
				property: 'dimmingSetting',
				value: data
			};
			if (sliderData) {
				slider.value(parseInt(data, 10));
			}
			text.value(parseInt(data, 10));
			connection.send(JSON.stringify(dataInfo));
		});
	}

	setInterval(() => {
		if (connection.readyState !== 1) {
			console.log('Unable to comminucate with the WebSocket server.');
		}
	}, 5000);

	function compareAttribute(elementsArray) {
		console.log('Calling compareAttribute function !');
		for (let i = 0; i < elementsArray.length; i++) {
			if (elementsArray[i].getAttribute('st-device') === stDevice && elementsArray[i].getAttribute('st-property') === stProperty) {
				if (elementsArray[i] === textData) {
					text.value(parseInt(stValue, 10));
				} else if (elementsArray[i] === sliderData) {
					slider.value(parseInt(stValue, 10));
				} else if (elementsArray[i] === dimmerData) {
					dimmer.value(parseInt(stValue, 10));
				} else if (elementsArray[i] === graphData) {
					graph.value(parseInt(stValue, 10));
				} else {
					console.error('No match widget data.');
				}
			}
		}
	}
}
export {startVD};
