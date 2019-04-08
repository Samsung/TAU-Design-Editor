/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function(window, document, undefined) {

var ns = window.tau = window.tau || {},
nsConfig = window.tauConfig = window.tauConfig || {};
nsConfig.rootNamespace = 'tau';
nsConfig.fileName = 'tau';
ns.version = '0.12.7';
/*global window, console, define, ns, nsConfig */
/*jslint plusplus:true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Core namespace
 * Object contains main framework methods.
 * @class ns
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns, nsConfig) {
	"use strict";
			var idNumberCounter = 0,
			currentDate = +new Date(),
			slice = [].slice,
			rootNamespace = nsConfig.rootNamespace,
			fileName = nsConfig.fileName,
			infoForLog = function (args) {
				var dateNow = new Date();
				args.unshift('[' + rootNamespace + '][' + dateNow.toLocaleString() + ']');
			};

		/**
		* Return unique id
		* @method getUniqueId
		* @static
		* @return {string}
		* @member ns
		*/
		ns.getUniqueId = function () {
			return rootNamespace + "-" + ns.getNumberUniqueId() + "-" + currentDate;
		};

		/**
		* Return unique id
		* @method getNumberUniqueId
		* @static
		* @return {number}
		* @member ns
		*/
		ns.getNumberUniqueId = function () {
			return idNumberCounter++;
		};

		/**
		* logs supplied messages/arguments
		* @method log
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.log = function () {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.log.apply(console, args);
			}
		};

		/**
		* logs supplied messages/arguments ad marks it as warning
		* @method warn
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.warn = function () {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.warn.apply(console, args);
			}
		};

		/**
		* logs supplied messages/arguments and marks it as error
		* @method error
		* @static
		* @param {...*} argument
		* @member ns
		*/
		ns.error = function () {
			var args = slice.call(arguments);
			infoForLog(args);
			if (console) {
				console.error.apply(console, args);
			}
		};

		/**
		* get from nsConfig
		* @method getConfig
		* @param {string} key
		* @param {*} defaultValue
		* @return {*}
		* @static
		* @member ns
		*/
		ns.getConfig = function (key, defaultValue) {
			return nsConfig[key] === undefined ? defaultValue : nsConfig[key];
		};

		/**
		 * set in nsConfig
		 * @method setConfig
		 * @param {string} key
		 * @param {*} value
		 * @param {boolean} [asDefault=false] value should be treated as default (doesn't overwrites the config[key] if it already exists)
		 * @static
		 * @member ns
		*/
		ns.setConfig = function (key, value, asDefault) {
			if (!asDefault || (asDefault && nsConfig[key] === undefined)) {
				nsConfig[key] = value;
			}
		};

		/**
		 * Return path for framework script file.
		 * @method getFrameworkPath
		 * @returns {?string}
		 * @member ns
		 */
		ns.getFrameworkPath = function () {
			var scripts = document.getElementsByTagName('script'),
				countScripts = scripts.length,
				i,
				url,
				arrayUrl,
				count;
			for (i = 0; i < countScripts; i++) {
				url = scripts[i].src;
				arrayUrl = url.split('/');
				count = arrayUrl.length;
				if (arrayUrl[count - 1] === fileName + '.js' || arrayUrl[count - 1] === fileName + '.min.js') {
					return arrayUrl.slice(0, count - 1).join('/');
				}
			}
			return null;
		};

		}(window.document, ns, nsConfig));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/*
 * Defaults settings object
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @class ns.defaults
 */
(function (ns) {
	"use strict";
	
			ns.defaults = {};

			Object.defineProperty(ns.defaults, "autoInitializePage", {
				 get: function(){
					 return ns.getConfig("autoInitializePage", true);
				 },
				 set: function(value){
					 return ns.setConfig("autoInitializePage", value);
				 }
			});

			Object.defineProperty(ns.defaults, "dynamicBaseEnabled", {
				 get: function(){
					 return ns.getConfig("dynamicBaseEnabled", true);
				 },
				 set: function(value){
					 return ns.setConfig("dynamicBaseEnabled", value);
				 }
			});

			Object.defineProperty(ns.defaults, "pageTransition", {
				 get: function(){
					 return ns.getConfig("pageTransition", "none");
				 },
				 set: function(value){
					 return ns.setConfig("pageTransition", value);
				 }
			});

			Object.defineProperty(ns.defaults, "popupTransition", {
				 get: function(){
					 return ns.getConfig("popupTransition", "none");
				 },
				 set: function(value){
					 return ns.setConfig("popupTransition", value);
				 }
			});

			Object.defineProperty(ns.defaults, "popupFullSize", {
				get: function(){
					return ns.getConfig("popupFullSize", false);
				},
				set: function(value){
					return ns.setConfig("popupFullSize", value);
				}
			});

			Object.defineProperty(ns.defaults, "enablePageScroll", {
				get: function(){
					return ns.getConfig("enablePageScroll", false);
				},
				set: function(value){
					return ns.setConfig("enablePageScroll", value);
				}
			});

			Object.defineProperty(ns.defaults, "scrollEndEffectArea", {
				get: function(){
					return ns.getConfig("scrollEndEffectArea", "content");
				},
				set: function(value){
					return ns.setConfig("scrollEndEffectArea", value);
				}
			});

			Object.defineProperty(ns.defaults, "enablePopupScroll", {
				get: function(){
					return ns.getConfig("enablePopupScroll", false);
				},
				set: function(value){
					return ns.setConfig("enablePopupScroll", value);
				}
			});
			}(ns));

/*global window, define*/
/*jslint bitwise: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	"use strict";
	
			// Default configuration properties
			ns.setConfig('rootDir', ns.getFrameworkPath(), true);
			ns.setConfig('version', '');
			ns.setConfig('allowCrossDomainPages', false, true);
			ns.setConfig('domCache', false, true);
			// .. other possible options
			// ns.setConfig('autoBuildOnPageChange', true);
			// ns.setConfig('autoInitializePage', true);
			// ns.setConfig('container', document.body); // for defining application container
			// ns.setConfig('pageContainer', document.body); // same as above, but for wearable version

			}(ns));

/*global window, define*/
/*jslint bitwise: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @class ns.support
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
			var isTizen = !(typeof tizen === "undefined");

			function isCircleShape() {
				var testDiv = document.createElement("div"),
					fakeBody = document.createElement("body"),
					html = document.getElementsByTagName('html')[0],
					style = getComputedStyle(testDiv),
					isCircle;

				testDiv.classList.add("is-circle-test");
				fakeBody.appendChild(testDiv);
				html.insertBefore(fakeBody, html.firstChild);
				isCircle = style.width === "1px";
				html.removeChild(fakeBody);

				return isCircle;
			}

			ns.support = {
				cssTransitions: true,
				mediaquery: true,
				cssPseudoElement: true,
				touchOverflow: true,
				cssTransform3d: true,
				boxShadow: true,
				scrollTop: 0,
				dynamicBaseTag: true,
				cssPointerEvents: false,
				boundingRect: true,
				browser: {
					ie: false,
					tizen: isTizen
				},
				shape: {
					circle: isTizen ? window.matchMedia("(-tizen-geometric-shape: circle)").matches : isCircleShape(),
				},
				gradeA : function () {
					return true;
				}
			};
			}(window, window.document, ns));

/*global window, define*/
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint bitwise: true */
(function (ns) {
	"use strict";
				// Default configuration properties for wearable
			ns.setConfig("autoBuildOnPageChange", false, true);

			ns.setConfig("pageTransition", "pop");
			ns.setConfig("popupTransition", "slideup");
			ns.setConfig("enablePageScroll", true);
			ns.setConfig("enablePopupScroll", true);
			// .. other possible options
			// ns.setConfig('autoInitializePage', true);
			// ns.setConfig('pageContainer', document.body); // defining application container for wearable

			}(ns));

/*global window, define, XMLHttpRequest, console, Blob */
/*jslint nomen: true, browser: true, plusplus: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Utilities
 *
 * The Tizen Advanced UI (TAU) framework provides utilities for easy-developing
 * and fully replaceable with jQuery method. When user using these DOM and
 * selector methods, it provide more light logic and it proves performance
 * of web app. The following table displays the utilities provided by the
 * TAU framework.
 *
 * @class ns.util
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
				var currentFrame = null,
				/**
				 * requestAnimationFrame function
				 * @method requestAnimationFrame
				 * @static
				 * @member ns.util
				*/
				requestAnimationFrame = (window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function (callback) {
						currentFrame = window.setTimeout(callback.bind(callback, +new Date()), 1000 / 60);
					}).bind(window),
				util = ns.util || {},
				slice = [].slice;

			/**
			 * fetchSync retrieves a text document synchronously, returns null on error
			 * @param {string} url
			 * @param {=string} [mime=""] Mime type of the resource
			 * @return {string|null}
			 * @static
			 * @member ns.util
			 */
			function fetchSync(url, mime) {
				var xhr = new XMLHttpRequest(),
					status;
				xhr.open("get", url, false);
				if (mime) {
					xhr.overrideMimeType(mime);
				}
				xhr.send();
				if (xhr.readyState === 4) {
					status = xhr.status;
					if (status === 200 || (status === 0 && xhr.responseText)) {
						return xhr.responseText;
					}
				}

				return null;
			}
			util.fetchSync = fetchSync;

			/**
			 * Removes all script tags with src attribute from document and returns them
			 * @param {HTMLElement} container
			 * @return {Array.<HTMLElement>}
			 * @private
			 * @static
			 * @member ns.util
			 */
			function removeExternalScripts(container) {
				var scripts = slice.call(container.querySelectorAll("script[src]")),
					i = scripts.length,
					script;

				while (--i >= 0) {
					script = scripts[i];
					script.parentNode.removeChild(script);
				}

				return scripts;
			}

			/**
			 * Evaluates code, reason for a function is for an atomic call to evaluate code
			 * since most browsers fail to optimize functions with try-catch blocks, so this
			 * minimizes the effect, returns the function to run
			 * @param {string} code
			 * @return {Function}
			 * @static
			 * @member ns.util
			 */
			function safeEvalWrap(code) {
				return function () {
					try {
						window.eval(code);
					} catch (e) {
						if (typeof console !== "undefined") {
							if (e.stack) {
								console.error(e.stack);
							} else if (e.name && e.message) {
								console.error(e.name, e.message);
							} else {
								console.error(e);
							}
						}
					}
				};
			}
			util.safeEvalWrap = safeEvalWrap;

			/**
			 * Calls functions in supplied queue (array)
			 * @param {Array.<Function>} functionQueue
			 * @static
			 * @member ns.util
			 */
			function batchCall(functionQueue) {
				var i,
					length = functionQueue.length;
				for (i = 0; i < length; ++i) {
					functionQueue[i].call(window);
				}
			}
			util.batchCall = batchCall;

			/**
			 * Creates new script elements for scripts gathered from a differnt document
			 * instance, blocks asynchronous evaluation (by renaming src attribute) and
			 * returns an array of functions to run to evalate those scripts
			 * @param {Array.<HTMLElement>} scripts
			 * @param {HTMLElement} container
			 * @return {Array.<Function>}
			 * @private
			 * @static
			 * @member ns.util
			 */
			function createScriptsSync(scripts, container) {
				var scriptElement,
					scriptBody,
					i,
					length,
					queue = [];

				// proper order of execution
				for (i = 0, length = scripts.length; i < length; ++i) {
					scriptBody = fetchSync(scripts[i].src, "text/plain");
					if (scriptBody) {
						scriptElement = document.adoptNode(scripts[i]);
						scriptElement.setAttribute("data-src", scripts[i].src);
						scriptElement.removeAttribute("src"); // block evaluation
						queue.push(safeEvalWrap(scriptBody));
						if (container) {
							container.appendChild(scriptElement);
						}
					}
				}

				return queue;
			}

			util.requestAnimationFrame = requestAnimationFrame;

			/**
			* cancelAnimationFrame function
			* @method cancelAnimationFrame
			* @return {Function}
			* @member ns.util
			* @static
			*/
			util.cancelAnimationFrame = (window.cancelAnimationFrame ||
					window.webkitCancelAnimationFrame ||
					window.mozCancelAnimationFrame ||
					window.oCancelAnimationFrame ||
					window.msCancelAnimationFrame ||
					function () {
						// propably wont work if there is any more than 1
						// active animationFrame but we are trying anyway
					window.clearTimeout(currentFrame);
				}).bind(window);

			/**
			 * Method make asynchronous call of function
			 * @method async
			 * @inheritdoc #requestAnimationFrame
			 * @member ns.util
			 * @static
			 */
			util.async = requestAnimationFrame;

			/**
			 * Appends element from different document instance to current document in the
			 * container element and evaluates scripts (synchronously)
			 * @param {HTMLElement} element
			 * @param {HTMLElement} container
			 * @method importEvaluateAndAppendElement
			 * @member ns.util
			 * @static
			 */
			util.importEvaluateAndAppendElement = function (element, container) {
				var externalScriptsQueue = createScriptsSync(removeExternalScripts(element), element),
					newNode = document.importNode(element, true);

				container.appendChild(newNode); // append and eval inline
				batchCall(externalScriptsQueue);

				return newNode;
			};

			/**
			* Checks if specified string is a number or not
			* @method isNumber
			* @return {boolean}
			* @member ns.util
			* @static
			*/
			util.isNumber = function (query) {
				var parsed = parseFloat(query);
				return !isNaN(parsed) && isFinite(parsed);
			};

			/**
			 * Reappend script tags to DOM structure to correct run script
			 * @method runScript
			 * @param {string} baseUrl
			 * @param {HTMLScriptElement} script
			 * @member ns.util
			 * @deprecated 2.3
			 */
			util.runScript = function (baseUrl, script) {
				var newScript = document.createElement("script"),
					scriptData = null,
					i,
					scriptAttributes = slice.call(script.attributes),
					src = script.getAttribute("src"),
					path = util.path,
					request,
					attribute,
					status;

				// 'src' may become null when none src attribute is set
				if (src !== null) {
					src = path.makeUrlAbsolute(src, baseUrl);
				}

				//Copy script tag attributes
				i = scriptAttributes.length;
				while (--i >= 0) {
					attribute = scriptAttributes[i];
					if (attribute.name !== "src") {
						newScript.setAttribute(attribute.name, attribute.value);
					} else {
						newScript.setAttribute("data-src", attribute.value);
					}
				}

				if (src) {
					scriptData = fetchSync(src, "text/plain");
									} else {
					scriptData = script.textContent;
				}

				if (scriptData) {
					// add the returned content to a newly created script tag
					newScript.src = URL.createObjectURL(new Blob([scriptData], {type: "text/javascript"}));
					newScript.textContent = scriptData; // for compatibility with some libs ex. templating systems
				}
				script.parentNode.replaceChild(newScript, script);
			};

			ns.util = util;
			}(window, window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Array Utility
 * Utility helps work with arrays.
 * @class ns.util.array
 */
(function (window, document, ns) {
	"use strict";
				/**
			 * Create an array containing the range of integers or characters
			 * from low to high (inclusive)
			 * @method range
			 * @param {number|string} low
			 * @param {number|string} high
			 * @param {number} step
			 * @static
			 * @return {Array} array containing continous elements
			 * @member ns.util.array
			 */
			function range(low, high, step) {
				// Create an array containing the range of integers or characters
				// from low to high (inclusive)
				//
				// version: 1107.2516
				// discuss at: http://phpjs.org/functions/range
				// +   original by: Waldo Malqui Silva
				// *	example 1: range ( 0, 12 );
				// *	returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
				// *	example 2: range( 0, 100, 10 );
				// *	returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
				// *	example 3: range( 'a', 'i' );
				// *	returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
				// *	example 4: range( 'c', 'a' );
				// *	returns 4: ['c', 'b', 'a']
				var matrix = [],
					inival,
					endval,
					plus,
					walker = step || 1,
					chars = false;

				if (!isNaN(low) && !isNaN(high)) {
					inival = low;
					endval = high;
				} else if (isNaN(low) && isNaN(high)) {
					chars = true;
					inival = low.charCodeAt(0);
					endval = high.charCodeAt(0);
				} else {
					inival = (isNaN(low) ? 0 : low);
					endval = (isNaN(high) ? 0 : high);
				}

				plus = inival <= endval;
				if (plus) {
					while (inival <= endval) {
						matrix.push((chars ? String.fromCharCode(inival) : inival));
						inival += walker;
					}
				} else {
					while (inival >= endval) {
						matrix.push((chars ? String.fromCharCode(inival) : inival));
						inival -= walker;
					}
				}

				return matrix;
			}

			/**
			 * Check object is arraylike (arraylike include array and
			 * collection)
			 * @method isArrayLike
			 * @param {Object} object
			 * @return {boolean} Whether arraylike object or not
			 * @member ns.util.array
			 * @static
			 */
			function isArrayLike(object) {
				var type = typeof object,
					length = object && object.length;

				// if object exists and is different from window
				// window object has length property
				if (object && object !== object.window) {
					// If length value is not number, object is not array and collection.
					// Collection type is not array but has length value.
					// e.g) Array.isArray(document.childNodes) ==> false
					return Array.isArray(object) || object instanceof NodeList || type === "function" &&
						(length === 0 || typeof length === "number" && length > 0 && (length - 1) in object);
				}
				return false;
			}

			/**
			 * Faster version of standard forEach method in array
	 		 * Confirmed that this method is 20 times faster then native
			 * @method forEach
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function forEach(array, callback) {
				var i,
					length;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					callback(array[i], i, array);
				}
			}


			/**
			 * Faster version of standard filter method in array
			 * @method filter
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function filter(array, callback) {
				var result = [],
					i,
					length,
					value;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					value = array[i];
					if (callback(value, i, array)) {
						result.push(value);
					}
				}
				return result;
			}

			/**
			 * Faster version of standard map method in array
			 * Confirmed that this method is 60% faster then native
			 * @method map
			 * @param {Array} array
			 * @param {Function} callback
			 * @member ns.util.array
			 * @static
			 */
			function map(array, callback) {
				var result = [],
					i,
					length;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					result.push(callback(array[i], i, array));
				}
				return result;
			}

			/**
			 * Faster version of standard reduce method in array
			 * Confirmed that this method is 60% faster then native
			 * @method reduce
			 * @param {Array} array
			 * @param {Function} callback
			 * @param {*} [initialValue]
			 * @member ns.util.array
			 * @return {*}
			 * @static
			 */
			function reduce(array, callback, initialValue) {
				var i,
					length,
					value,
					result = initialValue;
				if (!(array instanceof Array)) {
					array = [].slice.call(array);
				}
				length = array.length;
				for (i = 0; i < length; i++) {
					value = array[i];
					if (result === undefined && i === 0) {
						result = value;
					} else {
						result = callback(result, value, i, array);
					}
				}
				return result;
			}

			ns.util.array = {
				range: range,
				isArrayLike: isArrayLike,
				forEach: forEach,
				filter: filter,
				map: map,
				reduce: reduce
			};

			}(window, window.document, ns));

/*global window, ns, define, CustomEvent */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Events
 *
 * The Tizen Advanced UI (TAU) framework provides events optimized for the Tizen
 * Web application. The following table displays the events provided by the TAU
 * framework.
 * @class ns.event
 */
(function (window, ns) {
	"use strict";
	
			/**
			* Checks if specified variable is a array or not
			* @method isArray
			* @return {boolean}
			* @member ns.event
			* @private
			* @static
			*/
		var isArray = Array.isArray,
			isArrayLike = ns.util.array.isArrayLike,
			/**
			 * @property {RegExp} SPLIT_BY_SPACES_REGEXP
			 */
			SPLIT_BY_SPACES_REGEXP = /\s+/g,

			/**
			 * Returns trimmed value
			 * @method trim
			 * @param {string} value
			 * @return {string} trimmed string
			 * @static
			 * @private
			 * @member ns.event
			 */
			trim = function (value) {
				return value.trim();
			},

			/**
			 * Split string to array
			 * @method getEventsListeners
			 * @param {string|Array|Object} names string with one name of event, many names of events divided by spaces, array with names of widgets or object in which keys are names of events and values are callbacks
			 * @param {Function} globalListener
			 * @return {Array}
			 * @static
			 * @private
			 * @member ns.event
			 */
			getEventsListeners = function (names, globalListener) {
				var name,
					result = [],
					i;

				if (typeof names === 'string') {
					names = names.split(SPLIT_BY_SPACES_REGEXP).map(trim);
				}

				if (isArray(names)) {
					for (i=0; i<names.length; i++) {
						result.push({type: names[i], callback: globalListener});
					}
				} else {
					for (name in names) {
						if (names.hasOwnProperty(name)) {
							result.push({type: name, callback: names[name]});
						}
					}
				}
				return result;
			};

			ns.event = {

				/**
				* Triggers custom event fastOn element
				* The return value is false, if at least one of the event
				* handlers which handled this event, called preventDefault.
				* Otherwise it returns true.
				* @method trigger
				* @param {HTMLElement} element
				* @param {string} type
				* @param {?*} [data=null]
				* @param {boolean=} [bubbles=true]
				* @param {boolean=} [cancelable=true]
				* @return {boolean=}
				* @member ns.event
				* @static
				*/
				trigger: function (element, type, data, bubbles, cancelable) {
					var evt = new CustomEvent(type, {
							"detail": data,
							//allow event to bubble up, required if we want to allow to listen fastOn document etc
							bubbles: typeof bubbles === "boolean" ? bubbles : true,
							cancelable: typeof cancelable === "boolean" ? cancelable : true
						});
										return element.dispatchEvent(evt);
				},

				/**
				 * Prevent default on original event
				 * @method preventDefault
				 * @param {CustomEvent} event
				 * @member ns.event
				 * @static
				 */
				preventDefault: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.preventDefault) {
						originalEvent.preventDefault();
					}
					event.preventDefault();
				},

				/**
				* Stop event propagation
				* @method stopPropagation
				* @param {CustomEvent} event
				* @member ns.event
				* @static
				*/
				stopPropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.stopPropagation) {
						originalEvent.stopPropagation();
					}
					event.stopPropagation();
				},

				/**
				* Stop event propagation immediately
				* @method stopImmediatePropagation
				* @param {CustomEvent} event
				* @member ns.event
				* @static
				*/
				stopImmediatePropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (originalEvent && originalEvent.stopImmediatePropagation) {
						originalEvent.stopImmediatePropagation();
					}
					event.stopImmediatePropagation();
				},

				/**
				 * Return document relative cords for event
				 * @method documentRelativeCoordsFromEvent
				 * @param {Event} event
				 * @return {Object}
				 * @return {number} return.x
				 * @return {number} return.y
				 * @member ns.event
				 * @static
				 */
				documentRelativeCoordsFromEvent: function(event) {
					var _event = event ? event : window.event,
							client = {
								x: _event.clientX,
								y: _event.clientY
							},
							page = {
								x: _event.pageX,
								y: _event.pageY
							},
							posX = 0,
							posY = 0,
							touch0,
							body = document.body,
							documentElement = document.documentElement;

						if (event.type.match(/^touch/)) {
							touch0 = _event.targetTouches[0] || _event.originalEvent.targetTouches[0];
							page = {
								x: touch0.pageX,
								y: touch0.pageY
							};
							client = {
								x: touch0.clientX,
								y: touch0.clientY
							};
						}

						if (page.x || page.y) {
							posX = page.x;
							posY = page.y;
						}
						else if (client.x || client.y) {
							posX = client.x + body.scrollLeft + documentElement.scrollLeft;
							posY = client.y + body.scrollTop  + documentElement.scrollTop;
						}

						return { x: posX, y: posY };
				},

				/**
				 * Return target relative cords for event
				 * @method targetRelativeCoordsFromEvent
				 * @param {Event} event
				 * @return {Object}
				 * @return {number} return.x
				 * @return {number} return.y
				 * @member ns.event
				 * @static
				 */
				targetRelativeCoordsFromEvent: function(event) {
					var target = event.target,
						cords = {
							x: event.offsetX,
							y: event.offsetY
						};

					if (cords.x === undefined || isNaN(cords.x) ||
						cords.y === undefined || isNaN(cords.y)) {
						cords = ns.event.documentRelativeCoordsFromEvent(event);
						cords.x -= target.offsetLeft;
						cords.y -= target.offsetTop;
					}

					return cords;
				},

				/**
				 * Add event listener to element
				 * @method fastOn
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				fastOn: function(element, type, listener, useCapture) {
					element.addEventListener(type, listener, useCapture || false);
				},

				/**
				 * Remove event listener to element
				 * @method fastOff
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				fastOff: function(element, type, listener, useCapture) {
					element.removeEventListener(type, listener, useCapture || false);
				},

				/**
				 * Add event listener to element with prefixes for all browsers
				 * @method fastPrefixedOn
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				prefixedFastOn: function(element, type, listener, useCapture) {
					var nameForPrefix = type.charAt(0).toLocaleUpperCase() + type.substring(1);

					element.addEventListener(type.toLowerCase(), listener, useCapture || false);
					element.addEventListener("webkit" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("moz" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("ms" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("o" + nameForPrefix.toLowerCase(), listener, useCapture || false);
				},

				/**
				 * Remove event listener to element with prefixes for all browsers
				 * @method fastPrefixedOff
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				prefixedFastOff: function(element, type, listener, useCapture) {
					var nameForPrefix = type.charAt(0).toLocaleUpperCase() + type.substring(1);

					element.removeEventListener(type.toLowerCase(), listener, useCapture || false);
					element.removeEventListener("webkit" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("moz" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("ms" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("o" + nameForPrefix.toLowerCase(), listener, useCapture || false);
				},

				/**
				 * Add event listener to element that can be added addEventListner
				 * @method on
				 * @param {HTMLElement|HTMLDocument|Window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				on: function(element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners;

					if (isArrayLike(element)) {
						elements = element;
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							for (j = 0; j < typesLength; j++) {
								ns.event.fastOn(elements[i], listeners[j].type, listeners[j].callback, useCapture);
							}
						}
					}
				},

				/**
				 * Remove event listener to element
				 * @method off
				 * @param {HTMLElement|HTMLDocument|Window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				off: function(element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners;
					if (isArrayLike(element)) {
						elements = element;
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							for (j = 0; j < typesLength; j++) {
								ns.event.fastOff(elements[i], listeners[j].type, listeners[j].callback, useCapture);
							}
						}
					}
				},

				/**
				 * Add event listener to element only for one trigger
				 * @method one
				 * @param {HTMLElement|HTMLDocument|window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				one: function(element, type, listener, useCapture) {
					var arraySlice = [].slice,
						i,
						j,
						elementsLength,
						typesLength,
						elements,
						types,
						listeners,
						callbacks = [];
					if (isArrayLike(element)) {
						elements = arraySlice.call(element);
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							callbacks[i] = [];
							for (j = 0; j < typesLength; j++) {
								callbacks[i][j] = (function(i, j) {
									var args = arraySlice.call(arguments);
									ns.event.fastOff(elements[i], listeners[j].type, callbacks[i][j], useCapture);
									args.shift(); // remove the first argument of binding function
									args.shift(); // remove the second argument of binding function
									listeners[j].callback.apply(this, args);
								}).bind(null, i, j);
								ns.event.fastOn(elements[i], listeners[j].type, callbacks[i][j], useCapture);
							}
						}
					}
				}

			};

			}(window, ns));

/*global window, ns, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Info
 *
 * Various TAU information
 * @class ns.info
 */
(function (window, document, ns) {
	"use strict";
				/**
			 * @property {Object} info
			 * @property {string} [info.profile="default"] Current runtime profile
			 * @property {string} [info.theme="default"] Current runtime theme
			 * @property {string} info.version Current runtime version
			 * @member ns.info
			 * @static
			 */
			var eventUtils = ns.event,
				info = {
					profile: "default",
					theme: "default",
					version: ns.version,

					/**
					 * Refreshes information about runtime
					 * @method refreshTheme
					 * @param {Function} done Callback run when the theme is discovered
					 * @member ns.info
					 * @return {null|String}
					 * @static
					 */
					refreshTheme: function (done) {
						var el = document.createElement("span"),
							parent = document.body,
							themeName = null;

						if (document.readyState !== "interactive" && document.readyState !== "complete") {
							eventUtils.fastOn(document, "DOMContentLoaded", this.refreshTheme.bind(this, done));
							return null;
						}
						el.classList.add("tau-info-theme");

						parent.appendChild(el);
						themeName = window.getComputedStyle(el, ":after").content;
						parent.removeChild(el);

						if (themeName && themeName.length > 0) {
							this.theme = themeName;
						}

						themeName = themeName || null;

						if (done) {
							done(themeName);
						}

						return themeName;
					}
				};

			info.refreshTheme();

			ns.info = info;
			}(window, window.document, ns));

/*global define: true, window: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Selectors Utility
 * Object contains functions to get HTML elements by different selectors.
 * @class ns.util.selectors
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	"use strict";
				/**
			 * @method slice Alias for array slice method
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			var slice = [].slice,
				/**
				 * @method matchesSelectorType
				 * @return {string|boolean}
				 * @member ns.util.selectors
				 * @private
				 * @static
				 */
				matchesSelectorType = (function () {
					var el = document.createElement("div");

					if (typeof el.webkitMatchesSelector === "function") {
						return "webkitMatchesSelector";
					}

					if (typeof el.mozMatchesSelector === "function") {
						return "mozMatchesSelector";
					}

					if (typeof el.msMatchesSelector === "function") {
						return "msMatchesSelector";
					}

					if (typeof el.matchesSelector === "function") {
						return "matchesSelector";
					}

					if (typeof el.matches === "function") {
						return "matches";
					}

					return false;
				}());

			/**
			 * Prefix selector with 'data-' and namespace if present
			 * @method getDataSelector
			 * @param {string} selector
			 * @return {string}
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			function getDataSelector(selector) {
				var namespace = ns.getConfig('namespace');
				return '[data-' + (namespace ? namespace + '-' : '') + selector + ']';
			}

			/**
			 * Runs matches implementation of matchesSelector
			 * method on specified element
			 * @method matchesSelector
			 * @param {HTMLElement} element
			 * @param {string} selector
			 * @return {boolean}
			 * @static
			 * @member ns.util.selectors
			 */
			function matchesSelector(element, selector) {
				if (matchesSelectorType && element[matchesSelectorType]) {
					return element[matchesSelectorType](selector);
				}
				return false;
			}

			/**
			 * Return array with all parents of element.
			 * @method parents
			 * @param {HTMLElement} element
			 * @return {Array}
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			function parents(element) {
				var items = [],
					current = element.parentNode;
				while (current && current !== document) {
					items.push(current);
					current = current.parentNode;
				}
				return items;
			}

			/**
			 * Checks if given element and its ancestors matches given function
			 * @method closest
			 * @param {HTMLElement} element
			 * @param {Function} testFunction
			 * @return {?HTMLElement}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function closest(element, testFunction) {
				var current = element;
				while (current && current !== document) {
					if (testFunction(current)) {
						return current;
					}
					current = current.parentNode;
				}
				return null;
			}

			/**
			 * @method testSelector
			 * @param {string} selector
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testSelector(selector, node) {
				return matchesSelector(node, selector);
			}

			/**
			 * @method testClass
			 * @param {string} className
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testClass(className, node) {
				return node && node.classList && node.classList.contains(className);
			}

			/**
			 * @method testTag
			 * @param {string} tagName
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testTag(tagName, node) {
				return node.tagName.toLowerCase() === tagName;
			}

			/**
			 * @class ns.util.selectors
			 */
			ns.util.selectors = {
				matchesSelector: matchesSelector,

				/**
				* Return array with children pass by given selector.
				* @method getChildrenBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getChildrenBySelector: function (context, selector) {
					return slice.call(context.children).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with children pass by given data-namespace-selector.
				* @method getChildrenByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getChildrenByDataNS: function (context, dataSelector) {
					return slice.call(context.children).filter(testSelector.bind(null, getDataSelector(dataSelector)));
				},

				/**
				* Return array with children with given class name.
				* @method getChildrenByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getChildrenByClass: function (context, className) {
					return slice.call(context.children).filter(testClass.bind(null, className));
				},

				/**
				* Return array with children with given tag name.
				* @method getChildrenByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getChildrenByTag: function (context, tagName) {
					return slice.call(context.children).filter(testTag.bind(null, tagName));
				},

				/**
				* Return array with all parents of element.
				* @method getParents
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParents: parents,

				/**
				* Return array with all parents of element pass by given selector.
				* @method getParentsBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParentsBySelector: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, selector));
				},

				/**
				* Return array with all parents of element pass by given selector with namespace.
				* @method getParentsBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParentsBySelectorNS: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, getDataSelector(selector)));
				},

				/**
				* Return array with all parents of element with given class name.
				* @method getParentsByClass
				* @param {HTMLElement} context
				* @param {string} className
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParentsByClass: function (context, className) {
					return parents(context).filter(testClass.bind(null, className));
				},

				/**
				* Return array with all parents of element with given tag name.
				* @method getParentsByTag
				* @param {HTMLElement} context
				* @param {string} tagName
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getParentsByTag: function (context, tagName) {
					return parents(context).filter(testTag.bind(null, tagName));
				},

				/**
				* Return first element from parents of element pass by selector.
				* @method getClosestBySelector
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @member ns.util.selectors
				*/
				getClosestBySelector: function (context, selector) {
					return closest(context, testSelector.bind(null, selector));
				},

				/**
				* Return first element from parents of element pass by selector with namespace.
				* @method getClosestBySelectorNS
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @member ns.util.selectors
				*/
				getClosestBySelectorNS: function (context, selector) {
					return closest(context, testSelector.bind(null, getDataSelector(selector)));
				},

				/**
				* Return first element from parents of element with given class name.
				* @method getClosestByClass
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @member ns.util.selectors
				*/
				getClosestByClass: function (context, selector) {
					return closest(context, testClass.bind(null, selector));
				},

				/**
				* Return first element from parents of element with given tag name.
				* @method getClosestByTag
				* @param {HTMLElement} context
				* @param {string} selector
				* @return {HTMLElement}
				* @static
				* @member ns.util.selectors
				*/
				getClosestByTag: function (context, selector) {
					return closest(context, testTag.bind(null, selector));
				},

				/**
				* Return array of elements from context with given data-selector
				* @method getAllByDataNS
				* @param {HTMLElement} context
				* @param {string} dataSelector
				* @return {Array}
				* @static
				* @member ns.util.selectors
				*/
				getAllByDataNS: function (context, dataSelector) {
					return slice.call(context.querySelectorAll(getDataSelector(dataSelector)));
				},

				/**
				 * Get scrollable parent elmenent
				 * @method getScrollableParent
				 * @param {HTMLElement} element
				 * @return {HTMLElement}
				 * @static
				 * @member ns.util.selectors
				 */
				getScrollableParent:  function (element) {
					var overflow,
						style;

					while (element && element != document.body) {
						style = window.getComputedStyle(element);

						if (style) {
							overflow = style.getPropertyValue("overflow-y");
							if (overflow === "scroll" || (overflow === "auto" && element.scrollHeight > element.clientHeight)) {
								return element;
							}
						}
						element = element.parentNode;
					}
					return null;
				}
			};
			}(window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Object Utility
 * Object contains functions help work with objects.
 * @class ns.util.object
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	"use strict";
	
			var object = {
				/**
				* Copy object to new object
				* @method copy
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @member ns.util.object
				*/
				copy: function (orgObject) {
					return object.merge({}, orgObject);
				},

				/**
				* Attach fields from second object to first object.
				* @method fastMerge
				* @param {Object} newObject
				* @param {Object} orgObject
				* @return {Object}
				* @static
				* @member ns.util.object
				*/
				fastMerge: function (newObject, orgObject) {
					var key;
					for (key in orgObject) {
						if (orgObject.hasOwnProperty(key)) {
							newObject[key] = orgObject[key];
						}
					}
					return newObject;
				},

				/**
				* Attach fields from second and next object to first object.
				* @method merge
				* @param {Object} newObject
				* @param {...Object} orgObject
				* @param {?boolean} [override=true]
				* @return {Object}
				* @static
				* @member ns.util.object
				*/
				merge: function ( /* newObject, orgObject, override */ ) {
					var newObject, orgObject, override,
						key,
						args = [].slice.call(arguments),
						argsLength = args.length,
						i;
					newObject = args.shift();
					override = true;
					if (typeof arguments[argsLength-1] === "boolean") {
						override = arguments[argsLength-1];
						argsLength--;
					}
					for (i = 0; i < argsLength; i++) {
						orgObject = args.shift();
						if (orgObject !== null) {
							for (key in orgObject) {
								if (orgObject.hasOwnProperty(key) && ( override || newObject[key] === undefined )) {
									newObject[key] = orgObject[key];
								}
							}
						}
					}
					return newObject;
				},

				/**
				 * Function add to Constructor prototype Base object and add to prototype properties and methods from
				 * prototype object.
				 * @method inherit
				 * @param {Function} Constructor
				 * @param {Function} Base
				 * @param {Object} prototype
				 * @static
				 * @member ns.util.object
				 */
				/* jshint -W083 */
				inherit: function( Constructor, Base, prototype ) {
					var basePrototype = new Base(),
						property,
						value;
					for (property in prototype) {
						if (prototype.hasOwnProperty(property)) {
							value = prototype[property];
							if ( typeof value === "function" ) {
								basePrototype[property] = (function createFunctionWithSuper(Base, property, value) {
									var _super = function() {
										var superFunction = Base.prototype[property];
										if (superFunction) {
											return superFunction.apply(this, arguments);
										}
										return null;
									};
									return function() {
										var __super = this._super,
											returnValue;

										this._super = _super;
										returnValue = value.apply(this, arguments);
										this._super = __super;
										return returnValue;
									};
								}(Base, property, value));
							} else {
								basePrototype[property] = value;
							}
						}
					}

					Constructor.prototype = basePrototype;
					Constructor.prototype.constructor = Constructor;
				},

				/**
				 * Returns true if every property value corresponds value from 'value' argument
				 * @method hasPropertiesOfValue
				 * @param {Object} obj
				 * @param {*} [value=undefined]
				 * @return {boolean}
				 */
				hasPropertiesOfValue: function (obj, value) {
					var keys = Object.keys(obj),
						i = keys.length;

					// Empty array should return false
					if (i === 0) {
						return false;
					}

					while (--i >= 0) {
						if (obj[keys[i]] !== value) {
							return false;
						}
					}

					return true;
				},

				/**
				 * Remove properties from object.
				 * @method removeProperties
				 * @param {Object} object
				 * @param {Array} propertiesToRemove
				 * @return {Object}
				 */
				removeProperties: function (object, propertiesToRemove) {
					var length = propertiesToRemove.length,
						property,
						i;

					for (i = 0; i < length; i++) {
						property = propertiesToRemove[i];
						if (object.hasOwnProperty(property)) {
							delete object[property];
						}
					}
					return object;
				}
			};
			ns.util.object = object;
			}(ns));

/*global window, define, ns, Node, HTMLElement */
/*jslint nomen: true, plusplus: true, bitwise: false */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Engine
 * Main class with engine of library which control communication
 * between parts of framework.
 * @class ns.engine
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Michal Szepielak <m.szepielak@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
				/**
			 * @method slice Array.slice
			 * @private
			 * @static
			 * @member ns.engine
			 */
			var slice = [].slice,
				/**
				 * @property {Object} eventUtils {@link ns.event}
				 * @private
				 * @static
				 * @member ns.engine
				 */
				eventUtils = ns.event,
				objectUtils = ns.util.object,
				selectors = ns.util.selectors,
				/**
				 * @property {Object} widgetDefs Object with widgets definitions
				 * @private
				 * @static
				 * @member ns.engine
				 */
				widgetDefs = {},
				/**
				 * @property {Object} widgetBindingMap Object with widgets bindings
				 * @private
				 * @static
				 * @member ns.engine
				 */
				widgetBindingMap = {},
				location = window.location,
				/**
				 * engine mode, if true then engine only builds widgets
				 * @property {boolean} justBuild
				 * @private
				 * @static
				 * @member ns.engine
				 */
				justBuild = location.hash === "#build",
				/**
				 * @property {string} [TYPE_STRING="string"] local cache of string type name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				TYPE_STRING = "string",
				/**
				 * @property {string} [TYPE_FUNCTION="function"] local cache of function type name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				TYPE_FUNCTION = "function",
				/**
				 * @property {string} [DATA_BUILT="data-tau-built"] attribute informs that widget id build
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_BUILT = "data-tau-built",
				/**
				 * @property {string} [DATA_NAME="data-tau-name"] attribute contains widget name
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_NAME = "data-tau-name",
				/**
				 * @property {string} [DATA_BOUND="data-tau-bound"] attribute informs that widget id bound
				 * @private
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				DATA_BOUND = "data-tau-bound",
				/**
				 * @property {string} NAMES_SEPARATOR
				 * @private
				 * @static
				 * @readonly
				 */
				NAMES_SEPARATOR = ",",
				/**
				 * @property {string} [querySelectorWidgets="*[data-tau-built][data-tau-name]:not([data-tau-bound])"] query selector for all widgets which are built but not bound
				 * @private
				 * @static
				 * @member ns.engine
				 */
					// @TODO this selector is not valid ...
				querySelectorWidgets = "*[" + DATA_BUILT + "][" + DATA_NAME + "]:not([" + DATA_BOUND + "])",
				/**
				 * @method excludeBuildAndBound
				 * @private
				 * @static
				 * @member ns.engine
				 * @return {string} :not([data-tau-built*='widgetName']):not([data-tau-bound*='widgetName'])
				 */
				excludeBuiltAndBound = function (widgetType) {
					return ":not([" + DATA_BUILT + "*='" + widgetType +"']):not([" + DATA_BOUND + "*='" + widgetType +"'])";
				},

				/**
				 * Engine event types
				 * @property {Object} eventType
				 * @property {string} eventType.INIT="tauinit" INIT of framework init event
				 * @property {string} eventType.WIDGET_BOUND="widgetbound" WIDGET_BOUND of widget bound event
				 * @property {string} eventType.WIDGET_DEFINED="widgetdefined" WIDGET_DEFINED of widget built event
				 * @property {string} eventType.WIDGET_BUILT="widgetbuilt" WIDGET_BUILT of widget built event
				 * @property {string} eventType.BOUND="bound" BOUND of bound event
				 * @static
				 * @readonly
				 * @member ns.engine
				 */
				eventType = {
					INIT: "tauinit",
					WIDGET_BOUND: "widgetbound",
					WIDGET_DEFINED: "widgetdefined",
					WIDGET_BUILT: "widgetbuilt",
					BOUND: "bound"
				},
				engine,
				/**
				 * @property {Object} router Router object
				 * @private
				 * @static
				 * @member ns.engine
				 */
				router;

			/**
			 * This function prepares selector for widget' definition
			 * @method selectorChange
			 * @param {string} selectorName
			 * @return {string} new selector
			 * @member ns.engine
			 * @static
			 */
			function selectorChange (selectorName) {
				if (selectorName.match(/\[data-role=/) && !selectorName.match(/:not\(\[data-role=/)) {
					return selectorName.trim();
				}
				return selectorName.trim() + ":not([data-role='none'])";
			}

			/**
			 * Function to define widget
			 * @method defineWidget
			 * @param {string} name
			 * @param {string} selector
			 * @param {Array} methods
			 * @param {Object} widgetClass
			 * @param {string} [namespace]
			 * @param {boolean} [redefine]
			 * @param {boolean} [widgetNameToLowercase = true]
			 * @return {boolean}
			 * @member ns.engine
			 * @static
			 */
			function defineWidget(name, selector, methods, widgetClass, namespace, redefine, widgetNameToLowercase) {
				var definition;
				// Widget name is absolutely required
				if (name) {
					if (!widgetDefs[name] || redefine) {
												methods = methods || [];
						methods.push("destroy", "disable", "enable", "option", "refresh", "value");
						definition = {
							name: name,
							methods: methods,
							selector: selector || "",
							selectors: selector ? selector.split(",").map(selectorChange) : [],
							widgetClass: widgetClass || null,
							namespace: namespace || "",
							widgetNameToLowercase: widgetNameToLowercase === undefined ? true : !!widgetNameToLowercase
						};

						widgetDefs[name] = definition;
						eventUtils.trigger(document, "widgetdefined", definition, false);
						return true;
					}
									} else {
					ns.error("Widget with selector [" + selector + "] defined without a name, aborting!");
				}
				return false;
			}

			/**
			 * Get binding for element
			 * @method getBinding
			 * @static
			 * @param {HTMLElement|string} element
			 * @param {string} [type] widget name
			 * @return {?Object}
			 * @member ns.engine
			 */
			function getBinding(element, type) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id,
					binding,
					widgetInstance,
					bindingElement,
					storedWidgetNames;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(id);
				}

				// Fetch group of widget defined for this element
				binding = widgetBindingMap[id];

				if (binding && typeof binding === "object") {
					// If name is defined it's possible to fetch it instantly
					if (type) {
						widgetInstance = binding.instances[type];
					} else {
						storedWidgetNames = Object.keys(binding.instances);
						widgetInstance = binding.instances[storedWidgetNames[0]];
					}

					// Return only it instance of the proper widget exists
					if (widgetInstance) {
						
						// Check if widget instance has that same object referenced
						if (widgetInstance.element === element) {
							return widgetInstance;
						}
					}
				}

				return null;
			}

			/**
			 * Set binding of widget
			 * @method setBinding
			 * @param {ns.widget.BaseWidget} widgetInstance
			 * @static
			 * @member ns.engine
			 */
			function setBinding(widgetInstance) {
				var id = widgetInstance.element.id,
					type = widgetInstance.name,
					widgetBinding = widgetBindingMap[id];

				
				// If the HTMLElement never had a widget declared create an empty object
				if(!widgetBinding) {
					widgetBinding = {
						elementId: id,
						element: widgetInstance.element,
						instances: {}
					};
				}

				widgetBinding.instances[type] = widgetInstance;
				widgetBindingMap[id] = widgetBinding;
			}

			/**
			 * Returns all bindings for element or id gives as parameter
			 * @method getAllBindings
			 * @param {HTMLElement|string} element
			 * @return {?Object}
			 * @static
			 * @member ns.engine
			 */
			function getAllBindings(element) {
				var id = !element || typeof element === TYPE_STRING ? element : element.id;

				return (widgetBindingMap[id] && widgetBindingMap[id].instances) || null;
			}

			/**
			 * Removes given name from attributeValue string.
			 * Names should be separated with a NAMES_SEPARATOR
			 * @param {string} name
			 * @param {string} attributeValue
			 * @private
			 * @static
			 * @return {string}
			 */
			function _removeWidgetNameFromAttribute(name, attributeValue) {
				var widgetNames,
					searchResultIndex;

				// Split attribute value by separator
				widgetNames = attributeValue.split(NAMES_SEPARATOR);
				searchResultIndex = widgetNames.indexOf(name);

				if (searchResultIndex > -1) {
					widgetNames.splice(searchResultIndex, 1);
					attributeValue = widgetNames.join(NAMES_SEPARATOR);
				}

				return attributeValue;
			}

			function _removeAllBindingAttributes(element) {
				element.removeAttribute(DATA_BUILT);
				element.removeAttribute(DATA_BOUND);
				element.removeAttribute(DATA_NAME);
			}

			/**
			 * Remove binding data attributes for element.
			 * @method _removeBindingAttributes
			 * @param {HTMLElement} element
			 * @param {string} type widget type (name)
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function _removeWidgetFromAttributes(element, type) {
				var dataBuilt,
					dataBound,
					dataName;

				// Most often case is that name is not defined
				if (!type) {
					_removeAllBindingAttributes(element);
				} else {
					dataBuilt = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_BUILT) || "");
					dataBound = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_BOUND) || "");
					dataName = _removeWidgetNameFromAttribute(type, element.getAttribute(DATA_NAME) || "");

					// Check if all attributes have at least one widget
					if (dataBuilt && dataBound && dataName) {
						element.setAttribute(DATA_BUILT, dataBuilt);
						element.setAttribute(DATA_BOUND, dataBound);
						element.setAttribute(DATA_NAME, dataName);
					} else {
						// If something is missing remove everything
						_removeAllBindingAttributes(element);
					}
				}
			}

			/**
			 * Method removes binding for single widget.
			 * @method _removeSingleBinding
			 * @param {Object} bindingGroup
			 * @param {string} type
			 * @return {boolean}
			 * @private
			 * @static
			 */
			function _removeSingleBinding(bindingGroup, type) {
				var widgetInstance = bindingGroup[type];

				if (widgetInstance){
					if (widgetInstance.element && typeof widgetInstance.element.setAttribute === TYPE_FUNCTION) {
						_removeWidgetFromAttributes(widgetInstance.element, type);
					}

					bindingGroup[type] = null;

					return true;
				}

				return false;
			}

			/**
			 * Remove binding for widget based on element.
			 * @method removeBinding
			 * @param {HTMLElement|string} element
			 * @param {string} type widget name
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeBinding(element, type) {
				var id = (typeof element === TYPE_STRING) ? element : element.id,
					binding = widgetBindingMap[id],
					bindingGroup,
					widgetName,
					partialSuccess,
					fullSuccess = false;

				// [NOTICE] Due to backward compatibility calling removeBinding
				// with one parameter should remove all bindings

				if (binding) {
					if (typeof element === TYPE_STRING) {
						// Search based on current document may return bad results,
						// use previously defined element if it exists
						element = binding.element;
					}

					if (element) {
						_removeWidgetFromAttributes(element, type);
					}

					bindingGroup = widgetBindingMap[id] && widgetBindingMap[id].instances;

					if (bindingGroup) {
						if (!type) {
							fullSuccess = true;

							// Iterate over group of created widgets
							for (widgetName in bindingGroup) {
								if (bindingGroup.hasOwnProperty(widgetName)) {
									partialSuccess = _removeSingleBinding(bindingGroup, widgetName);
									
									// As we iterate over keys we are sure we want to remove this element
									// NOTE: Removing property by delete is slower than assigning null value
									bindingGroup[widgetName] = null;

									fullSuccess = (fullSuccess && partialSuccess);
								}
							}

							// If the object bindingGroup is empty or every key has a null value
							if (objectUtils.hasPropertiesOfValue(bindingGroup, null)) {
								// NOTE: Removing property by delete is slower than assigning null value
								widgetBindingMap[id] = null;
							}

							return fullSuccess;
						}

						partialSuccess = _removeSingleBinding(bindingGroup, type);

						if (objectUtils.hasPropertiesOfValue(bindingGroup, null)) {
							widgetBindingMap[id] = null;
						}

						return partialSuccess;
					}
				}

				return false;
			}

			/**
			 * Removes all bindings of widgets.
			 * @method removeAllBindings
			 * @param {HTMLElement|string} element
			 * @return {boolean}
			 * @static
			 * @member ns.engine
			 */
			function removeAllBindings(element) {
				// @TODO this should be coded in the other way around, removeAll should loop through all bindings and inside call removeBinding
				// but due to backward compatibility that code should be more readable
				return removeBinding(element);
			}

			/**
			 * If element not exist create base element for widget.
			 * @method ensureElement
			 * @param {HTMLElement} element
			 * @param {ns.widget.BaseWidget} Widget
			 * @return {HTMLElement}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function ensureElement(element, Widget) {
				if (!element || !element instanceof HTMLElement) {
					if (typeof Widget.createEmptyElement === TYPE_FUNCTION) {
						element = Widget.createEmptyElement();
					} else {
						element = document.createElement("div");
					}
				}
				return element;
			}

			/**
			 * Load widget
			 * @method processWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} definition definition of widget
			 * @param {ns.widget.BaseWidget} definition.widgetClass
			 * @param {string} definition.name
			 * @param {Object} [options] options for widget
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function processWidget(element, definition, options) {
				var widgetOptions = options || {},
					createFunction = widgetOptions.create,
					Widget = definition.widgetClass,
					/**
					 * @type {ns.widget.BaseWidget} widgetInstance
					 */
					widgetInstance,
					buildAttribute,
					parentEnhance,
					existingBinding;

				element = ensureElement(element, Widget);
				widgetInstance = Widget ? new Widget(element) : false;
				// if any parent has attribute data-enhance=false then stop building widgets
				parentEnhance = selectors.getParentsBySelectorNS(element, 'enhance=false');

				// While processing widgets queue other widget may built this one before
				// it reaches it's turn
				existingBinding = getBinding(element, definition.name);
				if (existingBinding && existingBinding.element === element) {
					return existingBinding.element;
				}

				if (widgetInstance && !parentEnhance.length) {
										widgetInstance.configure(definition, element, options);

					// Run .create method from widget options when a [widgetName]create event is triggered
					if (typeof createFunction === TYPE_FUNCTION) {
						eventUtils.one(element, definition.name.toLowerCase() + "create", createFunction);
					}

					if (element.id) {
						widgetInstance.id = element.id;
					}

					// Check if this type of widget was build for this element before
					buildAttribute = element.getAttribute(DATA_BUILT);
					if (!buildAttribute || (buildAttribute && buildAttribute.split(NAMES_SEPARATOR).indexOf(widgetInstance.name) === -1)) {
						element = widgetInstance.build(element);
					}

					if (element) {
						widgetInstance.element = element;

						setBinding(widgetInstance);

						widgetInstance.trigger(eventType.WIDGET_BUILT, widgetInstance, false);

						if (!justBuild) {
							widgetInstance.init(element);
						}

						widgetInstance.bindEvents(element, justBuild);

						eventUtils.trigger(element, eventType.WIDGET_BOUND, widgetInstance, false);
						eventUtils.trigger(document, eventType.WIDGET_BOUND, widgetInstance);
					} else {
											}
				}
				return widgetInstance.element;
			}

			/**
			 * Destroys widget of given 'type' for given HTMLElement.
			 * [NOTICE] This method won't destroy any children widgets.
			 * @method destroyWidget
			 * @param {HTMLElement|string} element
			 * @param {string} type
			 * @static
			 * @member ns.engine
			 */
			function destroyWidget(element, type) {
				var widgetInstance;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}

				
				// If type is not defined all widgets should be removed
				// this is for backward compatibility
				widgetInstance = getBinding(element, type);

				if (widgetInstance) {
					//Destroy widget
					widgetInstance.destroy();
					widgetInstance.trigger("widgetdestroyed");

					removeBinding(element, type);
				}
			}

			/**
			 * Calls destroy on widget (or widgets) connected with given HTMLElement
			 * Removes child widgets as well.
			 * @method destroyAllWidgets
			 * @param {HTMLElement|string} element
			 * @param {boolean} [childOnly=false] destroy only widgets on children elements
			 * @static
			 * @member ns.engine
			 */
			function destroyAllWidgets(element, childOnly) {
				var widgetName,
					widgetInstance,
					widgetGroup,
					childWidgets,
					i;

				if (typeof element === TYPE_STRING) {
					element = document.getElementById(element);
				}

				
				if (!childOnly) {
					// If type is not defined all widgets should be removed
					// this is for backward compatibility
					widgetGroup = getAllBindings(element);
					for (widgetName in widgetGroup) {
						if (widgetGroup.hasOwnProperty(widgetName)) {
							widgetInstance = widgetGroup[widgetName];

							//Destroy widget
							if (widgetInstance) {
								widgetInstance.destroy();
								widgetInstance.trigger("widgetdestroyed");
							}
						}
					}
				}

				//Destroy child widgets, if something left.
				childWidgets = slice.call(element.querySelectorAll("[" + DATA_BOUND + "]"));
				for (i = childWidgets.length - 1; i >= 0; i -= 1) {
					if (childWidgets[i]) {
						destroyAllWidgets(childWidgets[i], false);
					}
				}

				removeAllBindings(element);
			}

			/**
			 * Load widgets from data-* definition
			 * @method processHollowWidget
			 * @param {HTMLElement} element base element of widget
			 * @param {Object} definition widget definition
			 * @param {Object} [options] options for create widget
			 * @return {HTMLElement} base element of widget
			 * @private
			 * @static
			 * @member ns.engine
			 */
			function processHollowWidget(element, definition, options) {
				var name = (element && element.getAttribute(DATA_NAME)) ||
						(definition && definition.name);
								definition = definition || (name && widgetDefs[name]) || {
					"name": name
				};
				return processWidget(element, definition, options);
			}

			/**
			 * Compare function for nodes on build queue
			 * @param {Object} nodeA
			 * @param {Object} nodeB
			 * @return {number}
			 * @private
			 * @static
			 */
			function compareByDepth(nodeA, nodeB) {
				var mask = Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING;

				if (nodeA.element === nodeB.element) {
					return 0;
				}

				if (nodeA.element.compareDocumentPosition(nodeB.element) & mask) {
					return 1;
				}

				return -1;
			}

			/**
			 * Processes one build queue item. Runs processHollowWidget
			 * underneath
			 * @method processBuildQueueItem
			 * @param {Object|HTMLElement} queueItem
			 * @private
			 * @static
			 */
			function processBuildQueueItem(queueItem) {
				// HTMLElement doesn't have .element property
				// widgetDefs will return undefined when called widgetDefs[undefined]
				processHollowWidget(queueItem.element || queueItem, widgetDefs[queueItem.widgetName]);
			}

			/**
			 * Build widgets on all children of context element
			 * @method createWidgets
			 * @static
			 * @param {HTMLElement} context base html for create children
			 * @member ns.engine
			 */
			function createWidgets(context) {
				var builtWithoutTemplates = slice.call(context.querySelectorAll(querySelectorWidgets)),
					normal = [],
					buildQueue = [],
					selectorKeys = Object.keys(widgetDefs),
					excludeSelector,
					i,
					j,
					len = selectorKeys.length,
					definition,
					widgetName,
					definitionSelectors;

				
				
				// @TODO EXPERIMENTAL WIDGETS WITHOUT TEMPLATE DEFINITION
				builtWithoutTemplates.forEach(processBuildQueueItem);

				/* NORMAL */
				for (i = 0; i < len; ++i) {
					widgetName = selectorKeys[i];
					definition = widgetDefs[widgetName];
					definitionSelectors = definition.selectors;
					if (definitionSelectors.length) {
						excludeSelector = excludeBuiltAndBound(widgetName);

						normal = slice.call(context.querySelectorAll(definitionSelectors.join(excludeSelector + ",") + excludeSelector));
						j = normal.length;

						while (--j >= 0) {
							buildQueue.push({
								element: normal[j],
								widgetName: widgetName
							});
						}
					}
				}

				// Sort queue by depth, on every DOM branch outer most element go first
				buildQueue.sort(compareByDepth);

				// Build all widgets from queue
				buildQueue.forEach(processBuildQueueItem);

				
				eventUtils.trigger(document, "built");
				eventUtils.trigger(document, eventType.BOUND);
							}

			/**
			 * Handler for event create
			 * @method createEventHandler
			 * @param {Event} event
			 * @static
			 * @member ns.engine
			 */
			function createEventHandler(event) {
				createWidgets(event.target);
			}

			function setViewport() {
				/**
				 * Sets viewport tag if not exists
				 */
				var documentHead = document.head,
					metaTagListLength,
					metaTagList,
					metaTag,
					i;

				metaTagList = documentHead.querySelectorAll('[name="viewport"]');
				metaTagListLength = metaTagList.length;

				if (metaTagListLength > 0) {
					// Leave the last viewport tag
					--metaTagListLength;

					// Remove duplicated tags
					for (i = 0; i < metaTagListLength; ++i) {
						// Remove meta tag from DOM
						documentHead.removeChild(metaTagList[i]);
					}
				} else {
					// Create new HTML Element
					metaTag = document.createElement('meta');

					// Set required attributes
					metaTag.setAttribute('name', 'viewport');
					metaTag.setAttribute('content', 'width=device-width, user-scalable=no');

					// Force that viewport tag will be first child of head
					if (documentHead.firstChild) {
						documentHead.insertBefore(metaTag, documentHead.firstChild);
					} else {
						documentHead.appendChild(metaTag);
					}
				}
			}

			/**
			 * Build first page
			 * @method build
			 * @static
			 * @member ns.engine
			 */
			function build() {
				if (router) {
					// @TODO: Consider passing viewport options via script tag arguments (web-ui-fw style).
					setViewport();

					eventUtils.trigger(document, "beforerouterinit", router, false);
					router.init(justBuild);
					eventUtils.trigger(document, "routerinit", router, false);
				}
			}

			/**
			 * Method to remove all listeners bound in run
			 * @method stop
			 * @static
			 * @member ns.engine
			 */
			function stop() {
				if (router) {
					router.destroy();
				}
			}

			/**
			 * Add to object value at index equal to type of arg.
			 * @method getType
			 * @param {Object} result
			 * @param {*} arg
			 * @return {Object}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function getType(result, arg) {
				var type = arg instanceof HTMLElement ? "HTMLElement" : typeof arg;
				result[type] = arg;
				return result;
			}

			/**
			 * Convert args array to object with keys being types and arguments mapped by values
			 * @method getArgumentsTypes
			 * @param {Arguments[]} args
			 * @return {Object}
			 * @static
			 * @private
			 * @member ns.engine
			 */
			function getArgumentsTypes(args) {
				return tau.util.array.reduce(args, getType, {});
			}

			/*
			 document.addEventListener(eventType.BOUND, function () {
			 //@TODO dump it to file for faster binding by ids
			 nsWidgetBindingMap = widgetBindingMap;
			 }, false);
			 */
			ns.widgetDefinitions = {};
			engine = {
				justBuild: location.hash === "#build",
				/**
				 * object with names of engine attributes
				 * @property {Object} dataTau
				 * @property {string} [dataTau.built="data-tau-built"] attribute inform that widget id build
				 * @property {string} [dataTau.name="data-tau-name"] attribute contains widget name
				 * @property {string} [dataTau.bound="data-tau-bound"] attribute inform that widget id bound
				 * @property {string} [dataTau.separator=","] separation string for widget names
				 * @static
				 * @member ns.engine
				 */
				dataTau: {
					built: DATA_BUILT,
					name: DATA_NAME,
					bound: DATA_BOUND,
					separator: NAMES_SEPARATOR
				},
				destroyWidget: destroyWidget,
				destroyAllWidgets: destroyAllWidgets,
				createWidgets: createWidgets,

				/**
				 * Method to get all definitions of widgets
				 * @method getDefinitions
				 * @return {Object}
				 * @static
				 * @member ns.engine
				 */
				getDefinitions: function () {
					return widgetDefs;
				},
				/**
				 * Returns definition of widget
				 * @method getWidgetDefinition
				 * @param {string} name
				 * @static
				 * @member ns.engine
				 * @returns {Object}
				 */
				getWidgetDefinition: function (name) {
					return widgetDefs[name];
				},
				defineWidget: defineWidget,
				getBinding: getBinding,
				getAllBindings: getAllBindings,
				setBinding: setBinding,
				// @TODO either rename or fix functionally because
				// this method does not only remove binding but
				// actually destroys widget
				removeBinding: removeBinding,
				removeAllBindings: removeAllBindings,

				/**
				 * Clear bindings of widgets
				 * @method _clearBindings
				 * @static
				 * @member ns.engine
				 */
				_clearBindings: function () {
					//clear and set references to the same object
					widgetBindingMap = {};
				},

				build: build,

				/**
				 * Run engine
				 * @method run
				 * @static
				 * @member ns.engine
				 */
				run: function () {
										stop();

					eventUtils.fastOn(document, "create", createEventHandler);

					eventUtils.trigger(document, eventType.INIT, {tau: ns});

					switch (document.readyState) {
					case "interactive":
					case "complete":
						build();
						break;
					default:
						eventUtils.fastOn(document, "DOMContentLoaded", build.bind(engine));
						break;
					}
				},

				/**
				 * Return router
				 * @method getRouter
				 * @return {Object}
				 * @static
				 * @member ns.engine
				 */
				getRouter: function () {
					return router;
				},

				/**
				 * Initialize router. This method should be call in file with router class definition.
				 * @method initRouter
				 * @param {Function} RouterClass Router class
				 * @static
				 * @member ns.engine
				 */
				initRouter: function (RouterClass) {
					router = new RouterClass();
				},

				/**
				 * Build instance of widget and binding events
				 * Returns error when empty element is passed
				 * @method instanceWidget
				 * @param {HTMLElement} [element]
				 * @param {string} name
				 * @param {Object} [options]
				 * @return {?Object}
				 * @static
				 * @member ns.engine
				 */
				instanceWidget: function (element, name, options) {
					var binding,
						definition,
						argumentsTypes = getArgumentsTypes(arguments);

					// Map arguments with specific types to correct variables
					// Only name is required argument
					element = argumentsTypes.HTMLElement;
					name = argumentsTypes.string;
					options = argumentsTypes.object;
					// If element exists try to find existing binding
					if (element) {
						binding = getBinding(element, name);
					}
					// If didn't found binding build new widget
					if (!binding && widgetDefs[name]) {
						definition = widgetDefs[name];
						element = processHollowWidget(element, definition, options);
						binding = getBinding(element, name);
					}
					return binding;
				},

				stop: stop,

				/**
				 * Method to change build mode
				 * @method setJustBuild
				 * @param {boolean} newJustBuild
				 * @static
				 * @member ns.engine
				 */
				setJustBuild: function (newJustBuild) {
					// Set location hash to have a consistent behavior
					if(newJustBuild){
						location.hash = "build";
					} else {
						location.hash = "";
					}

					justBuild = newJustBuild;
				},

				/**
				 * Method to get build mode
				 * @method getJustBuild
				 * @return {boolean}
				 * @static
				 * @member ns.engine
				 */
				getJustBuild: function () {
					return justBuild;
				},
				_createEventHandler : createEventHandler
			};

			engine.eventType = eventType;
			ns.engine = engine;
			}(window, window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Anchor Highlight Utility
 * Utility enables highlight links.
 * @class ns.util.anchorHighlight
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Konrad Lipner <k.lipner@samsung.com>
 */
(function (document, window, ns) {
	'use strict';
				/* anchorHighlightController.js
			To prevent perfomance regression when scrolling,
			do not apply hover class in anchor.
			Instead, this code checks scrolling for time threshold and
			decide how to handle the color.
			When scrolling with anchor, it checks flag and decide to highlight anchor.
			While it helps to improve scroll performance,
			it lowers responsiveness of the element for 50msec.
			*/

			/**
			 * Touch start x
			 * @property {number} startX
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			var startX,
				/**
				 * Touch start y
				 * @property {number} startY
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				startY,
				/**
				 * Did page scrolled
				 * @property {boolean} didScroll
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				didScroll,
				/**
				 * Touch target element
				 * @property {HTMLElement} target
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				target,
				/**
				 * Timer id of adding activeClass delay
				 * @property {number} addActiveClassTimerID
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				addActiveClassTimerID,
				/**
				 * Object with default options
				 * @property {Object} options
				 * Treshold after which didScroll will be set
				 * @property {number} [options.scrollThreshold=5]
				 * Time to wait before adding activeClass
				 * @property {number} [options.addActiveClassDelay=10]
				 * Time to stay activeClass after touch end
				 * @property {number} [options.keepActiveClassDelay=100]
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				options = {
					scrollThreshold: 30,
					addActiveClassDelay: 10,
					keepActiveClassDelay: 100
				},
				/**
				 * Class used to mark element as active
				 * @property {string} [activeClassLI="ui-li-active"] activeClassLI
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				activeClassLI = "ui-li-active",
				/**
				 * Function invoked after touch move ends
				 * @method removeTouchMove
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				removeTouchMove,
				/**
				 * Alias for class {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors;


			/**
			 * Get closest highlightable element
			 * @method detectHighlightTarget
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function detectHighlightTarget(target) {
				target = selectors.getClosestBySelector(target, 'a, label');
				return target;
			}

			/**
			 * Get closest li element
			 * @method detectLiElement
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function detectLiElement(target) {
				target = selectors.getClosestByTag(target, 'li');
				return target;
			}

			/**
			 * Add active class to touched element
			 * @method addActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function addActiveClass() {
				var liTarget;
				target = detectHighlightTarget(target);
				if (!didScroll && target && (target.tagName === "A" || target.tagName === "LABEL")) {
					liTarget = detectLiElement(target);
					if( liTarget ) {
						liTarget.classList.add(activeClassLI);
					}
				}
			}

			/**
			 * Get all active elements
			 * @method getActiveElements
			 * @return {Array}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function getActiveElements() {
				return document.getElementsByClassName(activeClassLI);
			}

			/**
			 * Remove active class from active elements
			 * @method removeActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function removeActiveClass() {
				var activeA = getActiveElements(),
					activeALength = activeA.length,
					i;
				for (i = 0; i < activeALength; i++) {
					if (activeA[i]) {
						activeA[i].classList.remove(activeClassLI);
					}
				}
			}

			/**
			 * Function invoked during touch move
			 * @method touchmoveHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchmoveHandler(event) {
				var touch = event.touches[0];
				didScroll = didScroll ||
					(Math.abs(touch.clientX - startX) > options.scrollThreshold || Math.abs(touch.clientY - startY) > options.scrollThreshold);

				if (didScroll) {
					removeTouchMove();
					removeActiveClass();
				}
			}

			/**
			 * Function invoked after touch start
			 * @method touchstartHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchstartHandler(event) {
				var touches = event.touches,
					touch = touches[0];

				if (touches.length === 1) {
					didScroll = false;
					startX = touch.clientX;
					startY = touch.clientY;
					target = event.target;

					document.addEventListener("touchmove", touchmoveHandler, false);
					clearTimeout(addActiveClassTimerID);
					addActiveClassTimerID = setTimeout(addActiveClass, options.addActiveClassDelay);
				}
			}

			removeTouchMove = function () {
				document.removeEventListener("touchmove", touchmoveHandler, false);
			};

			/**
			 * Function invoked after touch
			 * @method touchendHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchendHandler(event) {
				if (event.touches.length === 0) {
					clearTimeout(addActiveClassTimerID);
					addActiveClassTimerID = null;
					if (!didScroll) {
						setTimeout(removeActiveClass, options.keepActiveClassDelay);
					}
					didScroll = false;
				}
			}

			/**
			 * Function invoked after visibilitychange event
			 * @method checkPageVisibility
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function checkPageVisibility() {
				if (document.visibilityState === "hidden") {
					removeActiveClass();
				}
			}

			/**
			 * Bind events to document
			 * @method enable
			 * @member ns.util.anchorHighlight
			 * @static
			 */
			function enable() {
				document.addEventListener("touchstart", touchstartHandler, false);
				document.addEventListener("touchend", touchendHandler, false);
				document.addEventListener("visibilitychange", checkPageVisibility, false);
				window.addEventListener("pagehide", removeActiveClass, false);
			}

			/**
			 * Unbinds events from document.
			 * @method disable
			 * @member ns.util.anchorHighlight
			 * @static
			 */
			function disable() {
				document.removeEventListener("touchstart", touchstartHandler, false);
				document.removeEventListener("touchend", touchendHandler, false);
				window.removeEventListener("pagehide", removeActiveClass, false);
			}

			enable();

			ns.util.anchorHighlight = {
				enable: enable,
				disable: disable
			};

			}(document, window, ns));

/*global window, define */
/*jslint plusplus: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Utility DOM
 * Utility object with function to DOM manipulation, CSS properties support
 * and DOM attributes support.
 *
 * # How to replace jQuery methods  by ns methods
 * ## append vs appendNodes
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).append( "<span>Test</span>" );

 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.util.DOM.appendNodes(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And
 *             <span>Test</span>
 *         </div>
 *        <div id="third">Goodbye</div>
 *     </div>
 *
 * ## replaceWith vs replaceWithNodes
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $('#second').replaceWith("<span>Test</span>");
 *
 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.util.DOM.replaceWithNodes(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <span>Test</span>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * ## before vs insertNodesBefore
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).before( "<span>Test</span>" );
 *
 * #### ns manipulation
 *
 *     @example
 *     var context = document.getElementById("second"),
 *         element = document.createElement("span");
 *     element.innerHTML = "Test";
 *     ns.util.DOM.insertNodesBefore(context, element);
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <span>Test</span>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * ## wrapInner vs wrapInHTML
 *
 * #### HTML code before manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">And</div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * #### jQuery manipulation
 *
 *     @example
 *     $( "#second" ).wrapInner( "<span class="new"></span>" );
 *
 * #### ns manipulation
 *
 *     @example
 *     var element = document.getElementById("second");
 *     ns.util.DOM.wrapInHTML(element, "<span class="new"></span>");
 *
 * #### HTML code after manipulation
 *
 *     @example
 *     <div>
 *         <div id="first">Hello</div>
 *         <div id="second">
 *             <span class="new">And</span>
 *         </div>
 *         <div id="third">Goodbye</div>
 *     </div>
 *
 * @class ns.util.DOM
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (ns) {
	"use strict";
				ns.util.DOM = ns.util.DOM || {};
			}(ns));

/*global window, define */
/*jslint plusplus: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	

			var selectors = ns.util.selectors,
				DOM = ns.util.DOM,
				namespace = "namespace";

			/**
			 * Returns given attribute from element or the closest parent,
			 * which matches the selector.
			 * @method inheritAttr
			 * @member ns.util.DOM
			 * @param {HTMLElement} element
			 * @param {string} attr
			 * @param {string} selector
			 * @return {?string}
			 * @static
			 */
			DOM.inheritAttr = function (element, attr, selector) {
				var value = element.getAttribute(attr),
					parent;
				if (!value) {
					parent = selectors.getClosestBySelector(element, selector);
					if (parent) {
						return parent.getAttribute(attr);
					}
				}
				return value;
			};

			/**
			 * Returns Number from properties described in html tag
			 * @method getNumberFromAttribute
			 * @member ns.util.DOM
			 * @param {HTMLElement} element
			 * @param {string} attribute
			 * @param {string=} [type] auto type casting
			 * @param {number} [defaultValue] default returned value
			 * @static
			 * @return {number}
			 */
			DOM.getNumberFromAttribute = function (element, attribute, type, defaultValue) {
				var value = element.getAttribute(attribute),
					result = defaultValue;

				if (!isNaN(value)) {
					if (type === "float") {
						value = parseFloat(value);
						if (!isNaN(value)) {
							result = value;
						}
					} else {
						value = parseInt(value, 10);
						if (!isNaN(value)) {
							result = value;
						}
					}
				}
				return result;
			};

			function getDataName(name) {
				var namespace = ns.getConfig(namespace);
				return "data-" + (namespace ? namespace + "-" : "") + name;
			}

			/**
			 * Special function to set attribute and property in the same time
			 * @method setAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {Mixed} value
			 * @member ns.util.DOM
			 * @static
			 */
			function setAttribute(element, name, value) {
				element[name] = value;
				element.setAttribute(name, value);
			}

			/**
			 * This function sets value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * @method setNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @param {string|number|boolean} value New value
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.setNSData = function (element, name, value) {
				element.setAttribute(getDataName(name), value);
			};

			/**
			 * This function returns value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * Method may return boolean in case of 'true' or 'false' strings as attribute value.
			 * @method getNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @member ns.util.DOM
			 * @return {?string|boolean}
			 * @static
			 */
			DOM.getNSData = function (element, name) {
				var value = element.getAttribute(getDataName(name));

				if (value === "true") {
					return true;
				}

				if (value === "false") {
					return false;
				}

				return value;
			};

			/**
			 * This function returns true if attribute data-{namespace}-{name} for element is set
			 * or false in another case. If the namespace is empty, attribute data-{name} is used.
			 * @method hasNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @member ns.util.DOM
			 * @return {boolean}
			 * @static
			 */
			DOM.hasNSData = function (element, name) {
				return element.hasAttribute(getDataName(name));
			};

			/**
			 * Get or set value on data attribute.
			 * @method nsData
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {?Mixed} [value]
			 * @static
			 * @member ns.util.DOM
			 */
			DOM.nsData = function (element, name, value) {
				// @TODO add support for object in value
				if (value === undefined) {
					return DOM.getNSData(element, name);
				} else {
					return DOM.setNSData(element, name, value);
				}
			};

			/**
			 * This function removes attribute data-{namespace}-{name} from element.
			 * If the namespace is empty, attribute data-{name} is used.
			 * @method removeNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.removeNSData = function (element, name) {
				element.removeAttribute(getDataName(name));
			};

			/**
			 * Returns object with all data-* attributes of element
			 * @method getData
			 * @param {HTMLElement} element Base element
			 * @member ns.util.DOM
			 * @return {Object}
			 * @static
			 */
			DOM.getData = function (element) {
				var dataPrefix = "data-",
					data = {},
					attrs = element.attributes,
					attr,
					nodeName,
					value,
					i,
					length = attrs.length;

				for (i = 0; i < length; i++) {
					attr = attrs.item(i);
					nodeName = attr.nodeName;
					if (nodeName.indexOf(dataPrefix) > -1) {
						value = attr.value;
						data[nodeName.replace(dataPrefix, "")] = value.toLowerCase() === "true" ? true : value.toLowerCase() === "false" ? false : value;
					}
				}

				return data;
			};

			/**
			 * Special function to remove attribute and property in the same time
			 * @method removeAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.removeAttribute = function (element, name) {
				element.removeAttribute(name);
				element[name] = false;
			};

			DOM.setAttribute = setAttribute;
			/**
			 * Special function to set attributes and propertie in the same time
			 * @method setAttribute
			 * @param {HTMLElement} element
			 * @param {Object} name
			 * @param {Mixed} value
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.setAttributes = function (element, values) {
				var i,
					names = Object.keys(values),
					name,
					len;

				for (i = 0, len = names.length; i < len; i++) {
					name = names[i];
					setAttribute(element, name, values[name]);
				}
			};
			}(window, window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Namespace For Widgets
 * Namespace For Widgets
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.widget
 */
(function (document, ns) {
	"use strict";
				var engine = ns.engine,
				widget = {
					/**
					 * Get bound widget for element
					 * @method getInstance
					 * @static
					 * @param {HTMLElement|string} element
					 * @param {string} type widget name
					 * @return {?Object}
					 * @member ns.widget
					 */
					getInstance: engine.getBinding,
					/**
					 * Returns Get all bound widget for element or id gives as parameter
					 * @method getAllInstances
					 * @param {HTMLElement|string} element
					 * @return {?Object}
					 * @static
					 * @member ns.widget
					 */
					getAllInstances: engine.getAllBindings
				};

			function widgetConstructor(name, element, options) {
				return engine.instanceWidget(element, name, options);
			}

			document.addEventListener(engine.eventType.WIDGET_DEFINED, function (evt) {
				var definition = evt.detail,
					name = definition.name;

				ns.widget[name] = widgetConstructor.bind(null, name);

			}, true);

			/** @namespace ns.widget */
			ns.widget = widget;
			}(window.document, ns));

/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true */
/*
 */
/**
 * #BaseWidget
 * Prototype class of widget
 *
 * ## How to invoke creation of widget from JavaScript
 *
 * To build and initialize widget in JavaScript you have to use method {@link ns.engine#instanceWidget} . First argument for method
 * is HTMLElement, which specifies the element of widget. Second parameter is name of widget to create.
 *
 * If you load jQuery before initializing tau library, you can use standard jQuery UI Widget notation.
 *
 * ### Examples
 * #### Build widget from JavaScript
 *
 *		@example
 *		var element = document.getElementById("id"),
 *			ns.engine.instanceWidget(element, "Button");
 *
 * #### Build widget from jQuery
 *
 *		@example
 *		var element = $("#id").button();
 *
 * ## How to create new widget
 *
 *		@example
 *		(function (ns) {
 *			"use strict";
 *			 *					var BaseWidget = ns.widget.BaseWidget, // create alias to main objects
 *						...
 *						arrayOfElements, // example of private property, common for all instances of widget
 *						Button = function () { // create local object with widget
 *							...
 *						},
 *						prototype = new BaseWidget(); // add ns.widget.BaseWidget as prototype to widget's object, for better minification this should be assign to local variable and next variable should be assign to prototype of object
 *
 *					function closestEnabledButton(element) { // example of private method
 *						...
 *					}
 *					...
 *
 *					prototype.options = { //add default options to be read from data- attributes
 *						theme: "s",
 *						...
 *					};
 *
 *					prototype._build = function (template, element) { // method called when the widget is being built, should contain all HTML manipulation actions
 *						...
 *						return element;
 *					};
 *
 *					prototype._init = function (element) { // method called during initialization of widget, should contain all actions necessary fastOn application start
 *						...
 *						return element;
 *					};
 *
 *					prototype._bindEvents = function (element) { // method to bind all events, should contain all event bindings
 *						...
 *					};
 *
 *					prototype._enable = function (element) { // method called during invocation of enable() method
 *						...
 *					};
 *
 *					prototype._disable = function (element) { // method called during invocation of disable() method
 *						...
 *					};
 *
 *					prototype.refresh = function (element) { // example of public method
 *						...
 *					};
 *
 *					prototype._refresh = function () { // example of protected method
 *						...
 *					};
 *
 *					Button.prototype = prototype;
 *
 *					engine.defineWidget( // define widget
 *						"Button", //name of widget
 *						"[data-role='button'],button,[type='button'],[type='submit'],[type='reset']",  //widget's selector
 *						[ // public methods, here should be list all public method, without that method will not be available
 *							"enable",
 *							"disable",
 *							"refresh"
 *						],
 *						Button, // widget's object
 *						"mobile" // widget's namespace
 *					);
 *					ns.widget.Button = Button;
 *					 *		}(ns));
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Przemyslaw Ciezkowski <p.ciezkowski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @class ns.widget.BaseWidget
 */
(function (document, ns, undefined) {
	"use strict";
				/**
			 * Alias to Array.slice function
			 * @method slice
			 * @member ns.widget.BaseWidget
			 * @private
			 * @static
			 */
			var slice = [].slice,
				/**
				 * Alias to ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.BaseWidget
				 * @private
				 * @static
				 */
				engine = ns.engine,
				engineDataTau = engine.dataTau,
				util = ns.util,
				/**
				 * Alias to {@link ns.event}
				 * @property {Object} eventUtils
				 * @member ns.widget.BaseWidget
				 * @private
				 * @static
				 */
				eventUtils = ns.event,
				/**
				 * Alias to {@link ns.util.DOM}
				 * @property {Object} domUtils
				 * @private
				 * @static
				 */
				domUtils = util.DOM,
				/**
				 * Alias to {@link ns.util.object}
				 * @property {Object} objectUtils
				 * @private
				 * @static
				 */
				objectUtils = util.object,
				BaseWidget = function () {
					return this;
				},
				prototype = {},
				/**
				 * Property with string represent function type 
				 * (for better minification)
				 * @property {string} [TYPE_FUNCTION="function"]
				 * @private
				 * @static
				 * @readonly
				 */
				TYPE_FUNCTION = "function",
				disableClass = "ui-state-disabled",
				ariaDisabled = "aria-disabled";

			BaseWidget.classes = {
				disable: disableClass
			};

			/**
			 * Protected method configuring the widget
			 * @method _configure
			 * @member ns.widget.BaseWidget
			 * @protected
			 * @template
			 * @internal
			 */
			/**
			 * Configures widget object from definition.
			 *
			 * It calls such methods as #\_getCreateOptions and #\_configure.
			 * @method configure
			 * @param {Object} definition
			 * @param {string} definition.name Name of the widget
			 * @param {string} definition.selector Selector of the widget
			 * @param {HTMLElement} element Element of widget
			 * @param {Object} options Configure options
			 * @member ns.widget.BaseWidget
			 * @chainable
			 * @internal
			 */
			prototype.configure = function (definition, element, options) {
				var self = this,
					definitionName,
					definitionNamespace;
				/**
				 * Object with options for widget
				 * @property {Object} [options={}]
				 * @member ns.widget.BaseWidget
				 */
				self.options = self.options || {};
				/**
				 * Base element of widget
				 * @property {?HTMLElement} [element=null]
				 * @member ns.widget.BaseWidget
				 */
				self.element = self.element || null;
				if (definition) {
					definitionName = definition.name;
					definitionNamespace = definition.namespace;
					/**
					 * Name of the widget
					 * @property {string} name
					 * @member ns.widget.BaseWidget
					 */
					self.name = definitionName;

					/**
					 * Name of the widget (in lower case)
					 * @property {string} widgetName
					 * @member ns.widget.BaseWidget
					 */
					self.widgetName = definitionName;

					/**
					 * Namespace of widget events
					 * @property {string} widgetEventPrefix
					 * @member ns.widget.BaseWidget
					 */
					self.widgetEventPrefix = definitionName.toLowerCase();

					/**
					 * Namespace of the widget
					 * @property {string} namespace 
					 * @member ns.widget.BaseWidget
					 */
					self.namespace = definitionNamespace;

					/**
					 * Full name of the widget
					 * @property {string} widgetFullName
					 * @member ns.widget.BaseWidget
					 */
					self.widgetFullName = ((definitionNamespace ? definitionNamespace + "-" : "") + definitionName).toLowerCase();
					/**
					 * Id of widget instance
					 * @property {string} id
					 * @member ns.widget.BaseWidget
					 */
					self.id = ns.getUniqueId();

					/**
					 * Widget's selector
					 * @property {string} selector
					 * @member ns.widget.BaseWidget
					 */
					self.selector = definition.selector;
				}

				if (typeof self._configure === TYPE_FUNCTION) {
					self._configure(element);
				}

				self._getCreateOptions(element);

				objectUtils.fastMerge(self.options, options);
			};

			/**
			 * Reads data-* attributes and save to options object.
			 * @method _getCreateOptions
			 * @param {HTMLElement} element Base element of the widget
			 * @return {Object}
			 * @member ns.widget.BaseWidget
			 * @protected
			 */
			prototype._getCreateOptions = function (element) {
				var options = this.options,
					bigRegexp = /[A-Z]/g;
				if (options !== undefined) {
					Object.keys(options).forEach(function (option) {
						// Get value from data-{namespace}-{name} element's attribute
						// based on widget.options property keys
						var value = domUtils.getNSData(element, (option.replace(bigRegexp, function (c) {
							return "-" + c.toLowerCase();
						})));

						if (value !== null) {
							options[option] = value;
						}
					});
				}
				return options;
			};
			/**
			 * Protected method building the widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} widget's element
			 * @member ns.widget.BaseWidget
			 * @protected
			 * @template
			 */
			/**
			 * Builds widget.
			 *
			 * It calls method #\_build.
			 *
			 * Before starting building process, the event beforecreate with
			 * proper prefix defined in variable widgetEventPrefix is triggered.
			 * @method build
			 * @param {HTMLElement} element Element of widget before building process
			 * @return {HTMLElement} Element of widget after building process
			 * @member ns.widget.BaseWidget
			 * @internal
			 */
			prototype.build = function (element) {
				var self = this,
					id,
					node,
					dataBuilt = element.getAttribute(engineDataTau.built),
					dataName = element.getAttribute(engineDataTau.name);

				eventUtils.trigger(element, self.widgetEventPrefix + "beforecreate");

				id = element.id;
				if (id) {
					self.id = id;
				} else {
					element.id = self.id;
				}

				if (typeof self._build === TYPE_FUNCTION) {
					node = self._build(element);
				} else {
					node = element;
				}

				// Append current widget name to data-tau-built and data-tau-name attributes
				dataBuilt = !dataBuilt ? self.name : dataBuilt + engineDataTau.separator + self.name;
				dataName = !dataName ? self.name : dataName + engineDataTau.separator + self.name;

				element.setAttribute(engineDataTau.built, dataBuilt);
				element.setAttribute(engineDataTau.name, dataName);

				return node;
			};

			/**
			 * Protected method initializing the widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Initializes widget.
			 *
			 * It calls method #\_init.
			 * @method init
			 * @param {HTMLElement} element Element of widget before initialization
			 * @member ns.widget.BaseWidget
			 * @chainable
			 * @internal
			 */
			prototype.init = function (element) {
				var self = this;
				self.id = element.id;

				if (typeof self._init === TYPE_FUNCTION) {
					self._init(element);
				}

				if (element.getAttribute("disabled") || self.options.disabled === true) {
					self.disable();
				} else {
					self.enable();
				}

				return self;
			};

			/**
			 * Returns base element widget
			 * @member ns.widget.BaseWidget
			 * @return {HTMLElement|null}
			 * @instance
			 */
			prototype.getContainer = function () {
				var self = this;
				if (typeof self._getContainer === TYPE_FUNCTION) {
					return self._getContainer();
				}
				return self.element;
			};

			/**
			 * Bind widget events attached in init mode
			 * @method _bindEvents
			 * @param {HTMLElement} element Base element of widget
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Binds widget events.
			 *
			 * It calls such methods as #\_buildBindEvents and #\_bindEvents.
			 * At the end of binding process, the event "create" with proper
			 * prefix defined in variable widgetEventPrefix is triggered.
			 * @method bindEvents
			 * @param {HTMLElement} element Base element of the widget
			 * @param {boolean} onlyBuild Inform about the type of bindings: build/init
			 * @member ns.widget.BaseWidget
			 * @chainable
			 * @internal
			 */
			prototype.bindEvents = function (element, onlyBuild) {
				var self = this,
					dataBound = element.getAttribute(engineDataTau.bound);

				if (!onlyBuild) {
					dataBound = !dataBound ? self.name : dataBound + engineDataTau.separator + self.name;
					element.setAttribute(engineDataTau.bound, dataBound);
				}
				if (typeof self._buildBindEvents === TYPE_FUNCTION) {
					self._buildBindEvents(element);
				}
				if (!onlyBuild && typeof self._bindEvents === TYPE_FUNCTION) {
					self._bindEvents(element);
				}

				self.trigger(self.widgetEventPrefix + "create", self);

				return self;
			};

			/**
			 * Focus widget's element.
			 *
			 * This function calls function focus on element and if it is known
			 * the direction of event, the proper css classes are added/removed.
			 * @method focus
			 * @param {object} options The options of event.
			 * @param {"up"|"down"|"left"|"right"} direction
			 * For example, if this parameter has value "down", it means that the movement
			 * comes from the top (eg. down arrow was pressed on keyboard).
			 * @param {HTMLElement} previousElement Element to blur
			 * @member ns.widget.BaseWidget
			 */
			prototype.focus = function (options) {
				var self = this,
					element = self.element,
					blurElement,
					blurWidget;

				options = options || {};

				blurElement = options.previousElement;
				// we try to blur element, which has focus previously
				if (blurElement) {
					blurWidget = engine.getBinding(blurElement);
					// call blur function on widget
					if (blurWidget) {
						options = objectUtils.merge({}, options, {element: blurElement});
						blurWidget.blur(options);
					} else {
						// or on element, if widget does not exist
						blurElement.blur();
					}
				}

				options = objectUtils.merge({}, options, {element: element});

				// set focus on element
				eventUtils.trigger(document, "taufocus", options);
				element.focus();

				return true;
			};

			/**
			 * Blur widget's element.
			 *
			 * This function calls function blur on element and if it is known
			 * the direction of event, the proper css classes are added/removed.
			 * @method blur
			 * @param {object} options The options of event.
			 * @param {"up"|"down"|"left"|"right"} direction
			 * @member ns.widget.BaseWidget
			 */
			prototype.blur = function (options) {
				var self = this,
					element = self.element;

				options = objectUtils.merge({}, options, {element: element});

				// blur element
				eventUtils.trigger(document, "taublur", options);
				element.blur();
				return true;
			};

			/**
			 * Protected method destroying the widget
			 * @method _destroy
			 * @template
			 * @protected
			 * @member ns.widget.BaseWidget
			 */
			/**
			 * Destroys widget.
			 *
			 * It calls method #\_destroy.
			 *
			 * At the end of destroying process, the event "destroy" with proper
			 * prefix defined in variable widgetEventPrefix is triggered and
			 * the binding set in engine is removed.
			 * @method destroy
			 * @param {HTMLElement} element Base element of the widget
			 * @member ns.widget.BaseWidget
			 */
			prototype.destroy = function (element) {
				var self = this;
				element = element || self.element;
				if (typeof self._destroy === TYPE_FUNCTION) {
					self._destroy(element);
				}
				if (self.element) {
					self.trigger(self.widgetEventPrefix + "destroy");
				}
				if (element) {
					engine.removeBinding(element, self.name);
				}
			};

			/**
			 * Protected method disabling the widget
			 * @method _disable
			 * @protected
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Disables widget.
			 *
			 * It calls method #\_disable.
			 * @method disable
			 * @member ns.widget.BaseWidget
			 * @chainable
			 */
			prototype.disable = function () {
				var self = this,
					args = slice.call(arguments),
					element = self.element;

				element.classList.add(disableClass);
				element.setAttribute(ariaDisabled, true);

				if (typeof self._disable === TYPE_FUNCTION) {
					args.unshift(element);
					self._disable.apply(self, args);
				}
				return this;
			};

			/**
			 * Check if widget is disabled.
			 * @method isDisabled
			 * @member ns.widget.BaseWidget
			 * @return {boolean} Returns true if widget is disabled
			 */
			prototype.isDisabled = function () {
				var self = this;
				return self.element.getAttribute("disabled") || self.options.disabled === true;
			};

			/**
			 * Protected method enabling the widget
			 * @method _enable
			 * @protected
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Enables widget.
			 *
			 * It calls method #\_enable.
			 * @method enable
			 * @member ns.widget.BaseWidget
			 * @chainable
			 */
			prototype.enable = function () {
				var self = this,
					args = slice.call(arguments),
					element = self.element;

				element.classList.remove(disableClass);
				element.setAttribute(ariaDisabled, false);

				if (typeof self._enable === TYPE_FUNCTION) {
					args.unshift(element);
					self._enable.apply(self, args);
				}
				return this;
			};

			/**
			 * Protected method causing the widget to refresh
			 * @method _refresh
			 * @protected
			 * @member ns.widget.BaseWidget
			 * @template
			 */
			/**
			 * Refreshes widget.
			 *
			 * It calls method #\_refresh.
			 * @method refresh
			 * @member ns.widget.BaseWidget
			 * @chainable
			 */
			prototype.refresh = function () {
				var self = this;
				if (typeof self._refresh === TYPE_FUNCTION) {
					self._refresh.apply(self, arguments);
				}
				return self;
			};


			/**
			 * Gets or sets options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for options given in object. Keys of object are names of options and values from object are values to set.
			 *
			 * If you give only one string argument then method return value for given option.
			 *
			 * If you give two arguments and first argument will be a string then second argument will be intemperate as value to set.
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} [value] value to set
			 * @member ns.widget.BaseWidget
			 * @return {*} return value of option or undefined if method is called in setter context
			 */
			prototype.option = function (/*name, value*/) {
				var self = this,
					args = slice.call(arguments),
					firstArgument = args.shift(),
					secondArgument = args.shift(),
					key,
					result,
					partResult,
					refresh = false;
				if (typeof firstArgument === "string") {
					result = self._oneOption(firstArgument, secondArgument);
					if (firstArgument !== undefined && secondArgument !== undefined) {
						refresh = result;
						result = undefined;
					}
				} else if (typeof firstArgument === "object") {
					for (key in firstArgument) {
						if (firstArgument.hasOwnProperty(key)) {
							partResult = self._oneOption(key, firstArgument[key]);
							if (key !== undefined && firstArgument[key] !== undefined) {
								refresh = refresh || partResult;
							}
						}
					}
				}
				if (refresh) {
					self.refresh();
				}
				return result;
			};

			/**
			 * Gets or sets one option of the widget.
			 *
			 * @method _oneOption
			 * @param {string} field
			 * @param {*} value
			 * @member ns.widget.BaseWidget
			 * @return {*}
			 * @protected
			 */
			prototype._oneOption = function (field, value) {
				var self = this,
					methodName,
					refresh = false;
				if (value === undefined) {
					methodName = "_get" + (field[0].toUpperCase() + field.slice(1));
					if (typeof self[methodName] === TYPE_FUNCTION) {
						return self[methodName]();
					}
					return self.options[field];
				}
				methodName = "_set" + (field[0].toUpperCase() + field.slice(1));
				if (typeof self[methodName] === TYPE_FUNCTION) {
					self[methodName](self.element, value);
				} else {
					self.options[field] = value;
					if (self.element) {
						self.element.setAttribute("data-" + (field.replace(/[A-Z]/g, function (c) {
							return "-" + c.toLowerCase();
						})), value);
						refresh = true;
					}
				}
				return refresh;
			};

			/**
			 * Returns true if widget has bounded events.
			 *
			 * This methods enables to check if the widget has bounded 
			 * events through the {@link ns.widget.BaseWidget#bindEvents} method.
			 * @method isBound
			 * @param {string} [type] Type of widget
			 * @member ns.widget.BaseWidget
			 * @internal
			 * @return {boolean} true if events are bounded
			 */
			prototype.isBound = function (type) {
				var element = this.element;
				type = type || this.name;
				return element && element.hasAttribute(engineDataTau.bound) && element.getAttribute(engineDataTau.bound).indexOf(type) > -1;
			};

			/**
			 * Returns true if widget is built.
			 *
			 * This methods enables to check if the widget was built 
			 * through the {@link ns.widget.BaseWidget#build} method.
			 * @method isBuilt
			 * @param {string} [type] Type of widget
			 * @member ns.widget.BaseWidget
			 * @internal
			 * @return {boolean} true if the widget was built
			 */
			prototype.isBuilt = function (type) {
				var element = this.element;
				type = type || this.name;
				return element && element.hasAttribute(engineDataTau.built) && element.getAttribute(engineDataTau.built).indexOf(type) > -1;
			};

			/**
			 * Protected method getting the value of widget
			 * @method _getValue
			 * @return {*}
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Protected method setting the value of widget
			 * @method _setValue
			 * @param {*} value
			 * @return {*}
			 * @member ns.widget.BaseWidget
			 * @template
			 * @protected
			 */
			/**
			 * Gets or sets value of the widget.
			 *
			 * @method value
			 * @param {*} [value] New value of widget
			 * @member ns.widget.BaseWidget
			 * @return {*}
			 */
			prototype.value = function (value) {
				var self = this;
				if (value !== undefined) {
					if (typeof self._setValue === TYPE_FUNCTION) {
						return self._setValue(value);
					}
					return self;
				}
				if (typeof self._getValue === TYPE_FUNCTION) {
					return self._getValue();
				}
				return self;
			};

			/**
			 * Triggers an event on widget's element.
			 *
			 * @method trigger
			 * @param {string} eventName The name of event to trigger
			 * @param {?*} [data] additional Object to be carried with the event
			 * @param {boolean} [bubbles=true] Indicating whether the event
			 * bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] Indicating whether
			 * the event is cancelable
			 * @member ns.widget.BaseWidget
			 * @return {boolean} False, if any callback invoked preventDefault on event object
			 */
			prototype.trigger = function (eventName, data, bubbles, cancelable) {
				return eventUtils.trigger(this.element, eventName, data, bubbles, cancelable);
			};

			/**
			 * Adds event listener to widget's element.
			 * @method on
			 * @param {string} eventName The name of event
			 * @param {Function} listener Function called after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture Parameter of addEventListener
			 * @member ns.widget.BaseWidget
			 */
			prototype.on = function (eventName, listener, useCapture) {
				eventUtils.on(this.element, eventName, listener, useCapture);
			};

			/**
			 * Removes event listener from  widget's element.
			 * @method off
			 * @param {string} eventName The name of event
			 * @param {Function} listener Function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture Parameter of addEventListener
			 * @member ns.widget.BaseWidget
			 */
			prototype.off = function (eventName, listener, useCapture) {
				eventUtils.off(this.element, eventName, listener, useCapture);
			};

			BaseWidget.prototype = prototype;

			// definition
			ns.widget.BaseWidget = BaseWidget;

			}(window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * #Namespace For Widgets
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.widget
 */
(function (document, ns) {
	"use strict";
				ns.widget.core = ns.widget.core || {};
			}(window.document, ns));

/*global window, define */
/*jslint plusplus: true */
/*jshint -W069 */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	
			var DOM = ns.util.DOM,
				DASH_TO_UPPER_CASE_REGEXP = /-([a-z])/gi;

			/**
			 * Returns css property for element
			 * @method getCSSProperty
			 * @param {HTMLElement} element
			 * @param {string} property
			 * @param {string|number|null} [def=null] default returned value
			 * @param {"integer"|"float"|null} [type=null] auto type casting
			 * @return {string|number|null}
			 * @member ns.util.DOM
			 * @static
			 */
			function getCSSProperty(element, property, def, type) {
				var style = window.getComputedStyle(element),
					value = null,
					result = def;
				if (style) {
					value = style.getPropertyValue(property);
					if (value) {
						switch (type) {
						case "integer":
							value = parseInt(value, 10);
							if (!isNaN(value)) {
								result = value;
							}
							break;
						case "float":
							value = parseFloat(value);
							if (!isNaN(value)) {
								result = value;
							}
							break;
						default:
							result = value;
							break;
						}
					}
				}
				return result;
			}

			/**
			 * Extracts css properties from computed css for an element.
			 * The properties values are applied to the specified
			 * properties list (dictionary)
			 * @method extractCSSProperties
			 * @param {HTMLElement} element
			 * @param {Object} properties
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [noConversion=false]
			 * @member ns.util.DOM
			 * @static
			 */
			function extractCSSProperties (element, properties, pseudoSelector, noConversion) {
				var style = window.getComputedStyle(element, pseudoSelector),
					property,
					value = null,
					utils = ns.util;

				// @TODO extractCSSProperties should rather return raw values (with units)
				for (property in properties) {
					if (properties.hasOwnProperty(property)) {
						value = style.getPropertyValue(property);
						if (utils.isNumber(value) && !noConversion) {
							if (value.match(/\./gi)) {
								properties[property] = parseFloat(value);
							} else {
								properties[property] = parseInt(value, 10);
							}
						} else {
							properties[property] = value;
						}
					}
				}
			}

			/**
			 * Returns elements height from computed style
			 * @method getElementHeight
			 * @param {HTMLElement} element
			 * if null then the "inner" value is assigned
			 * @param {"outer"|null} [type=null]
			 * @param {boolean} [includeOffset=false]
			 * @param {boolean} [includeMargin=false]
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [force=false] check even if element is hidden
			 * @return {number}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementHeight(element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var height = 0,
					style,
					value,
					originalDisplay = null,
					originalVisibility = null,
					originalPosition = null,
					outer = (type && type === "outer") || false,
					offsetHeight = 0,
					property,
					props = {
						"height": 0,
						"margin-top": 0,
						"margin-bottom": 0,
						"padding-top": 0,
						"padding-bottom": 0,
						"border-top-width": 0,
						"border-bottom-width": 0,
						"box-sizing": ""
					};
				if (element) {
					style = element.style;

					if (style.display !== "none") {
						extractCSSProperties(element, props, pseudoSelector, true);
						offsetHeight = element.offsetHeight;
					} else if (force) {
						originalDisplay = style.display;
						originalVisibility = style.visibility;
						originalPosition = style.position;

						style.display = "block";
						style.visibility = "hidden";
						style.position = "relative";

						extractCSSProperties(element, props, pseudoSelector, true);
						offsetHeight = element.offsetHeight;

						style.display = originalDisplay;
						style.visibility = originalVisibility;
						style.position = originalPosition;
					}

					// We are extracting raw values to be able to check the units
					if(typeof props["height"] === "string" && props["height"].indexOf("px") === -1){
						//ignore non px values such as auto or %
						props["height"] = 0;
					}

					for (property in props) {
						if (props.hasOwnProperty(property) && property !== "box-sizing"){
							value = parseFloat(props[property]);
							if (isNaN(value)) {
								value = 0;
							}
							props[property] = value;
						}
					}

					height += props["height"];

					if (props["box-sizing"] !== 'border-box') {
						height += props["padding-top"] + props["padding-bottom"];
					}

					if (includeOffset) {
						height = offsetHeight;
					} else if (outer && props["box-sizing"] !== 'border-box') {
						height += props["border-top-width"] + props["border-bottom-width"];
					}

					if (includeMargin) {
						height += Math.max(0, props["margin-top"]) + Math.max(0, props["margin-bottom"]);
					}
				}
				return height;
			}

			/**
			 * Returns elements width from computed style
			 * @method getElementWidth
			 * @param {HTMLElement} element
			 * if null then the "inner" value is assigned
			 * @param {"outer"|null} [type=null]
			 * @param {boolean} [includeOffset=false]
			 * @param {boolean} [includeMargin=false]
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [force=false] check even if element is hidden
			 * @return {number}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementWidth(element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var width = 0,
					style,
					value,
					originalDisplay = null,
					originalVisibility = null,
					originalPosition = null,
					offsetWidth = 0,
					property,
					outer = (type && type === "outer") || false,
					props = {
						"width": 0,
						"margin-left": 0,
						"margin-right": 0,
						"padding-left": 0,
						"padding-right": 0,
						"border-left-width": 0,
						"border-right-width": 0,
						"box-sizing": ""
					};

				if (element) {
					style = element.style;

					if (style.display !== "none") {
						extractCSSProperties(element, props, pseudoSelector, true);
						offsetWidth = element.offsetWidth;
					} else if (force) {
						originalDisplay = style.display;
						originalVisibility = style.visibility;
						originalPosition = style.position;

						style.display = "block";
						style.visibility = "hidden";
						style.position = "relative";

						extractCSSProperties(element, props, pseudoSelector, true);

						style.display = originalDisplay;
						style.visibility = originalVisibility;
						style.position = originalPosition;
					}

					if(typeof props["width"] === 'string' && props["width"].indexOf("px") === -1) {
						//ignore non px values such as auto or %
						props["width"] = 0;
					}
					for (property in props) {
						if (props.hasOwnProperty(property) && property !== "box-sizing"){
							value = parseFloat(props[property]);
							if (isNaN(value)) {
								value = 0;
							}
							props[property] = value;
						}
					}

					width += props["width"];
					if (props["box-sizing"] !== 'border-box') {
						width += props["padding-left"] + props["padding-right"];
					}

					if (includeOffset) {
						width = offsetWidth;
					} else if (outer && props["box-sizing"] !== 'border-box') {
						width += props["border-left-width"] + props["border-right-width"];
					}

					if (includeMargin) {
						width += Math.max(0, props["margin-left"]) + Math.max(0, props["margin-right"]);
					}
				}
				return width;
			}

			/**
			 * Returns offset of element
			 * @method getElementOffset
			 * @param {HTMLElement} element
			 * @return {Object}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementOffset(element) {
				var left = 0,
					top = 0;
				do {
					top += element.offsetTop;
					left += element.offsetLeft;
					element = element.offsetParent;
				} while (element !== null);

				return {
					top: top,
					left: left
				};
			}

			/**
			 * Check if element occupies place at view
			 * @method isOccupiedPlace
			 * @param {HTMLElement} element
			 * @return {boolean}
			 * @member ns.util.DOM
			 * @static
			 */
			function isOccupiedPlace(element) {
				return !(element.offsetWidth <= 0 && element.offsetHeight <= 0);
			}

			function toUpperCaseFn(match, value) {
				return value.toLocaleUpperCase();
			}

			function dashesToCamelCase(str) {
				return str.replace(DASH_TO_UPPER_CASE_REGEXP, toUpperCaseFn);
			}

			function firstToUpperCase(str) {
				return str.charAt(0).toLocaleUpperCase() + str.substring(1);
			}

			/**
			 * Set values for element with prefixes for browsers
			 * @method setPrefixedStyle
			 * @param {HTMLElement} element
			 * @param {string} property
			 * @param {string|Object|null} value
			 * @member ns.util.DOM
			 * @static
			 */
			function setPrefixedStyle(element, property, value) {
				var style = element.style,
					propertyForPrefix = firstToUpperCase(dashesToCamelCase(property)),
					values = (typeof value === "string") ? {
						webkit: value,
						moz: value,
						o: value,
						ms: value,
						normal: value
					} : value;

				style[property] = values.normal;
				style["webkit" + propertyForPrefix] = values.webkit;
				style["moz" + propertyForPrefix] = values.moz;
				style["o" + propertyForPrefix] = values.o;
				style["ms" + propertyForPrefix] = values.ms;
			}

			/**
			 * Get value from element with prefixes for browsers
			 * @method getCSSProperty
			 * @param {string} value
			 * @return {Object}
			 * @member ns.util.DOM
			 * @static
			 */
			function getPrefixedValue(value) {
				return {
					webkit: "-webkit-" + value,
					moz: "-moz-" + value,
					o: "-ms-" + value,
					ms: "-o-" + value,
					normal: value
				};
			}

			/**
			 * Returns style value for css property with browsers prefixes
			 * @method getPrefixedStyle
			 * @param {HTMLStyle} styles
			 * @param {string} property
			 * @return {Object}
			 * @member ns.util.DOM
			 * @static
			 */
			function getPrefixedStyleValue(styles, property) {
				var prefixedProperties = getPrefixedValue(property),
					value,
					key;

				for (key in prefixedProperties) {
					value = styles[prefixedProperties[key]];
					if (value && value !== "none") {
						return value;
					}
				}
				return value;
			}


			// assign methods to namespace
			DOM.getCSSProperty = getCSSProperty;
			DOM.extractCSSProperties = extractCSSProperties;
			DOM.getElementHeight = getElementHeight;
			DOM.getElementWidth = getElementWidth;
			DOM.getElementOffset = getElementOffset;
			DOM.isOccupiedPlace = isOccupiedPlace;
			DOM.setPrefixedStyle = setPrefixedStyle;
			DOM.getPrefixedValue = getPrefixedValue;
			DOM.getPrefixedStyleValue = getPrefixedStyleValue;

			}(window, window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true */
/**
 * # Page Widget
 * Page is main element of application's structure.
 *
 * ## Default selectors
 * In the Tizen Web UI framework the application page structure is based on a header, content and footer elements:
 *
 * - **The header** is placed at the top, and displays the page title and optionally buttons.
 * - **The content** is the section below the header, showing the main content of the page.
 * - **The footer** is a bottom part of page which can display for example buttons
 *
 * The following table describes the specific information for each section.
 *
 * <table>
 *     <tr>
 *         <th>Section</th>
 *         <th>Class</th>
 *         <th>Mandatory</th>
 *         <th>Description</th>
 *     </tr>
 *     <tr>
 *         <td rowspan="2">Page</td>
 *         <td>ui-page</td>
 *         <td>Yes</td>
 *         <td>Defines the element as a page.
 *
 * The page widget is used to manage a single item in a page-based architecture.
 *
 * A page is composed of header (optional), content (mandatory), and footer (optional) elements.</td>
 *      </tr>
 *      <tr>
 *          <td>ui-page-active</td>
 *          <td>No</td>
 *          <td>If an application has a static start page, insert the ui-page-active class in the page element to speed up the application launch. The start page with the ui-page-active class can be displayed before the framework is fully loaded.
 *
 *If this class is not used, the framework inserts the class automatically to the first page of the application. However, this has a slowing effect on the application launch, because the page is displayed only after the framework is fully loaded.</td>
 *      </tr>
 *      <tr>
 *          <td>Header</td>
 *          <td>ui-header</td>
 *          <td>No</td>
 *          <td>Defines the element as a header.</td>
 *      </tr>
 *      <tr>
 *          <td>Content</td>
 *          <td>ui-content</td>
 *          <td>Yes</td>
 *          <td>Defines the element as content.</td>
 *      </tr>
 *      <tr>
 *          <td>Footer</td>
 *          <td>ui-footer</td>
 *          <td>No</td>
 *          <td>Defines the element as a footer.
 *
 * The footer section is mostly used to include option buttons.</td>
 *      </tr>
 *  </table>
 *
 * All elements with class=ui-page will be become page widgets
 *
 *      @example
 *         <!--Page layout-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Page layout with more button in header-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header ui-has-more">
 *                 <h2 class="ui-title">Call menu</h2>
 *                 <button type="button" class="ui-more ui-icon-overflow">More Options</button>
 *             </header>
 *             <div class="ui-content">Content message</div>
 *             <footer class="ui-footer">
 *                 <button type="button" class="ui-btn">Footer Button</button>
 *             </footer>
 *         </div>
 *
 * ## Manual constructor
 * For manual creation of page widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var pageElement = document.getElementById("page"),
 *			page = tau.widget.page(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Multi-page Layout
 *
 * You can implement a template containing multiple page containers in the application index.html file.
 *
 * In the multi-page layout, the main page is defined with the ui-page-active class. If no page has the ui-page-active class, the framework automatically sets up the first page in the source order as the main page. You can improve the launch performance by explicitly defining the main page to be displayed first. If the application has to wait for the framework to set up the main page, the page is displayed with some delay only after the framework is fully loaded.
 *
 * You can link to internal pages by referring to the ID of the page. For example, to link to the page with an ID of two, the link element needs the href="#two" attribute in the code, as in the following example.
 *
 *      @example
 *         <!--Main page-->
 *         <div id="one" class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Secondary page-->
 *         <div id="two" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 * To find the currently active page, use the ui-page-active class.
 *
 * ## Changing Pages
 * ### Go to page in JavaScript
 * To change page use method *tau.changePage*
 *
 *      @example
 *      tau.changePage("page-two");
 *
 * ### Back in JavaScript
 * To back to previous page use method *tau.back*
 *
 *      @example
 *      tau.back();
 *
 * ## Transitions
 *
 * When changing the active page, you can use a page transition.
 *
 * Tizen Web UI Framework does not apply transitions by default. To set a custom transition effect, you must add the data-transition attribute to a link:
 *
 *      @example
 *      <a href="index.html" data-transition="slideup">I'll slide up</a>
 *
 * To set a default custom transition effect for all pages, use the pageTransition property:
 *
 *      @example
 *      tau.defaults.pageTransition = "slideup";
 *
 * ### Transitions list
 *
 *  - **none** no transition.
 *  - **slideup** Makes the content of the next page slide up, appearing to conceal the content of the previous page.
 *
 * ## Handling Page Events
 *
 * With page widget we have connected many of events.
 *
 * To handle page events, use the following code:
 *
 *      @example
 *        <div id="page" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *         </div>
 *
 *         <script>
 *             var page = document.getElementById("page");
 *             page.addEventListener("Event", function(event) {
 *                 // Your code
 *             });
 *         </script>
 *
 * To bind an event callback on the Back key, use the following code:
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * To bind an event callback on the Back key, use the following code:
 *
 *      @example
 *         <script>
 *             window.addEventListener("tizenhwkey", function (event) {
 *                 if (event.keyName == "back") {
 *                     // Call window.history.back() to go to previous browser window
 *                     // Call tizen.application.getCurrentApplication().exit() to exit application
 *                     // Add script to add another behavior
 *                 }
 *             });
 *         </script>
 *
 * ## Options for Page Widget
 *
 * Page widget hasn't any options.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var pageElement = document.getElementById("page"),
 *			page = tau.widget.page(buttonElement);
 *
 *		page.methodName(methodArgument1, methodArgument2, ...);
 *
 * @class ns.widget.core.Page
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	"use strict";
				/**
			 * Alias for {@link ns.widget.BaseWidget}
			 * @property {Object} BaseWidget
			 * @member ns.widget.core.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} doms
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				doms = util.DOM,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} utilSelectors
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				utilSelectors = util.selectors,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,

				Page = function () {
					var self = this;
					/**
					 * Callback on resize
					 * @property {?Function} contentFillAfterResizeCallback
					 * @private
					 * @member ns.widget.core.Page
					 */
					self.contentFillAfterResizeCallback = null;
					self._initialContentStyle = {};
					/**
					 * Options for widget.
					 * It is empty object, because widget Page does not have any options.
					 * @property {Object} options
					 * @member ns.widget.core.Page
					 */
					self.options = {};

					self._contentStyleAttributes = ["height", "width", "minHeight", "marginTop", "marginBottom"];

					self._ui = {};
				},
				/**
				 * Dictionary for page related event types
				 * @property {Object} EventType
				 * @member ns.widget.core.Page
				 * @static
				 */
				EventType = {
					/**
					 * Triggered on the page we are transitioning to,
					 * after the transition animation has completed.
					 * @event pageshow
					 * @member ns.widget.core.Page
					 */
					SHOW: "pageshow",
					/**
					 * Triggered on the page we are transitioning away from,
					 * after the transition animation has completed.
					 * @event pagehide
					 * @member ns.widget.core.Page
					 */
					HIDE: "pagehide",
					/**
					 * Triggered when the page has been created in the DOM
					 * (for example, through Ajax) but before all widgets
					 * have had an opportunity to enhance the contained markup.
					 * @event pagecreate
					 * @member ns.widget.core.Page
					 */
					CREATE: "pagecreate",
					/**
					 * Triggered when the page is being initialized,
					 * before most plugin auto-initialization occurs.
					 * @event pagebeforecreate
					 * @member ns.widget.core.Page
					 */
					BEFORE_CREATE: "pagebeforecreate",
					/**
					 * Triggered on the page we are transitioning to,
					 * before the actual transition animation is kicked off.
					 * @event pagebeforeshow
					 * @member ns.widget.core.Page
					 */
					BEFORE_SHOW: "pagebeforeshow",
					/**
					 * Triggered on the page we are transitioning away from,
					 * before the actual transition animation is kicked off.
					 * @event pagebeforehide
					 * @member ns.widget.core.Page
					 */
					BEFORE_HIDE: "pagebeforehide"
				},
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Page
				 * @static
				 * @readonly
				 */
				classes = {
					uiPage: "ui-page",
					uiPageActive: "ui-page-active",
					uiSection: "ui-section",
					uiHeader: "ui-header",
					uiFooter: "ui-footer",
					uiContent: "ui-content"
				},

				prototype = new BaseWidget();

			Page.classes = classes;
			Page.events = EventType;

			/**
			 * Configure default options for widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._configure = function() {
				var options = this.options || {};
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {boolean|string|null} [options.header=false] Sets content of header.
				 * @property {boolean|string|null} [options.footer=false] Sets content of footer.
				 * @property {string} [options.content=null] Sets content of popup.
				 * @member ns.widget.core.Page
				 * @static
				 */
				options.header = null;
				options.footer = null;
				options.content = null;
				this.options = options;
			};

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @member ns.widget.core.Page
			 */
			prototype._contentFill = function () {
				var self = this,
					element = self.element,
					screenWidth = window.innerWidth,
					screenHeight = window.innerHeight,
					contentSelector = classes.uiContent,
					headerSelector = classes.uiHeader,
					footerSelector = classes.uiFooter,
					extraHeight = 0,
					children = [].slice.call(element.children),
					childrenLength = children.length,
					elementStyle = element.style,
					i,
					node,
					contentStyle,
					marginTop,
					marginBottom,
					nodeStyle;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					if (node.classList.contains(headerSelector) ||
						node.classList.contains(footerSelector)) {
						extraHeight += doms.getElementHeight(node);
					}
				}
				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					nodeStyle = node.style;
					if (node.classList.contains(contentSelector)) {
						contentStyle = window.getComputedStyle(node);
						marginTop = parseFloat(contentStyle.marginTop);
						marginBottom = parseFloat(contentStyle.marginBottom);
						nodeStyle.height = (screenHeight - extraHeight - marginTop - marginBottom) + "px";
						nodeStyle.width = screenWidth + "px";
					}
				}
			};

			prototype._storeContentStyle = function () {
				var initialContentStyle = this._initialContentStyle,
					contentStyleAttributes = this._contentStyleAttributes,
					content = this.element.querySelector("." + classes.uiContent),
					contentStyle = content ? content.style : {};

				contentStyleAttributes.forEach(function(name) {
					initialContentStyle[name] = contentStyle[name];
				});
			};

			prototype._restoreContentStyle = function () {
				var initialContentStyle = this._initialContentStyle,
					contentStyleAttributes = this._contentStyleAttributes,
					content = this.element.querySelector("." + classes.uiContent),
					contentStyle = content ? content.style : {};

				contentStyleAttributes.forEach(function(name) {
					contentStyle[name] = initialContentStyle[name];
				});
			};

			/**
			 * Setter for footer option
			 * @method _setFooter
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setFooter = function(element, value) {
				var self = this,
					ui = self._ui,
					footer = ui.footer;

				// footer element if footer does not exist and value is true or string
				if (!footer && value) {
					footer = document.createElement("footer");
					element.appendChild(footer);
					ui.footer = footer;
				}
				if (footer) {
					// remove child if footer does not exist and value is set to false
					if (value === false) {
						element.removeChild(footer);
					} else {
						// if options is set to true, to string or not is set
						// add class
						footer.classList.add(classes.uiFooter);
						// if is string fill content by string value
						if (typeof value === "string") {
							ui.footer.textContent = value;
						}
					}
					// and remember options
					self.options.footer = value;
				}
			};

			/**
			 * Setter for header option
			 * @method _setHeader
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setHeader = function(element, value) {
				var self = this,
					ui = self._ui,
					header = ui.header;

				// header element if header does not exist and value is true or string
				if (!header && value) {
					header = document.createElement("header");
					element.appendChild(header);
					ui.header = header;
				}
				if (header) {
					// remove child if header does not exist and value is set to false
					if (value === false) {
						element.removeChild(header);
					} else {
						// if options is set to true, to string or not is set
						// add class
						header.classList.add(classes.uiHeader);
						// if is string fill content by string value
						if (typeof value === "string") {
							ui.header.textContent = value;
						}
					}
					// and remember options
					self.options.header = value;
				}
			};

			/**
			 * Setter for content option
			 * @method _setContent
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setContent = function(element, value) {
				var self = this,
					ui = self._ui,
					content = ui.content,
					child = element.firstChild,
					next;

				if (!content && value) {
					content = document.createElement("div");
					while (child) {
						next = child.nextSibling;
						if (child !== ui.footer && child !== ui.header) {
							content.appendChild(child);
						}
						child = next;
					}
					element.insertBefore(content, ui.footer);
					ui.content = content;
				}
				if (content) {
					// remove child if content exist and value is set to false
					if (value === false) {
						element.removeChild(content);
					} else {
						// if options is set to true, to string or not is set
						// add class
						content.classList.add(classes.uiContent);
						// if is string fill content by string value
						if (typeof value === "string") {
							content.textContent = value;
						}
					}
					// and remember options
					self.options.content = value;
				}
			};

			/**
			 * Method creates empty page header. It also checks for additional
			 * content to be added in header.
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildHeader = function(element) {
				var self = this;
				self._ui.header = utilSelectors.getChildrenBySelector(element, "header,[data-role='header'],." + classes.uiHeader)[0];
				self._setHeader(element, self.options.header);
			};

			/**
			 * Method creates empty page footer.
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildFooter = function(element) {
				var self = this;

				self._ui.footer = utilSelectors.getChildrenBySelector(element, "footer,[data-role='footer'],." + classes.uiFooter)[0];
				self._setFooter(element, self.options.footer);
			};

			/**
			 * Method creates empty page content.
			 * @method _buildContent
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildContent = function(element) {
				var self = this;

				self._ui.content = utilSelectors.getChildrenBySelector(element, "[data-role='content'],." + classes.uiContent)[0];
				self._setContent(element, self.options.content);
			};

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._build = function (element) {
				var self = this;
				element.classList.add(classes.uiPage);
				self._buildHeader(element);
				self._buildFooter(element);
				self._buildContent(element);
				return element;
			};

			/**
			 * This method sets page active or inactive.
			 * @method setActive
			 * @param {boolean} value If true, then page will be active. Otherwise, page will be inactive.
			 * @member ns.widget.core.Page
			 */
			prototype.setActive = function (value) {
				var elementClassList = this.element.classList;
				if (value) {
					this.focus();
					elementClassList.add(classes.uiPageActive);
				} else {
					this.blur();
					elementClassList.remove(classes.uiPageActive);
				}
			};

			/**
			 * Return current status of page.
			 * @method isActive
			 * @member ns.widget.core.Page
			 * @instance
			 */
			prototype.isActive = function () {
				return this.element.classList.contains(classes.uiPageActive);
			};

			/**
			 * Sets the focus to page
			 * @method focus
			 * @member ns.widget.core.Page
			 */
			prototype.focus = function () {
				var element = this.element,
					focusable = element.querySelector("[autofocus]") || element;
				focusable.focus();
			};

			/**
			 * Removes focus from page and all descendants
			 * @method blur
			 * @member ns.widget.core.Page
			 */
			prototype.blur = function () {
				var element = this.element,
					focusable = element.querySelector(":focus") || element;
				focusable.blur();
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._bindEvents = function (element) {
				var self = this;
				self.contentFillAfterResizeCallback = self._contentFill.bind(self);
				window.addEventListener("resize", self.contentFillAfterResizeCallback, false);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._refresh = function () {
				this._restoreContentStyle();
				this._contentFill();
			};

			/**
			 * Layouting page structure
			 * @method layout
			 * @member ns.widget.core.Page
			 */
			prototype.layout = function () {
				this._storeContentStyle();
				this._contentFill();
			};

			/**
			 * This method triggers BEFORE_SHOW event.
			 * @method onBeforeShow
			 * @member ns.widget.core.Page
			 */
			prototype.onBeforeShow = function () {
				this.trigger(EventType.BEFORE_SHOW);
			};

			/**
			 * This method triggers SHOW event.
			 * @method onShow
			 * @member ns.widget.core.Page
			 */
			prototype.onShow = function () {
								this.trigger(EventType.SHOW);
			};

			/**
			 * This method triggers BEFORE_HIDE event.
			 * @method onBeforeHide
			 * @member ns.widget.core.Page
			 */
			prototype.onBeforeHide = function () {
				this.trigger(EventType.BEFORE_HIDE);
			};

			/**
			 * This method triggers HIDE event.
			 * @method onHide
			 * @member ns.widget.core.Page
			 */
			prototype.onHide = function () {
				this._restoreContentStyle();
				this.trigger(EventType.HIDE);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element;

				element = element || self.element;
				
				window.removeEventListener("resize", self.contentFillAfterResizeCallback, false);
				// destroy widgets on children
				engine.destroyAllWidgets(element, true);
			};

			Page.prototype = prototype;

			Page.createEmptyElement = function() {
				var div = document.createElement("div");
				div.classList.add(classes.uiPage);
				doms.setNSData(div, "role", "page");
				return div;
			};

			// definition
			ns.widget.core.Page = Page;
			engine.defineWidget(
				"Page",
				"[data-role=page],.ui-page",
				[
					"layout",
					"focus",
					"blur",
					"setActive",
					"isActive"
				],
				Page,
				"core"
			);

			engine.defineWidget(
				"page",
				"",
				[
					"layout",
					"focus",
					"blur",
					"setActive",
					"isActive"
				],
				Page,
				"core"
			);

			// @remove
			// THIS IS ONLY FOR COMPATIBILITY
			ns.widget.page = ns.widget.Page;

			}(window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # PageContainer Widget
 * PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
 *
 * It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
 *
 * @class ns.widget.core.PageContainer
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 */
(function (document, ns) {
	"use strict";
				var BaseWidget = ns.widget.BaseWidget,
				Page = ns.widget.core.Page,
				util = ns.util,
				eventUtils = ns.event,
				DOM = util.DOM,
				engine = ns.engine,
				classes = {
					pageContainer: "ui-page-container",
					uiViewportTransitioning: "ui-viewport-transitioning",
					out: "out",
					in: "in",
					reverse: "reverse",
					uiPreIn: "ui-pre-in",
					uiBuild: "ui-page-build"
				},
				PageContainer = function () {
					/**
					 * Active page.
					 * @property {ns.widget.core.Page} [activePage]
					 * @member ns.widget.core.PageContainer
					 */
					this.activePage = null;
					this.inTransition = false;
				},
				EventType = {
					/**
					 * Triggered before the changePage() request
					 * has started loading the page into the DOM.
					 * @event pagebeforechange
					 * @member ns.widget.core.PageContainer
					 */
					PAGE_BEFORE_CHANGE: "pagebeforechange",
					/**
					 * Triggered after the changePage() request
					 * has finished loading the page into the DOM and
					 * all page transition animations have completed.
					 * @event pagechange
					 * @member ns.widget.core.PageContainer
					 */
					PAGE_CHANGE: "pagechange",
					PAGE_REMOVE: "pageremove"
				},
				animationend = "animationend",
				webkitAnimationEnd = "webkitAnimationEnd",
				mozAnimationEnd = "mozAnimationEnd",
				msAnimationEnd = "msAnimationEnd",
				oAnimationEnd = "oAnimationEnd",
				prototype = new BaseWidget();

			/**
			 * Dictionary for PageContainer related event types.
			 * @property {Object} events
			 * @property {string} [events.PAGE_CHANGE="pagechange"]
			 * @member ns.router.route.popup
			 * @static
			 */
			PageContainer.events = EventType;

			/**
			 * Dictionary for PageContainer related css class names
			 * @property {Object} classes
			 * @member ns.widget.core.Page
			 * @static
			 * @readonly
			 */
			PageContainer.classes = classes;

			/**
			 * This method changes active page to specified element.
			 * @method change
			 * @param {HTMLElement} toPage The element to set
			 * @param {Object} [options] Additional options for the transition
			 * @param {string} [options.transition=none] Specifies the type of transition
			 * @param {boolean} [options.reverse=false] Specifies the direction of transition
			 * @member ns.widget.core.PageContainer
			 */
			prototype.change = function (toPage, options) {
				var self = this,
					fromPageWidget = self.getActivePage(),
					toPageWidget;

				options = options || {};
				options.widget = options.widget || "Page";

				// The change should be made only if no active page exists
				// or active page is changed to another one.
				if (!fromPageWidget || (fromPageWidget.element !== toPage)) {
					if (toPage.parentNode !== self.element) {
						toPage = self._include(toPage);
					}

					self.trigger(EventType.PAGE_BEFORE_CHANGE);

					toPage.classList.add(classes.uiBuild);

					toPageWidget = engine.instanceWidget(toPage, options.widget);

					// set sizes of page for correct display
					toPageWidget.layout();

					if (ns.getConfig("autoBuildOnPageChange", false)) {
						engine.createWidgets(toPage);
					}

					if (fromPageWidget) {
						fromPageWidget.onBeforeHide();
					}
					toPageWidget.onBeforeShow();

					toPage.classList.remove(classes.uiBuild);

					options.deferred = {
						resolve: function () {
							if (fromPageWidget) {
								fromPageWidget.onHide();
								if (options.reverse) {
									fromPageWidget.destroy();
								}
								self._removeExternalPage(fromPageWidget, options);
							}
							toPageWidget.onShow();
														self.trigger(EventType.PAGE_CHANGE);
													}
					};
					self._transition(toPageWidget, fromPageWidget, options);
				}
			};

			/**
			 * This method performs transition between the old and a new page.
			 * @method _transition
			 * @param {ns.widget.core.Page} toPageWidget The new page
			 * @param {ns.widget.core.Page} fromPageWidget The page to be replaced
			 * @param {Object} [options] Additional options for the transition
			 * @param {string} [options.transition=none] The type of transition
			 * @param {boolean} [options.reverse=false] Specifies transition direction
			 * @param {Object} [options.deferred] Deferred object
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._transition = function (toPageWidget, fromPageWidget, options) {
				var self = this,
					element = self.element,
					elementClassList = element.classList,
					transition = !fromPageWidget || !options.transition ? "none" : options.transition,
					deferred = options.deferred,
					clearClasses = [classes.in, classes.out, classes.uiPreIn, transition],
					oldDeferredResolve,
					classlist,
					oneEvent;

				if (options.reverse) {
					clearClasses.push(classes.reverse);
				}
				self.inTransition = true;
				elementClassList.add(classes.uiViewportTransitioning);
				oldDeferredResolve = deferred.resolve;
				deferred.resolve = function () {
					var fromPageWidgetClassList = fromPageWidget && fromPageWidget.element.classList,
						toPageWidgetClassList = toPageWidget.element.classList;

					self._setActivePage(toPageWidget);

					elementClassList.remove(classes.uiViewportTransitioning);
					self.inTransition = false;
					clearClasses.forEach(function (className) {
						toPageWidgetClassList.remove(className);
					});
					if (fromPageWidgetClassList) {
						clearClasses.forEach(function (className) {
							fromPageWidgetClassList.remove(className);
						});
					}
					oldDeferredResolve();
				};

				if (transition !== "none") {
					oneEvent = function () {
						eventUtils.off(
							toPageWidget.element,
							[
								animationend,
								webkitAnimationEnd,
								mozAnimationEnd,
								msAnimationEnd,
								oAnimationEnd
							],
							oneEvent,
							false
						);
						deferred.resolve();
					};
					eventUtils.on(
						toPageWidget.element,
						[
							animationend,
							webkitAnimationEnd,
							mozAnimationEnd,
							msAnimationEnd,
							oAnimationEnd
						],
						oneEvent,
						false
					);

					if (fromPageWidget) {
						classlist = fromPageWidget.element.classList;
						classlist.add(transition);
						classlist.add(classes.out);
						if (options.reverse) {
							classlist.add(classes.reverse);
						}
					}

					classlist = toPageWidget.element.classList;
					classlist.add(transition);
					classlist.add(classes.in);
					classlist.add(classes.uiPreIn);
					if (options.reverse) {
						classlist.add(classes.reverse);
					}
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
			};
			/**
			 * This method adds an element as a page.
			 * @method _include
			 * @param {HTMLElement} page an element to add
			 * @return {HTMLElement}
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._include = function (page) {
				var element = this.element;
				if (page.parentNode !== element) {
					page = util.importEvaluateAndAppendElement(page, element);
				}
				return page;
			};
			/**
			 * This method sets currently active page.
			 * @method _setActivePage
			 * @param {ns.widget.core.Page} page a widget to set as the active page
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._setActivePage = function (page) {
				var self = this;
				if (self.activePage) {
					self.activePage.setActive(false);
				}
				self.activePage = page;
				page.setActive(true);
			};
			/**
			 * This method returns active page widget.
			 * @method getActivePage
			 * @member ns.widget.core.PageContainer
			 * @return {ns.widget.core.Page} Currently active page
			 */
			prototype.getActivePage = function () {
				return this.activePage;
			};

			/**
			 * This method displays a progress bar indicating loading process.
			 * @method showLoading
			 * @member ns.widget.core.PageContainer
			 * @return {null}
			 */
			prototype.showLoading = function () {
								return null;
			};
			/**
			 * This method hides any active progress bar.
			 * @method hideLoading
			 * @member ns.widget.core.PageContainer
			 * @return {null}
			 */
			prototype.hideLoading = function () {
								return null;
			};
			/**
			 * This method removes page element from the given widget and destroys it.
			 * @method _removeExternalPage
			 * @param {ns.widget.core.Page} fromPageWidget the widget to destroy
			 * @param {Object} [options] transition options
			 * @param {boolean} [options.reverse=false] specifies transition direction
			 * @member ns.widget.core.PageContainer
			 * @protected
			 */
			prototype._removeExternalPage = function ( fromPageWidget, options) {
				var fromPage = fromPageWidget.element;
				options = options || {};
				if (options.reverse && DOM.hasNSData(fromPage, "external")) {
					if (fromPage.parentNode) {
						fromPage.parentNode.removeChild(fromPage);
						this.trigger(EventType.PAGE_REMOVE);
					}
				}
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.core.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"core"
			);
			}(window.document, ns));

/*global window, define, console, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Marquee Text
 * It makes <div> element with text move horizontally like legacy <marquee> tag
 *
 * ## Make Marquee Element
 * If you want to use Marquee widget, you have to declare below attributes in <div> element and make Marquee widget in JS code.
 * To use a Marquee widget in your application, use the following code:
 *
 *	@example
 *	<div class="ui-content">
 *		<ul class="ui-listview">
 *			<li><div class="ui-marquee" id="marquee">Marquee widget code sample</div></li>
 *		</ul>
 *	</div>
 *	<script>
 *		var marqueeEl = document.getElementById("marquee"),
 *			marqueeWidget = new tau.widget.Marquee(marqueeEl, {marqueeStyle: "scroll", delay: "3000"});
 *	</script>
 *
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @class ns.widget.core.Marquee
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.event
				 * @property {ns.event} event
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				utilEvent = ns.event,
				/**
				 * Alias for class ns.util.object
				 * @property {Object} objectUtils
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				objectUtils = ns.util.object,
				/**
				 * Alias for class ns.util.DOM
				 * @property {Object} domUtil
				 * @member ns.widget.core.Marquee
				 * @private
				 */
				domUtil = ns.util.DOM,

				Marquee = function() {
					this._ui = {};
					this._ui.marqueeInnerElement = null;
					this._ui.styleSheelElement = null;

					this._state = states.STOPPED;
					this._hasEllipsisText = false;

					this.options = objectUtils.merge({}, Marquee.defaults);

					// event callbacks
					this._callbacks = {};
				},

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-marquee",

				states = {
					RUNNING: "running",
					STOPPED: "stopped",
					IDLE: "idle"
				},

				eventType = {
					/**
					 * Triggered when the marquee animation end.
					 * @event marqueeend
					 * @memeber ns.widget.core.Marquee
					 */
					MARQUEE_START: "marqueestart",
					MARQUEE_END: "marqueeend",
					MARQUEE_STOPPED: "marqueestopped"
				},
				/**
				 * Dictionary for CSS class of marquee play state
				 * @property {Object} classes
				 * @member ns.widget.core.Marquee
				 * @static
				 */
				classes = {
					MARQUEE_CONTENT: CLASSES_PREFIX + "-content",
					MARQUEE_GRADIENT: CLASSES_PREFIX + "-gradient",
					MARQUEE_ELLIPSIS: CLASSES_PREFIX + "-ellipsis",
					ANIMATION_RUNNING: CLASSES_PREFIX + "-anim-running",
					ANIMATION_STOPPED: CLASSES_PREFIX + "-anim-stopped",
					ANIMATION_IDLE: CLASSES_PREFIX + "-anim-idle"
				},

				selector = {
					MARQUEE_CONTENT: "." + CLASSES_PREFIX + "-content"
				},

				/**
				 * Dictionary for marquee style
				 */
				style = {
					SCROLL: "scroll",
					SLIDE: "slide",
					ALTERNATE: "alternate",
					ENDTOEND: "endToEnd"
				},

				ellipsisEffect = {
					GRADIENT: "gradient",
					ELLIPSIS: "ellipsis",
					NONE: "none"
				},

				/**
				 * Options for widget
				 * @property {Object} options
				 * @property {string|"slide"|"scroll"|"alternate"} [options.marqueeStyle="slide"] Sets the default style for the marquee
				 * @property {number} [options.speed=60] Sets the speed(px/sec) for the marquee
				 * @property {number|"infinite"} [options.iteration=1] Sets the iteration count number for marquee
				 * @property {number} [options.delay=2000] Sets the delay(ms) for marquee
				 * @property {"linear"|"ease"|"ease-in"|"ease-out"|"cubic-bezier(n,n,n,n)"} [options.timingFunction="linear"] Sets the timing function for marquee
				 * @property {"gradient"|"ellipsis"|"none"} [options.ellipsisEffect="gradient"] Sets the end-effect(gradient) of marquee
				 * @property {boolean} [options.autoRun=true] Sets the status of autoRun
				 * @member ns.widget.core.Marquee
				 * @static
				 */
				defaults = {
					marqueeStyle: style.SLIDE,
					speed: 60,
					iteration: 1,
					delay: 0,
					timingFunction: "linear",
					ellipsisEffect: "gradient",
					runOnlyOnEllipsisText: true,
					autoRun: true
				};

			Marquee.classes = classes;
			Marquee.defaults = defaults;

			/* Marquee AnimationEnd callback */
			function marqueeEndHandler(self) {
				self.reset();
			}

			function getAnimationDuration(self, speed) {
				var marqueeInnerElement = self._ui.marqueeInnerElement,
					textWidth = marqueeInnerElement.scrollWidth,
					duration = textWidth / speed;

				return duration;
			}

			function setMarqueeKeyFrame(self, marqueeStyle) {
				var marqueeInnerElement = self._ui.marqueeInnerElement,
					marqueeContainer = self.element,
					containerWidth = marqueeContainer.offsetWidth,
					textWidth = marqueeInnerElement.scrollWidth,
					styleElement = document.createElement("style"),
					keyFrameName = marqueeStyle + "-" + self.id,
					customKeyFrame,
					returnTimeFrame;

				switch (marqueeStyle) {
					case style.SLIDE:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {"
										+ "0% { -webkit-transform: translate3d(0, 0, 0);}"
										+ "95%, 100% { -webkit-transform: translate3d(-" + (textWidth - containerWidth) + "px, 0, 0);} }";
						break;
					case style.SCROLL:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {"
										+ "0% { -webkit-transform: translate3d(0, 0, 0);}"
										+ "95%, 100% { -webkit-transform: translate3d(-100%, 0, 0);} }";
						break;
					case style.ALTERNATE:
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {"
										+ "0% { -webkit-transform: translate3d(0, 0, 0);}"
										+ "50% { -webkit-transform: translate3d(-" + (textWidth - containerWidth) + "px, 0, 0);}"
										+ "100% { -webkit-transform: translate3d(0, 0, 0);} }";
						break;
					case style.ENDTOEND:
						returnTimeFrame = parseInt((textWidth / (textWidth + containerWidth)) * 100, 10);
						customKeyFrame = "@-webkit-keyframes " + keyFrameName + " {"
										+ "0% { -webkit-transform: translate3d(0, 0, 0);}"
										+ returnTimeFrame + "% { -webkit-transform: translate3d(-100%, 0, 0); opacity: 1;}"
										+ (returnTimeFrame+1) + "% { -webkit-transform: translate3d(-100%, 0, 0); opacity: 0; }"
										+ (returnTimeFrame+2) + "% { -webkit-transform: translate3d(" + containerWidth + "px, 0, 0); opacity: 0; }"
										+ (returnTimeFrame+3) + "% { -webkit-transform: translate3d(" + containerWidth + "px, 0, 0); opacity: 1; }"
										+ "100% { -webkit-transform: translate3d(0, 0, 0);} }";
						break;
					default:
						customKeyFrame = null;
						break;
				}

				if (customKeyFrame) {
					self.element.appendChild(styleElement);
					styleElement.sheet.insertRule(customKeyFrame, 0);

					self._ui.styleSheelElement = styleElement;
				}

				return keyFrameName;
			}

			function setAnimationStyle(self, options) {
				var marqueeInnerElement = self._ui.marqueeInnerElement,
					marqueeInnerElementStyle = marqueeInnerElement.style,
					duration = getAnimationDuration(self, isNaN(parseInt(options.speed, 10))? defaults.speed : options.speed ),
					marqueeKeyFrame = setMarqueeKeyFrame(self, options.marqueeStyle),
					iteration;

				// warning when option value is not correct.
				if (isNaN(parseInt(options.speed, 10))) {
					ns.warn("speed value must be number(px/sec)");
				}
				if ((options.iteration !== "infinite") && isNaN(options.iteration)) {
					ns.warn("iteration count must be number or 'infinite'");
				}
				if (isNaN(options.delay)) {
					ns.warn("delay value must be number");
				}

				marqueeInnerElementStyle.webkitAnimationName = marqueeKeyFrame;
				marqueeInnerElementStyle.webkitAnimationDuration = duration + "s";
				marqueeInnerElementStyle.webkitAnimationIterationCount = options.iteration;
				marqueeInnerElementStyle.webkitAnimationTimingFunction = options.timingFunction;
				marqueeInnerElementStyle.webkitAnimationDelay = options.delay + "ms";
			}

			function setEllipsisEffectStyle(self, ellipsisEffectOption, hasEllipsisText) {
				var marqueeElement = self.element;

				switch (ellipsisEffectOption) {
					case ellipsisEffect.GRADIENT:
						if (hasEllipsisText) {
							marqueeElement.classList.add(classes.MARQUEE_GRADIENT);
						}
						break;
					case ellipsisEffect.ELLIPSIS:
						marqueeElement.classList.add(classes.MARQUEE_ELLIPSIS);
						break;
					default :
						break;
				}

			}

			function setAutoRunState(self, autoRunOption) {
				if (autoRunOption) {
					self.start();
				} else {
					self.stop();
				}
			}

			/**
			 * Build Marquee DOM
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._build = function(element) {
				var marqueeInnerElement = document.createElement("div");

				while (element.hasChildNodes()) {
					marqueeInnerElement.appendChild(element.removeChild(element.firstChild));
				}
				marqueeInnerElement.classList.add(classes.MARQUEE_CONTENT);
				element.appendChild(marqueeInnerElement);

				this._ui.marqueeInnerElement = marqueeInnerElement;

				return element;
			};

			/**
			 * Init Marquee Style
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._init = function(element) {
				var self = this;

				self._ui.marqueeInnerElement = self._ui.marqueeInnerElement || element.querySelector(selector.MARQUEE_CONTENT);
				self._hasEllipsisText = element.offsetWidth - domUtil.getCSSProperty(element, "padding-right", null, "float") < self._ui.marqueeInnerElement.scrollWidth;

				if (!(self.options.runOnlyOnEllipsisText && !self._hasEllipsisText)) {
					setEllipsisEffectStyle(self, self.options.ellipsisEffect, self._hasEllipsisText);
					setAnimationStyle(self, self.options);
					setAutoRunState(self, self.options.autoRun);
				}

				return element;
			};

			/**
			 * Bind events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._bindEvents = function() {
				var self = this,
					marqueeInnerElement = self._ui.marqueeInnerElement,
					animationEndCallback = marqueeEndHandler.bind(null, self);

				self._callbacks.animationEnd = animationEndCallback;

				utilEvent.one(marqueeInnerElement, "webkitAnimationEnd", animationEndCallback);
			};

			/**
			 * Refresh styles
			 * @method _refresh
			 * @protected
			 * @memeber ns.widget.core.Marquee
			 */
			prototype._refresh = function() {
				var self = this;

				self._resetStyle();
				self._hasEllipsisText = self.element.offsetWidth < self._ui.marqueeInnerElement.scrollWidth;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				setEllipsisEffectStyle(self, self.options.ellipsisEffect, self._hasEllipsisText);
				setAnimationStyle(self, self.options);
				setAutoRunState(self, self.options.autoRun);
			};

			/**
			 * Reset style of Marquee elements
			 * @method _resetStyle
			 * @protected
			 * @memeber ns.widget.core.Marquee
			 */
			prototype._resetStyle = function() {
				var self = this,
					marqueeContainer = self.element,
					marqueeKeyframeStyleSheet = self._ui.styleSheelElement,
					marqueeInnerElementStyle = self._ui.marqueeInnerElement.style;

				if (marqueeContainer.contains(marqueeKeyframeStyleSheet)) {
					marqueeContainer.removeChild(marqueeKeyframeStyleSheet);
				}

				marqueeInnerElementStyle.webkitAnimationName = "";
				marqueeInnerElementStyle.webkitAnimationDuration = "";
				marqueeInnerElementStyle.webkitAnimationDelay = "";
				marqueeInnerElementStyle.webkitAnimationIterationCount = "";
				marqueeInnerElementStyle.webkitAnimationTimingFunction = "";
			};

			/**
			 * Remove marquee object and Reset DOM structure
			 * @method _resetDOM
			 * @protected
			 * @memeber ns.widget.core.Marquee
			 */
			prototype._resetDOM = function() {
				var ui = this._ui;

				while (ui.marqueeInnerElement.hasChildNodes()) {
					this.element.appendChild(ui.marqueeInnerElement.removeChild(ui.marqueeInnerElement.firstChild));
				}
				this.element.removeChild(ui.marqueeInnerElement);
				return null;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Marquee
			 */
			prototype._destroy = function() {
				var self = this;

				self._resetStyle();
				self._resetDOM();
				self._callbacks = null;
				self._ui = null;

				return null;
			};

			/**
			 * Set Marquee animation status Running
			 * @method _animationStart
			 * @memeber ns.widget.core.Marquee
			 */
			prototype._animationStart = function() {
				var self = this,
					marqueeElementClassList = self.element.classList,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList;

				self._state = states.RUNNING;

				if (marqueeElementClassList.contains(classes.MARQUEE_ELLIPSIS)) {
					marqueeElementClassList.remove(classes.MARQUEE_ELLIPSIS);
				}

				marqueeInnerElementClassList.remove(classes.ANIMATION_IDLE, classes.ANIMATION_STOPPED);
				marqueeInnerElementClassList.add(classes.ANIMATION_RUNNING);
				self.trigger(eventType.MARQUEE_START);
			};

			/**
			 * Start Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *
			 *	@example
			 *	<div class="ui-marquee" id="marquee">
			 *		<p>MarqueeTEST TEST message TEST for marquee</p>
			 *	</div>
			 *	<script>
			 *		var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *		marqueeWidget.start();
			 *	</script>
			 *
			 * @method start
			 * @memeber ns.widget.core.Marquee
			 */
			prototype.start = function() {
				var self = this;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				switch (self._state) {
					case states.IDLE:
						setAnimationStyle(self, self.options);
						self._bindEvents();
						self._animationStart();
						break;
					case states.STOPPED:
						self._state = states.RUNNING;
						self._animationStart();
						break;
					case states.RUNNING:
						break;
				}
			};

			/**
			 * Pause Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *	@example
			 *	<div class="ui-marquee" id="marquee">
			 *		<p>MarqueeTEST TEST message TEST for marquee</p>
			 *	</div>
			 *	<script>
			 *		var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *		marqueeWidget.stop();
			 *	</script>
			 *
			 * @method stop
			 * @member ns.widget.core.Marquee
			 */
			prototype.stop = function() {
				var self = this,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				if (self._state == states.IDLE) {
					return;
				}

				self._state = states.STOPPED;
				marqueeInnerElementClassList.remove(classes.ANIMATION_RUNNING);
				marqueeInnerElementClassList.add(classes.ANIMATION_STOPPED);
				self.trigger(eventType.MARQUEE_STOPPED);
			};

			/**
			 * Reset Marquee animation
			 *
			 * #####Running example in pure JavaScript:
			 *	@example
			 *	<div class="ui-marquee" id="marquee">
			 *		<p>MarqueeTEST TEST message TEST for marquee</p>
			 *	</div>
			 *	<script>
			 *		var marqueeWidget = tau.widget.Marquee(document.getElementById("marquee"));
			 *		marqueeWidget.reset();
			 *	</script>
			 *
			 * @method reset
			 * @member ns.widget.core.Marquee
			 */
			prototype.reset = function() {
				var self = this,
					marqueeElementClassList = self.element.classList,
					marqueeInnerElementClassList = self._ui.marqueeInnerElement.classList;

				if (self.options.runOnlyOnEllipsisText && !self._hasEllipsisText) {
					return;
				}

				if (self._state == states.IDLE) {
					return;
				}

				self._state = states.IDLE;
				marqueeInnerElementClassList.remove(classes.ANIMATION_RUNNING, classes.ANIMATION_STOPPED);
				marqueeInnerElementClassList.add(classes.ANIMATION_IDLE);
				if (self.options.ellipsisEffect === ellipsisEffect.ELLIPSIS) {
					marqueeElementClassList.add(classes.MARQUEE_ELLIPSIS);
				}

				self._resetStyle();
				self.trigger(eventType.MARQUEE_END);
			};

			Marquee.prototype = prototype;
			ns.widget.core.Marquee = Marquee;

			engine.defineWidget(
				"Marquee",
				".ui-marquee",
				["start", "stop", "reset"],
				Marquee,
				"core"
			);
			}(window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #PageIndicator Widget
 * Widget create dots page indicator.
 * @class ns.widget.core.PageIndicator
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
				var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,

				PageIndicator = function () {
					var self = this;
					self._activeIndex = null;
					self.options = {};
				},
				classes = {
					indicator: "ui-page-indicator",
					indicatorActive: "ui-page-indicator-active",
					indicatorItem: "ui-page-indicator-item",
					linearIndicator: "ui-page-indicator-linear",
					circularIndicator: "ui-page-indicator-circular"
				},
				maxDots = {
					IN_CIRCLE: 60,
					IN_LINEAR: 11
				},
				layoutType = {
					LINEAR: "linear",
					CIRCULAR: "circular"
				},
				DISTANCE_FROM_EDGE = 15,

				prototype = new BaseWidget();

			PageIndicator.classes = classes;

			prototype._configure = function () {
				/**
				 * Options for widget.
				 * @property {Object} options
				 * @property {number} [options.maxPage=null] Maximum number of dots(pages) in indicator.
				 * @property {number} [options.numberOfPages=null] Number of pages to be linked to PageIndicator.
				 * @property {string} [options.layout="linear"] Layout type of page indicator.
				 * @property {number} [options.intervalAngle=6] angle between each dot in page indicator.
				 * @member ns.widget.core.PageIndicator
				 */
				this.options = {
					maxPage: null,
					numberOfPages: null,
					layout: "linear",
					intervalAngle: 6
				};
			};
			/**
			 * Build PageIndicator
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._build = function (element) {
				var self = this;
				self._createIndicator(element);
				if (self.options.layout === layoutType.CIRCULAR) {
					self._circularPositioning(element);
				}
				return element;
			};

			/**
			 * Create HTML elements for PageIndicator
			 * @method _createIndicator
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._createIndicator = function (element) {
				var self = this,
					i,
					len,
					maxPage,
					span,
					numberOfPages = self.options.numberOfPages;

				if(numberOfPages === null) {
					ns.error("build error: numberOfPages is null");
					return;
				}

				self.options.layout = self.options.layout.toLowerCase();

				if (self.options.layout === layoutType.CIRCULAR) {
					element.classList.remove(classes.linearIndicator);
					element.classList.add(classes.circularIndicator);
				} else {
					element.classList.remove(classes.circularIndicator);
					element.classList.add(classes.linearIndicator);
				}

				maxPage = self._getMaxPage();

				len = numberOfPages < maxPage ? numberOfPages : maxPage;

				for(i = 0; i < len; i++) {
					span = document.createElement("span");
					span.classList.add(classes.indicatorItem);

					element.appendChild(span);
				}
			};

			/**
			 * Make circular positioned indicator
			 * @method _circularPositioning
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._circularPositioning = function (element) {
				var self = this,
					items = element.children,
					numberOfDots = items.length,
					intervalAngle = self.options.intervalAngle - "0",
					translatePixel,
					style,
					i;

				translatePixel = element.offsetWidth / 2 - DISTANCE_FROM_EDGE;

				for(i=0;i<numberOfDots;i++) {
					style = "rotate(" + (i * intervalAngle - 90 - (numberOfDots-1) * intervalAngle * 0.5) + "deg) translate(" +
					translatePixel + "px) ";

					items[i].style.transform = style;
				}

			};

			/**
			 * Return maximum number of dots(pages) in indicator
			 * @method _getMaxPage
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._getMaxPage = function() {
				var self = this,
					options = self.options,
					maxPage;
				if (options.layout === layoutType.CIRCULAR) {
					maxPage = options.maxPage || maxDots.IN_CIRCLE;
				} else {
					maxPage = options.maxPage || maxDots.IN_LINEAR;
				}
				return maxPage;
			};

			/**
			 * Remove contents of HTML elements for PageIndicator
			 * @method _removeIndicator
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._removeIndicator =  function (element) {
				element.textContent = "";
			};

			/**
			 * This method sets a dot to active state.
			 * @method setActive
			 * @param {number} position index to be active state.
			 * @member ns.widget.core.PageIndicator
			 */
			prototype.setActive = function (position) {
				var self = this,
					dotIndex = position,
					elPageIndicatorItems = self.element.children,
					maxPage,
					numberOfPages = self.options.numberOfPages,
					middle,
					numberOfCentralDotPages = 0,
					indicatorActive = classes.indicatorActive,
					previousActive;

				if(position === null || position === undefined) {
					return;
				}

				self._activeIndex = position;
				maxPage = self._getMaxPage();
				middle = window.parseInt(maxPage/2, 10);

				if(numberOfPages > maxPage) {
					numberOfCentralDotPages = numberOfPages - maxPage;
				} else if(numberOfPages === null) {
					ns.error("setActive error: numberOfPages is null");
					return;
				} else if(numberOfPages === 0) {
					return;
				}

				previousActive = self.element.querySelector("." + indicatorActive);
				if(previousActive) {
					previousActive.classList.remove(indicatorActive);
				}

				if ((middle < position) && (position <= (middle + numberOfCentralDotPages))) {
					dotIndex = middle;
				} else if (position > (middle + numberOfCentralDotPages)) {
					dotIndex = position - numberOfCentralDotPages;
				}

				elPageIndicatorItems[dotIndex].classList.add(indicatorActive);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.element;
				self._removeIndicator(element);
				self._createIndicator(element);
				if (self.options.layout === layoutType.CIRCULAR) {
					self._circularPositioning(element);
				}
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._destroy = function () {
				this._removeIndicator(this.element);
			};

			PageIndicator.prototype = prototype;

			ns.widget.core.PageIndicator = PageIndicator;

			engine.defineWidget(
				"PageIndicator",
				"[data-role='page-indicator'], .ui-page-indicator",
				["setActive"],
				PageIndicator,
				"core"
			);
			}(window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Callback Utility
 * Class creates a callback list
 *
 * Create a callback list using the following parameters:
 *  options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 * @class ns.util.callbacks
 */
(function (window, document, ns) {
	"use strict";
				ns.util.callbacks = function (orgOptions) {

				var object = ns.util.object,
					options = object.copy(orgOptions),
					/**
					 * Alias to Array.slice function
					 * @method slice
					 * @member ns.util.callbacks
					 * @private
					 */
					slice = [].slice,
					/**
					 * Last fire value (for non-forgettable lists)
					 * @property {Object} memory
					 * @member ns.util.callbacks
					 * @private
					 */
					memory,
					/**
					 * Flag to know if list was already fired
					 * @property {boolean} fired
					 * @member ns.util.callbacks
					 * @private
					 */
					fired,
					/**
					 * Flag to know if list is currently firing
					 * @property {boolean} firing
					 * @member ns.util.callbacks
					 * @private
					 */
					firing,
					/**
					 * First callback to fire (used internally by add and fireWith)
					 * @property {number} [firingStart=0]
					 * @member ns.util.callbacks
					 * @private
					 */
					firingStart,
					/**
					 * End of the loop when firing
					 * @property {number} firingLength
					 * @member ns.util.callbacks
					 * @private
					 */
					firingLength,
					/**
					 * Index of currently firing callback (modified by remove if needed)
					 * @property {number} firingIndex
					 * @member ns.util.callbacks
					 * @private
					 */
					firingIndex,
					/**
					 * Actual callback list
					 * @property {Array} list
					 * @member ns.util.callbacks
					 * @private
					 */
					list = [],
					/**
					 * Stack of fire calls for repeatable lists
					 * @property {Array} stack
					 * @member ns.util.callbacks
					 * @private
					 */
					stack = !options.once && [],
					fire,
					add,
					self = {
						/**
						 * Add a callback or a collection of callbacks to the list
						 * @method add
						 * @param {..Function} list
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						add: function () {
							if (list) {
								// First, we save the current length
								var start = list.length;
								add(arguments);
								// Do we need to add the callbacks to the
								// current firing batch?
								if (firing) {
									firingLength = list.length;
								// With memory, if we're not firing then
								// we should call right away
								} else if (memory) {
									firingStart = start;
									fire(memory);
								}
							}
							return this;
						},
						/**
						 * Remove a callback from the list
						 * @method remove
						 * @param {..Function} list
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						remove: function () {
							if (list) {
								slice.call(arguments).forEach(function (arg) {
									var index = list.indexOf(arg);
									while (index > -1) {
										list.splice(index, 1);
										// Handle firing indexes
										if (firing) {
											if (index <= firingLength) {
												firingLength--;
											}
											if (index <= firingIndex) {
												firingIndex--;
											}
										}
										index = list.indexOf(arg, index);
									}
								});
							}
							return this;
						},
						/**
						 * Check if a given callback is in the list. 
						 * If no argument is given,
						 * return whether or not list has callbacks attached.
						 * @method has
						 * @param {Funciton} fn
						 * @return {boolean}
						 * @member ns.util.callbacks
						 */
						has: function (fn) {
							return fn ? !!list && list.indexOf(fn) > -1 : !!(list && list.length);
						},
						/**
						 * Remove all callbacks from the list
						 * @method empty
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						empty: function () {
							list = [];
							firingLength = 0;
							return this;
						},
						/**
						 * Have the list do nothing anymore
						 * @method disable
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						disable: function () {
							list = stack = memory = undefined;
							return this;
						},
						/**
						 * Is it disabled?
						 * @method disabled
						 * @return {boolean}
						 * @member ns.util.callbacks
						 */
						disabled: function () {
							return !list;
						},
						/**
						 * Lock the list in its current state
						 * @method lock
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						lock: function () {
							stack = undefined;
							if (!memory) {
								self.disable();
							}
							return this;
						},
						/**
						 * Is it locked?
						 * @method locked
						 * @return {boolean} stack
						 * @member ns.util.callbacks
						 */
						locked: function () {
							return !stack;
						},
						/**
						 * Call all callbacks with the given context and
						 * arguments
						 * @method fireWith
						 * @param {Object} context
						 * @param {Array} args
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						fireWith: function (context, args) {
							if (list && (!fired || stack)) {
								args = args || [];
								args = [context, args.slice ? args.slice() : args];
								if (firing) {
									stack.push(args);
								} else {
									fire(args);
								}
							}
							return this;
						},
						/**
						 * Call all the callbacks with the given arguments
						 * @method fire
						 * @param {...*} argument
						 * @return {ns.util.callbacks} self
						 * @chainable
						 * @member ns.util.callbacks
						 */
						fire: function () {
							self.fireWith(this, arguments);
							return this;
						},
						/**
						 * To know if the callbacks have already been called at
						 * least once
						 * @method fired
						 * @return {booblean}
						 * @chainable
						 * @member ns.util.callbacks
						 */
						fired: function () {
							return !!fired;
						}
					};
				/**
				 * Adds functions to the callback list
				 * @method add
				 * @param {...*} argument
				 * @member ns.util.bezierCurve
				 * @private
				 */
				add = function (args) {
					slice.call(args).forEach(function (arg) {
						var type = typeof arg;
						if (type === "function") {
							if (!options.unique || !self.has(arg)) {
								list.push(arg);
							}
						} else if (arg && arg.length && type !== "string") {
							// Inspect recursively
							add(arg);
						}
					});
				};
				/**
				 * Fire callbacks
				 * @method fire
				 * @param {Array} data
				 * @member ns.util.bezierCurve
				 * @private
				 */
				fire = function (data) {
					memory = options.memory && data;
					fired = true;
					firingIndex = firingStart || 0;
					firingStart = 0;
					firingLength = list.length;
					firing = true;
					while (list && firingIndex < firingLength) {
						if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
							memory = false; // To prevent further calls using add
							break;
						}
						firingIndex++;
					}
					firing = false;
					if (list) {
						if (stack) {
							if (stack.length) {
								fire(stack.shift());
							}
						} else if (memory) {
							list = [];
						} else {
							self.disable();
						}
					}
				};

				return self;
			};

			}(window, window.document, ns));

/*global window, define, RegExp */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Deferred Utility
 * Class creates object which can call registered callback depend from
 * state of object..
 * @class ns.util.deferred
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */(function (window, document, ns) {
	"use strict";
	
			var Deferred = function (callback) {
				var callbacks = ns.util.callbacks,
					object = ns.util.object,
					/**
					 * Register additional action for deferred object
					 * @property {Array} tuples
					 * @member ns.util.deferred
					 * @private
					 */
					tuples = [
						// action, add listener, listener list, final state
						["resolve", "done", callbacks({once: true, memory: true}), "resolved"],
						["reject", "fail", callbacks({once: true, memory: true}), "rejected"],
						["notify", "progress", callbacks({memory: true})]
					],
					state = "pending",
					deferred = {},
					promise = {
						/**
						 * Determine the current state of a Deferred object.
						 * @method state
						 * @return {"pending" | "resolved" | "rejected"} representing the current state
						 * @member ns.util.deferred
						 */
						state: function () {
							return state;
						},
						/**
						 * Add handlers to be called when the Deferred object
						 * is either resolved or rejected.
						 * @method always
						 * @param {...Function}
						 * @return {ns.util.deferred} self
						 * @member ns.util.deferred
						 */
						always: function () {
							deferred.done(arguments).fail(arguments);
							return this;
						},
						/**
						 * Add handlers to be called when the Deferred object
						 * is resolved, rejected, or still in progress.
						 * @method then
						 * @param {?Function} callback assign when done
						 * @param {?Function} callback assign when fail
						 * @param {?Function} callback assign when progress
						 * @return {Object} returns a new promise
						 * @member ns.util.deferred
						 */
						then: function () {/* fnDone, fnFail, fnProgress */
							var functions = arguments;
							return new Deferred(function (newDefer) {
								tuples.forEach(function (tuple, i) {
									var fn = (typeof functions[i] === 'function') && functions[i];
									// deferred[ done | fail | progress ] for forwarding actions to newDefer
									deferred[tuple[1]](function () {
										var returned = fn && fn.apply(this, arguments);
										if (returned && (typeof returned.promise === 'function')) {
											returned.promise()
												.done(newDefer.resolve)
												.fail(newDefer.reject)
												.progress(newDefer.notify);
										} else {
											newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
										}
									});
								});
								functions = null;
							}).promise();
						},
						/**
						 * Get a promise for this deferred. If obj is provided,
						 * the promise aspect is added to the object
						 * @method promise
						 * @param {Object} obj
						 * @return {Object} return a Promise object
						 * @member ns.util.deferred
						 */
						promise: function (obj) {
							if (obj) {
								return object.merge(obj, promise);
							}
							return promise;
						}
					};

				/**
				 * alias for promise.then, Keep pipe for back-compat
				 * @method pipe
				 * @member ns.util.deferred
				 */
				promise.pipe = promise.then;

				// Add list-specific methods

				tuples.forEach(function (tuple, i) {
					var list = tuple[2],
						stateString = tuple[3];

					// promise[ done | fail | progress ] = list.add
					promise[tuple[1]] = list.add;

					// Handle state
					if (stateString) {
						list.add(function () {
							// state = [ resolved | rejected ]
							state = stateString;

						// [ reject_list | resolve_list ].disable; progress_list.lock
						}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
					}

					// deferred[ resolve | reject | notify ]
					deferred[tuple[0]] = function () {
						deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
						return this;
					};
					deferred[tuple[0] + "With"] = list.fireWith;
				});

				// Make the deferred a promise
				promise.promise(deferred);

				// Call given func if any
				if (callback) {
					callback.call(deferred, deferred);
				}

				// All done!
				return deferred;
			};
			ns.util.deferred = Deferred;
			}(window, window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Popup Widget
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.core.Popup
 * @extends ns.widget.Popup
 */
(function (ns) {
	"use strict";
					/**
				 * Alias for {@link ns.widget.BaseWidget}
				 * @property {Function} BaseWidget
				 * @member ns.widget.core.Popup
				 * @private
				 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.core.Popup
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.util.object
				 * @property {Object} objectUtils
				 * @member ns.widget.core.Popup
				 * @private
				 */
				objectUtils = ns.util.object,
				/**
				 * Alias for class ns.util.deferred
				 * @property {Object} UtilDeferred
				 * @member ns.widget.core.Popup
				 * @private
				 */
				UtilDeferred = ns.util.deferred,
				/**
				 * Alias for class ns.util.selectors
				 * @property {Object} utilSelector
				 * @member ns.widget.core.Popup
				 * @private
				 */
				utilSelector = ns.util.selectors,
				/**
				 * Alias for class ns.event
				 * @property {Object} eventUtils
				 * @member ns.widget.core.Popup
				 * @private
				 */
				eventUtils = ns.event,

				Popup = function () {
					var self = this,
						ui = {};

					self.selectors = selectors;
					self.options = objectUtils.merge({}, Popup.defaults);
					self.events = objectUtils.merge({}, Popup.events);
					self.classes = objectUtils.merge({}, Popup.classes);
					self.storedOptions = null;

					/**
					 * Popup state flag
					 * @property {0|1|2|3} [state=null]
					 * @member ns.widget.core.Popup
					 * @private
					 */
					self.state = states.CLOSED;

					ui.overlay = null;
					ui.header = null;
					ui.footer = null;
					ui.content = null;
					ui.container = null;
					ui.wrapper = null;
					self._ui = ui;

					// event callbacks
					self._callbacks = {};
				},
				/**
				 * Object with default options
				 * @property {Object} defaults
				 * @property {string} [options.transition="none"] Sets the default transition for the popup.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
				 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
				 * @property {boolean|string} [options.header=false] Sets content of header.
				 * @property {boolean|string} [options.footer=false] Sets content of footer.
				 * @property {string} [options.content=null] Sets content of popup.
				 * @property {string} [options.overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
				 * @property {string} [options.closeLinkSelector="a[data-rel='back']"] Sets selector for close buttons in popup.
				 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
				 * @member ns.widget.core.Popup
				 * @static
				 */
				defaults = {
					transition: "none",
					dismissible: true,
					overlay: true,
					header: false,
					footer: false,
					content: null,
					overlayClass: "",
					closeLinkSelector: "[data-rel='back']",
					history: true
				},
				states = {
					DURING_OPENING: 0,
					OPENED: 1,
					DURING_CLOSING: 2,
					CLOSED: 3
				},
				CLASSES_PREFIX = "ui-popup",
				/**
				 * Dictionary for popup related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Popup
				 * @static
				 */
				classes = {
					popup: CLASSES_PREFIX,
					active: CLASSES_PREFIX + "-active",
					overlay: CLASSES_PREFIX + "-overlay",
					header: CLASSES_PREFIX + "-header",
					footer: CLASSES_PREFIX + "-footer",
					content: CLASSES_PREFIX + "-content",
					wrapper: CLASSES_PREFIX + "-wrapper",
					build: "ui-build"
				},
				/**
				 * Dictionary for popup related selectors
				 * @property {Object} selectors
				 * @member ns.widget.core.Popup
				 * @static
				 */
				selectors = {
					header: "." + classes.header,
					content: "." + classes.content,
					footer: "." + classes.footer
				},
				EVENTS_PREFIX = "popup",
				/**
				 * Dictionary for popup related events
				 * @property {Object} events
				 * @member ns.widget.core.Popup
				 * @static
				 */
				events = {
					/**
					 * Triggered when the popup has been created in the DOM (via ajax or other) but before all widgets have had an opportunity to enhance the contained markup.
					 * @event popupshow
					 * @member ns.widget.core.Popup
					 */
					show: EVENTS_PREFIX + "show",
					/**
					 * Triggered on the popup after the transition animation has completed.
					 * @event popuphide
					 * @member ns.widget.core.Popup
					 */
					hide: EVENTS_PREFIX + "hide",
					/**
					 * Triggered on the popup we are transitioning to, before the actual transition animation is kicked off.
					 * @event popupbeforeshow
					 * @member ns.widget.core.Popup
					 */
					before_show: EVENTS_PREFIX + "beforeshow",
					/**
					 * Triggered on the popup we are transitioning away from, before the actual transition animation is kicked off.
					 * @event popupbeforehide
					 * @member ns.widget.core.Popup
					 */
					before_hide: EVENTS_PREFIX + "beforehide"
				},

				prototype = new BaseWidget();

			Popup.classes = classes;
			Popup.events = events;
			Popup.defaults = defaults;

			/**
			 * Build the content of popup
			 * @method _buildContent
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildContent = function (element) {
				var self = this,
					ui = self._ui,
					selectors = self.selectors,
					classes = self.classes,
					options = self.options,
					content = ui.content || element.querySelector(selectors.content),
					footer = ui.footer || element.querySelector(selectors.footer),
					elementChildren = [].slice.call(element.childNodes),
					elementChildrenLength = elementChildren.length,
					i,
					node;

				if (!content) {
					content = document.createElement("div");
					content.className = classes.content;
					for (i = 0; i < elementChildrenLength; ++i) {
						node = elementChildren[i];
						if (node !== ui.footer && node !== ui.header) {
							content.appendChild(node);
						}
					}
					if (typeof options.content === "string") {
						content.innerHTML = options.content;
					}
					element.insertBefore(content, footer);
				}
				content.classList.add(classes.content);
				ui.content = content;
			};

			/**
			 * Build the header of popup
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildHeader = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					classes = self.classes,
					selectors = self.selectors,
					content = ui.content || element.querySelector(selectors.content),
					header = ui.header || element.querySelector(selectors.header);
				if (!header && options.header !== false) {
					header = document.createElement("div");
					header.className = classes.header;
					if (typeof options.header !== "boolean") {
						header.innerHTML = options.header;
					}
					element.insertBefore(header, content);
				}
				if (header) {
					header.classList.add(classes.header);
				}
				ui.header = header;
			};

			/**
			 * Set the header of popup.
			 * This function is called by function "option" when the option "header" is set.
			 * @method _setHeader
			 * @param {HTMLElement} element
			 * @param {boolean|string} value
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setHeader = function (element, value) {
				var self = this,
					ui = self._ui,
					header = ui.header;
				if (header) {
					header.parentNode.removeChild(header);
					ui.header = null;
				}
				self.options.header = value;
				self._buildHeader(ui.container);
			};

			/**
			 * Build the footer of popup
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildFooter = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					classes = self.classes,
					footer = ui.footer || element.querySelector(self.selectors.footer);
				if (!footer && options.footer !== false) {
					footer = document.createElement("div");
					footer.className = classes.footer;
					if (typeof options.footer !== "boolean") {
						footer.innerHTML = options.footer;
					}
					element.appendChild(footer);
				}
				if (footer) {
					footer.classList.add(classes.footer);
				}
				ui.footer = footer;
			};

			/**
			 * Set the footer of popup.
			 * This function is called by function "option" when the option "footer" is set.
			 * @method _setFooter
			 * @param {HTMLElement} element
			 * @param {boolean|string} value
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setFooter = function (element, value) {
				var self = this,
					ui = self._ui,
					footer = ui.footer;
				if (footer) {
					footer.parentNode.removeChild(footer);
					ui.footer = null;
				}
				self.options.footer = value;
				self._buildFooter(ui.container);
			};

			/**
			 * Build structure of Popup widget
			 * @method _build
			 * @param {HTMLElement} element of popup
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					classes = self.classes,
					wrapper,
					child = element.firstChild;

				// set class for element
				element.classList.add(classes.popup);

				// create wrapper
				wrapper = document.createElement("div");
				wrapper.classList.add(classes.wrapper);
				ui.wrapper = wrapper;
				ui.container = wrapper;
				// move all children to wrapper
				while (child) {
					wrapper.appendChild(child);
					child = element.firstChild;
				}
				// add wrapper and arrow to popup element
				element.appendChild(wrapper);

				// build header, footer and content
				this._buildHeader(ui.container);
				this._buildFooter(ui.container);
				this._buildContent(ui.container);

				// set overlay
				this._setOverlay(element, this.options.overlay);

				return element;
			};

			/**
			 * Set overlay
			 * @method _setOverlay
			 * @param {HTMLElement} element
			 * @param {boolean} enable
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._setOverlay = function(element, enable) {
				var self = this,
					classes = self.classes,
					overlayClass = self.options.overlayClass,
					ui = self._ui,
					overlay = ui.overlay;

				// if this popup is not connected with slider,
				// we create overlay, which is invisible when
				// the value of option overlay is false
				/// @TODO: get class from widget
				if (!element.classList.contains("ui-slider-popup")) {
					// create overlay
					if (!overlay) {
						overlay = document.createElement("div");
						element.parentNode.insertBefore(overlay, element);
						ui.overlay = overlay;
					}
					overlay.className = classes.overlay + (overlayClass ? " " + overlayClass : "");
					if (enable) {
						overlay.style.opacity = "";
					} else {
						// if option is set on "false", the overlay is not visible
						overlay.style.opacity = 0;
					}
				}
			};

			/**
			 * Returns the state of the popup
			 * @method _isActive
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._isActive = function () {
				var state = this.state;
				return state === states.DURING_OPENING || state === states.OPENED;
			};

			/**
			 * Returns true if popup is already opened and visible
			 * @method _isActive
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._isOpened = function () {
				return this.state === states.OPENED;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._init = function(element) {
				var self = this,
					selectors = self.selectors,
					classes = self.classes,
					ui = self._ui;

				ui.header = ui.header || element.querySelector(selectors.header);
				ui.footer = ui.footer || element.querySelector(selectors.footer);
				ui.content = ui.content || element.querySelector(selectors.content);
				ui.wrapper = ui.wrapper || element.querySelector("." + classes.wrapper);
				ui.container = ui.wrapper || element;

				// @todo - use selector from page's definition in engine
				ui.page = utilSelector.getClosestByClass(element, "ui-page") || window;
			};

			/**
			 * Set the state of the popup
			 * @method _setActive
			 * @param {boolean} active
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setActive = function (active) {
				var self = this,
					activeClass = self.classes.active,
					elementClassList = self.element.classList,
					route = engine.getRouter().getRoute("popup"),
					options;

				// NOTE: popup's options object is stored in window.history at the router module,
				// and this window.history can't store DOM element object.
				options =  objectUtils.merge({}, self.options, {positionTo: null, link: null});

				// set state of popup and add proper class
				if (active) {
					// set global variable
					route.setActive(self, options);
					// add proper class
					elementClassList.add(activeClass);
					// set state of popup 	358
					self.state = states.OPENED;
				} else {
					// no popup is opened, so set global variable on "null"
					route.setActive(null, options);
					// remove proper class
					elementClassList.remove(activeClass);
					// set state of popup
					self.state = states.CLOSED;
				}
			};

			/**
			 * Bind events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._bindEvents = function () {
				var self = this,
					closeButtons = self.element.querySelectorAll(self.options.closeLinkSelector);

				self._ui.page.addEventListener("pagebeforehide", self, false);
				window.addEventListener("resize", self, false);
				eventUtils.on(closeButtons, "click", self, false);
				self._bindOverlayEvents();
			};

			/**
			 * Bind "click" event for overlay
			 * @method _bindOverlayEvents
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._bindOverlayEvents = function () {
				var overlay = this._ui.overlay;
				if (overlay) {
					overlay.addEventListener("click", this, false);
				}
			};

			/**
			 * Unbind "click" event for overlay
			 * @method _bindOverlayEvents
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._unbindOverlayEvents = function () {
				var overlay = this._ui.overlay;
				if (overlay) {
					overlay.removeEventListener("click", this, false);
				}
			};

			/**
			 * Unbind events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._unbindEvents = function () {
				var self = this;

				self._ui.page.removeEventListener("pagebeforehide", self, false);
				window.removeEventListener("resize", self, false);
				self._unbindOverlayEvents();
			};

			/**
			 * Layouting popup structure
			 * @method layout
			 * @member ns.widget.core.Popup
			 */
			prototype._layout = function (element) {
			};

			/**
			 * Open the popup
			 * @method open
			 * @param {Object=} [options]
			 * @param {string=} [options.transition] options.transition
			 * @member ns.widget.core.Popup
			 */
			prototype.open = function (options) {
				var self = this,
					newOptions;

				if (!self._isActive()) {
					/*
					 * Some passed options on open need to be kept until popup closing.
					 * For example, trasition parameter should be kept for closing animation.
					 * On the other hand, fromHashChange or x, y parameter should be removed.
					 * We store options and restore them on popup closing.
					 */
					self._storeOpenOptions(options);

					newOptions = objectUtils.merge(self.options, options);
					if (!newOptions.dismissible) {
						engine.getRouter().lock();
					}
					self._show(newOptions);
				}
			};

			/**
			 * Close the popup
			 * @method close
			 * @param {Object=} [options]
			 * @param {string=} [options.transition]
			 * @member ns.widget.core.Popup
			 */
			prototype.close = function (options) {
				var self = this,
					newOptions = objectUtils.merge(self.options, options);

				if (self._isActive()) {
					if (!newOptions.dismissible) {
						engine.getRouter().unlock();
					}
					self._hide(newOptions);
				}
			};

			/**
			 * Store Open options.
			 * @method _storeOpenOptions
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._storeOpenOptions = function (options) {
				var self = this,
					oldOptions = self.options,
					storedOptions = {},
					key;

				for (key in options) {
					if (options.hasOwnProperty(key)) {
						storedOptions[key] = oldOptions[key];
					}
				}

				self.storedOptions = storedOptions;
			};

			/**
			 * Restore Open options and remove some unnecessary ones.
			 * @method _storeOpenOptions
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._restoreOpenOptions = function () {
				var self = this,
					options = self.options,
					propertiesToRemove = ["x", "y", "fromHashChange"];

				// we restore opening values of all options
				options = objectUtils.merge(options, self.storedOptions);
				// and remove all values which should not be stored
				objectUtils.removeProperties(options, propertiesToRemove);
			};

			/**
			 * Show popup.
			 * @method _show
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._show = function (options) {
				var self = this,
					transitionOptions = objectUtils.merge({}, options),
					overlay = self._ui.overlay,
					deferred;

				// layouting
				self._layout(self.element);

				// change state of popup
				self.state = states.DURING_OPENING;
				// set transiton
				transitionOptions.ext = " in ";

				self.trigger(self.events.before_show);
				// show overlay
				if (overlay) {
					overlay.style.display = "block";
				}
				// start opening animation
				window.requestAnimationFrame(self._transition.bind(self, transitionOptions, self._onShow.bind(self)));
			};

			/**
			 * Show popup
			 * @method _onShow
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onShow = function() {
				var self = this;
				self._setActive(true);
				self.trigger(self.events.show);
			};

			/**
			 * Hide popup
			 * @method _hide
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._hide = function (options) {
				var self = this,
					isOpened = self._isOpened(),
					callbacks = self._callbacks;

				// change state of popup
				self.state = states.DURING_CLOSING;

				self.trigger(self.events.before_hide);

				if (isOpened) {
					// popup is opened, so we start closing animation
					options.ext = " out ";
					self._transition(options, self._onHide.bind(self));
				} else {
					// popup is active, but not opened yet (DURING_OPENING), so
					// we stop opening animation
					if (callbacks.transitionDeferred) {
						callbacks.transitionDeferred.reject();
					}
					if (callbacks.animationEnd) {
						callbacks.animationEnd();
					}
					// and set popup as inactive
					self._onHide();
				}
			};

			/**
			 * Hide popup
			 * @method _onHide
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onHide = function() {
				var self = this,
					overlay = self._ui.overlay;

				self._setActive(false);

				if (overlay) {
					overlay.style.display = "";
				}
				self._restoreOpenOptions();
				self.trigger(self.events.hide);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Popup
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch(event.type) {
					case "pagebeforehide":
						// we need close active popup if exists
						engine.getRouter().close(null, {transition: "none", rel: "popup"});
						break;
					case "resize":
						self._onResize(event);
						break;
					case "click":
						if ( event.target === self._ui.overlay ) {
							self._onClickOverlay(event);
						}
						break;
				}
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._refresh = function() {
				var self = this;
				self._unbindOverlayEvents();
				self._setOverlay(self.element, self.options.overlay);
				self._bindOverlayEvents();
			};

			/**
			 * Callback function fires after clicking on overlay.
			 * @method _onClickOverlay
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onClickOverlay = function(event) {
				var options = this.options;

				event.preventDefault();
				event.stopPropagation();

				if (options.dismissible) {
					engine.getRouter().close();
				}
			};

			/**
			 * Callback function fires on resizing
			 * @method _onResize
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onResize = function() {
				if (this._isOpened()) {
					this._refresh();
				}
			};

			function clearAnimation(self, transitionClass, deferred) {
				var element = self.element,
					elementClassList = element.classList,
					overlay = self._ui.overlay,
					animationEndCallback = self._callbacks.animationEnd;

				// remove callbacks on animation events
				element.removeEventListener("animationend", animationEndCallback, false);
				element.removeEventListener("webkitAnimationEnd", animationEndCallback, false);
				element.removeEventListener("mozAnimationEnd", animationEndCallback, false);
				element.removeEventListener("oAnimationEnd", animationEndCallback, false);
				element.removeEventListener("msAnimationEnd", animationEndCallback, false);

				// clear classes
				transitionClass.split(" ").forEach(function (currentClass) {
					currentClass = currentClass.trim();
					if (currentClass.length > 0) {
						elementClassList.remove(currentClass);
						if (overlay) {
							overlay.classList.remove(currentClass);
						}
					}
				});
				if (deferred.state() === "pending") {
					// we resolve only pending (not rejected) deferred
					deferred.resolve();
				}
			}

			function setTransitionDeferred(self, resolve) {
				var deferred = new UtilDeferred();

				deferred.then(function() {
					if (deferred === self._callbacks.transitionDeferred) {
						resolve();
					}
				});

				self._callbacks.transitionDeferred = deferred;
				return deferred;
			}
			/**
			 * Animate popup opening/closing
			 * @method _transition
			 * @protected
			 * @param {Object} [options]
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext]
			 * @param {?Function} [resolve]
			 * @member ns.widget.core.Popup
			 */
			prototype._transition = function (options, resolve) {
				var self = this,
					transition = options.transition || self.options.transition || "none",
					transitionClass = transition + options.ext,
					element = self.element,
					elementClassList = element.classList,
					overlayClassList = self._ui.overlay.classList,
					deferred,
					animationEndCallback;

				deferred = setTransitionDeferred(self, resolve);

				if (transition !== "none") {
					// set animationEnd callback
					animationEndCallback = clearAnimation.bind(null, self, transitionClass, deferred);
					self._callbacks.animationEnd = animationEndCallback;

					// add animation callbacks
					element.addEventListener("animationend", animationEndCallback, false);
					element.addEventListener("webkitAnimationEnd", animationEndCallback, false);
					element.addEventListener("mozAnimationEnd", animationEndCallback, false);
					element.addEventListener("oAnimationEnd", animationEndCallback, false);
					element.addEventListener("msAnimationEnd", animationEndCallback, false);
					// add transition classes
					transitionClass.split(" ").forEach(function (currentClass) {
						currentClass = currentClass.trim();
						if (currentClass.length > 0) {
							elementClassList.add(currentClass);
							overlayClassList.add(currentClass);
						}
					});
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
				return deferred;
			};

			/**
			 * Destroy popup
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._destroy = function() {
				var self = this,
					element = self.element,
					ui = self._ui,
					wrapper = ui.wrapper,
					child;

				if (wrapper) {
					// restore all children from wrapper
					child = wrapper.firstChild;
					while (child) {
						element.appendChild(child);
						child = wrapper.firstChild;
					}

					if (wrapper.parentNode) {
						wrapper.parentNode.removeChild(wrapper);
					}
				}

				self._unbindEvents(element);
				self._setOverlay(element, false);

				ui.wrapper = null;
			};

			Popup.prototype = prototype;

			ns.widget.core.Popup = Popup;

			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"reposition"
				],
				Popup,
				"core"
			);
			}(ns));

/*global window, define */
/*
 * Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */

/**
 * # Toast Component
 * Shows a toast window.
 *
 * @author Hagun Kim <hagun.kim@samsung.com>
 * @class ns.widget.core.Toast
 * @extends ns.widget.core.Popup
 */
(function (window, document, ns) {
	"use strict";
	
			var CorePopup = ns.widget.core.Popup,
				CorePopupPrototype = CorePopup.prototype,
				engine = ns.engine,

				objectUtils = ns.util.object,

				defaults = {
					toastDuration: 2000,
					transition: "slideup"
				},

				states = {
					DURING_OPENING: 0,
					OPENED: 1,
					DURING_CLOSING: 2,
					CLOSED: 3
				},

				classes = objectUtils.merge({}, CorePopup.classes, {
					popup: "ui-toast",
					active: "ui-toast-active",
					overlay: "ui-toast-overlay",
					header: "ui-toast-header",
					footer: "ui-toast-footer",
					content: "ui-toast-content",
					wrapper: "ui-toast-wrapper",
					build: "ui-build"
				}),

				selectors = {
					header: "." + classes.header,
					content: "." + classes.content,
					footer: "." + classes.footer
				},

				EVENTS_PREFIX = "toast",
				/**
				 * Dictionary for toast related events
				 * @property {Object} events
				 * @member ns.widget.core.Toast
				 * @static
				 */
				events = {
					/**
					 * Triggered when the toast has been created in the DOM (via ajax or other) but before all widgets have had an opportunity to enhance the contained markup.
					 * @event toastshow
					 * @member ns.widget.core.Toast
					 */
					show: EVENTS_PREFIX + "show",
					/**
					 * Triggered on the toast after the transition animation has completed.
					 * @event toasthide
					 * @member ns.widget.core.Toast
					 */
					hide: EVENTS_PREFIX + "hide",
					/**
					 * Triggered on the toast we are transitioning to, before the actual transition animation is kicked off.
					 * @event toastbeforeshow
					 * @member ns.widget.core.Toast
					 */
					before_show: EVENTS_PREFIX + "beforeshow",
					/**
					 * Triggered on the toast we are transitioning away from, before the actual transition animation is kicked off.
					 * @event toastbeforehide
					 * @member ns.widget.core.Toast
					 */
					before_hide: EVENTS_PREFIX + "beforehide"
				},

				Toast = function () {
					var self = this;

					CorePopup.call(self);
					self.selectors = selectors;
					self.options = objectUtils.merge(self.options, defaults);
					self.events = events;
					self.classes = classes;
					self._timeOutId = null;
				},

				prototype = new CorePopup();

			/**
			 * Callback function fires after clicking on overlay.
			 * @method _onClickOverlay
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.core.Toast
			 */
			prototype._onClickOverlay = function(event) {
				var options = this.options;

				event.preventDefault();
				event.stopPropagation();

				if (options.dismissible) {
					this.close();
				}
			};

			/**
			 * Set the state of the toast
			 * @method _setActive
			 * @param {boolean} active
			 * @protected
			 * @member ns.widget.core.Toast
			 */
			prototype._setActive = function (active) {
				var self = this,
					activeClass = classes.active,
					elementClassList = self.element.classList;

				// set state of toast and add proper class
				if (active) {
					// add proper class
					elementClassList.add(activeClass);
					// set state of toast
					self.state = states.OPENED;
				} else {
					// remove proper class
					elementClassList.remove(activeClass);
					// set state of toast
					self.state = states.CLOSED;
				}
			};

			/**
			 * Open the toast and then close the toast after a specified amount of time
			 * @method open
			 * @param {Object=} [options]
			 * @member ns.widget.core.Toast
			 */
			prototype.open = function (options) {
				var self = this,
					newOptions;

				if (!self._isActive()) {
					/*
					 * Some passed options on open need to be kept until popup closing.
					 * For example, trasition parameter should be kept for closing animation.
					 * On the other hand, fromHashChange or x, y parameter should be removed.
					 * We store options and restore them on popup closing.
					 */
					self._storeOpenOptions(options);

					newOptions = objectUtils.merge(self.options, options);

					self._show(newOptions);
					self._timeOutId = setTimeout(function() {
						if (self._isActive()) {
							self.close();
						}
					}, self.options.toastDuration);
				}
			};

			/**
			 * Close the toast
			 * @method close
			 * @param {Object=} [options]
			 * @member ns.widget.core.Toast
			 */
			prototype.close = function (options) {
				var self = this,
					newOptions = objectUtils.merge(self.options, options);

				clearTimeout(self._timeOutId);
				self._timeOutId = null;
				if (self._isActive()) {
					self._hide(newOptions);
				}
			};

			/**
			 * Bind events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Toast
			 */
			prototype._bindEvents = function () {
				var self = this;

				window.addEventListener("resize", self, false);
				self._bindOverlayEvents();
			};

			/**
			 * Unbind events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Toast
			 */
			prototype._unbindEvents = function () {
				var self = this;

				window.removeEventListener("resize", self, false);
				self._unbindOverlayEvents();
			};

			Toast.prototype = prototype;
			ns.widget.core.Toast = Toast;

			engine.defineWidget(
				"Toast",
				"[data-role='toast'], .ui-toast",
				[
					"open",
					"close",
					"reposition"
				],
				Toast,
				"core",
				true
			);

			}(window, window.document, ns));
/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Gesture Namespace
 * Core object enables multi gesture support.
 *
 * @class ns.event.gesture
 */
(function ( ns, window, undefined ) {
	"use strict";
	
			var Gesture = function( elem, options ) {
				return new ns.event.gesture.Instance( elem, options );
			};

			/**
			 * Default values for Gesture feature
			 * @property {Object} defaults
			 * @property {boolean} [defaults.triggerEvent=false]
			 * @property {number} [defaults.updateVelocityInterval=16]
			 * Interval in which Gesture recalculates current velocity in ms
			 * @property {number} [defaults.estimatedPointerTimeDifference=15]
			 * pause time threshold.. tune the number to up if it is slow
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.defaults = {
				triggerEvent: false,
				updateVelocityInterval: 16,
				estimatedPointerTimeDifference: 15
			};

			/**
			 * Dictionary of orientation
			 * @property {Object} Orientation
			 * @property {1} Orientation.VERTICAL vertical orientation
			 * @property {2} Orientation.HORIZONTAL horizontal orientation
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.Orientation = {
				VERTICAL: "vertical",
				HORIZONTAL: "horizontal"
			};

			/**
			 * Dictionary of direction
			 * @property {Object} Direction
			 * @property {1} Direction.UP up
			 * @property {2} Direction.DOWN down
			 * @property {3} Direction.LEFT left
			 * @property {4} Direction.RIGHT right
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.Direction = {
				UP: "up",
				DOWN: "down",
				LEFT: "left",
				RIGHT: "right"
			};

			/**
			 * Dictionary of gesture events state
			 * @property {Object} Event
			 * @property {"start"} Event.START start
			 * @property {"move"} Event.MOVE move
			 * @property {"end"} Event.END end
			 * @property {"cancel"} Event.CANCEL cancel
			 * @property {"blocked"} Event.BLOCKED blocked
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.Event = {
				START: "start",
				MOVE: "move",
				END: "end",
				CANCEL: "cancel",
				BLOCKED: "blocked"
			};

			/**
			 * Dictionary of gesture events flags
			 * @property {Object} Result
			 * @property {number} [Result.PENDING=1] is pending
			 * @property {number} [Result.RUNNING=2] is running
			 * @property {number} [Result.FINISHED=4] is finished
			 * @property {number} [Result.BLOCK=8] is blocked
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.Result = {
				PENDING: 1,
				RUNNING: 2,
				FINISHED: 4,
				BLOCK: 8
			};

			/**
			 * Create plugin namespace.
			 * @property {Object} plugin
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.plugin = {};

			/**
			 * Create object of Detector
			 * @method createDetector
			 * @param {string} gesture
			 * @param {HTMLElement} eventSender
			 * @param {Object} options
			 * @return {ns.event.gesture.Gesture}
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.createDetector = function( gesture, eventSender, options ) {
				if ( !Gesture.plugin[gesture] ) {
					throw gesture + " gesture is not supported";
				}
				return new Gesture.plugin[gesture]( eventSender, options );
			};

			ns.event.gesture = Gesture;
			} ( ns, window ) );

/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Gesture Utilities
 * Contains helper function to gesture support.
 * @class ns.event.gesture.utils
 */
(function (ns, Math, undefined) {
	"use strict";
	
				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.utils
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture;

			Gesture.utils = {

				/**
				 * Get center from array of touches
				 * @method getCenter
				 * @param {Event[]} touches description
				 * @member ns.event.gesture.utils
				 * @return {Object} position
				 * @return {number} return.clientX position X
				 * @return {number} return.clientY position Y
				 */
				getCenter: function (touches) {
					var valuesX = [], valuesY = [];

					[].forEach.call(touches, function(touch) {
						// I prefer clientX because it ignore the scrolling position
						valuesX.push(!isNaN(touch.clientX) ? touch.clientX : touch.pageX);
						valuesY.push(!isNaN(touch.clientY) ? touch.clientY : touch.pageY);
					});

					return {
						clientX: (Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2,
						clientY: (Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2
					};
				},

				/**
				 * Get velocity
				 * @method getVelocity
				 * @param {number} delta_time Delta of time
				 * @param {number} delta_x Position change on x axis
				 * @param {number} delta_y Position change on y axis
				 * @return {Object} velocity
				 * @return {number} return.x velocity on X axis
				 * @return {number} return.y velocity on Y axis
				 * @member ns.event.gesture.utils
				 */
				getVelocity: function (delta_time, delta_x, delta_y) {
					return {
						x: Math.abs(delta_x / delta_time) || 0,
						y: Math.abs(delta_y / delta_time) || 0
					};
				},

				/**
				 * Get angel between position of two touches
				 * @method getAngle
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {number} angel (deg)
				 * @member ns.event.gesture.utils
				 */
				getAngle: function (touch1, touch2) {
					var y = touch2.clientY - touch1.clientY,
						x = touch2.clientX - touch1.clientX;
					return Math.atan2(y, x) * 180 / Math.PI;
				},

				/**
				 * Get direction indicated by position of two touches
				 * @method getDirectiqon
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN}
				 * @member ns.event.gesture.utils
				 */
				getDirection: function (touch1, touch2) {
					var x = Math.abs(touch1.clientX - touch2.clientX),
						y = Math.abs(touch1.clientY - touch2.clientY);

					if (x >= y) {
						return touch1.clientX - touch2.clientX > 0 ? Gesture.Direction.LEFT : Gesture.Direction.RIGHT;
					}
					return touch1.clientY - touch2.clientY > 0 ? Gesture.Direction.UP : Gesture.Direction.DOWN;
				},

				/**
				 * Get distance indicated by position of two touches
				 * @method getDistance
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {number} distance
				 * @member ns.event.gesture.utils
				 */
				getDistance: function (touch1, touch2) {
					var x = touch2.clientX - touch1.clientX,
						y = touch2.clientY - touch1.clientY;
					return Math.sqrt((x * x) + (y * y));
				},

				/**
				 * Get scale indicated by position of the first and the last touch
				 * @method getScale
				 * @param {Event} start start touch
				 * @param {Event} end end touch
				 * @return {number} scale
				 * @member ns.event.gesture.utils
				 */
				getScale: function (start, end) {
					// need two fingers...
					if (start.length >= 2 && end.length >= 2) {
						return this.getDistance(end[0], end[1]) / this.getDistance(start[0], start[1]);
					}
					return 1;
				},

				/**
				 * Get value of rotation indicated by position
				 * of the first and the last touch
				 * @method getRotation
				 * @param {Event} start start touch
				 * @param {Event} end end touch
				 * @return {number} angle (deg)
				 * @member ns.event.gesture.utils
				 */
				getRotation: function (start, end) {
					// need two fingers
					if (start.length >= 2 && end.length >= 2) {
						return this.getAngle(end[1], end[0]) -
							this.getAngle(start[1], start[0]);
					}
					return 0;
				},

				/**
				 * Check if the direction is vertical
				 * @method isVertical
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction start touch
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				isVertical: function (direction) {
					return direction === Gesture.Direction.UP || direction === Gesture.Direction.DOWN;
				},

				/**
				 * Check if the direction is horizontal
				 * @method isHorizontal
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction start touch
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				isHorizontal: function (direction) {
					return direction === Gesture.Direction.LEFT || direction === Gesture.Direction.RIGHT;
				},

				/**
				 * Check if the direction is horizontal
				 * @method getOrientation
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				getOrientation: function (direction) {
					return this.isVertical(direction) ? Gesture.Orientation.VERTICAL : Gesture.Orientation.HORIZONTAL;
				}
			};
			} (ns, window.Math));

/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Gesture.Detector class
 * Base class for create detectors in gestures.
 *
 * @class ns.event.gesture.Detector
 */
( function ( ns, window, undefined ) {
	"use strict";
					/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Manager
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} objectMerge
				 * @member ns.event.gesture.Detector
				 * @private
				 * @static
				 */
				objectMerge = ns.util.object.merge,

				Detector = function( strategy, sender ) {
					this.sender = sender;
					this.strategy = strategy.create();
					this.name = this.strategy.name;
					this.index = this.strategy.index || 100;
					this.options = this.strategy.options || {};
				};

			/**
			 * Start of gesture detection of given type
			 * @method detect
			 * @param {string} gestureEvent
			 * @return {Object}
			 * @member ns.event.gesture.Detector
			 */
			Detector.prototype.detect = function( gestureEvent ) {
				return this.strategy.handler( gestureEvent, this.sender, this.strategy.options );
			};

			Detector.Sender = {
				sendEvent: function(/* eventName, detail */) {}
			};

			/**
			 * Create plugin namespace.
			 * @property {Object} plugin
			 * @member ns.event.gesture.Detector
			 */
			Detector.plugin = {};

			/**
			 * Methods creates plugin
			 * @method create
			 * @param {Object} gestureHandler
			 * @return {ns.event.gesture.Detector} gestureHandler
			 * @member ns.event.gesture.Detector.plugin
			 */
			Detector.plugin.create = function( gestureHandler ) {

				if ( !gestureHandler.types ) {
					gestureHandler.types = [ gestureHandler.name ];
				}

				var detector = Detector.plugin[ gestureHandler.name ] = function( options ) {
					this.options = objectMerge({}, gestureHandler.defaults, options);
				};

				detector.prototype.create = function() {
					return objectMerge({
						options: this.options
					}, gestureHandler);
				};

				return detector;
			};

			// definition
			Gesture.Detector = Detector;

			} ( ns, window ));

/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Gesture.Manager class
 * Main class controls all gestures.
 * @class ns.event.gesture.Manager
 */
( function ( ns, window, document) {
	"use strict";
	
				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Manager
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,

				/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} objectMerge
				 * @member ns.event.gesture.Manager
				 * @private
				 * @static
				 */
				objectMerge = ns.util.object.merge,

				/**
				 * Device has touchable interface
				 * @property {boolean} TOUCH_DEVICE
				 * @member ns.event.gesture.Manager
				 * @private
				 * @static
				 */
				TOUCH_DEVICE = "ontouchstart" in window;

			Gesture.Manager = (function() {
				var instance = null,

				startEvent = null,
				isReadyDetecting = false,
				blockMouseEvent = false,

				Manager = function() {

					this.instances = [];
					this.gestureDetectors = [];
					this.runningDetectors = [];
					this.detectorRequestedBlock = null;

					this.unregisterBlockList = [];

					this.gestureEvents = null;
					this.velocity = null;
				};

				Manager.prototype = {
					/**
					 * Bind start events
					 * @method _bindStartEvents
					 * @param {ns.event.gesture.Instance} instance gesture instance
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_bindStartEvents: function( instance ) {
						var element = instance.getElement();
						if ( TOUCH_DEVICE ) {
							element.addEventListener( "touchstart", this);
						}

						element.addEventListener( "mousedown", this);
					},

					/**
					 * Bind move, end and cancel events
					 * @method _bindEvents
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_bindEvents: function( ) {
						if ( TOUCH_DEVICE ) {
							document.addEventListener( "touchmove", this);
							document.addEventListener( "touchend", this);
							document.addEventListener( "touchcancel", this);
						}

						document.addEventListener( "mousemove", this);
						document.addEventListener( "mouseup", this);
					},

					/**
					 * Unbind start events
					 * @method _unbindStartEvents
					 * @param {ns.event.gesture.Instance} instance gesture instance
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_unbindStartEvents: function( instance ) {
						var element = instance.getElement();
						if ( TOUCH_DEVICE ) {
							element.removeEventListener( "touchstart", this);
						}

						element.removeEventListener( "mousedown", this);
					},

					/**
					 * Unbind move, end and cancel events
					 * @method _bindEvents
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_unbindEvents: function() {
						if ( TOUCH_DEVICE ) {
							document.removeEventListener( "touchmove", this);
							document.removeEventListener( "touchend", this);
							document.removeEventListener( "touchcancel", this);
						}

						document.removeEventListener( "mousemove", this);
						document.removeEventListener( "mouseup", this);
					},

					/**
					 * Handle event
					 * @method handleEvent
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					/* jshint -W086 */
					handleEvent: function( event ) {
						var eventType = event.type.toLowerCase();

						if ( eventType.match(/touch/) ) {
							blockMouseEvent = true;
						}

						if ( eventType.match(/mouse/) &&
							( blockMouseEvent || event.which !== 1 ) ) {
							return;
						}

						switch ( event.type ) {
							case "mousedown":
							case "touchstart":
								this._start( event );
								break;
							case "mousemove":
							case "touchmove":
								this._move( event );
								break;
							case "mouseup":
							case "touchend":
								this._end( event );
								break;
							case "touchcancel":
								this._cancel( event );
								break;
						}
					},

					/**
					 * Handler for gesture start
					 * @method _start
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_start: function( event ) {
						var elem = event.currentTarget,
							startEvent = {},
							detectors = [];

						if ( !isReadyDetecting ) {
							this._resetDetecting();
							this._bindEvents();

							startEvent = this._createDefaultEventData( Gesture.Event.START, event );

							this.gestureEvents = {
								start: startEvent,
								last: startEvent
							};

							this.velocity = {
								event: startEvent,
								x: 0,
								y: 0
							};

							startEvent = objectMerge(startEvent, this._createGestureEvent(Gesture.Event.START, event));
							isReadyDetecting = true;
						}

						this.instances.forEach(function( instance ) {
							if ( instance.getElement() === elem ) {
								detectors = detectors.concat( instance.getGestureDetectors() );
							}
						}, this);

						detectors.sort(function(a, b) {
							if(a.index < b.index) {
								return -1;
							} else if(a.index > b.index) {
								return 1;
							}
							return 0;
						});

						this.gestureDetectors = this.gestureDetectors.concat( detectors );

						this._detect(detectors, startEvent);
					},

					/**
					 * Handler for gesture move
					 * @method _move
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_move: function( event ) {
						if ( !isReadyDetecting ) {
							return;
						}

						event = this._createGestureEvent(Gesture.Event.MOVE, event);
						this._detect(this.gestureDetectors, event);

						this.gestureEvents.last = event;
					},

					/**
					 * Handler for gesture end
					 * @method _end
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_end: function( event ) {

						event = objectMerge(
							{},
							this.gestureEvents.last,
							this._createDefaultEventData(Gesture.Event.END, event)
						);

						if ( event.pointers.length > 0 ) {
							return;
						}

						this._detect(this.gestureDetectors, event);

						this.unregisterBlockList.forEach(function( instance ) {
							this.unregist( instance );
						}, this);

						this._resetDetecting();
						blockMouseEvent = false;
					},

					/**
					 * Handler for gesture cancel
					 * @method _cancel
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_cancel: function( event ) {

						event = objectMerge(
							{},
							this.gestureEvents.last,
							this._createDefaultEventData(Gesture.Event.CANCEL, event)
						);

						this._detect(this.gestureDetectors, event);

						this.unregisterBlockList.forEach(function( instance ) {
							this.unregist( instance );
						}, this);

						this._resetDetecting();
						blockMouseEvent = false;
					},

					/**
					 * Detect gesture
					 * @method _detect
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_detect: function( detectors, event ) {
						var finishedDetectors = [];

						detectors.forEach(function( detector ) {
							var result;

							if ( this.detectorRequestedBlock ) {
								return;
							}

							result = detector.detect( event );
							if ( result & Gesture.Result.RUNNING ) {
								if ( this.runningDetectors.indexOf( detector ) < 0 ) {
									this.runningDetectors.push( detector );
								}
							}

							if ( result & Gesture.Result.FINISHED ) {
								finishedDetectors.push( detector );
							}

							if ( result & Gesture.Result.BLOCK ) {
								this.detectorRequestedBlock = detector;
							}

						}, this);

						// remove finished detectors.
						finishedDetectors.forEach(function( detector ) {
							var idx;

							idx = this.gestureDetectors.indexOf( detector );
							if ( idx > -1 ) {
								this.gestureDetectors.splice(idx, 1);
							}

							idx = this.runningDetectors.indexOf( detector );
							if ( idx > -1 ) {
								this.runningDetectors.splice(idx, 1);
							}
						}, this);

						// remove all detectors except the detector that return block result
						if ( this.detectorRequestedBlock ) {
							// send to cancel event.
							this.runningDetectors.forEach(function( detector ) {
								var cancelEvent = objectMerge({}, event, {
									eventType: Gesture.Event.BLOCKED
								});
								detector.detect( cancelEvent );
							});
							this.runningDetectors.length = 0;

							// remove all detectors.
							this.gestureDetectors.length = 0;
							if ( finishedDetectors.indexOf( this.detectorRequestedBlock ) < 0 ) {
								this.gestureDetectors.push( this.detectorRequestedBlock );
							}
						}
					},

					/**
					 * Reset of gesture manager detector
					 * @method _resetDetecting
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_resetDetecting: function() {
						isReadyDetecting = false;
						startEvent = null

						this.gestureDetectors.length = 0;
						this.runningDetectors.length = 0;
						this.detectorRequestedBlock = null;

						this.gestureEvents = null;
						this.velocity = null;

						this._unbindEvents();
					},

					/**
					 * Create default event data
					 * @method _createDefaultEventData
					 * @param {string} type event type
					 * @param {Event} event source event
					 * @return {Object} default event data
					 * @return {string} return.eventType
					 * @return {number} return.timeStamp
					 * @return {Touch} return.pointer
					 * @return {TouchList} return.pointers
					 * @return {Event} return.srcEvent
					 * @return {Function} return.preventDefault
					 * @return {Function} return.stopPropagation
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_createDefaultEventData: function( type, event ) {
						var pointers = event.touches ?
								event.touches :
									event.type === "mouseup" ? [] : ( event.identifier=1 && [event] ),
							pointer = pointers[0],
							timeStamp = new Date().getTime();

						return {
							eventType: type,
							timeStamp: timeStamp,
							pointer: pointer,
							pointers: pointers,

							srcEvent: event,
							preventDefault: function() {
								this.srcEvent.preventDefault();
							},
							stopPropagation: function() {
								this.srcEvent.stopPropagation();
							}
						};
					},

					/**
					 * Create gesture event
					 * @method _createGestureEvent
					 * @param {string} type event type
					 * @param {Event} event source event
					 * @return {Object} gesture event consist from Event class and additional properties
					 * @return {number} return.deltaTime
					 * @return {number} return.deltaX
					 * @return {number} return.deltaY
					 * @return {number} return.velocityX
					 * @return {number} return.velocityY
					 * @return {number} return.estimatedX
					 * @return {number} return.estimatedY
					 * @return {number} return.estimatedDeltaX
					 * @return {number} return.estimatedDeltaY
					 * @return {number} return.distance
					 * @return {number} return.angle
					 * @return {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} return.direction
					 * @return {number} return.scale
					 * @return {number} return.rotation (deg)
					 * @return {Event} return.startEvent
					 * @return {Event} return.lastEvent
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_createGestureEvent: function( type, event ) {
						var ev = this._createDefaultEventData( type, event ),
							startEvent = this.gestureEvents.start,
							lastEvent = this.gestureEvents.last,
							velocityEvent = this.velocity.event,
							delta = {
								time: ev.timeStamp - startEvent.timeStamp,
								x: ev.pointer.clientX - startEvent.pointer.clientX,
								y: ev.pointer.clientY - startEvent.pointer.clientY
							},
							deltaFromLast = {
								x: ev.pointer.clientX - lastEvent.pointer.clientX,
								y: ev.pointer.clientY - lastEvent.pointer.clientY
							},
							velocity = this.velocity,
							timeDifference = Gesture.defaults.estimatedPointerTimeDifference, /* pause time threshold.util. tune the number to up if it is slow */
							estimated;

						// reset start event for multi touch
						if( startEvent && ev.pointers.length !== startEvent.pointers.length ) {
							startEvent.pointers = [];
							[].forEach.call(ev.pointers, function( pointer ) {
								startEvent.pointers.push( objectMerge({}, pointer) );
							});
						}

						if ( ev.timeStamp - velocityEvent.timeStamp > Gesture.defaults.updateVelocityInterval ) {
							this.velocity = Gesture.utils.getVelocity(
									ev.timeStamp - velocityEvent.timeStamp,
									ev.pointer.clientX - velocityEvent.pointer.clientX,
									ev.pointer.clientY - velocityEvent.pointer.clientY
							);

							objectMerge(this.velocity, velocity, {
								direction: Gesture.utils.getDirection(velocityEvent.pointer, ev.pointer),
								event: ev
							});
						}

						estimated = {
							x: Math.round( ev.pointer.clientX + ( timeDifference * velocity.x * (deltaFromLast.x < 0 ? -1 : 1) ) ),
							y: Math.round( ev.pointer.clientY + ( timeDifference * velocity.y * (deltaFromLast.y < 0 ? -1 : 1) ) )
						};

						// Prevent that point goes back even though direction is not changed.
						if ( (deltaFromLast.x < 0 && estimated.x > lastEvent.estimatedX) ||
							(deltaFromLast.x > 0 && estimated.x < lastEvent.estimatedX) ) {
							estimated.x = lastEvent.estimatedX;
						}

						if ( (deltaFromLast.y < 0 && estimated.y > lastEvent.estimatedY) ||
							(deltaFromLast.y > 0 && estimated.y < lastEvent.estimatedY) ) {
							estimated.y = lastEvent.estimatedY;
						}

						objectMerge(ev, {
							deltaTime: delta.time,
							deltaX: delta.x,
							deltaY: delta.y,

							velocityX: velocity.x,
							velocityY: velocity.y,
							velocityDirection: velocity.direction,

							estimatedX: estimated.x,
							estimatedY: estimated.y,
							estimatedDeltaX: estimated.x - startEvent.pointer.clientX,
							estimatedDeltaY: estimated.y - startEvent.pointer.clientY,

							distance: Gesture.utils.getDistance(startEvent.pointer, ev.pointer),

							angle: Gesture.utils.getAngle(startEvent.pointer, ev.pointer),

							direction: Gesture.utils.getDirection(startEvent.pointer, ev.pointer),

							scale: Gesture.utils.getScale(startEvent.pointers, ev.pointers),
							rotation: Gesture.utils.getRotation(startEvent.pointers, ev.pointers),

							startEvent: startEvent,
							lastEvent: lastEvent
						});

						return ev;
					},

					/**
					 * Register instance of gesture
					 * @method register
					 * @param {ns.event.gesture.Instance} instance gesture instance
					 * @member ns.event.gesture.Manager
					 */
					register: function( instance ) {
						var idx = this.instances.indexOf( instance );
						if ( idx < 0 ) {
							this.instances.push( instance );
							this._bindStartEvents( instance );
						}
					},

					/**
					 * Unregister instance of gesture
					 * @method unregister
					 * @param {ns.event.gesture.Instance} instance gesture instance
					 * @member ns.event.gesture.Manager
					 */
					unregister: function( instance ) {
						var idx;

						if ( !!this.gestureDetectors.length ) {
							this.unregisterBlockList.push( instance );
							return;
						}

						idx = this.instances.indexOf( instance );
						if ( idx > -1 ) {
							this.instances.splice( idx, 1 );
							this._unbindStartEvents( instance );
						}

						if ( !this.instances.length ) {
							this._destroy();
						}
					},

					/**
					 * Destroy instance of Manager
					 * @method _destroy
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					_destroy: function() {
						this._resetDetecting();

						this.instances.length = 0;
						this.unregisterBlockList.length = 0;

						blockMouseEvent = false;
						instance = null;
					}

				};

				return {
					getInstance: function() {
						return instance ? instance : ( instance = new Manager() );
					}
				};
			})();
			} ( ns, window, window.document ) );

/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Gesture.Instance class
 * Creates instance of gesture manager on element.
 * @class ns.event.gesture.Instance
 */
( function ( ns, window, undefined ) {
	"use strict";
					/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector,
				/**
				 * Local alias for {@link ns.event.gesture.Manager}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				Manager = ns.event.gesture.Manager,
				/**
				 * Local alias for {@link ns.event}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				events = ns.event,
				/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} merge
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				merge = ns.util.object.merge;

			Gesture.Instance = function( element, options ) {

				this.element = element;
				this.eventDetectors = [];

				this.options = merge({}, Gesture.defaults, options);
				this.gestureManager = null;

				this._init();
			};

			Gesture.Instance.prototype = {
				/**
				 * Initialize gesture instance
				 * @method _init
				 * @member ns.event.gesture.Instance
				 * @protected
				 */
				_init: function() {
					this.gestureManager = Manager.getInstance();
					this.eventSender = merge({}, Detector.Sender, {
						sendEvent: this.trigger.bind(this)
					});
				},

				/**
				 * Find gesture detector
				 * @method _findGestureDetector
				 * @param {string} gesture gesture
				 * @member ns.event.gesture.Instance
				 * @protected
				 */
				_findGestureDetector: function( gesture ) {
					var detectors = Detector.plugin,
						detector, name;
					for ( name in detectors ) {
						if ( detectors.hasOwnProperty( name ) ) {
							detector = detectors[ name ];
							if ( detector.prototype.types.indexOf( gesture ) > -1 ) {
								return detector;
							}
						}
					}
				},

				/**
				 * Set options
				 * @method setOptions
				 * @param {Object} options options
				 * @chainable
				 * @member ns.event.gesture.Instance
				 */
				setOptions: function( options ) {
					merge(this.options, options);
					return this;
				},

				/**
				 * Add detector
				 * @method addDetector
				 * @param {Object} detectorStrategy strategy
				 * @chainable
				 * @member ns.event.gesture.Instance
				 */
				addDetector: function( detectorStrategy ) {
					var detector = new Detector( detectorStrategy, this.eventSender ),
						alreadyHasDetector = !!this.eventDetectors.length;

					this.eventDetectors.push(detector);

					if ( !!this.eventDetectors.length && !alreadyHasDetector ) {
						this.gestureManager.register(this);
					}

					return this;
				},

				/**
				 * Remove detector
				 * @method removeDetector
				 * @param {Object} detectorStrategy strategy
				 * @chainable
				 * @member ns.event.gesture.Instance
				 */
				removeDetector: function( detectorStrategy ) {
					var idx = this.eventDetectors.indexOf( detectorStrategy );

					if ( idx > -1 ) {
						this.eventDetectors.splice(idx, 1);
					}

					if ( !this.eventDetectors.length ) {
						this.gestureManager.unregister(this);
					}

					return this;
				},

				/**
				 * Triggers the gesture event
				 * @method trigger
				 * @param {string} gesture gesture name
				 * @param {Object} eventInfo data provided to event object
				 * @member ns.event.gesture.Instance
				 */
				trigger: function( gesture, eventInfo ) {
					return events.trigger(this.element, gesture, eventInfo, false);
				},

				/**
				 * Get HTML element assigned to gesture event instance
				 * @method getElement
				 * @member ns.event.gesture.Instance
				 */
				getElement: function() {
					return this.element;
				},

				/**
				 * Get gesture event detectors assigned to instance
				 * @method getGestureDetectors
				 * @member ns.event.gesture.Instance
				 */
				getGestureDetectors: function() {
					return this.eventDetectors;
				},

				/**
				 * Destroy instance
				 * @method destroy
				 * @member ns.event.gesture.Instance
				 */
				destroy: function( ) {
					this.element = null;
					this.eventHandlers = {};
					this.gestureManager = null;
					this.eventSender = null;
					this.eventDetectors.length = 0;
				}
			};
			} ( ns, window ) );

/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * # Gesture Plugin: drag
 * Plugin enables drag event.
 *
 * @class ns.event.gesture.Drag
 */
( function ( ns, window, undefined ) {
	"use strict";
	
				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Drag
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Drag
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector,
				/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} merge
				 * @member ns.event.gesture.Drag
				 * @private
				 * @static
				 */
				merge = ns.util.object.merge,

				// TODO UA test will move to support.
				tizenBrowser = !!window.navigator.userAgent.match(/tizen/i);

			ns.event.gesture.Drag = Detector.plugin.create({

				/**
				 * Gesture name
				 * @property {string} [name="drag"]
				 * @member ns.event.gesture.Drag
				 */
				name: "drag",

				/**
				 * Gesture Index
				 * @property {number} [index=400]
				 * @member ns.event.gesture.Drag
				 */
				index: 500,

				/**
				 * Array of possible drag events
				 * @property {string[]} types
				 * @member ns.event.gesture.Drag
				 */
				types: ["drag", "dragstart", "dragend", "dragcancel", "dragprepare", "dragrelease"],

				/**
				 * Default values for drag gesture
				 * @property {Object} defaults
				 * @property {boolean} [defaults.blockHorizontal=false]
				 * @property {boolean} [defaults.blockVertical=false]
				 * @property {number} [defaults.threshold=10]
				 * @property {number} [defaults.delay=0]
				 * @member ns.event.gesture.Drag
				 */
				defaults: {
					blockHorizontal: false,
					blockVertical: false,
					threshold: 20,
					delay: 0
				},

				/**
				 * Triggered
				 * @property {boolean} [triggerd=false]
				 * @member ns.event.gesture.Drag
				 */
				triggerd: false,

				/**
				 * Handler for drag gesture
				 * @method handler
				 * @param {Event} gestureEvent gesture event
				 * @param {Object} sender event's sender
				 * @param {Object} options options
				 * @return {ns.event.gesture.Result.PENDING|ns.event.gesture.Result.END|ns.event.gesture.Result.FINISHED|ns.event.gesture.Result.BLOCK}
				 * @member ns.event.gesture.Drag
				 */
				handler: function( gestureEvent, sender, options ) {
					var ge = gestureEvent,
						threshold = options.threshold,
						result = Gesture.Result.PENDING,
						event = {
							drag: this.types[0],
							start: this.types[1],
							end: this.types[2],
							cancel: this.types[3],
							prepare: this.types[4],
							release: this.types[5]
						},
						direction = ge.direction;

					if ( !this.triggerd && ge.eventType === Gesture.Event.MOVE ) {
						if ( Math.abs(ge.deltaX) < threshold && Math.abs(ge.deltaY) < threshold ) {
							if ( !tizenBrowser ) {
								ge.preventDefault();
							}
							return Gesture.Result.PENDING;
						}

						if ( options.delay && ge.deltaTime < options.delay ) {
							if ( !tizenBrowser ) {
								ge.preventDefault();
							}
							return Gesture.Result.PENDING;
						}
						if ( (options.blockHorizontal && Gesture.utils.isHorizontal( ge.direction )) ||
							(options.blockVertical && Gesture.utils.isVertical( ge.direction )) ) {
							sender.sendEvent( event.release, ge );
							return Gesture.Result.FINISHED;
						}
						this.fixedStartPointX = 0;
						this.fixedStartPointY = 0;
						if ( Gesture.utils.isHorizontal( ge.direction ) ) {
							this.fixedStartPointX = ( ge.deltaX < 0 ? 1 : -1 ) * threshold;
						} else {
							this.fixedStartPointY = ( ge.deltaY < 0 ? 1 : -1 ) * threshold;
						}
					}

					if ( options.blockHorizontal ) {
						direction = ge.deltaY < 0 ? Gesture.Direction.UP : Gesture.Direction.DOWN;
					}

					if ( options.blockVertical ) {
						direction = ge.deltaX < 0 ? Gesture.Direction.LEFT : Gesture.Direction.RIGHT;
					}

					ge = merge({}, ge, {
						deltaX: ge.deltaX + this.fixedStartPointX,
						deltaY: ge.deltaY + this.fixedStartPointY,
						estimatedDeltaX: ge.estimatedDeltaX + this.fixedStartPointX,
						estimatedDeltaY: ge.estimatedDeltaY + this.fixedStartPointY,

						direction: direction
					});

					switch( ge.eventType ) {
						case Gesture.Event.START:
							this.triggerd = false;
							if (sender.sendEvent( event.prepare, ge ) === false) {
								result = Gesture.Result.FINISHED;
							}
							break;
						case Gesture.Event.MOVE:
							if ( !this.triggerd ) {
								if (sender.sendEvent( event.start, ge ) === false) {
									result = Gesture.Result.FINISHED;
									ge.preventDefault();
									break;
								}
							}
							result = sender.sendEvent( event.drag, ge ) ? Gesture.Result.RUNNING : Gesture.Result.FINISHED;
							ge.preventDefault();
							this.triggerd = true;
							break;

						case Gesture.Event.BLOCKED:
						case Gesture.Event.END:
							result = Gesture.Result.FINISHED;
							if ( this.triggerd ) {
								sender.sendEvent( event.end, ge );
								ge.preventDefault();
								this.triggerd = false;
							}
							sender.sendEvent( event.release, ge );
							break;

						case Gesture.Event.CANCEL:
							result = Gesture.Result.FINISHED;
							if ( this.triggerd ) {
								sender.sendEvent( event.cancel, ge );
								ge.preventDefault();
								this.triggerd = false;
							}
							sender.sendEvent( event.release, ge );
							break;

					}

					return result;
				}
			});
			} ( ns, window ) );

/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Gesture Plugin: swipe
 * Plugin enables swipe event.
 *
 * @class ns.event.gesture.Swipe
 */
( function ( ns, window, undefined ) {
	"use strict";
    
				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Swipe
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Swipe
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector;

			ns.event.gesture.Swipe = Detector.plugin.create({
				/**
				 * Gesture name
				 * @property {string} [name="swipe"]
				 * @member ns.event.gesture.Swipe
				 */
				name: "swipe",

				/**
				 * Gesture Index
				 * @property {number} [index=400]
				 * @member ns.event.gesture.Swipe
				 */
				index: 400,

				/**
				 * Default values for swipe gesture
				 * @property {Object} defaults
				 * @property {number} [defaults.timeThreshold=400]
				 * @property {number} [defaults.velocity=0.6]
				 * @property {ns.event.gesture.HORIZONTAL|ns.event.gesture.VERTICAL} [defaults.orientation=ns.event.gesture.HORIZONTAL]
				 * @member ns.event.gesture.Swipe
				 */
				defaults: {
					timeThreshold: 400,
					velocity: 0.6,
					orientation: Gesture.Orientation.HORIZONTAL
				},

				/**
				 * Handler for swipe gesture
				 * @method handler
				 * @param {Event} gestureEvent gesture event
				 * @param {Object} sender event's sender
				 * @param {Object} options options
				 * @return {ns.event.gesture.Result.PENDING|ns.event.gesture.Result.END|ns.event.gesture.Result.FINISHED|ns.event.gesture.Result.BLOCK}
				 * @member ns.event.gesture.Swipe
				 */
				handler: function( gestureEvent, sender, options ) {
					var ge = gestureEvent,
						result = Gesture.Result.PENDING;

					if ( ge.eventType !== Gesture.Event.END ) {
						return result;
					}

					if ( ( ge.deltaTime > options.timeThreshold ) ||
						( options.orientation !== Gesture.utils.getOrientation( ge.direction ) ) ) {
						result = Gesture.Result.FINISHED;
						return result;
					}

					if( ge.velocityX > options.velocity || ge.velocityY > options.velocity ) {
						sender.sendEvent( this.name, gestureEvent );
						result = Gesture.Result.FINISHED | Gesture.Result.BLOCK;
					}

					return result;
				}
			});
			} ( ns, window ) );

/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * # Gesture Plugin: pinch
 * Plugin enables pinch event.
 *
 * @class ns.event.gesture.Pinch
 */
( function ( ns, window, undefined ) {
	"use strict";
	
				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Pinch
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Pinch
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector;

			ns.event.gesture.Pinch = Detector.plugin.create({
				/**
				 * Gesture name
				 * @property {string} [name="pinch"]
				 * @member ns.event.gesture.Pinch
				 */
				name: "pinch",

				/**
				 * Gesture Index
				 * @property {number} [index=300]
				 * @member ns.event.gesture.Pinch
				 */
				index: 300,

				/**
				 * Array of posible pinch events
				 * @property {string[]} types
				 * @member ns.event.gesture.Pinch
				 */
				types: ["pinchstart", "pinchmove", "pinchend", "pinchcancel", "pinchin", "pinchout"],

				/**
				 * Default values for pinch gesture
				 * @property {Object} defaults
				 * @property {number} [defaults.velocity=0.6]
				 * @property {number} [defaults.timeThreshold=400]
				 * @member ns.event.gesture.Pinch
				 */
				defaults: {
					velocity: 0.6,
					timeThreshold: 400
				},

				/**
				 * Triggered
				 * @property {boolean} [triggerd=false]
				 * @member ns.event.gesture.Pinch
				 */
				triggerd: false,

				/**
				 * Handler for pinch gesture
				 * @method handler
				 * @param {Event} gestureEvent gesture event
				 * @param {Object} sender event's sender
				 * @param {Object} options options
				 * @return {ns.event.gesture.Result.PENDING|ns.event.gesture.Result.END|ns.event.gesture.Result.FINISHED|ns.event.gesture.Result.BLOCK}
				 * @member ns.event.gesture.Pinch
				 */
				handler: function ( gestureEvent, sender, options ) {
					var ge = gestureEvent,
						result = Gesture.Result.PENDING,
						event = {
							start: this.types[0],
							move: this.types[1],
							end: this.types[2],
							cancel: this.types[3],
							in: this.types[4],
							out: this.types[5]
						};

					switch( ge.eventType ) {
						case Gesture.Event.MOVE:
							if (ge.pointers.length === 1 && ge.distance > 35) {
								result = Gesture.Result.FINISHED;
								return result;
							} else if ( !this.triggerd && ge.pointers.length >= 2) {
								this.triggerd = true;
								sender.sendEvent( event.start, ge );
								ge.preventDefault();
								result = Gesture.Result.RUNNING;
							} else if ( this.triggerd) {
								if ( ( ge.deltaTime < options.timeThreshold ) &&
									( ge.velocityX > options.velocity || ge.velocityY > options.velocity ) ) {
									if (ge.scale < 1) {
										sender.sendEvent( event.in, gestureEvent );
									} else {
										sender.sendEvent( event.out, gestureEvent );
									}
									ge.preventDefault();
									this.triggerd = false;
									result = Gesture.Result.FINISHED | Gesture.Result.BLOCK;
									return result;
								} else {
									sender.sendEvent( event.move, ge );
									ge.preventDefault();
									result = Gesture.Result.RUNNING;
								}
							}
							break;
						case Gesture.Event.BLOCKED:
						case Gesture.Event.END:
							if ( this.triggerd ) {
								sender.sendEvent( event.end, ge );
								ge.preventDefault();
								this.triggerd = false;
								result = Gesture.Result.FINISHED;
							}
							break;
						case Gesture.Event.CANCEL:
							if ( this.triggerd ) {
								sender.sendEvent( event.cancel, ge );
								ge.preventDefault();
								this.triggerd = false;
								result = Gesture.Result.FINISHED;
							}
							break;
					}
					return result;
				}
			});
			} ( ns, window ) );

/*global ns, window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Gesture Plugin: longPress
 * Plugin enables long press event.
 *
 * @class ns.event.gesture.LongPress
 */
( function ( ns, window, undefined ) {
	"use strict";
	
				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.LongPress
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.LongPress
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector;

			ns.event.gesture.LongPress = Detector.plugin.create({
				/**
				 * Gesture name
				 * @property {string} [name="longpress"]
				 * @member ns.event.gesture.LongPress
				 */
				name: "longpress",

				/**
				 * Gesture Index
				 * @property {number} [index=200]
				 * @member ns.event.gesture.LongPress
				 */
				index: 600,

				/**
				 * Default values for longPress gesture
				 * @property {Object} defaults
				 * @property {number} [defaults.timeThreshold=400]
				 * @property {number} [defaults.longPressDistanceThreshold=15]
				 * @property {boolean} [defaults.preventClick]
				 * @member ns.event.gesture.LongPress
				 */
				defaults: {
					longPressTimeThreshold: 750,
					longPressDistanceThreshold: 20,
					preventClick: true
				},

				/**
				 * IsTriggered
				 * @property {boolean} [isTriggered=false]
				 * @member ns.event.gesture.LongPress
				 */
				isTriggered: false,

				/**
				 * longPressTimeOutId
				 * @property {number} [longPressTimeOutId=0]
				 * @member ns.event.gesture.LongPress
				 */
				longPressTimeOutId: 0,

				/**
				 * Handler for longPress gesture
				 * @method handler
				 * @param {Event} gestureEvent gesture event
				 * @param {Object} sender event's sender
				 * @param {Object} options options
				 * @return {ns.event.gesture.Result.PENDING|ns.event.gesture.Result.END|ns.event.gesture.Result.FINISHED|ns.event.gesture.Result.BLOCK}
				 * @member ns.event.gesture.LongPress
				 */
				handler: function( gestureEvent, sender, options ) {
					var ge = gestureEvent,
						result = Gesture.Result.PENDING;

					switch( ge.eventType ) {
						case Gesture.Event.START:
							this.isTriggered = false;
							this.longPressTimeOutId = setTimeout(function() {
								this.isTriggered = true;
								sender.sendEvent( this.name, gestureEvent );
								result = Gesture.Result.FINISHED;
								return result;
							}.bind(this), options.longPressTimeThreshold);
							break;

						case Gesture.Event.MOVE:
							if ( ge.distance > options.longPressDistanceThreshold && !this.isTriggered) {
								clearTimeout(this.longPressTimeOutId);
								result = Gesture.Result.FINISHED;
							}
							break;

						case Gesture.Event.END:
							if (!this.isTriggered) {
								clearTimeout(this.longPressTimeOutId);
							} else if (options.preventClick) {
								ge.preventDefault();
							}
							result = Gesture.Result.FINISHED;
							break;

						default:
							break;

					}
					return result;
				}
			});
			} ( ns, window ) );

/*global window, define, CustomEvent */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * @class ns.event.gesture
 */
(function (ns) {
	"use strict";
				var instances = [],
				gesture = ns.event.gesture || {};

			/**
			 * Find instance by element
			 * @method findInstance
			 * @param {HTMLElement} element
			 * @return {ns.event.gesture.Instance}
			 * @member ns.event
			 * @static
			 * @private
			 */
			function findInstance(element) {
				var instance;
				instances.forEach(function(item) {
					if (item.element === element) {
						instance = item.instance;
					}
				});
				return instance;
			}

			/**
			 * Remove instance from instances by element
			 * @method removeInstance
			 * @param {HTMLElement} element
			 * @member ns.event
			 * @static
			 * @private
			 */
			function removeInstance(element) {
				instances.forEach(function(item, key) {
					if (item.element === element) {
						instances.splice(key, 1);
					}
				});
			}

			/**
			 * Enable gesture handlingo on given HTML element or object
			 * @method enableGesture
			 * @param {HTMLElement} element
			 * @param {...Object} [gesture] Gesture object {@link ns.event.gesture}
			 * @member ns.event
			 */
			ns.event.enableGesture = function() {
				var element = arguments[0],
					gestureInstance = findInstance( element ),
					length = arguments.length,
					i = 1;

				if ( !gestureInstance ) {
					gestureInstance = new gesture.Instance(element);
					instances.push({element: element, instance: gestureInstance});
				}

				for ( ; i < length; i++ ) {
					gestureInstance.addDetector( arguments[i] );
				}
			};

			/**
			 * Disable gesture handling from given HTML element or object
			 * @method disableGesture
			 * @param {HTMLElement} element
			 * @param {...Object} [gesture] Gesture object {@link ns.event.gesture}
			 * @member ns.event
			 */
			ns.event.disableGesture = function() {
				var element = arguments[0],
					gestureInstance = findInstance( element ),
					length = arguments.length,
					i = 1;

				if ( !gestureInstance ) {
					return;
				}

				if ( length > 1 ) {
					gestureInstance.removeDetector( arguments[i] );
				} else {
					gestureInstance.destroy();
					removeInstance( element );
				}
			};

			ns.event.gesture = gesture;
			}(ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Scroller namespace
 * Namespace contains classes and objects connected with scroller widget.
 * @class ns.widget.wearable.scroller
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	"use strict";
				ns.widget.core.scroller = ns.widget.core.scroller || {};
			}(window, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * #Effect namespace
 * Namespace with effects for scroller widget.
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @class ns.widget.core.scroller.effect
 */
(function (window, ns) {
	"use strict";
				ns.widget.core.scroller.effect = ns.widget.core.scroller.effect || {};
			}(window, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Bouncing effect
 * Bouncing effect for scroller widget.
 * @class ns.widget.core.scroller.effect.Bouncing
 * @since 2.3
 */
(function (document, ns) {
	"use strict";
				// scroller.start event trigger when user try to move scroller
			var utilsObject = ns.util.object,
				selectors = ns.util.selectors,
				Bouncing = function (scrollerElement, options) {
					var self = this;
					self._orientation = null;
					self._maxValue = null;

					self._container = null;
					self._minEffectElement = null;
					self._maxEffectElement = null;

					self.options = utilsObject.merge({}, Bouncing.defaults, {scrollEndEffectArea: ns.getConfig("scrollEndEffectArea", Bouncing.defaults.scrollEndEffectArea)});
				/**
				 * target element for bouncing effect
				 * @property {HTMLElement} targetElement
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
					self._targetElement = null;

					self._isShow = false;
					self._isDrag = false;
					self._isShowAnimating = false;
					self._isHideAnimating = false;

					self._create(scrollerElement, options);
				},
				endEffectAreaType = {
					content: "content",
					screen: "screen"
				},
				defaults = {
					duration: 500,
					scrollEndEffectArea : "content"
				},
				classes = {
					bouncingEffect: "ui-scrollbar-bouncing-effect",
					page: "ui-page",
					left: "ui-left",
					right: "ui-right",
					top: "ui-top",
					bottom: "ui-bottom",
					hide: "ui-hide",
					show: "ui-show"
				};

			Bouncing.defaults = defaults;

			Bouncing.prototype = {
				_create: function (scrollerElement, options) {
					var self = this;
					if( self.options.scrollEndEffectArea === endEffectAreaType.content ){
						self._container = scrollerElement;
					} else {
						self._container = selectors.getClosestByClass(scrollerElement, classes.page);
					}

					self._orientation = options.orientation;
					self._maxValue = self._getValue( options.maxScrollX, options.maxScrollY );

					self._initLayout();
				},

				_initLayout: function() {
					var self = this,
						minElement = self._minEffectElement = document.createElement("DIV"),
						maxElement = self._maxEffectElement = document.createElement("DIV"),
						className = classes.bouncingEffect;

					if ( self._orientation === ns.widget.core.scroller.Scroller.Orientation.HORIZONTAL ) {
						minElement.className = className + " " + classes.left;
						maxElement.className = className + " " + classes.right;
					} else {
						minElement.className = className + " " + classes.top;
						maxElement.className = className + " " + classes.bottom;
					}

					self._container.appendChild( minElement );
					self._container.appendChild( maxElement );

					minElement.addEventListener("animationEnd", this);
					minElement.addEventListener("webkitAnimationEnd", this);
					minElement.addEventListener("mozAnimationEnd", this);
					minElement.addEventListener("msAnimationEnd", this);
					minElement.addEventListener("oAnimationEnd", this);

					maxElement.addEventListener("animationEnd", this);
					maxElement.addEventListener("webkitAnimationEnd", this);
					maxElement.addEventListener("mozAnimationEnd", this);
					maxElement.addEventListener("msAnimationEnd", this);
					maxElement.addEventListener("oAnimationEnd", this);
				},

				/**
				 * ...
				 * @method drag
				 * @param x
				 * @param y
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				drag: function( x, y ) {
					this._isDrag = true;
					this._checkAndShow( x, y );
				},

				/**
				 * ...
				 * @method dragEnd
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				dragEnd: function() {
					var self = this;
					if ( self._isShow && !self._isShowAnimating && !self._isHideAnimating ) {
						self._beginHide();
					}

					self._isDrag = false;
				},

				/**
				 * Shows effect.
				 * @method show
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				show: function() {
					var self = this;
					if ( self._targetElement ) {
						self._isShow = true;
						self._beginShow();
					}
				},

				/**
				 * Hides effect.
				 * @method hide
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				hide: function() {
					var self = this;
					if ( self._isShow ) {
						self._minEffectElement.style.display = "none";
						self._maxEffectElement.style.display = "none";
						self._targetElement.classList.remove(classes.hide);
						self._targetElement.classList.remove(classes.show);
					}
					self._isShow = false;
					self._isShowAnimating = false;
					self._isHideAnimating = false;
					self._targetElement = null;
				},

				_checkAndShow: function( x, y ) {
					var self = this,
						val = self._getValue(x, y);
					if ( !self._isShow ) {
						if ( val >= 0 ) {
							self._targetElement = self._minEffectElement;
							self.show();
						} else if ( val <= self._maxValue ) {
							self._targetElement = self._maxEffectElement;
							self.show();
						}

					} else if ( self._isShow && !self._isDrag && !self._isShowAnimating && !self._isHideAnimating ) {
						self._beginHide();
					}
				},

				_getValue: function(x, y) {
					return this._orientation === ns.widget.core.scroller.Scroller.Orientation.HORIZONTAL ? x : y;
				},

				_beginShow: function() {
					var self = this;
					if ( !self._targetElement || self._isShowAnimating ) {
						return;
					}

					self._targetElement.style.display = "block";

					self._targetElement.classList.remove(classes.hide);
					self._targetElement.classList.add(classes.show);

					self._isShowAnimating = true;
					self._isHideAnimating = false;
				},

				_finishShow: function() {
					var self = this;
					self._isShowAnimating = false;
					if ( !self._isDrag ) {
						self._targetElement.classList.remove(classes.show);
						self._beginHide();
					}
				},

				_beginHide: function() {
					var self = this;
					if ( self._isHideAnimating ) {
						return;
					}

					self._targetElement.classList.remove(classes.show);
					self._targetElement.classList.add(classes.hide);

					self._isHideAnimating = true;
					self._isShowAnimating = false;
				},

				_finishHide: function() {
					var self = this;
					self._isHideAnimating = false;
					self._targetElement.classList.remove(classes.hide);
					self.hide();
					self._checkAndShow();
				},

				/**
				 * Supports events.
				 * @method handleEvent
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				handleEvent: function( event ) {
					if (event.type.toLowerCase().indexOf("animationend") > -1) {
						if ( this._isShowAnimating ) {
							this._finishShow();
						} else if ( this._isHideAnimating ) {
							this._finishHide();
						}
					}
				},

				/**
				 * Destroys effect.
				 * @method destroy
				 * @member ns.widget.core.scroller.effect.Bouncing
				 */
				destroy: function() {
					var self = this,
						maxEffectElement = this._maxEffectElement,
						minEffectElement = this._minEffectElement;

					minEffectElement.removeEventListener("animationEnd", this);
					minEffectElement.removeEventListener("webkitAnimationEnd", this);
					minEffectElement.removeEventListener("mozAnimationEnd", this);
					minEffectElement.removeEventListener("msAnimationEnd", this);
					minEffectElement.removeEventListener("oAnimationEnd", this);

					maxEffectElement.removeEventListener("animationEnd", this);
					maxEffectElement.removeEventListener("webkitAnimationEnd", this);
					maxEffectElement.removeEventListener("mozAnimationEnd", this);
					maxEffectElement.removeEventListener("msAnimationEnd", this);
					maxEffectElement.removeEventListener("oAnimationEnd", this);

					self._container.removeChild( minEffectElement );
					self._container.removeChild( maxEffectElement );

					self._container = null;
					self._minEffectElement = null;
					self._maxEffectElement = null;
					self._targetElement = null;

					self._isShow = null;
					self._orientation = null;
					self._maxValue = null;
				}
			};

			ns.widget.core.scroller.effect.Bouncing = Bouncing;
			}(window.document, ns));

/*global window, define, Event, console, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Scroller Widget
 * Widget creates scroller on content.
 * @class ns.widget.core.scroller.Scroller
 * @since 2.3
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
				// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				Gesture = ns.event.gesture,
				engine = ns.engine,
				utilsObject = ns.util.object,
				utilsEvents = ns.event,
				eventTrigger = utilsEvents.trigger,
				prototype = new BaseWidget(),
				EffectBouncing = ns.widget.core.scroller.effect.Bouncing,
				eventType = {
					/**
					 * event trigger when scroller start
					 * @event scrollstart
					 */
					START: "scrollstart",
					/**
					 * event trigger when scroller move
					 * @event scrollmove
					 */
					MOVE: "scrollmove",
					/**
					 * event trigger when scroller end
					 * @event scrollend
					 */
					END: "scrollend",
					/**
					 * event trigger when scroll is cancel
					 * @event scrollcancel
					 */
					CANCEL: "scrollcancel"
				},

				/*
				 * this option is related operation of scroll bar.
				 * the value is true, scroll bar is shown during touching screen even if content doesn't scroll.
				 * the value is false, scroll bar disappear when there is no movement of the scroll bar.
				 */
				_keepShowingScrollbarOnTouch = false,

				Scroller = function () {
				};

			Scroller.Orientation = {
				VERTICAL: "vertical",
				HORIZONTAL: "horizontal"
			};

			Scroller.EventType = eventType;

			prototype._build = function (element) {
				if (element.children.length !== 1) {
					throw "scroller has only one child.";
				}

				this.scroller = element.children[0];
				this.scrollerStyle = this.scroller.style;

				this.bouncingEffect = null;
				this.scrollbar = null;

				this.scrollerWidth = 0;
				this.scrollerHeight = 0;
				this.scrollerOffsetX = 0;
				this.scrollerOffsetY = 0;

				this.maxScrollX = 0;
				this.maxScrollY = 0;

				this.startScrollerOffsetX = 0;
				this.startScrollerOffsetY = 0;

				this.orientation = null;

				this.enabled = true;
				this.scrolled = false;
				this.dragging = false;
				this.scrollCanceled = false;

				return element;
			};

			prototype._configure = function () {
				/**
				 * @property {Object} options Options for widget
				 * @property {number} [options.scrollDelay=0]
				 * @property {number} [options.threshold=10]
				 * @property {""|"bar"|"tab"} [options.scrollbar=""]
				 * @property {boolean} [options.useBouncingEffect=false]
				 * @property {"vertical"|"horizontal"} [options.orientation="vertical"]
				 * @member ns.widget.core.Scroller
				 */
				this.options = utilsObject.merge({}, this.options, {
					scrollDelay: 0,
					threshold: 30,
					scrollbar: "",
					useBouncingEffect: false,
					orientation: "vertical"	// vertical or horizontal,
				});
			};

			prototype._init = function (element) {
				var options = this.options,
					scrollerChildren = this.scroller.children,
					elementStyle = this.element.style,
					scrollerStyle = this.scroller.style,
					elementHalfWidth =  this.element.offsetWidth / 2,
					elementHalfHeight = this.element.offsetHeight / 2;

				this.orientation = this.orientation ? this.orientation :
					(options.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL);
				this.scrollerWidth = this.scroller.offsetWidth;
				this.scrollerHeight = this.scroller.offsetHeight;

				this.maxScrollX = elementHalfWidth - this.scrollerWidth + scrollerChildren[scrollerChildren.length - 1].offsetWidth / 2;
				this.maxScrollY = elementHalfHeight - this.scrollerHeight + scrollerChildren[scrollerChildren.length - 1].offsetHeight / 2;
				this.minScrollX = elementHalfWidth - scrollerChildren[0].offsetWidth / 2;
				this.minScrollY = elementHalfHeight - scrollerChildren[0].offsetHeight / 2;

				this.scrolled = false;
				this.touching = true;
				this.scrollCanceled = false;

				if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
					this.maxScrollY = 0;
				} else {
					this.maxScrollX = 0;
				}
				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";
				scrollerStyle.position = "absolute";
				scrollerStyle.top = "0px";
				scrollerStyle.left = "0px";
				scrollerStyle.width = this.scrollerWidth + "px";
				scrollerStyle.height = this.scrollerHeight + "px";
				this._initScrollbar();
				this._initBouncingEffect();
				return element;
			};

			prototype._initScrollbar = function () {
				var type = this.options.scrollbar,
					scrollbarType;

				if ( type ) {
					scrollbarType = ns.widget.core.scroller.scrollbar.type[type];
					if ( scrollbarType ) {
						this.scrollbar = engine.instanceWidget(this.element, "ScrollBar", {
							type: scrollbarType,
							orientation: this.orientation
						});
					}
				}
			};

			prototype._initBouncingEffect = function () {
				var o = this.options;
				if ( o.useBouncingEffect ) {
					this.bouncingEffect = new EffectBouncing(this.element, {
						maxScrollX: this.maxScrollX,
						maxScrollY: this.maxScrollY,
						orientation: this.orientation
					});
				}
			};

			prototype._resetLayout = function () {
				var elementStyle = this.element.style,
					scrollerStyle = this.scrollerStyle;

				elementStyle.overflow = "";
				elementStyle.position = "";

				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";

				if (scrollerStyle) {
					scrollerStyle.position = "";
					scrollerStyle.top = "";
					scrollerStyle.left = "";
					scrollerStyle.width = "";
					scrollerStyle.height = "";

					scrollerStyle["-webkit-transform"] = "";
					scrollerStyle["-moz-transition"] = "";
					scrollerStyle["-ms-transition"] = "";
					scrollerStyle["-o-transition"] = "";
					scrollerStyle["transition"] = "";
				}
			};

			prototype._bindEvents = function () {
				ns.event.enableGesture(
					this.scroller,

					new ns.event.gesture.Drag({
						threshold: this.options.threshold,
						delay: this.options.scrollDelay,
						blockVertical: this.orientation === Scroller.Orientation.HORIZONTAL,
						blockHorizontal: this.orientation === Scroller.Orientation.VERTICAL
					})
				);

				utilsEvents.on( this.scroller, "drag dragstart dragend dragcancel", this );
				window.addEventListener("resize", this);
			};

			prototype._unbindEvents = function () {
				if (this.scroller) {
					ns.event.disableGesture( this.scroller );
					utilsEvents.off( this.scroller, "drag dragstart dragend dragcancel", this );
					window.removeEventListener("resize", this);
				}
			};

			/* jshint -W086 */
			prototype.handleEvent = function (event) {
				switch (event.type) {
					case "dragstart":
						this._start( event );
						break;
					case "drag":
						this._move( event );
						break;
					case "dragend":
						this._end( event );
						break;
					case "dragcancel":
						this.cancel( event );
						break;
					case "resize":
						this.refresh();
						break;
				}
			};

			/**
			 * Set options for widget.
			 * @method setOptions
			 * @param {Object} options
			 * @member ns.widget.core.scroller.Scroller
			 */
			prototype.setOptions = function (options) {
				var name;
				for ( name in options ) {
					if ( options.hasOwnProperty(name) && !!options[name] ) {
						this.options[name] = options[name];
					}
				}
			};

			prototype._refresh = function () {
				this._clear();
				this._unbindEvents();
				this._init(this.element);
				this._bindEvents();
			};

			/**
			 * Scrolls to new position.
			 * @method scrollTo
			 * @param x
			 * @param y
			 * @param duration
			 * @member ns.widget.core.scroller.Scroller
			 */
			prototype.scrollTo = function (x, y, duration) {
				this._translate(x, y, duration);
				this._translateScrollbar(x, y, duration);
			};

			prototype._translate = function (x, y, duration) {
				var translate,
					transition = {
						normal: "none",
						webkit: "none",
						moz: "none",
						ms: "none",
						o: "none"
					},
					scrollerStyle = this.scrollerStyle;

				if (duration) {
					transition.normal = "transform " + duration / 1000 + "s ease-out";
					transition.webkit = "-webkit-transform " + duration / 1000 + "s ease-out";
					transition.moz = "-moz-transform " + duration / 1000 + "s ease-out";
					transition.ms = "-ms-transform " + duration / 1000 + "s ease-out";
					transition.o = "-o-transform " + duration / 1000 + "s ease-out";
				}
				translate = "translate3d(" + x + "px," + y + "px, 0)";

				scrollerStyle["-webkit-transform"] =
						scrollerStyle["-moz-transform"] =
						scrollerStyle["-ms-transform"] =
						scrollerStyle["-o-transform"] =
						scrollerStyle.transform = translate;
				scrollerStyle.transition = transition.normal;
				scrollerStyle["-webkit-transition"] = transition.webkit;
				scrollerStyle["-moz-transition"] = transition.moz;
				scrollerStyle["-ms-transition"] = transition.ms;
				scrollerStyle["-o-transition"] = transition.o;

				this.scrollerOffsetX = window.parseInt(x, 10);
				this.scrollerOffsetY = window.parseInt(y, 10);
			};

			prototype._translateScrollbar = function (x, y, duration, autoHidden) {
				if (!this.scrollbar) {
					return;
				}

				this.scrollbar.translate(this.orientation === Scroller.Orientation.HORIZONTAL ? -x : -y, duration, autoHidden);
			};

			prototype._start = function(/* e */) {
				this.scrolled = false;
				this.dragging = true;
				this.scrollCanceled = false;
				this.startScrollerOffsetX = this.scrollerOffsetX;
				this.startScrollerOffsetY = this.scrollerOffsetY;
			};

			prototype._move = function (e, pos) {
				var newX = this.startScrollerOffsetX,
					newY = this.startScrollerOffsetY,
					autoHide = !_keepShowingScrollbarOnTouch;

				if ( !this.enabled || this.scrollCanceled || !this.dragging ) {
					return;
				}

				if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
					newX += e.detail.estimatedDeltaX;
				} else {
					newY += e.detail.estimatedDeltaY;
				}

				if ( newX > this.minScrollX || newX < this.maxScrollX ) {
					newX = newX > this.minScrollX ? this.minScrollX : this.maxScrollX;
				}
				if ( newY > this.minScrollY || newY < this.maxScrollY ) {
					newY = newY > this.minScrollY ? this.minScrollY : this.maxScrollY;
				}

				if ( newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY ) {
					if ( !this.scrolled ) {
						this._fireEvent( eventType.START );
					}
					this.scrolled = true;

					this._translate( newX, newY );
					this._translateScrollbar( newX, newY, 0, autoHide );
					// TODO to dispatch move event is too expansive. it is better to use callback.
					this._fireEvent( eventType.MOVE );

					if ( this.bouncingEffect ) {
						this.bouncingEffect.hide();
					}
				} else {
					if ( this.bouncingEffect ) {
						this.bouncingEffect.drag( newX, newY );
					}
					this._translateScrollbar( newX, newY, 0, autoHide );
				}
			};

			prototype._end = function (/* e */) {
				if ( !this.dragging ) {
					return;
				}

				// bouncing effect
				if ( this.bouncingEffect ) {
					this.bouncingEffect.dragEnd();
				}

				if ( this.scrollbar ) {
					this.scrollbar.end();
				}

				this._endScroll();
				this.dragging = false;
			};

			prototype._endScroll = function () {
				if (this.scrolled) {
					this._fireEvent(eventType.END);
				}

				this.scrolled = false;
			};

			/**
			 * Cancels scroll.
			 * @method cancel
			 * @member ns.widget.core.scroller.Scroller
			 */
			prototype.cancel = function () {
				this.scrollCanceled = true;

				if ( this.scrolled ) {
					this._translate( this.startScrollerOffsetX, this.startScrollerOffsetY );
					this._translateScrollbar( this.startScrollerOffsetX, this.startScrollerOffsetY );
					this._fireEvent( eventType.CANCEL );
				}

				if ( this.scrollbar ) {
					this.scrollbar.end();
				}

				this.scrolled = false;
				this.dragging = false;
			};

			prototype._fireEvent = function (eventName, detail) {
				eventTrigger( this.element, eventName, detail );
			};

			prototype._clear = function () {
				this.scrolled = false;
				this.scrollCanceled = false;

				this._resetLayout();
				this._clearScrollbar();
				this._clearBouncingEffect();
			};

			prototype._clearScrollbar = function () {
				if ( this.scrollbar ) {
					this.scrollbar.destroy();
				}
				this.scrollbar = null;
			};

			prototype._clearBouncingEffect = function () {
				if (this.bouncingEffect) {
					this.bouncingEffect.destroy();
				}
				this.bouncingEffect = null;
			};

			prototype._disable = function () {
				this.enabled = false;
			};

			prototype._enable = function () {
				this.enabled = true;
			};

			prototype._destroy = function () {
				this._clear();
				this._unbindEvents();
				this.scrollerStyle = null;
				this.scroller = null;
			};

			Scroller.prototype = prototype;

			ns.widget.core.scroller.Scroller = Scroller;

			engine.defineWidget(
				"Scroller",
				".scroller",
				["scrollTo", "cancel"],
				Scroller
			);
			}(window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Grid Utility
 * Object helps creating grids.
 * @class ns.util.grid
 */
(function (ns) {
	"use strict";
				/**
			 * Local alias for ns.util.selectors
			 * @property {Object} selectors Alias for {@link ns.util.selectors}
			 * @member ns.util.grid
			 * @static
			 * @private
			 */
			var selectors = ns.util.selectors,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.util.grid
				 * @private
				 * @static
				 */
				slice = [].slice,
				/**
				 * grid types
				 * @property {Array} gridTypes
				 * @member ns.util.grid
				 * @static
				 * @private
				*/
				gridTypes = [
					null,
					"solo", //1
					"a",	//2
					"b",	//3
					"c",	//4
					"d"	//5
				];

			/**
			 * Add classes on the matched elements
			 * @method setClassOnMatches
			 * @param {HTMLElementCollection} elements
			 * @param {string} selector
			 * @param {string} className
			 * @private
			 * @member ns.util.grid
			 * @static
			 */
			function setClassOnMatches(elements, selector, className) {
				elements.forEach(function (item) {
					if (selectors.matchesSelector(item, selector)) {
						item.classList.add(className);
					}
				});
			}
			ns.util.grid = {
				/**
				* make css grid
				* @method makeGrid
				* @param {HTMLElement} element
				* @param {?string} [gridType="a"]
				* @static
				* @member ns.util.grid
				*/
				makeGrid: function (element, gridType) {
					var gridClassList = element.classList,
						kids = slice.call(element.children),
						iterator;
					if (!gridType) {
						gridType = gridTypes[kids.length];
						if (!gridType) {
							//if gridType is not defined in gritTypes
							//make it grid type "a""
							gridType = "a";
							iterator = 2;
							gridClassList.add("ui-grid-duo");
						}
					}
					if (!iterator) {
						//jquery grid doesn't care if someone gives non-existing gridType
						iterator = gridTypes.indexOf(gridType);
					}

					gridClassList.add("ui-grid-" + gridType);

					setClassOnMatches(kids, ":nth-child(" + iterator + "n+1)", "ui-block-a");

					if (iterator > 1) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+2)", "ui-block-b");
					}
					if (iterator > 2) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+3)", "ui-block-c");
					}
					if (iterator > 3) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+4)", "ui-block-d");
					}
					if (iterator > 4) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+5)", "ui-block-e");
					}
				}
			};
			}(ns));

/*global CustomEvent, define, window, ns */
/*jslint plusplus: true, nomen: true, bitwise: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Virtual Mouse Events
 * Reimplementation of jQuery Mobile virtual mouse events.
 *
 * ##Purpose
 * It will let for users to register callbacks to the standard events like bellow,
 * without knowing if device support touch or mouse events
 * @class ns.event.vmouse
 */
/**
 * Triggered after mouse-down or touch-started.
 * @event vmousedown
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-click or touch-end when touch-move didn't occur
 * @event vclick
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-up or touch-end
 * @event vmouseup
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-move or touch-move
 * @event vmousemove
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-over or touch-start if went over coordinates
 * @event vmouseover
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-out or touch-end
 * @event vmouseout
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-cancel or touch-cancel and when scroll occur during touchmove
 * @event vmousecancel
 * @member ns.event.vmouse
 */
(function (window, document, ns) {
	"use strict";
				/**
			 * Object with default options
			 * @property {Object} vmouse
			 * @member ns.event.vmouse
			 * @static
			 * @private
			 **/
			var vmouse,
				/**
				 * @property {Object} eventProps Contains the properties which are copied from the original event to custom v-events
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				eventProps,
				/**
				 * Indicates if the browser support touch events
				 * @property {boolean} touchSupport
				 * @member ns.event.vmouse
				 * @static
				 **/
				touchSupport = window.hasOwnProperty("ontouchstart"),
				/**
				 * @property {boolean} didScroll The flag tell us if the scroll event was triggered
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				didScroll,
				/** @property {HTMLElement} lastOver holds reference to last element that touch was over
				 * @member ns.event.vmouse
				 * @private
				 */
				lastOver = null,
				/**
				 * @property {Number} [startX=0] Initial data for touchstart event
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				startX = 0,
				/**
				 * @property {Number} [startY=0] Initial data for touchstart event
				 * @member ns.event.vmouse
				 * @private
				 * @static
				 **/
				startY = 0,
				touchEventProps = ["clientX", "clientY", "pageX", "pageY", "screenX", "screenY"],
				KEY_CODES = {
					enter: 13
				};

			/**
			 * Extends objects with other objects
			 * @method copyProps
			 * @param {Object} from Sets the original event
			 * @param {Object} to Sets the new event
			 * @param {Object} properties Sets the special properties for position
			 * @param {Object} propertiesNames Describe parameters which will be copied from Original to To event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function copyProps(from, to, properties, propertiesNames) {
				var i,
					length,
					descriptor,
					property;

				for (i = 0, length = propertiesNames.length; i < length; ++i) {
					property = propertiesNames[i];
					if (isNaN(properties[property]) === false || isNaN(from[property]) === false) {
						descriptor = Object.getOwnPropertyDescriptor(to, property);
						if (property !== "detail" && (!descriptor || descriptor.writable)) {
							to[property] = properties[property] || from[property];
						}
					}
				}
			}

			/**
			 * Create custom event
			 * @method createEvent
			 * @param {string} newType gives a name for the new Type of event
			 * @param {Event} original Event which trigger the new event
			 * @param {Object} properties Sets the special properties for position
			 * @return {Event}
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function createEvent(newType, original, properties) {
				var evt = new CustomEvent(newType, {
						"bubbles": original.bubbles,
						"cancelable": original.cancelable,
						"detail": original.detail
					}),
					orginalType = original.type,
					changeTouches,
					touch,
					j = 0,
					len,
					prop;

				copyProps(original, evt, properties, eventProps);
				evt._originalEvent = original;

				if (orginalType.indexOf("touch") !== -1) {
					orginalType = original.touches;
					changeTouches = original.changedTouches;

					if (orginalType && orginalType.length) {
						touch = orginalType[0];
					} else {
						touch = (changeTouches && changeTouches.length) ? changeTouches[0] : null;
					}

					if (touch) {
						for (len = touchEventProps.length; j < len; j++) {
							prop = touchEventProps[j];
							evt[prop] = touch[prop];
						}
					}
				}

				return evt;
			}

			/**
			 * Dispatch Events
			 * @method fireEvent
			 * @param {string} eventName event name
			 * @param {Event} evt original event
			 * @param {Object} [properties] Sets the special properties for position
			 * @return {boolean}
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function fireEvent(eventName, evt, properties) {
				return evt.target.dispatchEvent(createEvent(eventName, evt, properties || {}));
			}

			eventProps = [
				"currentTarget",
				"detail",
				"button",
				"buttons",
				"clientX",
				"clientY",
				"offsetX",
				"offsetY",
				"pageX",
				"pageY",
				"screenX",
				"screenY",
				"toElement",
				"which"
			];

			vmouse = {
				/**
				 * Sets the distance of pixels after which the scroll event will be successful
				 * @property {number} [eventDistanceThreshold=10]
				 * @member ns.event.vmouse
				 * @static
				 */
				eventDistanceThreshold: 10,

				touchSupport: touchSupport
			};

			/**
			 * Handle click down
			 * @method handleDown
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleDown(evt) {
				fireEvent("vmousedown", evt);
			}

			/**
			 * Prepare position of event for keyboard events.
			 * @method preparePositionForClick
			 * @param {Event} event
			 * @return {?Object} options
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function preparePositionForClick(event) {
				var x = event.clientX,
					y = event.clientY;
				// event comes from keyboard
				if (!x && !y) {
					return preparePositionForEvent(event);
				}
			}

			/**
			 * Handle click
			 * @method handleClick
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleClick(evt) {
				fireEvent("vclick", evt, preparePositionForClick(evt));
			}

			/**
			 * Handle click up
			 * @method handleUp
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleUp(evt) {
				fireEvent("vmouseup", evt);
			}

			/**
			 * Handle click move
			 * @method handleMove
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleMove(evt) {
				fireEvent("vmousemove", evt);
			}

			/**
			 * Handle click over
			 * @method handleOver
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleOver(evt) {
				fireEvent("vmouseover", evt);
			}

			/**
			 * Handle click out
			 * @method handleOut
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleOut(evt) {
				fireEvent("vmouseout", evt);
			}

			/**
			 * Handle touch start
			 * @method handleTouchStart
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchStart(evt) {
				var touches = evt.touches,
					firstTouch,
					over;
				//if touches are registered and we have only one touch
				if (touches && touches.length === 1) {
					didScroll = false;
					firstTouch = touches[0];
					startX = firstTouch.pageX;
					startY = firstTouch.pageY;

					// Check if we have touched something on our page
					// @TODO refactor for multi touch
					over = document.elementFromPoint(startX, startY);
					if (over) {
						lastOver = over;
						fireEvent("vmouseover", evt);
					}
					fireEvent("vmousedown", evt);
				}

			}

			/**
			 * Handle touch end
			 * @method handleTouchEnd
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchEnd(evt) {
				var touches = evt.touches;
				if (touches && touches.length === 0) {
					fireEvent("vmouseup", evt);
					fireEvent("vmouseout", evt);
					// Reset flag for last over element
					lastOver = null;
				}
			}

			/**
			 * Handle touch move
			 * @method handleTouchMove
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchMove(evt) {
				var over,
					firstTouch = evt.touches && evt.touches[0],
					didCancel = didScroll,
				//sets the threshold, based on which we consider if it was the touch-move event
					moveThreshold = vmouse.eventDistanceThreshold;

				/**
				 * Ignore the touch which has identifier other than 0.
				 * Only first touch has control others are ignored.
				 * Patch for webkit behaviour where touchmove event
				 * is triggered between touchend events
				 * if there is multi touch.
				 */
				if (firstTouch.identifier > 0) {
					evt.preventDefault();
					evt.stopPropagation();
					return;
				}

				didScroll = didScroll ||
					//check in both axes X,Y if the touch-move event occur
					(Math.abs(firstTouch.pageX - startX) > moveThreshold ||
						Math.abs(firstTouch.pageY - startY) > moveThreshold);

				// detect over event
				// for compatibility with mouseover because "touchenter" fires only once
				// @TODO Handle many touches
				over = document.elementFromPoint(firstTouch.pageX, firstTouch.pageY);
				if (over && lastOver !== over) {
					lastOver = over;
					fireEvent("vmouseover", evt);
				}

				//if didscroll occur and wasn't canceled then trigger touchend otherwise just touchmove
				if (didScroll && !didCancel) {
					fireEvent("vmousecancel", evt);
					lastOver = null;
				}
				fireEvent("vmousemove", evt);
			}

			/**
			 * Handle Scroll
			 * @method handleScroll
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleScroll(evt) {
				if (!didScroll) {
					fireEvent("vmousecancel", evt);
				}
				didScroll = true;
			}

			/**
			 * Handle touch cancel
			 * @method handleTouchCancel
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchCancel(evt) {
				fireEvent("vmousecancel", evt);
				lastOver = null;
			}

			/**
			 * Prepare position of event for keyboard events.
			 * @method preparePositionForEvent
			 * @param {Event} event
			 * @return {Object} properties
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function preparePositionForEvent(event) {
				var targetRect = event.target && event.target.getBoundingClientRect(),
					properties = {};
				if (targetRect) {
					properties = {
						"clientX": targetRect.left + targetRect.width / 2,
						"clientY": targetRect.top + targetRect.height / 2,
						"which": 1
					};
				}
				return properties;
			}

			/**
			 * Handle key up
			 * @method handleKeyUp
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleKeyUp(event) {
				var properties;
				if (event.keyCode === KEY_CODES.enter) {
					properties = preparePositionForEvent(event);
					fireEvent("vmouseup", event, properties);
					fireEvent("vclick", event, properties);
				}
			}

			/**
			 * Handle key down
			 * @method handleKeyDown
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleKeyDown(event) {
				if (event.keyCode === KEY_CODES.enter) {
					fireEvent("vmousedown", event, preparePositionForEvent(event));
				}
			}

			/**
			 * Binds events common to mouse and touch to support virtual mouse.
			 * @method bindCommonEvents
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindCommonEvents = function () {
				document.addEventListener("keyup", handleKeyUp, true);
				document.addEventListener("keydown", handleKeyDown, true);
				document.addEventListener("scroll", handleScroll, true);
				document.addEventListener("click", handleClick, true);
			};

			// @TODO delete touchSupport flag and attach touch and mouse listeners,
			// @TODO check if v-events are not duplicated if so then called only once

			/**
			 * Binds touch events to support virtual mouse.
			 * @method bindTouch
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindTouch = function () {
				document.addEventListener("touchstart", handleTouchStart, true);
				document.addEventListener("touchend", handleTouchEnd, true);
				document.addEventListener("touchmove", handleTouchMove, true);
				document.addEventListener("touchcancel", handleTouchCancel, true);

				// touchenter and touchleave are removed from W3C spec
				// No need to listen to touchover as it has never exited
				// document.addEventListener("touchenter", handleTouchOver, true);
				// document.addEventListener("touchleave", callbacks.out, true);
				document.addEventListener("touchcancel", handleTouchCancel, true);
			};

			/**
			 * Binds mouse events to support virtual mouse.
			 * @method bindMouse
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindMouse = function () {
				document.addEventListener("mousedown", handleDown, true);

				document.addEventListener("mouseup", handleUp, true);
				document.addEventListener("mousemove", handleMove, true);
				document.addEventListener("mouseover", handleOver, true);
				document.addEventListener("mouseout", handleOut, true);
			};

			ns.event.vmouse = vmouse;

			if (touchSupport) {
				vmouse.bindTouch();
			} else {
				vmouse.bindMouse();
			}
			vmouse.bindCommonEvents();

			}(window, window.document, ns));
/*global window, define */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Easing Utility
 * Utility calculates time function for animations.
 * @class ns.util.easing
 */

(function (ns) {
	"use strict";
				ns.util.easing = {
				/**
				* Performs cubit out easing calcuclations based on time
				* @method cubicOut
				* @member ns.util.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				cubicOut: function (currentTime, startValue, changeInValue, duration) {
					currentTime /= duration;
					currentTime--;
					return changeInValue * (currentTime * currentTime * currentTime + 1) + startValue;
				},

				/**
				 * Performs quad easing out calcuclations based on time
				 * @method easeOutQuad
				 * @member ns.util.easing
				 * @param {number} currentTime
				 * @param {number} startValue
				 * @param {number} changeInValue
				 * @param {number} duration
				 * @return {number}
				 * @static
				 */
				easeOutQuad: function (currentTime, startValue, changeInValue, duration) {
					return -changeInValue * (currentTime /= duration) * (currentTime - 2) + startValue;
				},

				/**
				* Performs out expo easing calcuclations based on time
				* @method easeOutExpo
				* @member ns.util.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				easeOutExpo: function (currentTime, startValue, changeInValue, duration) {
					return (currentTime === duration) ?
							startValue + changeInValue :
								changeInValue * (-Math.pow(2, -10 * currentTime / duration) + 1) +
								startValue;
				},
				/**
				* Performs out linear calcuclations based on time
				* @method linear
				* @member ns.util.easing
				* @param {number} currentTime
				* @param {number} startValue
				* @param {number} changeInValue
				* @param {number} duration
				* @return {number}
				* @static
				*/
				linear: function (currentTime, startValue, changeInValue, duration) {
					return startValue + duration * currentTime;
				}
			};
			}(ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Event orientationchange
 * Namespace to support orientationchange event
 * @class ns.event.orientationchange
 */
/**
 * Event orientationchange
 * @event orientationchange
 * @member ns.event.orientationchange
 */
(function (window, document, ns) {
	"use strict";
				var body = document.body,
				orientation = null,
				eventUtils = ns.event,
				orientationchange = {
					/**
					 * Informs about support orientation change event.
					 * @property {boolean} supported
					 * @member ns.event.orientationchange
					 */
					supported: (window.orientation !== undefined) && (window.onorientationchange !== undefined),
					/**
					 * Returns current orientation.
					 * @method getOrientation
					 * @return {"landscape"|"portrait"}
					 * @member ns.event.orientationchange
					 * @static
					 */
					getOrientation: function () {
						return orientation;
					},
					/**
					 * Triggers event orientationchange on element
					 * @method trigger
					 * @param {HTMLElement} element
					 * @member ns.event.orientationchange
					 * @static
					 */
					trigger: function (element) {
						eventUtils.trigger(element, "orientationchange", {'orientation': orientation});
					},
					/**
					 * List of properties copied to event details object
					 * @property {Array} properties
					 * @member ns.event.orientationchange
					 * @static
					 */
					properties: ['orientation']
				},
				detectOrientationByDimensions = function (omitCustomEvent) {
					var width = window.innerWidth,
						height = window.innerHeight;
					if (window.screen) {
						width = window.screen.availWidth;
						height = window.screen.availHeight;
					}

					if (width > height) {
						orientation = "landscape";
					} else {
						orientation = "portrait";
					}

					if (!omitCustomEvent) {
						eventUtils.trigger(window, "orientationchange", {'orientation': orientation});
					}
				},
				checkReportedOrientation = function () {
					if (window.orientation) {
						switch (window.orientation) {
						case 90:
						case -90:
							orientation = "portrait";
							break;
						default:
							orientation = "landscape";
							break;
						}
					} else {
						detectOrientationByDimensions(true);
					}
				},
				matchMediaHandler = function (mediaQueryList) {
					if (mediaQueryList.matches) {
						orientation = "portrait";
					} else {
						orientation = "landscape";
					}
					eventUtils.trigger(window, "orientationchange", {'orientation': orientation});
				},
				portraitMatchMediaQueryList;

			if (orientationchange.supported) {
				window.addEventListener("orientationchange", checkReportedOrientation, false);
				checkReportedOrientation();
				// try media queries
			} else {
				if (window.matchMedia) {
					portraitMatchMediaQueryList = window.matchMedia("(orientation: portrait)");
					if (portraitMatchMediaQueryList.matches) {
						orientation = "portrait";
					} else {
						orientation = "landscape";
					}
					portraitMatchMediaQueryList.addListener(matchMediaHandler);
				} else {
					body.addEventListener("throttledresize", detectOrientationByDimensions);
					detectOrientationByDimensions();
				}
			}

			ns.event.orientationchange = orientationchange;

			}(window, window.document, ns));

/*global window, define, ns*/
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * # ScrollView Widget
 * Widgets allows for creating scrollable panes, lists, etc.
 *
 * ## Default selectors
 * All elements with _data-role=content attribute or _.ui-scrollview
 * css class will be changed to ScrollView widgets, unless they specify
 * _data-scroll=none attribute.
 *
 * ### HTML Examples
 *
 * #### Data attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content"><!-- this will become scrollview //-->
 *				content data
 *			</div>
 *		</div>
 *
 * #### CSS Class
 *
 *		@example
 *		<div data-role="page">
 *			<div class="ui-content"><!-- this will become scrollview //-->
 *				content data
 *			</div>
 *		</div>
 *
 * ## Manual constructor
 *
 * To create the widget manually you can use 2 different APIs, the TAU
 * API or jQuery API.
 *
 * ### Create scrollview by TAU API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				page content
 *			</div>
 *		</div>
 *		<script>
 *			var page = tau.widget.Page(document.getElementById("myPage")),
 *				scrollview = tau.widget.Scrollview(page.ui.content);
 *		</script>
 *
 * ### Create scrollview using jQuery API
 *
 *		@example
 *		<div data-role="page" id="myPage">
 *			<div data-role="content">
 *				page content
 *			</div>
 *		</div>
 *		<script>
 *			$("#myPage > div[data-role='content']").scrollview();
 *		</script>
 *
 * ## Options for Scrollview widget
 *
 * Options can be set using data-* attributes or by passing them to
 * the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * jQuery mobile format is also supported.
 *
 * ## Scroll
 *
 * This options specifies of a content element should become Scrollview
 * widget.
 *
 * You can change this by all available methods for changing options.
 *
 * ### By data-scroll attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content" data-scroll="none">
 *				content
 *			</div>
 *		</div>
 *
 * ### By config passed to constructor
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			var contentElement = document.querySelector(".myPageClass > div[data-role=content]");
 *			tau.widget.Scrollview(contentElement, {
 *				"scroll": false
 *			});
 *		</script>
 *
 * ### By using jQuery API
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			$(".myPageClass > div[data-role='content']").scrollview({
 *				"scroll": false
 *			});
 *		</script>
 *
 * ## ScrollJumps
 *
 * Scroll jumps are small buttons which allow the user to quickly
 * scroll to top or left
 *
 * You can change this by all available methods for changing options.
 *
 * ### By data-scroll-jump
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content" data-scroll-jump="true">
 *				content
 *			</div>
 *		</div>
 *
 * ### By config passed to constructor
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			var contentElement = document.querySelector(".myPageClass > div[data-role=content]");
 *			tau.widget.Scrollview(contentElement, {
 *				"scrollJump": true
 *			});
 *		</script>
 *
 * ### By using jQuery API
 *
 *		@example
 *		<div class="myPageClass" data-role="page">
 *			<div data-role="content">
 *				content
 *			</div>
 *		</div>
 *		<script>
 *			$(".myPageClass > div[data-role='content']").scrollview({
 *				"scrollJump": true
 *			});
 *		</script>
 *
 * ## Methods
 *
 * Page methods can be called trough 2 APIs: TAU API and jQuery API
 * (jQuery mobile-like API)
 *
 * @class ns.widget.core.Scrollview
 * @extends ns.widget.BaseWidget
 *
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Grzegorz Osimowicz <g.osimowicz@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 */
/**
 * Triggered when scrolling operation starts
 * @event scrollstart
 * @member ns.widget.core.Scrollview
 */
/**
 * Triggered when scroll is being updated
 * @event scrollupdate
 * @member ns.widget.core.Scrollview
 */
/**
 * Triggered when scrolling stops
 * @event scrollstop
 * @member ns.widget.core.Scrollview
 */
(function (window, document, ns) {
	"use strict";
				var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				util = ns.util,
				easingUtils = ns.util.easing,
				eventUtils = ns.event,
				DOMUtils = ns.util.DOM,
				selectors = ns.util.selectors,
				currentTransition = null,
				Page = ns.widget.core.Page,
				pageClass = Page.classes.uiPage,
				pageActiveClass = Page.classes.uiPageActive,
				Scrollview = function () {
					var self = this,
						ui;
					/**
					 * @property {Object} state Scrollview internal state object
					 * @property {Function} state.currentTransition Instance transition function
					 * @readonly
					 */
					self.state = {
						currentTransition: null
					};
					/**
					 * @property {number} scrollDuration The time length of the scroll animation
					 * @member ns.widget.core.Scrollview
					 */
					self.scrollDuration = 300;
					self.scrollviewSetHeight = false;
					/**
					 * Scrollview options
					 * @property {Object} options
					 * @property {string} [options.scroll='y'] Scroll direction
					 * @property {boolean} [options.scrollJump=false] Scroll jump buttons flag
					 * @member ns.widget.core.Scrollview
					 */
					self.options = {
						scroll: "y",
						scrollJump: false,
						scrollIndicator: false
					};
					/**
					 * Dictionary for holding internal DOM elements
					 * @property {Object} ui
					 * @property {HTMLElement} ui.view The main view element
					 * @property {HTMLElement} ui.page The main page element
					 * @property {HTMLElement} ui.jumpHorizontalButton Jump left button
					 * @property {HTMLElement} ui.jumpVerticalButton Jump top button
					 * @member ns.widget.core.Scrollview
					 * @readonly
					 */
					ui = self._ui || {};
					ui.view = null;
					ui.page = null;
					ui.jumpHorizontalButton = null;
					ui.jumpVerticalButton = null;
					self._ui = ui;
					/**
					 * Dictionary for holding internal listeners
					 * @property {Object} _callbacks
					 * @property {Function} _callbacks.repositionJumps Refresh jumps listener
					 * @property {Function} _callbacks.jumpTop Top jump button click callback
					 * @property {Function} _callbacks.jumpLeft Left jump button click callback
					 * @member ns.widget.core.Scrollview
					 * @protected
					 * @readonly
					 */
					self._callbacks = {
						repositionJumps: null,
						jumpTop: null,
						jumpBottom: null
					};

					self._timers = {
						scrollIndicatorHide: null
					};
				},
				/**
				 * Dictionary for scrollview css classes
				 * @property {Object} classes
				 * @property {string} [classes.view='ui-scrollview-view'] View main class
				 * @property {string} [classes.clip='ui-scrollview-clip'] Clip main class
				 * @property {string} [classes.jumpTop='ui-scroll-jump-top-bg'] Jump top button background
				 * @property {string} [classes.jumpLeft='ui-scroll-jump-left-bg'] Jump bottom button background
				 * @member ns.widget.core.Scrollview
				 * @static
				 * @readonly
				 */
				classes =  {
					view: "ui-scrollview-view",
					clip: "ui-scrollview-clip",
					jumpTop: "ui-scroll-jump-top-bg",
					jumpLeft: "ui-scroll-jump-left-bg",
					indicatorTop: "ui-overflow-indicator-top",
					indicatorBottom: "ui-overflow-indicator-bottom",
					indicatorTopShown: "ui-scrollindicator-top",
					indicatorBottomShown: "ui-scrollindicator-bottom",
					indicatorLeftShown: "ui-scrollindicator-left",
					indicatorRightShown: "ui-scrollindicator-right"
				};

			// Changes static position to relative
			// @param {HTMLElement} view
			function makePositioned(view) {
				if (DOMUtils.getCSSProperty(view, "position") === "static") {
					view.style.position = "relative";
				} else {
					view.style.position = "absolute";
				}
			}

			// Translation animation loop
			// @param {Object} state Scrollview instance state
			// @param {HTMLElement} element
			// @param {number} startTime
			// @param {number} startX
			// @param {number} startY
			// @param {number} translateX
			// @param {number} translateY
			// @param {number} endX
			// @param {number} endY
			// @param {number} duration
			function translateTransition(state, element, startTime, startX, startY, translateX, translateY, endX, endY, duration) {
				var timestamp = (new Date()).getTime() - startTime,
					newX = parseInt(easingUtils.cubicOut(timestamp, startX, translateX, duration), 10),
					newY = parseInt(easingUtils.cubicOut(timestamp, startY, translateY, duration), 10);
				if (element.scrollLeft !== endX) {
					element.scrollLeft = newX;
				}
				if (element.scrollTop !== endY) {
					element.scrollTop = newY;
				}

				if ((newX !== endX || newY !== endY) &&
						(newX >= 0 && newY >= 0) &&
						state.currentTransition) {
					util.requestAnimationFrame(state.currentTransition);
				} else {
					state.currentTransition = null;
				}
			}

			// Translates scroll posotion directly or with an animation
			// if duration is specified
			// @param {Object} state Scrollview instance state
			// @param {HTMLElement} element
			// @param {number} x
			// @param {number} y
			// @param {number=} [duration]
			function translate(state, element, x, y, duration) {
				if (duration) {
					state.currentTransition = translateTransition.bind(
						null,
						state,
						element,
						(new Date()).getTime(),
						element.scrollLeft,
						element.scrollTop,
						x,
						y,
						element.scrollLeft + x,
						element.scrollTop + y,
						duration
					);
					util.requestAnimationFrame(state.currentTransition);
				} else {
					if (x) {
						element.scrollLeft = element.scrollLeft + x;
					}
					if (y) {
						element.scrollTop = element.scrollTop + y;
					}
				}
			}

			// Refresh jumpTop jumpLeft buttons
			// @param {ns.widget.core.Scrollview} self
			function repositionJumps(self) {
				var ui = self._ui,
					horizontalJumpButton = ui.jumpHorizontalButton,
					verticalJumpButton = ui.jumpVerticalButton,
					offsets = horizontalJumpButton || verticalJumpButton ? DOMUtils.getElementOffset(self.element) : null; // dont calc when not used

				if (horizontalJumpButton) {
					horizontalJumpButton.style.left = offsets.left + "px";
				}

				if (verticalJumpButton) {
					verticalJumpButton.style.top = offsets.top + "px";
				}
			}

			Scrollview.classes = classes;

			Scrollview.prototype = new BaseWidget();

			/**
			 * Builds the widget
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @method _build
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._build = function (element) {
				//@TODO wrap element's content with external function
				var self = this,
					ui = self._ui,
					view = selectors.getChildrenByClass(element, classes.view)[0] || document.createElement("div"),
					clipStyle = element.style,
					node = null,
					child = element.firstChild,
					options = self.options,
					direction = options.scroll,
					jumpButton,
					jumpBackground;
				view.className = classes.view;

				while (child) {
					node = child;
					child = child.nextSibling;
					if (view !== node) {
						view.appendChild(node);
					}
				}

				if (view.parentNode !== element) {
					element.appendChild(view);
				}

				// setting view style
				makePositioned(view);

				element.classList.add(classes.clip);

				switch (direction) {
					case "x":
						clipStyle.overflowX = "scroll";
						break;
					case "xy":
						clipStyle.overflow = "scroll";
						break;
					default:
						clipStyle.overflowY = "auto";
						break;
				}

				if (options.scrollJump) {
					if (direction.indexOf("x") > -1) {
						jumpBackground = document.createElement("div");
						jumpBackground.className = classes.jumpLeft;
						jumpButton = document.createElement("div");

						jumpBackground.appendChild(jumpButton);
						element.appendChild(jumpBackground);
						engine.instanceWidget(
							jumpButton,
							"Button",
							{
								"icon": "scrollleft",
								"style": "box"
							}
						);
						ui.jumpHorizontalButton = jumpBackground;
					}

					if (direction.indexOf("y") > -1) {
						jumpBackground = document.createElement("div");
						jumpBackground.className = classes.jumpTop;
						jumpButton = document.createElement("div");

						jumpBackground.appendChild(jumpButton);
						element.appendChild(jumpBackground);
						engine.instanceWidget(
							jumpButton,
							"Button",
							{
								"icon": "scrolltop",
								"style": "box"
							}
						);
						ui.jumpVerticalButton = jumpBackground;
					}
				}

				ui.view = view;

				// add scroll indicators
				if (options.scrollIndicator) {
					self._addOverflowIndicator(element);
				}

				return element;
			};

			/**
			 * Inits widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._init = function (element) {
				var ui = this._ui,
					page = ui.page;

				if (!ui.view) {
					ui.view = selectors.getChildrenByClass(element, classes.view)[0];
				}

				if (!page) {
					page = selectors.getClosestByClass(element, pageClass);
					if (page) {
						ui.page = page;
						if (page.classList.contains(pageActiveClass) && this.options.scrollJump) {
							repositionJumps(this);
						}
					}
				}
			};

			/**
			 * Adds overflow indicators
			 * @param {HTMLElement} clip
			 * @method _addOverflowIndicator
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._addOverflowIndicator = function (clip) {
				clip.insertAdjacentHTML("beforeend",
					"<div class='" + classes.indicatorTop + "'></div><div class='" + classes.indicatorBottom + "'></div>");
			};

			/**
			 * Clear classes and styles of indicators
			 * @param {HTMLElement} element
			 * @method clearIndicator
			 * @private
			 * @member ns.widget.core.Scrollview
			 */
			function clearIndicator (element) {
				var clipClasses = element.classList,
					topIndicator = selectors.getChildrenByClass(element, classes.indicatorTop)[0],
					bottomIndicator = selectors.getChildrenByClass(element, classes.indicatorBottom)[0];

				clipClasses.remove(classes.indicatorTopShown);
				clipClasses.remove(classes.indicatorBottomShown);
				clipClasses.remove(classes.indicatorRightShown);
				clipClasses.remove(classes.indicatorLeftShown);
				topIndicator.style = "";
				bottomIndicator.style = "";
			}

			/**
			 * Set top and bottom indicators
			 * @param {HTMLElement} clip
			 * @param {object} options
			 * @method setTopAndBottomIndicators
			 * @private
			 * @member ns.widget.core.Scrollview
			 */
			function setTopAndBottomIndicators (clip, options) {
				var topIndicator = selectors.getChildrenByClass(clip, classes.indicatorTop)[0],
					bottomIndicator = selectors.getChildrenByClass(clip, classes.indicatorBottom)[0],
					style;

				// set top indicator
				if (topIndicator) {
					style = topIndicator.style;
					style.width = options.width + "px";
					style.top = options.clipTop + "px";
					style.backgroundColor = options.color;
				}
				if (bottomIndicator) {
					// set bottom indicator
					style = bottomIndicator.style;
					style.width = options.width + "px";
					style.top = options.clipTop + options.clipHeight - DOMUtils.getElementHeight(bottomIndicator) + "px";
					style.backgroundColor = options.color;
				}
			}

			/**
			 * Show scroll indicators.
			 * @method _showScrollIndicator
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._showScrollIndicator = function () {
				var self = this,
					clip = self.element,
					view = self._ui.view,
					scrollTop = clip.scrollTop,
					clipHeight = DOMUtils.getElementHeight(clip),
					clipOffset = DOMUtils.getElementOffset(clip),
					viewHeight = DOMUtils.getElementHeight(view),
					viewWidth = DOMUtils.getElementWidth(view),
					viewOffset = DOMUtils.getElementOffset(view);

				clearIndicator(clip);

				switch (self.options.scroll) {
					case "x":
						// @todo
						break;
					case "xy":
						// @todo
						break;
					default:
						setTopAndBottomIndicators(clip, {
							clipTop: clipOffset.top,
							clipHeight: clipHeight,
							width: viewWidth,
							color: window.getComputedStyle(clip).backgroundColor
						});
						if (viewOffset.top - scrollTop < clipOffset.top) {
							// the top is not visible
							clip.classList.add(classes.indicatorTopShown);
						}
						if (viewOffset.top - scrollTop + viewHeight > clipOffset.top + clipHeight) {
							// the bottom is not visible
							clip.classList.add(classes.indicatorBottomShown);
						}
				}
			};

			/**
			 * Hide scroll indicators.
			 * @method _hideScrollIndicator
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._hideScrollIndicator = function () {
				var self = this,
					timers = self._timers,
					timer = timers.scrollIndicatorHide;

				if (timer) {
					window.clearTimeout(timer);
				}
				timers.scrollIndicatorHide = window.setTimeout(function () {
					clearIndicator(self.element);
				}, 1500);
			};

			/**
			 * Scrolls to specified position
			 *
			 * ### Example usage with TAU API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]"));
			 *			scrollview.scrollTo(0, 200, 1000); // scroll to 200px vertical with 1s animation
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]"));
			 *			element.scrollview();
			 *			element.scrollview("scrollTo", 0, 200, 1000); // scroll to 200px vertical with 1s animation
			 *		</script>
			 *
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @method scrollTo
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.scrollTo = function (x, y, duration) {
				var element = this.element;
				this.translateTo(x - element.scrollLeft, y - element.scrollTop, duration);
			};

			/**
			 * Translates the scroll to specified position
			 *
			 * ### Example usage with TAU API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]"));
			 *			scrollview.translateTo(0, 200, 1000); // scroll forward 200px in vertical direction with 1s animation
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]"));
			 *			element.scrollview();
			 *			element.scrollview("translateTo", 0, 200, 1000); // scroll forward 200px in vertical direction with 1s animation
			 *		</script>
			 *
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @method translateTo
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.translateTo = function (x, y, duration) {
				translate(this.state, this.element, x, y, duration);
			};

			/**
			 * Ensures that specified element is visible in the
			 * clip area
			 *
			 * ### Example usage with TAU API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *				<div class="testElementClass">somedata</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *				testElement = document.querySelector(".testElementClass");
			 *			scrollview.ensureElementIsVisible(testelement);
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *				<div class="testElementClass">somedata</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]")),
			 *				testElement = $(".testElementClass");
			 *			element.scrollview();
			 *			element.scrollview("ensureElementIsVisible", testElement);
			 *		</script>
			 *
			 * @param {HTMLElement} element
			 * @method ensureElementIsVisible
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.ensureElementIsVisible = function (element) {
				var clip = this.element,
					clipHeight = DOMUtils.getElementHeight(clip),
					clipWidth = DOMUtils.getElementWidth(clip),
					clipTop = 0,
					clipBottom = clipHeight,
					elementHeight = DOMUtils.getElementHeight(element),
					elementWidth = DOMUtils.getElementWidth(element),
					elementTop = 0,
					elementBottom,
					elementFits = clipHeight >= elementHeight && clipWidth >= elementWidth,
					anchor,
					anchorPositionX,
					anchorPositionY,
					parent,
					findPositionAnchor = function (input) {
						var id = input.getAttribute("id"),
							tagName = input.tagName.toLowerCase();
						if (id && ["input", "textarea", "button"].indexOf(tagName) > -1) {
							return input.parentNode.querySelector("label[for=" + id + "]");
						}
					},
					_true = true;

				parent = element.parentNode;
				while (parent && parent !== clip) {
					elementTop += parent.offsetTop;
					//elementLeft += parent.offsetLeft;
					parent = parent.parentNode;
				}
				elementBottom = elementTop + elementHeight;
				//elementRight = elementLeft + elementWidth;

				switch (_true) {
					case elementFits && clipTop < elementTop && clipBottom > elementBottom: // element fits in view is inside clip area
						// pass, element position is ok
						break;
					case elementFits && clipTop < elementTop && clipBottom < elementBottom: // element fits in view but its visible only at top
					case elementFits && clipTop > elementTop && clipBottom > elementBottom: // element fits in view but its visible only at bottom
					case elementFits: // element fits in view but is not visible
						this.centerToElement(element);
						break;
					case clipTop < elementTop && elementTop < clipBottom && clipBottom < elementBottom: // element visible only at top; eg. partly visible textarea
					case clipTop > elementTop && clipBottom > elementBottom: // element visible only at bottom
						// pass, we cant do anything, if we move the scroll
						// the user could lost view of something he scrolled to
						break;
					default: // element is not visible
						anchor = findPositionAnchor(element);
						if (!anchor) {
							anchor = element;
						}
						anchorPositionX = anchor.offsetLeft + DOMUtils.getCSSProperty(anchor, "margin-left", 0, "integer");
						anchorPositionY = anchor.offsetTop + DOMUtils.getCSSProperty(anchor, "margin-top", 0, "integer");
						parent = anchor.parentNode;
						while (parent && parent !== clip) {
							anchorPositionX += parent.offsetLeft;
							anchorPositionY += parent.offsetTop;
							parent = parent.parentNode;
						}
						this.scrollTo(anchorPositionX, anchorPositionY, this.scrollDuration);
						break;
				}
			};

			/**
			 * Centers specified element in the clip area
			 *
			 * ### Example usage with TAU API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *				<div class="testElementClass">somedata</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *				testElement = document.querySelector(".testElementClass");
			 *			scrollview.centerToElement(testelement);
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *				<div class="testElementClass">somedata</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]")),
			 *				testElement = $(".testElementClass");
			 *			element.scrollview();
			 *			element.scrollview("centerToElement", testElement);
			 *		</script>
			 *
			 * @param {HTMLElement} element
			 * @method centerToElement
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.centerToElement = function (element) {
				var clip = this.element,
					deltaX = parseInt(DOMUtils.getElementWidth(clip) / 2 - DOMUtils.getElementWidth(element) / 2, 10),
					deltaY = parseInt(DOMUtils.getElementHeight(clip) / 2 - DOMUtils.getElementHeight(element) / 2, 10),
					elementPositionX = element.offsetLeft,
					elementPositionY = element.offsetTop,
					parent = element.parentNode;

				while (parent && parent !== clip) {
					elementPositionX += parent.offsetLeft + DOMUtils.getCSSProperty(parent, "margin-left", 0, "integer");
					elementPositionY += parent.offsetTop + DOMUtils.getCSSProperty(parent, "margin-top", 0, "integer");
					parent = parent.parentNode;
				}
				this.scrollTo(elementPositionX - deltaX, elementPositionY - deltaY, this.scrollDuration);
			};

			/**
			 * This is just for compatibility
			 * @method skipDragging
			 * @member ns.widget.core.Scrollview
			 * @deprecated 2.3
			 */
			Scrollview.prototype.skipDragging = function () {
				if (ns.warn) {
					ns.warn("ns.widget.core.Scrollview: skipDragging is deprecated");
				}
			}; // just for TWEBUIFW compat

			/**
			 * Returns scroll current position
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *				currentPosition = scrollview.getScrollPosition();
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]")),
			 *				position;
			 *			element.scrollview();
			 *			position = element.scrollview("getScrollPosition");
			 *		</script>
			 *
			 * @return {Object}
			 * @method getScrollPosition
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.getScrollPosition = function () {
				var element = this.element;
				return {
					"x": element.scrollLeft,
					"y": element.scrollTop
				};
			};

			/**
			 * Binds scrollview events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._bindEvents = function (element) {
				var scrollTimer = null,
					view = element.children[0],
					lastClipHeight = DOMUtils.getElementHeight(element),
					lastClipWidth = DOMUtils.getElementWidth(element),
					notifyScrolled = function () {
						eventUtils.trigger(element, "scrollstop");
						window.clearTimeout(scrollTimer);
						scrollTimer = null;
					},
					self = this,
					//FIXME there should be some other way to get parent container
					ui = self._ui,
					page = ui.page,
					jumpTop = ui.jumpVerticalButton,
					jumpLeft = ui.jumpHorizontalButton,
					repositionJumpsCallback,
					jumpTopCallback,
					jumpLeftCallback,
					callbacks = self._callbacks;

				if (page) {
					if (this.options.scrollJump) {
						repositionJumpsCallback = repositionJumps.bind(null, this);
						jumpTopCallback = function () {
							self.scrollTo(element.scrollLeft, 0, 250);
						};
						jumpLeftCallback = function () {
							self.scrollTo(0, element.scrollTop, 250);
						};
						page.addEventListener("pageshow", repositionJumpsCallback, false);
						if (jumpTop) {
							jumpTop.firstChild.addEventListener("vclick", jumpTopCallback, false);
						}
						if (jumpLeft) {
							jumpLeft.firstChild.addEventListener("vclick", jumpLeftCallback, false);
						}

						callbacks.repositionJumps = repositionJumpsCallback;
						callbacks.jumpTop = jumpTopCallback;
						callbacks.jumpLeft = jumpLeftCallback;
					}

					element.addEventListener("scroll", function () {
						if (scrollTimer) {
							window.clearTimeout(scrollTimer);
						} else {
							eventUtils.trigger(element, "scrollstart");
						}
						scrollTimer = window.setTimeout(notifyScrolled, 100);
						eventUtils.trigger(element, "scrollupdate");
					}, false);

					document.addEventListener("vmousedown", function () {
						if (currentTransition) {
							currentTransition = null;
						}
					}, false);

					if (self.options.scrollIndicator) {
						callbacks.scrollUpdate = self._showScrollIndicator.bind(self);
						element.addEventListener("scrollupdate", callbacks.scrollUpdate , false);
						callbacks.scrollStop = self._hideScrollIndicator.bind(self);
						element.addEventListener("scrollstop", callbacks.scrollStop , false);
					}

				}
			};

			Scrollview.prototype._destroy = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					page = ui.page,
					scrollJump = this.options.scrollJump,
					jumpTop = ui.jumpVerticalButton,
					jumpLeft = ui.jumpHorizontalButton,
					callbacks = self._callbacks,
					repositionJumpsCallback = callbacks.repositionJumps,
					jumpTopCallback = callbacks.jumpTop,
					jumpLeftCallback = callbacks.jumpLeft;

				if (scrollJump) {
					if (page && repositionJumpsCallback) {
						page.removeEventListener("pageshow", repositionJumpsCallback, false);
					}
					if (jumpTop && jumpTopCallback) {
						jumpTop.firstChild.removeEventListener("vclick", jumpTopCallback, false);
					}
					if (jumpLeft && jumpLeftCallback) {
						jumpLeft.firstChild.removeEventListener("vclick", jumpLeftCallback, false);
					}
				}

				if (self.options.scrollIndicator) {
					element.removeEventListener("scrollupdate", callbacks.scrollUpdate , false);
				}

				if (self._timers.scrollIndicatorHide) {
					window.clearTimeout(self._timers.scrollIndicatorHide);
				}

			};

			ns.widget.core.Scrollview = Scrollview;
			}(window, window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * @class ns.widget.mobile.Tab
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
				var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				events = ns.event,
				Tab = function () {
				},
				/**
				 * Object with class dictionary
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.Tab
				 * @readonly
				 */
				classes = {
				},
				CustomEvent = {
					TAB_CHANGE: "tabchange"
				},
				prototype = new BaseWidget();

			Tab.prototype = prototype;
			Tab.classes = classes;

			/**
			 * Set the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype._setActive = function(index) {
				var element = this.element;
				events.trigger(element, CustomEvent.TAB_CHANGE, {
					active: index
				});
			};
			/**
			 * Set the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype.setActive = function(index) {
				this._setActive(index);
			};

			/**
			 * Get the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype._getActive = function() {
				return this.options.active;
			};

			/**
			 * Get the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype.getActive = function() {
				return this._getActive();
			};

			ns.widget.core.Tab = Tab;
			engine.defineWidget(
				"Tab",
				"",
				["setActive", "getActive"],
				Tab,
				"tizen"
			);
			}(window.document, ns));

/*global window, define, Event, console */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * #TabIndicator Widget
 * Widget create tabs indicator.
 * @class ns.widget.core.TabIndicator
 * @since 2.3
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
				var Tab = ns.widget.core.Tab,
				engine = ns.engine,
				object = ns.util.object,

				TabIndicator = function() {
					this.tabSize = 0;
					this.width = 0;
				},

				TabPrototype = Tab.prototype,
				prototype = new Tab();

			TabIndicator.prototype = prototype;

			prototype._init = function(element) {
				var o = this.options;

				this.width = element.offsetWidth;
				element.classList.add( o.wrapperClass );
			};

			prototype._configure = function( ) {
				/**
				 * @property {Object} options Options for widget
				 * @property {number} [options.margin=2]
				 * @property {boolean} [options.triggerEvent=false]
				 * @property {string} [options.wrapperClass="ui-tab-indicator]
				 * @property {string} [options.itemClass="ui-tab-item"]
				 * @property {string} [options.activeClass="ui-tab-active"]
				 * @member ns.widget.core.TabIndicator
				 */
				object.merge(this.options, {
					margin: 4,
					triggerEvent: false,
					wrapperClass: "ui-tab-indicator",
					itemClass: "ui-tab-item",
					activeClass: "ui-tab-active",
					active: 0
				});
			};

			prototype._createIndicator = function() {
				var o = this.options,
					wrap = document.createDocumentFragment(),
					widthTable = [],
					margin = o.margin,
					i = 0,
					len = this.tabSize,
					width = this.width-margin*(len-1),
					std = Math.floor(width / len),
					remain = width % len,
					span, offset=0;

				for (i=0; i < len; i++) {
					widthTable[i] = std;
				}

				for ( i= Math.floor((len-remain)/2); remain > 0; i++, remain-- ) {
					widthTable[i] += 1;
				}

				for (i=0; i < len; i++) {
					span = document.createElement("span");
					span.classList.add( o.itemClass );
					span.style.width = widthTable[i] + "px";
					span.style.left = offset + "px";
					offset += widthTable[i] + margin;

					if ( i === o.active ) {
						span.classList.add( o.activeClass );
					}
					wrap.appendChild(span);
				}

				this.element.appendChild( wrap );
			};

			prototype._removeIndicator = function() {
				this.element.innerHTML = "";
			};

			prototype._fireEvent = function(eventName, detail) {
				ns.fireEvent( this.element, eventName, detail );
			};

			prototype._refresh = function() {
				this._removeIndicator();
				this._createIndicator();
			};

			/**
			 * @method setActive
			 * @param index
			 * @member ns.widget.core.TabIndicator
			 */
			prototype._setActive = function ( index ) {
				var o = this.options,
					nodes = this.element.children;

				o.active = index;

				[].forEach.call(nodes, function( element ) {
					element.classList.remove( o.activeClass );
				});

				if ( index < nodes.length ) {
					nodes[index].classList.add( o.activeClass );

					TabPrototype._setActive.call(this, index);
				}
			};

			/**
			 * @method setSize
			 * @param size
			 * @member ns.widget.core.TabIndicator
			 */
			prototype.setSize = function( size ) {
				var needRefresh = this.tabSize !== size;

				this.tabSize = size;
				if ( needRefresh ) {
					this.refresh();
				}
			};

			prototype._destroy = function() {
				var o = this.options;

				this._removeIndicator();

				this.element.classList.remove( o.wrapperClass );
			};

			ns.widget.core.TabIndicator = TabIndicator;

			engine.defineWidget(
				"TabIndicator",
				".ui-tab",
				["setActive", "getActive", "setSize"],
				TabIndicator
			);
			}(window.document, ns));

/*global window, define, ns*/
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * # SectionChanger Widget
 * Shows a control that you can use to scroll through multiple *section*
 * elements.
 *
 * The section changer widget provides an application architecture, which has
 * multiple sections on a page and enables scrolling through the *section* elements.
 *
 * ## Manual constructor
 *
 *      @example
 *         <div id="hasSectionchangerPage" class="ui-page">
 *             <header class="ui-header">
 *                 <h2 class="ui-title">SectionChanger</h2>
 *             </header>
 *             <div id="sectionchanger" class="ui-content">
 *                 <!--Section changer has only one child-->
 *                 <div>
 *                     <section>
 *                         <h3>LEFT1 PAGE</h3>
 *                     </section>
 *                     <section class="ui-section-active">
 *                         <h3>MAIN PAGE</h3>
 *                     </section>
 *                     <section>
 *                         <h3>RIGHT1 PAGE</h3>
 *                     </section>
 *                 </div>
 *             </div>
 *         </div>
 *         <script>
 *             (function () {
 *                 var page = document.getElementById("hasSectionchangerPage"),
 *                     element = document.getElementById("sectionchanger"),
 *                     sectionChanger;
 *
 *                 page.addEventListener("pageshow", function () {
 *                     // Create the SectionChanger object
 *                     sectionChanger = new tau.SectionChanger(element, {
 *                         circular: true,
 *                         orientation: "horizontal",
 *                         useBouncingEffect: true
 *                     });
 *                 });
 *
 *                 page.addEventListener("pagehide", function () {
 *                     // Release the object
 *                     sectionChanger.destroy();
 *                 });
 *             })();
 *         </script>
 *
 * ## Handling Events
 *
 * To handle section changer events, use the following code:
 *
 *      @example
 *         <script>
 *             (function () {
 *                 var changer = document.getElementById("sectionchanger");
 *                 changer.addEventListener("sectionchange", function (event) {
 *                     console.debug(event.detail.active + " section is active.");
 *                 });
 *             })();
 *         </script>
 *
 * @class ns.widget.core.SectionChanger
 * @since 2.2
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
				var Scroller = ns.widget.core.scroller.Scroller,
				Gesture = ns.event.gesture,
				engine = ns.engine,
				utilsObject = ns.util.object,
				utilsEvents = ns.event,
				eventType = ns.util.object.merge({
					/**
					 * Triggered when the section is changed.
					 * @event sectionchange
					 * @member ns.widget.core.SectionChanger
					 */
					CHANGE: "sectionchange"
				}, Scroller.EventType),
				classes = {
					uiSectionChanger: "ui-section-changer"
				};

			function SectionChanger() {
				this.options = {};
			}

			function calculateCustomLayout(direction, elements, lastIndex) {
				var len = lastIndex !== undefined ? lastIndex : elements.length,
					result = 0,
					i;
				for (i = 0; i < len; i++) {
					result += direction === Scroller.Orientation.HORIZONTAL ? elements[i].offsetWidth : elements[i].offsetHeight;
				}
				return result;
			}
			function calculateCenter(direction, elements, index) {
				var result = calculateCustomLayout(direction, elements, index + 1);
				result -= direction === Scroller.Orientation.HORIZONTAL ? elements[index].offsetWidth / 2 : elements[index].offsetHeight / 2;
				return result;
			}
			utilsObject.inherit(SectionChanger, Scroller, {
				_build: function (element) {

					this.tabIndicatorElement = null;
					this.tabIndicator = null;

					this.sections = null;
					this.sectionPositions = [];

					this.activeIndex = 0;
					this.beforeIndex = 0;

					this._super(element);
					element.classList.add(classes.uiSectionChanger);
					return element;
				},

				_configure : function () {
					this._super();
					/**
					 * Options for widget
					 * @property {Object} options
					 * @property {"horizontal"|"vertical"} [options.orientation="horizontal"] Sets the section changer orientation:
					 * @property {boolean} [options.circular=false] Presents the sections in a circular scroll fashion.
					 * @property {boolean} [options.useBouncingEffect=false] Shows a scroll end effect on the scroll edge.
					 * @property {string} [options.items="section"] Defines the section element selector.
					 * @property {string} [options.activeClass="ui-section-active"] Specifies the CSS classes which define the active section element. Add the specified class (ui-section-active) to a *section* element to indicate which section must be shown first. By default, the first section is shown first.
					 * @property {boolean} [options.fillContent=true] declare to section tag width to fill content or not.
					 * @member ns.widget.core.SectionChanger
					 */
					this.options = utilsObject.merge(this.options, {
						items: "section",
						activeClass: "ui-section-active",
						circular: false,
						animate: true,
						animateDuration: 100,
						orientation: "horizontal",
						changeThreshold: -1,
						useTab: false,
						fillContent: true
					});
				},

				_init: function (element) {
					var o = this.options,
						scroller = this.scroller,
						offsetHeight,
						sectionLength, i, className;

					scroller.style.position = "absolute";
					offsetHeight = element.offsetHeight;
					if (offsetHeight === 0) {
						offsetHeight = element.parentNode.offsetHeight;
						element.style.height = offsetHeight + "px";
					}
					this._sectionChangerWidth = element.offsetWidth;
					this._sectionChangerHeight = offsetHeight;
					this._sectionChangerHalfWidth = this._sectionChangerWidth / 2;
					this._sectionChangerHalfHeight = this._sectionChangerHeight / 2;
					this.orientation = o.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL;

					if (o.scrollbar === "tab") {
						o.scrollbar = false;
						o.useTab = true;
					}

					this.sections = typeof o.items === "string" ?
						scroller.querySelectorAll(o.items) :
						o.items;
					sectionLength = this.sections.length;

					if (o.circular && sectionLength < 3) {
						throw "if you use circular option, you must have at least three sections.";
					}

					if (this.activeIndex >= sectionLength) {
						this.activeIndex = sectionLength - 1;
					}

					for (i = 0; i < sectionLength; i++) {
						className = this.sections[i].className;
						if (className && className.indexOf(o.activeClass) > -1) {
							this.activeIndex = i;
						}

						this.sectionPositions[i] = i;
					}

					this._prepareLayout();
					this._initLayout();
					this._super();
					this._repositionSections(true);
					this.setActiveSection(this.activeIndex);

					// set corret options values.
					if (!o.animate) {
						o.animateDuration = 0;
					}
					if (o.changeThreshold < 0) {
						o.changeThreshold = this._sectionChangerHalfWidth;
					}

					return element;
				},

				_prepareLayout: function () {
					var o = this.options,
						sectionLength = this.sections.length,
						width = this._sectionChangerWidth,
						height = this._sectionChangerHeight,
						orientation = this.orientation,
						scrollerStyle = this.scroller.style,
						tabHeight;

					if (o.useTab) {
						this._initTabIndicator();
						tabHeight = this.tabIndicatorElement.offsetHeight;
						height -= tabHeight;
						this._sectionChangerHalfHeight = height / 2;
						this.element.style.height = height + "px";
						this._sectionChangerHeight = height;
					}

					if (orientation === Scroller.Orientation.HORIZONTAL) {
						scrollerStyle.width = (o.fillContent ? width * sectionLength : calculateCustomLayout(orientation, this.sections)) + "px";
						scrollerStyle.height = height + "px"; //set Scroller width
					} else {
						scrollerStyle.width = width + "px"; //set Scroller width
						scrollerStyle.height = (o.fillContent ? height * sectionLength : calculateCustomLayout(orientation, this.sections)) + "px";
					}

				},

				_initLayout: function () {
					var sectionStyle = this.sections.style,
						left = 0,
						top = 0,
						i, sectionLength;

					//section element has absolute position
					for (i = 0, sectionLength = this.sections.length; i < sectionLength; i++) {
						//Each section set initialize left position
						sectionStyle = this.sections[i].style;
						sectionStyle.position = "absolute";
						if (this.options.fillContent) {
							sectionStyle.width = this._sectionChangerWidth + "px";
							sectionStyle.height = this._sectionChangerHeight + "px";
						}

						if (this.orientation === Scroller.Orientation.HORIZONTAL) {
							top = 0;
							left = calculateCustomLayout(this.orientation, this.sections, i);
						} else {
							top = calculateCustomLayout(this.orientation, this.sections, i);
							left = 0;
						}

						sectionStyle.top = top + "px";
						sectionStyle.left = left + "px";
					}

				},

				_initBouncingEffect: function () {
					var o = this.options;
					if (!o.circular) {
						this._super();
					}
				},

				_translateScrollbar: function (x, y, duration, autoHidden) {
					var offset;

					if (!this.scrollbar) {
						return;
					}

					if (this.orientation === Scroller.Orientation.HORIZONTAL) {
						offset = (-x + this.minScrollX);
					} else {
						offset = (-y + this.minScrollY);
					}

					this.scrollbar.translate(offset, duration, autoHidden);
				},

				_translateScrollbarWithPageIndex: function (pageIndex, duration) {
					var offset;

					if (!this.scrollbar) {
						return;
					}

					offset = calculateCustomLayout(this.orientation, this.sections, this.activeIndex);

					this.scrollbar.translate(offset, duration);
				},

				_initTabIndicator: function () {
					var elem = this.tabIndicatorElement = document.createElement("div");
					this.element.parentNode.insertBefore(elem, this.element);

					this.tabIndicator = new engine.instanceWidget(elem, "TabIndicator");
					this.tabIndicator.setSize(this.sections.length);
					this.tabIndicator.setActive(this.activeIndex);
					this.tabIndicatorHandler = function (e) {
						this.tabIndicator.setActive(e.detail.active);
					}.bind(this);
					this.element.addEventListener(eventType.CHANGE, this.tabIndicatorHandler, false);
				},

				_clearTabIndicator: function () {
					if (this.tabIndicator) {
						this.element.parentNode.removeChild(this.tabIndicatorElement);
						this.element.removeEventListener(eventType.CHANGE, this.tabIndicatorHandler, false);
						this.tabIndicator.destroy();
						this.tabIndicator = null;
						this.tabIndicatorElement = null;
						this.tabIndicatorHandler = null;
					}
				},

				_resetLayout: function () {
					var //scrollerStyle = this.scroller.style,
						sectionStyle = this.sections.style,
						i, sectionLength;

					//scrollerStyle.width = "";
					//scrollerStyle.height = "";
					//this.scroller || this.scroller._resetLayout();

					for (i = 0, sectionLength = this.sections.length; i < sectionLength; i++) {
						sectionStyle = this.sections[i].style;

						sectionStyle.position = "";
						sectionStyle.width = "";
						sectionStyle.height = "";
						sectionStyle.top = "";
						sectionStyle.left = "";
					}

					this._super();
				},

				_bindEvents: function () {
					this._super();

					ns.event.enableGesture(
						this.scroller,

						new ns.event.gesture.Swipe({
							orientation: this.orientation === Scroller.Orientation.HORIZONTAL ?
								Gesture.Orientation.HORIZONTAL :
								Gesture.Orientation.VERTICAL
						})
					);

					utilsEvents.on(this.scroller,
							"swipe transitionEnd webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd", this);
				},

				_unbindEvents: function () {
					this._super();

					if (this.scroller) {
						ns.event.disableGesture(this.scroller);
						utilsEvents.off(this.scroller,
							"swipe transitionEnd webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd", this);
					}
				},

				/**
				 * This method manages events.
				 * @method handleEvent
				 * @returns {Event} event
				 * @member ns.widget.core.SectionChanger
				 */
				handleEvent: function (event) {
					this._super(event);

					switch (event.type) {
						case "swipe":
							this._swipe(event);
							break;
						case "webkitTransitionEnd":
						case "mozTransitionEnd":
						case "msTransitionEnd":
						case "oTransitionEnd":
						case "transitionEnd":
							if (event.target === this.scroller) {
								this._endScroll();
							}
							break;
					}
				},

				_notifyChanagedSection: function (index) {
					var activeClass = this.options.activeClass,
						sectionLength = this.sections.length,
						i=0, section;

					for (i=0; i < sectionLength; i++) {
						section = this.sections[i];
						section.classList.remove(activeClass);
						if (i === this.activeIndex) {
							section.classList.add(activeClass);
						}
					}

					this._fireEvent(eventType.CHANGE, {
						active: index
					});
				},

				/**
				 * Changes the currently active section element.
				 * @method setActiveSection
				 * @param {number} index
				 * @param {number} duration For smooth scrolling,
				 * the duration parameter must be in milliseconds.
				 * @member ns.widget.core.SectionChanger
				 */
				setActiveSection: function (index, duration, direct) {
					var position = this.sectionPositions[ index ],
						scrollbarDuration = duration,
						oldActiveIndex = this.activeIndex,
						newX=0,
						newY= 0,
						centerX = 0,
						centerY = 0;

					if (this.orientation === Scroller.Orientation.HORIZONTAL) {
						newX = this._sectionChangerHalfWidth - calculateCenter(this.orientation, this.sections, position);

					} else {
						newY = this._sectionChangerHalfHeight - calculateCenter(this.orientation, this.sections, position);
					}

					if (this.beforeIndex - index > 1 || this.beforeIndex - index < -1) {
						scrollbarDuration = 0;
					}

					this.activeIndex = index;
					this.beforeIndex = this.activeIndex;

					if (newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY) {
						if (direct !== false) {
							this._fireEvent( eventType.START );
							this.scrolled = true;
						}

						this._translate(newX, newY, duration);
						this._translateScrollbarWithPageIndex(index, scrollbarDuration);
					} else {
						this._endScroll();
					}

					// notify changed section.
					if (this.activeIndex !== oldActiveIndex) {
						this._notifyChanagedSection(this.activeIndex);
					}
				},

				/**
				 * Gets the currently active section element's index.
				 * @method getActiveSectionIndex
				 * @returns {number}
				 * @member ns.widget.core.SectionChanger
				 */
				getActiveSectionIndex: function () {
					return this.activeIndex;
				},

				_start: function (e) {
					this._super(e);

					this.beforeIndex = this.activeIndex;
				},

				_move: function (e) {
					var changeThreshold = this.options.changeThreshold,
						delta = this.orientation === Scroller.Orientation.HORIZONTAL ? e.detail.deltaX : e.detail.deltaY,
						oldActiveIndex = this.activeIndex;

					this._super(e);

					if (!this.scrolled) {
						return;
					}

					if (delta > changeThreshold) {
						this.activeIndex = this._calculateIndex(this.beforeIndex - 1);
					} else if (delta < -changeThreshold) {
						this.activeIndex = this._calculateIndex(this.beforeIndex + 1);
					} else {
						this.activeIndex = this.beforeIndex;
					}

					// notify changed section.
					if (this.activeIndex !== oldActiveIndex) {
						this._notifyChanagedSection(this.activeIndex);
					}
				},

				_end: function (/* e */) {
					if ( this.scrollbar ) {
						this.scrollbar.end();
					}

					if (!this.enabled || this.scrollCanceled || !this.dragging) {
						return;
					}

					// bouncing effect
					if (this.bouncingEffect) {
						this.bouncingEffect.dragEnd();
					}

					this.setActiveSection(this.activeIndex, this.options.animateDuration, false);
					this.dragging = false;
				},

				_swipe: function (e) {
					var offset = e.detail.direction === Gesture.Direction.UP || e.detail.direction === Gesture.Direction.LEFT ? 1 : -1,
						newIndex = this._calculateIndex(this.beforeIndex + offset);

					if (!this.enabled || this.scrollCanceled || !this.dragging) {
						return;
					}

					// bouncing effect
					if (this.bouncingEffect) {
						this.bouncingEffect.dragEnd();
					}

					if (this.activeIndex !== newIndex) {
						this.activeIndex = newIndex;
						this._notifyChanagedSection(newIndex);
					}

					this.setActiveSection(newIndex, this.options.animateDuration, false);
					this.dragging = false;
				},

				_endScroll: function () {
					if (!this.enabled || !this.scrolled || this.scrollCanceled) {
						return;
					}

					this._repositionSections();
					this._super();
				},

				_repositionSections: function (init) {
					// if developer set circular option is true, this method used when webkitTransitionEnd event fired
					var sectionLength = this.sections.length,
						curPosition = this.sectionPositions[this.activeIndex],
						centerPosition = window.parseInt(sectionLength/2, 10),
						circular = this.options.circular,
						centerX = 0,
						centerY = 0,
						i, sectionStyle, sIdx, top, left, newX, newY;

					if (this.orientation === Scroller.Orientation.HORIZONTAL) {
						newX = -(calculateCenter(this.orientation, this.sections, (circular ? centerPosition : this.activeIndex)));
						newY = 0;
					} else {
						newX = 0;
						newY = -(calculateCenter(this.orientation, this.sections, (circular ? centerPosition : this.activeIndex)));
					}

					this._translateScrollbarWithPageIndex(this.activeIndex);

					if (init || (curPosition === 0 || curPosition === sectionLength - 1)) {

						if (this.orientation === Scroller.Orientation.HORIZONTAL) {
							centerX = this._sectionChangerHalfWidth + newX;
						} else {
							centerY = this._sectionChangerHalfHeight + newY;
						}
						this._translate(centerX, centerY);

						if (circular) {
							for (i = 0; i < sectionLength; i++) {
								sIdx = (sectionLength + this.activeIndex - centerPosition + i) % sectionLength;
								sectionStyle = this.sections[ sIdx ].style;

								this.sectionPositions[sIdx] = i;

								if (this.orientation === Scroller.Orientation.HORIZONTAL) {
									top = 0;
									left = calculateCustomLayout(this.orientation, this.sections, i);
								} else {
									top = calculateCustomLayout(this.orientation, this.sections, i);
									left = 0;
								}

								sectionStyle.top = top + "px";
								sectionStyle.left = left + "px";
							}
						}
					}
				},

				_calculateIndex: function (newIndex) {
					var sectionLength = this.sections.length;

					if (this.options.circular) {
						newIndex = (sectionLength + newIndex) % sectionLength;
					} else {
						newIndex = newIndex < 0 ? 0 : (newIndex > sectionLength - 1 ? sectionLength - 1 : newIndex);
					}

					return newIndex;
				},

				_clear: function () {
					this._clearTabIndicator();
					this._super();
					this.sectionPositions.length = 0;
				}
			});

			ns.widget.core.SectionChanger = SectionChanger;

			engine.defineWidget(
				"SectionChanger",
				"[data-role='section-changer'], .ui-section-changer",
				["getActiveSectionIndex", "setActiveSection"],
				SectionChanger
			);
			}(window.document, ns));

/*global window, define, NodeList, HTMLCollection */
/*jslint plusplus: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	
			/**
			 * @property {DocumentFragment} fragment
			 * @member ns.util.DOM
			 * @private
			 * @static
			 */
			/*
			 * @todo maybe can be moved to function scope?
			 */
			var fragment = document.createDocumentFragment(),
				/**
				 * @property {DocumentFragment} fragment2
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				/*
				 * @todo maybe can be moved to function scope?
				 */
				fragment2 = document.createDocumentFragment(),
				/**
				 * @property {number} [containerCounter=0]
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				/*
				 * @todo maybe can be moved to function scope?
				 */
				containerCounter = 0,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.util.DOM
				 * @private
				 * @static
				 */
				slice = [].slice,
				DOM = ns.util.DOM;

			/**
			 * Appends node or array-like node list array to context
			 * @method appendNodes
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 * @throws {string}
			 */
			DOM.appendNodes = function (context, elements) {
				var i,
					len;
				if (context) {
					if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
						elements = slice.call(elements);
						for (i = 0, len = elements.length; i < len; ++i) {
							context.appendChild(elements[i]);
						}
					} else {
						context.appendChild(elements);
					}
					return elements;
				}

				throw "Context empty!";
			};

			/**
			 * Replaces context with node or array-like node list
			 * @method replaceWithNodes
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 */
			DOM.replaceWithNodes = function (context, elements) {
				if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
					elements = this.insertNodesBefore(context, elements);
					context.parentNode.removeChild(context);
				} else {
					context.parentNode.replaceChild(elements, context);
				}
				return elements;
			};

			/**
			 * Remove all children
			 * @method removeAllChildren
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @static
			 */
			DOM.removeAllChildren = function (context) {
				context.innerHTML = "";
			};

			/**
			 * Inserts node or array-like node list before context
			 * @method insertNodesBefore
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement|HTMLCollection|NodeList|Array} elements
			 * @return {HTMLElement|Array|null}
			 * @static
			 * @throws {string}
			 */
			DOM.insertNodesBefore = function (context, elements) {
				var i,
					len,
					parent;
				if (context) {
					parent = context.parentNode;
					if (elements instanceof Array || elements instanceof NodeList || elements instanceof HTMLCollection) {
						elements = slice.call(elements);
						for (i = 0, len = elements.length; i < len; ++i) {
							parent.insertBefore(elements[i], context);
						}
					} else {
						parent.insertBefore(elements, context);
					}
					return elements;
				}

				throw "Context empty!";

			};

			/**
			 * Inserts node after context
			 * @method insertNodeAfter
			 * @member ns.util.DOM
			 * @param {HTMLElement} context
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @static
			 * @throws {string}
			 */
			DOM.insertNodeAfter = function (context, element) {
				if (context) {
					context.parentNode.insertBefore(element, context.nextSibling);
					return element;
				}
				throw "Context empty!";
			};

			/**
			 * Wraps element or array-like node list in html markup
			 * @method wrapInHTML
			 * @param {HTMLElement|NodeList|HTMLCollection|Array} elements
			 * @param {string} html
			 * @return {HTMLElement|NodeList|Array} wrapped element
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.wrapInHTML = function (elements, html) {
				var container = document.createElement("div"),
					contentFlag = false,
					elementsLen = elements.length,
					//if elements is nodeList, retrieve parentNode of first node
					originalParentNode = elementsLen ? elements[0].parentNode : elements.parentNode,
					next = elementsLen ? elements[elementsLen - 1].nextSibling : elements.nextSibling,
					innerContainer;

				fragment.appendChild(container);
				html = html.replace(/(\$\{content\})/gi, function () {
					contentFlag = true;
					return "<span id='temp-container-" + (++containerCounter) + "'></span>";
				});
				container.innerHTML = html;

				if (contentFlag === true) {
					innerContainer = container.querySelector("span#temp-container-" + containerCounter);
					elements = this.replaceWithNodes(innerContainer, elements);
				} else {
					innerContainer = container.children[0];
					elements = this.appendNodes(innerContainer || container, elements);
				}

				// move the nodes
				while (fragment.firstChild.firstChild) {
					fragment2.appendChild(fragment.firstChild.firstChild);
				}

				// clean up
				while (fragment.firstChild) {
					fragment.removeChild(fragment.firstChild);
				}

				if (originalParentNode) {
					if (next) {
						originalParentNode.insertBefore(fragment2, next);
					} else {
						originalParentNode.appendChild(fragment2);
					}
				} else {
					// clean up
					while (fragment2.firstChild) {
						fragment2.removeChild(fragment2.firstChild);
					}
				}
				return elements;
			};
			}(window, window.document, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * #Wearable Widget Reference
 * The Tizen Web UI service provides rich Tizen widgets that are optimized for the Tizen Web browser. You can use the widgets for:
 *
 * - CSS animation
 * - Rendering
 *
 * The following table displays the widgets provided by the Tizen Web UI service.
 * @class ns.widget.wearable
 * @seeMore https://developer.tizen.org/dev-guide/2.2.1/org.tizen.web.uiwidget.apireference/html/web_ui_framework.htm "Web UI Framework Reference"
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	"use strict";
				ns.widget.wearable = ns.widget.wearable || {};
			}(window, ns));

/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true */
/**
 * # Page Widget
 * Page is main element of application's structure.
 *
 * ## Default selectors
 * In the Tizen Web UI framework the application page structure is based on a header, content and footer elements:
 *
 * - **The header** is placed at the top, and displays the page title and optionally buttons.
 * - **The content** is the section below the header, showing the main content of the page.
 * - **The footer** is a bottom part of page which can display for example buttons
 *
 * The following table describes the specific information for each section.
 *
 * <table>
 *     <tr>
 *         <th>Section</th>
 *         <th>Class</th>
 *         <th>Mandatory</th>
 *         <th>Description</th>
 *     </tr>
 *     <tr>
 *         <td rowspan="2">Page</td>
 *         <td>ui-page</td>
 *         <td>Yes</td>
 *         <td>Defines the element as a page.
 *
 * The page widget is used to manage a single item in a page-based architecture.
 *
 * A page is composed of header (optional), content (mandatory), and footer (optional) elements.</td>
 *      </tr>
 *      <tr>
 *          <td>ui-page-active</td>
 *          <td>No</td>
 *          <td>If an application has a static start page, insert the ui-page-active class in the page element to speed up the application launch. The start page with the ui-page-active class can be displayed before the framework is fully loaded.
 *
 *If this class is not used, the framework inserts the class automatically to the first page of the application. However, this has a slowing effect on the application launch, because the page is displayed only after the framework is fully loaded.</td>
 *      </tr>
 *      <tr>
 *          <td>Header</td>
 *          <td>ui-header</td>
 *          <td>No</td>
 *          <td>Defines the element as a header.</td>
 *      </tr>
 *      <tr>
 *          <td>Content</td>
 *          <td>ui-content</td>
 *          <td>Yes</td>
 *          <td>Defines the element as content.</td>
 *      </tr>
 *      <tr>
 *          <td>Footer</td>
 *          <td>ui-footer</td>
 *          <td>No</td>
 *          <td>Defines the element as a footer.
 *
 * The footer section is mostly used to include option buttons.</td>
 *      </tr>
 *  </table>
 *
 * All elements with class=ui-page will be become page widgets
 *
 *      @example
 *         <!--Page layout-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Page layout with more button in header-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header ui-has-more">
 *                 <h2 class="ui-title">Call menu</h2>
 *                 <button type="button" class="ui-more ui-icon-overflow">More Options</button>
 *             </header>
 *             <div class="ui-content">Content message</div>
 *             <footer class="ui-footer">
 *                 <button type="button" class="ui-btn">Footer Button</button>
 *             </footer>
 *         </div>
 *
 * ## Manual constructor
 * For manual creation of page widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var pageElement = document.getElementById("page"),
 *			page = tau.widget.page(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Multi-page Layout
 *
 * You can implement a template containing multiple page containers in the application index.html file.
 *
 * In the multi-page layout, the main page is defined with the ui-page-active class. If no page has the ui-page-active class, the framework automatically sets up the first page in the source order as the main page. You can improve the launch performance by explicitly defining the main page to be displayed first. If the application has to wait for the framework to set up the main page, the page is displayed with some delay only after the framework is fully loaded.
 *
 * You can link to internal pages by referring to the ID of the page. For example, to link to the page with an ID of two, the link element needs the href="#two" attribute in the code, as in the following example.
 *
 *      @example
 *         <!--Main page-->
 *         <div id="one" class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Secondary page-->
 *         <div id="two" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 * To find the currently active page, use the ui-page-active class.
 *
 * ## Changing Pages
 * ### Go to page in JavaScript
 * To change page use method *tau.changePage*
 *
 *      @example
 *      tau.changePage("page-two");
 *
 * ### Back in JavaScript
 * To back to previous page use method *tau.back*
 *
 *      @example
 *      tau.back();
 *
 * ## Transitions
 *
 * When changing the active page, you can use a page transition.
 *
 * Tizen Web UI Framework does not apply transitions by default. To set a custom transition effect, you must add the data-transition attribute to a link:
 *
 *      @example
 *      <a href="index.html" data-transition="slideup">I'll slide up</a>
 *
 * To set a default custom transition effect for all pages, use the pageTransition property:
 *
 *      @example
 *      tau.defaults.pageTransition = "slideup";
 *
 * ### Transitions list
 *
 *  - **none** no transition.
 *  - **slideup** Makes the content of the next page slide up, appearing to conceal the content of the previous page.
 *
 * ## Handling Page Events
 *
 * With page widget we have connected many of events.
 *
 * To handle page events, use the following code:
 *
 *      @example
 *        <div id="page" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *         </div>
 *
 *         <script>
 *             var page = document.getElementById("page");
 *             page.addEventListener("Event", function(event) {
 *                 // Your code
 *             });
 *         </script>
 *
 * To bind an event callback on the Back key, use the following code:
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * To bind an event callback on the Back key, use the following code:
 *
 *      @example
 *         <script>
 *             window.addEventListener("tizenhwkey", function (event) {
 *                 if (event.keyName == "back") {
 *                     // Call window.history.back() to go to previous browser window
 *                     // Call tizen.application.getCurrentApplication().exit() to exit application
 *                     // Add script to add another behavior
 *                 }
 *             });
 *         </script>
 *
 * ## Options for Page Widget
 *
 * Page widget hasn't any options.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var pageElement = document.getElementById("page"),
 *			page = tau.widget.page(buttonElement);
 *
 *		page.methodName(methodArgument1, methodArgument2, ...);
 *
 * @class ns.widget.wearable.Page
 * @extends ns.widget.core.Page
 * @author hyunkook cho <hk0713.cho@samsung.com>
 */
(function (document, ns) {
	"use strict";
				/**
			 * Alias for {@link ns.widget.BaseWidget}
			 * @property {Object} BaseWidget
			 * @member ns.widget.core.Page
			 * @private
			 * @static
			 */
			var CorePage = ns.widget.core.Page,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} doms
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				doms = util.DOM,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				selectors = util.selectors,
				/**
				 * Alias for {@link ns.util.object}
				 * @property {Object} object
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				object = ns.util.object,
				/**
				 * Alias for {@link ns.event}
				 * @property {Object} object
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				utilsEvents = ns.event,
				/**
				 * Alias for {@link ns.event.gesture}
				 * @property {Object} object
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				Gesture = utilsEvents.gesture,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,

				Page = function () {
					var self = this;
					CorePage.call(self);
					self._contentStyleAttributes = ["height", "width", "minHeight", "marginTop", "marginBottom"];
				},
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Page
				 * @static
				 * @readonly
				 */
				classes = object.merge({
					uiHeader: "ui-header",
					uiPageScroll: "ui-scroll-on",
					uiScroller: "ui-scroller",
					uiFixed: "ui-fixed"
				}, CorePage.classes),

				prototype = new CorePage();

			/**
			 * Configure Page Widget
			 * @method _configure
			 * @member ns.widget.wearable.Page
			 */
			prototype._configure = function () {
				CorePage.prototype._configure.call(this);
				this.options.enablePageScroll = ns.getConfig("enablePageScroll");
			};
			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @member ns.widget.wearable.Page
			 */
			prototype._contentFill = function () {
				var self = this,
					option = self.options,
					element = self.element,
					screenWidth = window.innerWidth,
					screenHeight = window.innerHeight,
					pageScrollSelector = classes.uiPageScroll,
					children = [].slice.call(element.children),
					elementStyle = element.style,
					scroller,
					fragment,
					firstChild;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				if (option.enablePageScroll === true && !element.querySelector("." + classes.uiScroller)) {
					element.classList.add(pageScrollSelector);
					scroller = document.createElement("div");
					scroller.classList.add(classes.uiScroller);
					fragment = document.createDocumentFragment();

					children.forEach( function(value) {
						if ( selectors.matchesSelector(value, ".ui-header:not(.ui-fixed), .ui-content, .ui-footer:not(.ui-fixed)")) {
							fragment.appendChild(value);
						}
					});

					if (element.children.length > 0 && element.children[0].classList.contains(classes.uiHeader)) {
						doms.insertNodeAfter(element.children[0], scroller);
					} else {
						element.insertBefore(scroller, element.firstChild);
					}

					firstChild = fragment.firstChild;

					scroller.appendChild(fragment);
				}
			};

			prototype.getScroller = function() {
				var element = this.element,
					scroller = element.querySelector("." + classes.uiScroller);
				return scroller || element.querySelector("." + classes.uiContent) || element;
			};

			prototype._destroy = function () {
				CorePage.prototype._destroy.call(this);
			};

			Page.prototype = prototype;

			// definition
			ns.widget.wearable.Page = Page;
			engine.defineWidget(
				"Page",
				"[data-role=page],.ui-page",
				[
					"layout",
					"focus",
					"blur",
					"setActive",
					"isActive"
				],
				Page,
				"wearable",
				true
			);

			}(window.document, ns));

/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
*
* Licensed under the Flora License, Version 1.1 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://floralicense.org/license/
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/*jslint nomen: true, plusplus: true */

/**
 * # Popup Widget
 * Shows a pop-up window.
 *
 * The popup widget shows in the middle of the screen a list of items in a pop-up window. It automatically optimizes the pop-up window size within the screen. The following table describes the supported popup classes.
 *
 * ## Default selectors
 * All elements with class *ui-popup* will be become popup widgets.
 *
 * The pop-up window can contain a header, content, and footer area like the page element.
 *
 * To open a pop-up window from a link, use the data-rel attribute in HTML markup as in the following code:
 *
 *      @example
 *      <a href="#popup" class="ui-btn" data-rel="popup">Open popup when clicking this element.</a>
 *
 * The following table shows examples of various types of popups.
 *
 * The popup contains header, content and footer area
 *
 * ###HTML Examples
 *
 * #### Basic popup with header, content, footer
 *
 *		@example
 *		<div class="ui-page">
 *		    <div class="ui-popup">
 *		        <div class="ui-popup-header">Power saving mode</div>
 *		        <div class="ui-popup-content">
 *		            Turning on Power
 *		            saving mode will
 *		            limit the maximum
 *		            per
 *		        </div>
 *		        <div class="ui-popup-footer">
 *		            <button id="cancel" class="ui-btn">Cancel</button>
 *		        </div>
 *		    </div>
 *		</div>
 *
 * #### Popup with 2 buttons in the footer
 *
 *      @example
 *         <div id="2btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Delete</div>
 *             <div class="ui-popup-content">
 *                 Delete the image?
 *             </div>
 *             <div class="ui-popup-footer ui-grid-col-2">
 *                 <button id="2btnPopup-cancel" class="ui-btn">Cancel</button>
 *                 <button id="2btnPopup-ok" class="ui-btn">OK</button>
 *             </div>
 *         </div>
 *
 * #### Popup with checkbox/radio
 *
 * If you want make popup with list checkbox(or radio) just include checkbox (radio) to popup and add class *ui-popup-checkbox-label* to popup element.
 *
 *		@example
 *         <div id="listBoxPopup" class="ui-popup">
 *             <div class="ui-popup-header">When?</div>
 *             <div class="ui-popup-content" style="height:243px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="check-1" class="ui-popup-checkbox-label">Yesterday</label>
 *                         <input type="checkbox" name="checkset" id="check-1" />
 *                     </li>
 *                     <li>
 *                         <label for="check-2" class="ui-popup-checkbox-label">Today</label>
 *                         <input type="checkbox" name="checkset" id="check-2" />
 *                     </li>
 *                     <li>
 *                         <label for="check-3" class="ui-popup-checkbox-label">Tomorrow</label>
 *                         <input type="checkbox" name="checkset" id="check-3" />
 *                     </li>
 *                 </ul>
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="radio-1" class="ui-popup-radio-label">Mandatory</label>
 *                         <input type="radio" name="radioset" id="radio-1" />
 *                     </li>
 *                     <li>
 *                         <label for="radio-2" class="ui-popup-radio-label">Optional</label>
 *                         <input type="radio" name="radioset" id="radio-2" />
 *                     </li>
 *                 </ul>
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="listBoxPopup-close" class="ui-btn">Close</button>
 *             </div>
 *         </div>
 *     </div>
 *
 * #### Popup with no header and footer
 *
 *      @example
 *         <div id="listNoTitleNoBtnPopup" class="ui-popup">
 *             <div class="ui-popup-content" style="height:294px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li><a href="">Ringtones 1</a></li>
 *                     <li><a href="">Ringtones 2</a></li>
 *                     <li><a href="">Ringtones 3</a></li>
 *                 </ul>
 *             </div>
 *         </div>
 *
 * #### Toast popup
 *
 *      @example
 *         <div id="PopupToast" class="ui-popup ui-popup-toast">
 *             <div class="ui-popup-content">Saving contacts to sim on Samsung</div>
 *         </div>
 *
 * ### Create Option popup
 *
 * Popup inherits value of option positionTo from property data-position-to set in link.
 *
 *		@example
 *		<!--definition of link, which opens popup and sets its position-->
 *		<a href="#popupOptionText" data-rel="popup"  data-position-to="origin">Text</a>
 *		<!--definition of popup, which inherites property position from link-->
 *		<div id="popupOptionText" class="ui-popup">
 *			<div class="ui-popup-content">
 *				<ul class="ui-listview">
 *				<li><a href="#">Option 1</a></li>
 *				<li><a href="#">Option 2</a></li>
 *				<li><a href="#">Option 3</a></li>
 *				<li><a href="#">Option 4</a></li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * ### Opening and closing popup
 *
 * To open popup from "a" link using html markup, use the following code:
 *
 *		@example
 *      <div class="ui-page">
 *          <header class="ui-header">
 *              <h2 class="ui-title">Call menu</h2>
 *          </header>
 *          <div class="ui-content">
 *              <a href="#popup" class="ui-btn" data-rel="popup" >Open Popup</a>
 *          </div>
 *
 *          <div id="popup" class="ui-popup">
 *               <div class="ui-popup-header">Power saving mode</div>
 *                   <div class="ui-popup-content">
 *                       Turning on Power
 *                       saving mode will
 *                       limit the maximum
 *                       per
 *                   </div>
 *               <div class="ui-popup-footer">
 *               <button id="cancel" class="ui-btn">Cancel</button>
 *           </div>
 *       </div>
 *
 *  To open the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.openPopup("popup")
 *
 *  To close the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.closePopup("popup")
 *
 * To find the currently active popup, use the ui-popup-active class.
 *
 * To bind the popup to a button, use the following code:
 *
 *      @example
 *         <!--HTML code-->
 *         <div id="1btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Power saving mode</div>
 *             <div class="ui-popup-content">
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="1btnPopup-cancel" class="ui-btn">Cancel</button>
 *             </div>
 *         </div>
 *         <script>
 *             // Popup opens with button click
 *             var button = document.getElementById("button");
 *             button.addEventListener("click", function() {
 *                 tau.openPopup("#1btnPopup");
 *             });
 *
 *             // Popup closes with Cancel button click
 *             document.getElementById("1btnPopup-cancel").addEventListener("click", function() {
 *                 tau.closePopup();
 *             });
 *         </script>
 *
 * ## Manual constructor
 * For manual creation of popup widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Options for Popup Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 *		popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * ## Transitions
 *
 * By default, the framework doesn't apply transition. To set a custom transition effect, add the data-transition attribute to the link.
 *
 *		@example
 *		<a href="index.html" data-rel="popup" data-transition="slideup">I'll slide up</a>
 *
 * Global configuration:
 *
 *		@example
 *		gear.ui.defaults.popupTransition = "slideup";
 *
 * ### Transitions list
 *
 * - **none** Default value, no transition.
 * - **slideup** Makes the content of the pop-up slide up.
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *      @example
 *         <!--Popup html code-->
 *         <div id="popup" class="ui-popup">
 *             <div class="ui-popup-header"></div>
 *             <div class="ui-popup-content"></div>
 *         </div>
 *         </div>
 *         <script>
 *             // Use popup events
 *             var popup = document.getElementById("popup");
 *             popup.addEventListener("popupbeforecreate", function() {
 *                 // Implement code for popupbeforecreate event
 *             });
 *         </script>
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.core.Popup
 * @extends ns.widget.core.BasePopup
 */
(function (window, document, ns) {
	"use strict";
	
			var Popup = ns.widget.core.Popup,

				PopupPrototype = Popup.prototype,

				engine = ns.engine,

				objectUtils = ns.util.object,

				domUtils = ns.util.DOM,

				/**
				 * Object with default options
				 * @property {Object} defaults
				 * @property {string} [options.transition="none"] Sets the default transition for the popup.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
				 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
				 * @property {string} [overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
				 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
				 * @property {string} [options.arrow="l,t,r,b"] Sets directions of popup's arrow by priority ("l" for left, "t" for top,
				 * "r" for right, and "b" for bottom). The first one has the highest priority, the last one - the lowest. If you set arrow="t",
				 * then arrow will be placed at the top of popup container and the whole popup will be placed under cliced element.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {number} [options.distance=0] Sets the extra distance in px from clicked element.
				 * @property {HTMLElement|string} [options.link=null] Set the element or its id, under which popup should be placed.
				 * It only works with option positionTo="origin".
				 * @member ns.widget.core.ContextPopup
				 * @static
				 * @private
				 */
				defaults = {
					arrow: "l,b,r,t",
					positionTo: "window",
					positionOriginCenter: false,
					distance: 0,
					link: null
				},

				ContextPopup = function () {
					var self = this,
						ui;

					Popup.call(self);

					// set options
					self.options = objectUtils.merge(self.options, defaults);

					// set ui
					ui = self._ui || {};
					ui.arrow = null;
					self._ui = ui;
				},

				/**
				 * @property {Object} classes Dictionary for popup related css class names
				 * @member ns.widget.core.Popup
				 * @static
				 */
				CLASSES_PREFIX = "ui-popup",
				classes = objectUtils.merge({}, Popup.classes, {
					context: "ui-ctxpopup",
					contextOverlay: "ui-ctxpopup-overlay",
					arrow: "ui-arrow",
					arrowDir: CLASSES_PREFIX + "-arrow-"
				}),

				/**
				 * @property {Object} events Dictionary for popup related events
				 * @member ns.widget.core.Popup
				 * @static
				 */
				events = objectUtils.merge({}, Popup.events, {
					before_position: "beforeposition"
				}),

				positionTypes = {
					WINDOW: "window",
					ORIGIN: "origin",
					ABSOLUTE: "absolute"
				},

				prototype = new Popup();

			ContextPopup.defaults = objectUtils.merge({}, Popup.defaults, defaults);
			ContextPopup.classes = classes;
			ContextPopup.events = events;
			ContextPopup.positionTypes = positionTypes;

			/**
			 * Build structure of Popup widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					arrow;

				// build elements of popup
				PopupPrototype._build.call(self, element);

				// set class for element
				element.classList.add(classes.popup);

				// create arrow
				arrow = document.createElement("div");
				arrow.appendChild(document.createElement("span"));
				arrow.classList.add(classes.arrow);
				ui.arrow = arrow;

				// add arrow to popup element
				element.appendChild(arrow);

				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._init = function(element) {
				var self = this,
					ui = self._ui;

				PopupPrototype._init.call(this, element);

				ui.arrow = ui.arrow || element.querySelector("." + classes.arrow);
			};

			/**
			 * Layouting popup structure
			 * @method layout
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._layout = function (element) {
				var self = this;
				this._reposition();
				PopupPrototype._layout.call(self, element);
			};

			/**
			 * Set positon and size of popup.
			 * @method _reposition
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._reposition = function(options) {
				var self = this,
					element = self.element,
					ui = self._ui,
					elementClassList = element.classList;

				options = objectUtils.merge({}, self.options, options);

				self.trigger(events.before_position, null, false);

				elementClassList.add(classes.build);

				// set height of content
				self._setContentHeight();

				// set class for contextpopup
				if ((options.positionTo === "origin") && ui.overlay) {
					ui.overlay.classList.add(classes.contextOverlay);
				}

				// set position of popup
				self._placementCoords(options);

				elementClassList.remove(classes.build);

			};

			/**
			 * Find the best positon of context popup.
			 * @method findBestPosition
			 * @param {ns.widget.core.ContextPopup} self
			 * @param {HTMLElement} clickedElement
			 * @private
			 * @member ns.widget.core.ContextPopup
			 */
			function findBestPosition(self, clickedElement) {
				var options = self.options,
					arrowsPriority = options.arrow.split(","),
					element = self.element,
					windowWidth = window.innerWidth,
					windowHeight = window.innerHeight,
					popupWidth = domUtils.getElementWidth(element, "outer"),
					popupHeight = domUtils.getElementHeight(element, "outer"),
					// offset coordinates of clicked element
					clickElementRect = clickedElement.getBoundingClientRect(),
					clickElementOffsetX = clickElementRect.left,
					clickElementOffsetY = clickElementRect.top,
					// width of visible part of clicked element
					clickElementOffsetWidth = Math.min(clickElementRect.width,
							windowWidth - clickElementOffsetX),
					// height of visible part of clicked element
					clickElementOffsetHeight = Math.min(clickElementRect.height,
							windowHeight - clickElementOffsetY),
					// params for all types of popup
					// "l" - popup with arrow on the left side, "r" - right, "b" - bottom, "t" - top
					// dir - this letter is added as a suffix of class to popup's element
					// fixedPositionField - specifies which coordinate is changed for this type of popup
					// fixedPositionFactor - factor, which specifies if size should be added or subtracted
					// size - available size, which is needed for this type of popup (width or height)
					// max - maximum size of available place
					params = {
						"l": {dir: "l", fixedPositionField: "x", fixedPositionFactor: 1,
							size: popupWidth, max: clickElementOffsetX},
						"r": {dir: "r", fixedPositionField: "x", fixedPositionFactor: -1,
							size: popupWidth, max: windowWidth - clickElementOffsetX - clickElementOffsetWidth},
						"b": {dir: "b", fixedPositionField: "y", fixedPositionFactor: -1,
							size: popupHeight, max: clickElementOffsetY},
						"t": {dir: "t", fixedPositionField: "y", fixedPositionFactor: 1,
							size: popupHeight, max: windowHeight - clickElementOffsetY - clickElementOffsetHeight}
					},
					bestDirection,
					direction,
					bestOffsetInfo;

				// set value of bestDirection on the first possible type or top
				bestDirection = params[arrowsPriority[0]] || params.t;

				arrowsPriority.forEach(function(key){
					var param = params[key],
						paramMax = param.max;
					if (!direction) {
						if (param.size < paramMax) {
							direction = param;
						} else if (paramMax > bestDirection.max) {
							bestDirection = param;
						}
					}
				});

				if (!direction) {
					direction = bestDirection;
					if (direction.fixedPositionField === "x") {
						popupWidth = direction.max;
					} else {
						popupHeight = direction.max;
					}
				}

				// info about the best position without taking into account type of popup
				bestOffsetInfo = {
					x: clickElementOffsetX + clickElementOffsetWidth / 2 - popupWidth / 2,
					y: clickElementOffsetY + clickElementOffsetHeight / 2 - popupHeight / 2,
					w: popupWidth,
					h: popupHeight,
					dir: direction.dir
				};

				// check type of popup and correct value for "fixedPositionField" coordinate
				bestOffsetInfo[direction.fixedPositionField] +=
					(direction.fixedPositionField === "x" ?
						(popupWidth + clickElementOffsetWidth) * direction.fixedPositionFactor :
						(popupHeight + clickElementOffsetHeight) * direction.fixedPositionFactor)
						/ 2 + options.distance * direction.fixedPositionFactor;

				// fix min/max position
				bestOffsetInfo.x = bestOffsetInfo.x < 0 ? 0 : bestOffsetInfo.x + bestOffsetInfo.w > windowWidth ? windowWidth - bestOffsetInfo.w : bestOffsetInfo.x;
				bestOffsetInfo.y = bestOffsetInfo.y < 0 ? 0 : bestOffsetInfo.y + bestOffsetInfo.h > windowHeight ? windowHeight - bestOffsetInfo.h : bestOffsetInfo.y;

				return bestOffsetInfo;
			}

			/**
			 * Find the best positon of arrow.
			 * @method adjustedPositionAndPlacementArrow
			 * @param {ns.widget.core.ContextPopup} self
			 * @param {Object} bestRectangle
			 * @param {number} x
			 * @param {number} y
			 * @private
			 * @member ns.widget.core.ContextPopup
			 */
			function adjustedPositionAndPlacementArrow(self, bestRectangle, x, y) {
				var ui = self._ui,
					wrapper = ui.wrapper,
					arrow = ui.arrow,
					popupElement = self.element,
					arrowStyle = arrow.style,
					windowWidth = window.innerWidth,
					windowHeight = window.innerHeight,
					wrapperRect = wrapper.getBoundingClientRect(),
					arrowHalfWidth = arrow.offsetWidth / 2,
					popupProperties = {
						"padding-top": 0,
						"padding-bottom": 0,
						"padding-left": 0,
						"padding-right": 0,
						"border-top-width": 0,
						"border-left-width": 0,
						"box-sizing": null
					},
					wrapperProperties = {
						"margin-top": 0,
						"margin-bottom": 0,
						"margin-left": 0,
						"margin-right": 0,
						"padding-top": 0,
						"padding-bottom": 0,
						"padding-left": 0,
						"padding-right": 0
					},
					margins,
					params = {
						"t": {pos: x, min: "left", max: "right", posField: "x", valField: "w", styleField: "left"},
						"b": {pos: x, min: "left", max: "right", posField: "x", valField: "w", styleField: "left"},
						"l": {pos: y, min: "top", max: "bottom", posField: "y", valField: "h", styleField: "top"},
						"r": {pos: y, min: "top", max: "bottom", posField: "y", valField: "h", styleField: "top"}
					},
					param = params[bestRectangle.dir],
					surplus,
					addPadding;

				domUtils.extractCSSProperties(popupElement, popupProperties);
				domUtils.extractCSSProperties(wrapper, wrapperProperties);
				addPadding = popupProperties["box-sizing"] === "border-box";
				margins	= {
					"t": popupProperties["padding-top"] + wrapperProperties["margin-top"] + wrapperProperties["padding-top"],
					"b": popupProperties["padding-bottom"] + wrapperProperties["margin-bottom"] + wrapperProperties["padding-bottom"],
					"l": popupProperties["padding-left"] + wrapperProperties["margin-left"] + wrapperProperties["padding-left"],
					"r": popupProperties["padding-right"] + wrapperProperties["margin-right"] + wrapperProperties["padding-right"]
				};

				// value of coordinates of proper edge of wrapper
				wrapperRect = {
					// x-coordinate of left edge
					left: margins.l + bestRectangle.x,
					// x-coordinate of right edge
					right: margins.l + wrapperRect.width + bestRectangle.x,
					// y-coordinate of top edge
					top: margins.t + bestRectangle.y,
					// y-coordinate of bottom edge
					bottom: wrapperRect.height + margins.t + bestRectangle.y
				};

				if (wrapperRect[param.min] > param.pos - arrowHalfWidth) {
					surplus = bestRectangle[param.posField];
					if (surplus > 0) {
						bestRectangle[param.posField] = Math.max(param.pos - arrowHalfWidth, 0);
						param.pos = bestRectangle[param.posField] + arrowHalfWidth;
					} else {
						param.pos = wrapperRect[param.min] + arrowHalfWidth;
					}
				} else if (wrapperRect[param.max] < param.pos + arrowHalfWidth) {
					surplus = (param.valField === "w" ? windowWidth : windowHeight)
						- (bestRectangle[param.posField] + bestRectangle[param.valField]);
					if (surplus > 0) {
						bestRectangle[param.posField] += Math.min(surplus, (param.pos + arrowHalfWidth) - wrapperRect[param.max]);
						param.pos = bestRectangle[param.posField] + bestRectangle[param.valField] - arrowHalfWidth;
					} else {
						param.pos = wrapperRect[param.max] - arrowHalfWidth;
					}
				}

				arrowStyle[param.styleField] = (param.pos - arrowHalfWidth - bestRectangle[param.posField] - (addPadding ? popupProperties["border-" + param.styleField + "-width"] : 0)) + "px";

				return bestRectangle;
			}

			/**
			 * Set top, left and margin for popup's container.
			 * @method _placementCoordsWindow
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._placementCoordsWindow = function(element) {
				var elementStyle = element.style,
					elementWidth = element.offsetWidth,
					elementHeight = element.offsetHeight,
					elementMarginTop = domUtils.getCSSProperty(element, "margin-top", 0, "float"),
					elementTop = window.innerHeight - elementHeight - elementMarginTop;

				elementStyle.top = elementTop + "px";
				elementStyle.left = "50%";
				elementStyle.marginLeft = -(elementWidth / 2) + "px";
			};

			/**
			 * Set top, left and margin for popup's container.
			 * @method _placementCoordsAbsolute
			 * @param {HTMLElement} element
			 * @param {number} x
			 * @param {number} y
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._placementCoordsAbsolute = function(element, x, y) {
				var elementStyle = element.style,
					elementWidth = element.offsetWidth,
					elementHeight = element.offsetHeight;

				elementStyle.top = y + "px";
				elementStyle.left = x + "px";
				elementStyle.marginTop = -(elementHeight / 2) + "px";
				elementStyle.marginLeft = -(elementWidth / 2) + "px";
			};

			/**
			 * Find clicked element.
			 * @method _findClickedElement
			 * @param {number} x
			 * @param {number} y
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._findClickedElement = function(x, y) {
				return document.elementFromPoint(x, y);
			};

			/**
			 * Emulate position of event for clicked element.
			 * @method emulatePositionOfClick
			 * @param {string} bestDirection direction of arrow
			 * @param {HTMLElement} clickedElement
			 * @private
			 * @member ns.widget.core.ContextPopup
			 */
			function emulatePositionOfClick(bestDirection, clickedElement) {
				var clickedElementRect = clickedElement.getBoundingClientRect(),
					position = {};

				switch(bestDirection) {
					case "l":
						// the arrow will be on the left edge of container, so x-coordinate
						// should have value equals to the position of right edge of clicked element
						position.x = clickedElementRect.right;
						// y-coordinate should have value equals to the position of top edge of clicked
						// element plus half of its height
						position.y = clickedElementRect.top + clickedElementRect.height / 2;
						break;
					case "r":
						// the arrow will be on the right edge of container
						position.x = clickedElementRect.left;
						position.y =  clickedElementRect.top + clickedElementRect.height / 2;
						break;
					case "t":
						// the arrow will be on the top edge of container
						position.x = clickedElementRect.left + clickedElementRect.width / 2;
						position.y = clickedElementRect.bottom;
						break;
					case "b":
						// the arrow will be on the bottom edge of container
						position.x = clickedElementRect.left + clickedElementRect.width / 2;
						position.y = clickedElementRect.top;
						break;
				}
				return position;
			}

			prototype._placementCoordsOrigin = function (clickedElement, options) {
				var self = this,
					element = self.element,
					elementStyle = element.style,
					elementClassList = element.classList,
					x = options.x,
					y = options.y,
					bestRectangle,
					emulatedPosition,
					arrowType,
					elementHeight;

				elementClassList.add(classes.context);

				elementHeight = element.offsetHeight;
				bestRectangle = findBestPosition(self, clickedElement);

				arrowType = bestRectangle.dir;
				elementClassList.add(classes.arrowDir + arrowType);
				self._ui.arrow.setAttribute("type", arrowType);

				if ((typeof x !== "number" && typeof y !== "number") || self.options.positionOriginCenter) {
					// if we found element, which was clicked, but the coordinates of event
					// was not available, we have to count these coordinates to the center of proper edge of element.
					emulatedPosition = emulatePositionOfClick(arrowType, clickedElement);
					x = emulatedPosition.x;
					y = emulatedPosition.y;
				}
				bestRectangle = adjustedPositionAndPlacementArrow(self, bestRectangle, x, y);

				if (elementHeight > bestRectangle.h) {
					self._setContentHeight(bestRectangle.h);
				}

				elementStyle.left = bestRectangle.x + "px";
				elementStyle.top = bestRectangle.y + "px";
			};

			prototype._placementCoordsElement = function (clickedElement, options) {
				var self = this,
					element = self.element,
					elementStyle = element.style,
					bestRectangle,
					elementHeight;

				element.classList.add(classes.context);

				elementHeight = element.offsetHeight;
				bestRectangle = findBestPosition(self, clickedElement);

				if (elementHeight > bestRectangle.h) {
					self._setContentHeight(bestRectangle.h);
				}

				elementStyle.left = bestRectangle.x + "px";
				elementStyle.top = bestRectangle.y + "px";
			};

			/**
			 * Find and set the best position for popup.
			 * @method _placementCoords
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._placementCoords = function(options) {
				var self = this,
					positionTo = options.positionTo,
					x = options.x,
					y = options.y,
					element = self.element,
					elementHeight,
					clickedElement,
					link;

				switch (positionTo) {
					case positionTypes.ORIGIN:
						// if we know x-coord and y-coord, we open the popup with arrow
						link = options.link;
						if (link) {
							if (typeof link === "string") {
								clickedElement = document.getElementById(link);
							} else if (typeof link === "object") {
								clickedElement = link;
							}
						} else if (typeof x === "number" && typeof y === "number") {
							clickedElement = self._findClickedElement(x, y);
						}
						if (clickedElement) {
							self._placementCoordsOrigin(clickedElement, options);
							return;
						}
						break;
					case positionTypes.WINDOW:
						self._placementCoordsWindow(element);
						return;
						break;
					case positionTypes.ABSOLUTE:
						if (typeof x === "number" && typeof y === "number") {
							self._placementCoordsAbsolute(element, x, y);
							return;
						}
						break;
					default:
						// there is posible, that element or its id was given
						if (typeof positionTo === "string") {
							try {
								clickedElement = document.querySelector(options.positionTo);
							} catch(e) {}
						} else if (typeof positionTo === "object") {
							clickedElement = positionTo;
						}
						if (clickedElement) {
							self._placementCoordsElement(clickedElement, options);
							return;
						}
						break;
				}

				// if there was problem with setting position of popup, we set its position to window
				self._placementCoordsWindow(element);
			};

			/**
			 * Set height for popup's container.
			 * @method _setContentHeight
			 * @param {number} maxHeight
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._setContentHeight = function(maxHeight) {
				var self = this,
					element = self.element,
					content = self._ui.content,
					contentStyle,
					contentHeight,
					elementOffsetHeight;

				if (content) {
					contentStyle = content.style;

					if (contentStyle.height || contentStyle.minHeight) {
						contentStyle.height = "";
						contentStyle.minHeight = "";
					}

					maxHeight = maxHeight || window.innerHeight;

					contentHeight = content.offsetHeight;
					elementOffsetHeight = element.offsetHeight;

					if (elementOffsetHeight > maxHeight) {
						contentHeight -= (elementOffsetHeight - maxHeight);
						contentStyle.height = contentHeight + "px";
						contentStyle.minHeight = contentHeight + "px";
					}
				}
			};

			/**
			 * Hide popup.
			 * @method _onHide
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._onHide = function() {
				var self = this,
					ui = self._ui,
					element = self.element,
					elementClassList = element.classList,
					content = ui.content,
					arrow = ui.arrow;

				elementClassList.remove(classes.context);
				["l", "r", "b", "t"].forEach(function(key) {
					elementClassList.remove(classes.arrowDir + key);
				});

				// we remove styles for element, which are changed
				// styles for container, header and footer are left unchanged
				element.removeAttribute("style");
				arrow.removeAttribute("style");

				PopupPrototype._onHide.call(self);
			};

			/**
			 * Destroy popup.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._destroy = function() {
				var self = this,
					element = self.element,
					ui = self._ui,
					arrow = ui.arrow;

				PopupPrototype._destroy.call(self);

				if (arrow && arrow.parentNode) {
					arrow.parentNode.removeChild(arrow);
				}

				ui.arrow = null;
			};

			/**
			 * Set new position for popup.
			 * @method reposition
			 * @param options
			 * @param options.x
			 * @param options.y
			 * @param options.positionTo
			 * @member ns.widget.core.ContextPopup
			 */
			prototype.reposition = function(options) {
				if (this._isActive()) {
					this._reposition(options);
				}
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._refresh = function() {
				if (this._isActive()) {
					PopupPrototype._refresh.call(this);
					this.reposition(this.options);
				}
			};

			ContextPopup.prototype = prototype;
			ns.widget.core.ContextPopup = ContextPopup;

			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"reposition"
				],
				ContextPopup,
				"core",
				true
			);

			// @remove
			// THIS IS ONLY FOR COMPATIBILITY
			ns.widget.popup = ns.widget.Popup;

			}(window, window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */

/**
 * # Popup Widget
 * Shows a pop-up window.
 *
 * The popup widget shows in the middle of the screen a list of items in a pop-up window. It automatically optimizes the pop-up window size within the screen. The following table describes the supported popup classes.
 *
 * ## Default selectors
 * All elements with class *ui-popup* will be become popup widgets.
 *
 * The pop-up window can contain a header, content, and footer area like the page element.
 *
 * To open a pop-up window from a link, use the data-rel attribute in HTML markup as in the following code:
 *
 *      @example
 *      <a href="#popup" class="ui-btn" data-rel="popup">Open popup when clicking this element.</a>
 *
 * The following table shows examples of various types of popups.
 *
 * The popup contains header, content and footer area
 *
 * ###HTML Examples
 *
 * #### Basic popup with header, content, footer
 *
 *		@example
 *		<div class="ui-page">
 *		    <div class="ui-popup">
 *		        <div class="ui-popup-header">Power saving mode</div>
 *		        <div class="ui-popup-content">
 *		            Turning on Power
 *		            saving mode will
 *		            limit the maximum
 *		            per
 *		        </div>
 *		        <div class="ui-popup-footer">
 *		            <button id="cancel" class="ui-btn">Cancel</button>
 *		        </div>
 *		    </div>
 *		</div>
 *
 * #### Popup with 2 buttons in the footer
 *
 *      @example
 *         <div id="2btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Delete</div>
 *             <div class="ui-popup-content">
 *                 Delete the image?
 *             </div>
 *             <div class="ui-popup-footer ui-grid-col-2">
 *                 <button id="2btnPopup-cancel" class="ui-btn">Cancel</button>
 *                 <button id="2btnPopup-ok" class="ui-btn">OK</button>
 *             </div>
 *         </div>
 *
 * #### Popup with checkbox/radio
 *
 * If you want make popup with list checkbox(or radio) just include checkbox (radio) to popup and add class *ui-popup-checkbox-label* to popup element.
 *
 *		@example
 *         <div id="listBoxPopup" class="ui-popup">
 *             <div class="ui-popup-header">When?</div>
 *             <div class="ui-popup-content" style="height:243px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="check-1" class="ui-popup-checkbox-label">Yesterday</label>
 *                         <input type="checkbox" name="checkset" id="check-1" />
 *                     </li>
 *                     <li>
 *                         <label for="check-2" class="ui-popup-checkbox-label">Today</label>
 *                         <input type="checkbox" name="checkset" id="check-2" />
 *                     </li>
 *                     <li>
 *                         <label for="check-3" class="ui-popup-checkbox-label">Tomorrow</label>
 *                         <input type="checkbox" name="checkset" id="check-3" />
 *                     </li>
 *                 </ul>
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="radio-1" class="ui-popup-radio-label">Mandatory</label>
 *                         <input type="radio" name="radioset" id="radio-1" />
 *                     </li>
 *                     <li>
 *                         <label for="radio-2" class="ui-popup-radio-label">Optional</label>
 *                         <input type="radio" name="radioset" id="radio-2" />
 *                     </li>
 *                 </ul>
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="listBoxPopup-close" class="ui-btn">Close</button>
 *             </div>
 *         </div>
 *     </div>
 *
 * #### Popup with no header and footer
 *
 *      @example
 *         <div id="listNoTitleNoBtnPopup" class="ui-popup">
 *             <div class="ui-popup-content" style="height:294px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li><a href="">Ringtones 1</a></li>
 *                     <li><a href="">Ringtones 2</a></li>
 *                     <li><a href="">Ringtones 3</a></li>
 *                 </ul>
 *             </div>
 *         </div>
 *
 * #### Toast popup
 *
 *      @example
 *         <div id="PopupToast" class="ui-popup ui-popup-toast">
 *             <div class="ui-popup-content">Saving contacts to sim on Samsung</div>
 *         </div>
 *
 * ### Create Option popup
 *
 * Popup inherits value of option positionTo from property data-position-to set in link.
 *
 *		@example
 *		<!--definition of link, which opens popup and sets its position-->
 *		<a href="#popupOptionText" data-rel="popup"  data-position-to="origin">Text</a>
 *		<!--definition of popup, which inherites property position from link-->
 *		<div id="popupOptionText" class="ui-popup">
 *			<div class="ui-popup-content">
 *				<ul class="ui-listview">
 *				<li><a href="#">Option 1</a></li>
 *				<li><a href="#">Option 2</a></li>
 *				<li><a href="#">Option 3</a></li>
 *				<li><a href="#">Option 4</a></li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * ### Opening and closing popup
 *
 * To open popup from "a" link using html markup, use the following code:
 *
 *		@example
 *      <div class="ui-page">
 *          <header class="ui-header">
 *              <h2 class="ui-title">Call menu</h2>
 *          </header>
 *          <div class="ui-content">
 *              <a href="#popup" class="ui-btn" data-rel="popup" >Open Popup</a>
 *          </div>
 *
 *          <div id="popup" class="ui-popup">
 *               <div class="ui-popup-header">Power saving mode</div>
 *                   <div class="ui-popup-content">
 *                       Turning on Power
 *                       saving mode will
 *                       limit the maximum
 *                       per
 *                   </div>
 *               <div class="ui-popup-footer">
 *               <button id="cancel" class="ui-btn">Cancel</button>
 *           </div>
 *       </div>
 *
 *  To open the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.openPopup("popup")
 *
 *  To close the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.closePopup("popup")
 *
 * To find the currently active popup, use the ui-popup-active class.
 *
 * To bind the popup to a button, use the following code:
 *
 *      @example
 *         <!--HTML code-->
 *         <div id="1btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Power saving mode</div>
 *             <div class="ui-popup-content">
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="1btnPopup-cancel" class="ui-btn">Cancel</button>
 *             </div>
 *         </div>
 *         <script>
 *             // Popup opens with button click
 *             var button = document.getElementById("button");
 *             button.addEventListener("click", function() {
 *                 tau.openPopup("#1btnPopup");
 *             });
 *
 *             // Popup closes with Cancel button click
 *             document.getElementById("1btnPopup-cancel").addEventListener("click", function() {
 *                 tau.closePopup();
 *             });
 *         </script>
 *
 * ## Manual constructor
 * For manual creation of popup widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Options for Popup Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 *		popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * ## Transitions
 *
 * By default, the framework doesn't apply transition. To set a custom transition effect, add the data-transition attribute to the link.
 *
 *		@example
 *		<a href="index.html" data-rel="popup" data-transition="slideup">I'll slide up</a>
 *
 * Global configuration:
 *
 *		@example
 *		gear.ui.defaults.popupTransition = "slideup";
 *
 * ### Transitions list
 *
 * - **none** Default value, no transition.
 * - **slideup** Makes the content of the pop-up slide up.
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *      @example
 *         <!--Popup html code-->
 *         <div id="popup" class="ui-popup">
 *             <div class="ui-popup-header"></div>
 *             <div class="ui-popup-content"></div>
 *         </div>
 *         </div>
 *         <script>
 *             // Use popup events
 *             var popup = document.getElementById("popup");
 *             popup.addEventListener("popupbeforecreate", function() {
 *                 // Implement code for popupbeforecreate event
 *             });
 *         </script>
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.core.Popup
 * @extends ns.widget.core.ContextPopup
 */
(function (window, document, ns) {
	"use strict";
	
			var CorePopup = ns.widget.core.ContextPopup,

				CorePopupPrototype = CorePopup.prototype,

				engine = ns.engine,

				objectUtils = ns.util.object,

				domUtils = ns.util.DOM,

				defaults = {
					fullSize: false,
					enablePopupScroll: false
				},

				classes = objectUtils.merge({}, CorePopup.classes, {
					popupScroll: "ui-scroll-on",
					fixed: "ui-fixed",
					sideButton: "ui-side-button",
					hasSideButtons: "ui-has-side-buttons",
					toast: "ui-popup-toast",
					ctx: "ui-ctxpopup"
				}),

				Popup = function () {
					var self = this;

					CorePopup.call(self);
					self.options = objectUtils.merge(self.options, {
						fullSize: ns.getConfig("popupFullSize", defaults.fullSize),
						enablePopupScroll: ns.getConfig("enablePopupScroll", defaults.enablePopupScroll)
					});
				},

				prototype = new CorePopup();

			/**
			 * Layouting popup structure
			 * @method layout
			 * @member ns.widget.wearable.Popup
			 */
			prototype._layout = function (element) {
				var self = this,
					elementClassList = element.classList,
					ui = self._ui,
					wrapper = ui.wrapper,
					header = ui.header,
					footer = ui.footer,
					content = ui.content,
					headerHeight = 0,
					footerHeight = 0;

				self._blockPageScroll();

				CorePopupPrototype._layout.call(self, element);

				if (self.options.enablePopupScroll === true) {
					element.classList.add(classes.popupScroll);
				} else {
					element.classList.remove(classes.popupScroll);
				}

				if (elementClassList.contains(classes.popupScroll)) {
					elementClassList.add(classes.build);

					if (header) {
						headerHeight = header.offsetHeight;
						if (header.classList.contains(classes.fixed)) {
							content.style.marginTop = headerHeight + "px";
						}
					}
					if (footer) {
						footerHeight = footer.offsetHeight;
						if (footer.classList.contains(classes.fixed)) {
							content.style.marginBottom = footerHeight + "px";
						}
						if (footer.classList.contains(classes.sideButton)) {
							elementClassList.add(classes.hasSideButtons);
						}
					}

					wrapper.style.height = Math.min(content.offsetHeight + headerHeight + footerHeight, element.offsetHeight) + "px";

					elementClassList.remove(classes.build);
				}

				if (self.options.fullSize && !elementClassList.contains(classes.toast) && !elementClassList.contains(classes.ctx)) {
					wrapper.style.height = window.innerHeight + "px";
				}
			};

			/**
			 * Hide popup.
			 * @method _onHide
			 * @protected
			 * @member ns.widget.wearable.Popup
			 */
			prototype._onHide = function() {
				var self = this,
					ui = self._ui,
					wrapper = ui.wrapper;

				wrapper.removeAttribute("style");
				self._unblockPageScroll();
				CorePopupPrototype._onHide.call(self);
			};

			prototype._blockPageScroll = function() {
				var page = ns.widget.Page(this._ui.page);
				if (page.getScroller) {
					page.getScroller().style.overflow = "hidden";
				}
			};

			prototype._unblockPageScroll = function() {
				var page = ns.widget.Page(this._ui.page);
				if (page.getScroller) {
					page.getScroller().style.overflow = "";
				}
			};

			Popup.prototype = prototype;
			ns.widget.wearable.Popup = Popup;

			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"reposition"
				],
				Popup,
				"wearable",
				true
			);

			}(window, window.document, ns));

/*global window, define, XMLHttpRequest */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Load Utility
 * Object contains function to load external resources.
 * @class ns.util.load
 */
(function (document, ns) {
	'use strict';
	
			/**
			 * Local alias for document HEAD element
			 * @property {HTMLHeadElement} head
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			var head = document.head,
				/**
				 * Local alias for document styleSheets element
				 * @property {HTMLStyleElement} styleSheets
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				styleSheets = document.styleSheets,
				/**
				 * Local alias for ns.util.DOM
				 * @property {Object} utilsDOM Alias for {@link ns.util.DOM}
				 * @member ns.util.load
				 * @static
				 * @private
				 */
				utilDOM = ns.util.DOM,
				getNSData = utilDOM.getNSData,
				setNSData = utilDOM.setNSData,
				load = ns.util.load || {},
				/**
				 * Regular expression for extracting path to the image
				 * @property {RegExp} IMAGE_PATH_REGEXP
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				IMAGE_PATH_REGEXP = /url\((\.\/)?images/gm,
				/**
				 * Regular expression for extracting path to the css
				 * @property {RegExp} CSS_FILE_REGEXP
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				CSS_FILE_REGEXP = /[^/]+\.css$/;

			/**
			 * Load file
			 * (synchronous loading)
			 * @method loadFileSync
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			 function loadFileSync(scriptPath, successCB, errorCB) {
				var xhrObj = new XMLHttpRequest();

				// open and send a synchronous request
				xhrObj.open('GET', scriptPath, false);
				xhrObj.send();
				// add the returned content to a newly created script tag
				if (xhrObj.status === 200 || xhrObj.status === 0) {
					if (typeof successCB === 'function') {
						successCB(xhrObj, xhrObj.status);
					}
				} else {
					if (typeof errorCB === 'function') {
						errorCB(xhrObj, xhrObj.status, new Error(xhrObj.statusText));
					}
				}
			}

			/**
			 * Callback function on javascript load success
			 * @method scriptSyncSuccess
			 * @private
			 * @static
			 * @param {?Function} successCB
			 * @param {?Function} xhrObj
			 * @param {?string} status
			 * @member ns.util.load
			 */
			function scriptSyncSuccess(successCB, xhrObj, status) {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.text = xhrObj.responseText;
				document.body.appendChild(script);
				if (typeof successCB === 'function') {
					successCB(xhrObj, status);
				}
			}


			/**
			 * Add script to document
			 * (synchronous loading)
			 * @method scriptSync
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @member ns.util.load
			 */
			function scriptSync(scriptPath, successCB, errorCB) {
				loadFileSync(scriptPath, scriptSyncSuccess.bind(null, successCB), errorCB);
			}

			/**
			 * Callback function on css load success
			 * @method cssSyncSuccess
			 * @param {string} cssPath
			 * @param {?Function} successCB
			 * @param {?Function} xhrObj
			 * @member ns.util.load
			 * @static
			 * @private
			 */
			function cssSyncSuccess(cssPath, successCB, xhrObj) {
				var css = document.createElement('style');
				css.type = 'text/css';
				css.textContent = xhrObj.responseText.replace(
					IMAGE_PATH_REGEXP,
					'url(' + cssPath.replace(CSS_FILE_REGEXP, 'images')
				);
				if (typeof successCB === 'function') {
					successCB(css);
				}
			}

			/**
			 * Add css to document
			 * (synchronous loading)
			 * @method cssSync
			 * @param {string} cssPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			function cssSync(cssPath, successCB, errorCB) {
				loadFileSync(cssPath, cssSyncSuccess.bind(null, cssPath, successCB), errorCB);
			}

			/**
			 * Add element to head tag
			 * @method addElementToHead
			 * @param {HTMLElement} element
			 * @param {boolean} [asFirstChildElement=false]
			 * @member ns.util.load
			 * @static
			 */
			function addElementToHead(element, asFirstChildElement) {
				var firstElement;
				if (head) {
					if (asFirstChildElement) {
						firstElement = head.firstElementChild;
						if (firstElement) {
							head.insertBefore(element, firstElement);
							return;
						}
					}
					head.appendChild(element);
				}
			}

			/**
			 * Create HTML link element with href
			 * @method makeLink
			 * @param {string} href
			 * @returns {HTMLLinkElement}
			 * @member ns.util.load
			 * @static
			 */
			function makeLink(href) {
				var cssLink = document.createElement('link');
				cssLink.setAttribute('rel', 'stylesheet');
				cssLink.setAttribute('href', href);
				cssLink.setAttribute('name', 'tizen-theme');
				return cssLink;
			}

			/**
			 * Adds the given node to document head or replaces given 'replaceElement'.
			 * Additionally adds 'name' and 'theme-name' attribute
			 * @param {HTMLElement} node Element to be placed as theme link
			 * @param {string} themeName Theme name passed to the element
			 * @param {HTMLElement} [replaceElement=null] If replaceElement is given it gets replaced by node
			 */
			function addNodeAsTheme(node, themeName, replaceElement) {
				setNSData(node, 'name', 'tizen-theme');
				setNSData(node, 'theme-name', themeName);

				if (replaceElement) {
					replaceElement.parentNode.replaceChild(node, replaceElement);
				} else {
					addElementToHead(node, true);
				}
			}

			/**
			 * Add css link element to head if not exists
			 * @method themeCSS
			 * @param {string} path
			 * @param {string} themeName
			 * @param {boolean} [embed=false] Embeds the CSS content to the document
			 * @member ns.util.load
			 * @static
			 */
			function themeCSS(path, themeName, embed) {
				var i,
					styleSheetsLength = styleSheets.length,
					ownerNode,
					previousElement = null,
					linkElement;
				// Find css link or style elements
				for (i = 0; i < styleSheetsLength; i++) {
					ownerNode = styleSheets[i].ownerNode;

					// We try to find a style / link node that matches current style or is linked to
					// the proper theme. We cannot use ownerNode.href because this returns the absolute path
					if (getNSData(ownerNode, 'name') === 'tizen-theme' || ownerNode.getAttribute("href") === path) {
						if (getNSData(ownerNode, 'theme-name') === themeName) {
							// Nothing to change
							return;
						}
						previousElement = ownerNode;
						break;
					}
				}

				if (embed){
					// Load and replace old styles or append new styles
					cssSync(path, function onSuccess(styleElement) {
						addNodeAsTheme(styleElement, themeName, previousElement);
					}, function onFailure(xhrObj, xhrStatus, errorObj) {
						ns.warn("There was a problem when loading '" + themeName + "', status: " + xhrStatus);
					});
				} else {
					linkElement = makeLink(path);
					addNodeAsTheme(linkElement, themeName, previousElement);
				}
			}

			/**
			 * In debug mode add time to url to disable cache
			 * @property {string} cacheBust
			 * @member ns.util.load
			 * @static
			 */
			load.cacheBust = (document.location.href.match(/debug=true/)) ? '?cacheBust=' + (new Date()).getTime() : '';
			// the binding a local methods with the namespace
			load.scriptSync = scriptSync;
			load.addElementToHead = addElementToHead;
			load.makeLink = makeLink;
			load.themeCSS = themeCSS;

			ns.util.load = load;
			}(window.document, ns));

/*global window, define, Math, ns*/
/*jslint bitwise: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Theme object
 * Class with functions to set theme of application.
 * @class ns.theme
 */
(function (window, document, ns) {
	"use strict";
			/**
			 * Local alias for document HEAD element
			 * @property {HTMLHeadElement} head
			 * @static
			 * @private
			 * @member ns.theme
			 */
			var head = document.head,
				documentElement = document.documentElement,
				frameworkData = ns.frameworkData,
				util = ns.util,
				DOM = util.DOM,
				load = util.load,
				support = ns.support,

				stopEvent = function (event) {
					var element = event.target,
						tag = element.tagName.toLowerCase(),
						type = element.type;
					if ((tag !== "input" ||
							(type !== "text" && type !== "email" && type !== "url" && type !== "search" && type !== "tel")) &&
							tag !== "textarea") {
						event.stopPropagation();
						event.preventDefault();
					}
				},

				THEME_JS_FILE_NAME = "theme.js",
				THEME_CSS_FILE_NAME = "tau",

				themeRegex =  /ui-(bar|body|overlay)-([a-z])\b/,
				deviceWidthRegex = /.*width=(device-width|\d+)\s*,?.*$/gi;

			ns.theme = {
				/**
				 * Standard theme
				 * @property {string} theme="s"
				 * @member ns.theme
				 */
				theme: "s",

				_activeTheme: null,

				/**
				 * This function inits theme.
				 * @method init
				 * @param {HTMLElement} container
				 * @member ns.theme
				 */
				init: function (container) {
					var self = this,
						containerClassList = container.classList;

					if (frameworkData) {
						frameworkData.getParams();
					}

					if (support && support.gradeA()) {
						documentElement.classList.add("ui-mobile");
						containerClassList.add("ui-mobile-viewport");
					}

					if (frameworkData) {
						self.loadTheme(frameworkData.theme);
					}
				},

				/**
				 * This function scales font size.
				 * @method scaleBaseFontSize
				 * @param {number} themeDefaultFontSize Default font size
				 * @param {number} ratio Scaling ration
				 * @member ns.theme
				 */
				scaleBaseFontSize : function (themeDefaultFontSize, ratio) {
					var scaledFontSize = Math.max(themeDefaultFontSize * ratio | 0, 4);
					documentElement.style.fontSize = scaledFontSize + "px";
					document.body.style.fontSize = scaledFontSize + "px";
				},

				/**
				 * This function searches theme, which is inherited
				 * from parents by element.
				 * @method getInheritedTheme
				 * @param {HTMLElement} element Element for which theme is looking for.
				 * @param {string} defaultTheme Default theme.
				 * It is used if no theme, which can be inherited, is found.
				 * @return {string} Inherited theme
				 * @member ns.theme
				 */
				getInheritedTheme: function (element, defaultTheme) {
					var theme,
						parentElement = element.parentNode,
						parentClasses,
						parentTheme;

					theme = DOM.getNSData(element, "theme");

					if (!theme) {
						while (parentElement) {
							parentClasses = parentElement.className || "";
							parentTheme = themeRegex.exec(parentClasses);
							if (parentClasses && parentTheme && parentTheme.length > 2) {
								theme = parentTheme[2];
								break;
							}
							parentElement = parentElement.parentNode;
						}
					}
					return theme || defaultTheme;
				},

				/**
				 * This function sets selection behavior for the element.
				 * @method enableSelection
				 * @param {HTMLElement} element Element for which selection behavior is set.
				 * @param {"text"|"auto"|"none"} value="auto" Selection behavior.
				 * @return {HTMLElement} Element with set styles.
				 * @member ns.theme
				 */
				enableSelection: function (element, value) {
					var val,
						elementStyle;

					switch (value) {
					case "text":
					case "auto":
					case "none":
						val = value;
						break;
					default:
						val = "auto";
						break;
					}

					if (element === document) {
						element = document.body;
					}

					elementStyle = element.style;
					elementStyle.MozUserSelect = elementStyle.webkitUserSelect = elementStyle.userSelect = val;

					return element;
				},

				/**
				 * This function disables event "contextmenu".
				 * @method disableContextMenu
				 * @param {HTMLElement} element Element for which event "contextmenu"
				 * is disabled.
				 * @member ns.theme
				 */
				disableContextMenu: function (element) {
					element.addEventListener("contextmenu", stopEvent, true);
				},

				/**
				 * This function enables event "contextmenu".
				 * @method enableContextMenu
				 * @param {HTMLElement} element Element for which event "contextmenu"
				 * is enabled.
				 * @member ns.theme
				 */
				enableContextMenu: function (element) {
					element.removeEventListener("contextmenu", stopEvent, true);
				},

				/**
				 * This function loads files with proper theme.
				 * @method loadTheme
				 * @param {string} theme Choosen theme.
				 * @member ns.theme
				 */
				loadTheme: function(theme) {
					var self = this,
						themePath = frameworkData.themePath,
						themeName = THEME_CSS_FILE_NAME,
						cssPath,
						isMinified = frameworkData.minified,
						jsPath;

					// If the theme has been loaded do not repeat that process
					if (frameworkData.themeLoaded) {
												return;
					}

					if (frameworkData.frameworkName !== "tau") {
						themeName = "tizen-web-ui-fw-theme";
					}
					if (isMinified) {
						cssPath = themePath + "/" + themeName + ".min.css";
					} else {
						cssPath = themePath + "/" + themeName + ".css";
					}

					
					load.themeCSS(cssPath, theme);
					jsPath = themePath + "/" + THEME_JS_FILE_NAME;
										load.scriptSync(jsPath);

					if (support.gradeA()) {
						self.setScaling();
					}

					frameworkData.themeLoaded = true;
				},

				/**
				 * This function sets viewport.
				 * If custom viewport is found, its width will be returned.
				 * Otherwise, the new viewport will be created.
				 * @method setViewport
				 * @param {number|string} viewportWidth Width of the new viewport.
				 * If no viewport is found, the new viewport with this
				 * width is created.
				 * @return {string} Width of custom viewport.
				 * @member ns.theme
				 */
				setViewport: function(viewportWidth) {
					var metaViewport = document.querySelector("meta[name=viewport]"),
						content;

					if (metaViewport) {
						// Found custom viewport!
						content = metaViewport.getAttribute("content");
						viewportWidth = content.replace(deviceWidthRegex, "$1");
					} else {
						// Create a meta tag
						metaViewport = document.createElement("meta");
						metaViewport.name = "viewport";
						content = "width=" + viewportWidth + ", user-scalable=no";
						metaViewport.content = content;
						head.insertBefore(metaViewport, head.firstChild);
					}
					return viewportWidth;
				},

				/**
				 * This function checks if application is run
				 * in the mobile browser.
				 * @method isMobileBrowser
				 * @return {boolean} Returns true, if application
				 * is run in mobile browser. Otherwise, false is returned.
				 * @member ns.theme
				 */
				isMobileBrowser: function() {
					return window.navigator.appVersion.indexOf("Mobile") > -1;
				},

				/**
				 * This function sets scaling of viewport.
				 * @method setScaling
				 * @member ns.theme
				 */
				setScaling: function () {
					var self = this,
						viewportWidth = frameworkData.viewportWidth,
						themeDefaultFontSize = frameworkData.defaultFontSize, // comes from theme.js
						ratio = 1;

					// Keep original font size
					document.body.setAttribute("data-tizen-theme-default-font-size", themeDefaultFontSize);

					if (ns.theme.isMobileBrowser()) {
						// Legacy support: tizen.frameworkData.viewportScale
						if (frameworkData.viewportScale === true) {
							viewportWidth = "screen-width";
						}

						// screen-width support
						if ("screen-width" === viewportWidth) {
							if (window.self === window.top) {
								// Top frame: for target. Use window.outerWidth.
								viewportWidth = window.outerWidth;
							} else {
								// iframe: for web simulator. Use clientWidth.
								viewportWidth = document.documentElement.clientWidth;
							}
						}

						// set viewport meta tag
						// If custom viewport setting exists, get viewport width
						viewportWidth = self.setViewport(viewportWidth);

						if (viewportWidth !== "device-width") {
							ratio = parseFloat(viewportWidth / ns.frameworkData.defaultViewportWidth);
							self.scaleBaseFontSize(themeDefaultFontSize, ratio);
						}
					}
				}
			};

			document.addEventListener("themeinit", function (evt) {
				var router = evt.detail;
				if (router && ns.getConfig("autoInitializePage", true)) {
					ns.theme.init(router.getContainer().element);
				}
			}, false);

			}(window, window.document, ns));

/*global define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Router
 * Namespace for routers
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.router
 */
(function (ns) {
	"use strict";
				ns.router = ns.router || {};
			}(ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #History
 * Object controls history changes.
 *
 * @class ns.router.history
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	"use strict";
				var historyVolatileMode,
				object = ns.util.object,
				historyUid = 0,
				historyActiveIndex = 0,
				windowHistory = window.history,
				history = {
					/**
					 * Property contains active state in history.
					 * @property {Object} activeState
					 * @static
					 * @member ns.router.history
					 */
					activeState : null,

					/**
					 * This method replaces or pushes state to history.
					 * @method replace
					 * @param {Object} state The state object
					 * @param {string} stateTitle The title of state
					 * @param {string} url The new history entry's URL
					 * @static
					 * @member ns.router.history
					 */
					replace: function (state, stateTitle, url) {
						var newState = object.merge({}, state, {
								uid: historyVolatileMode ? historyActiveIndex : ++historyUid,
								stateUrl: url,
								stateTitle: stateTitle
							});
						windowHistory[historyVolatileMode ? "replaceState" : "pushState"](newState, stateTitle, url);
						history.setActive(newState);
					},

					/**
					 * This method moves backward through history.
					 * @method back
					 * @static
					 * @member ns.router.history
					 */
					back: function () {
						windowHistory.back();
					},

					/**
					 * This method sets active state.
					 * @method setActive
					 * @param {Object} state Activated state
					 * @static
					 * @member ns.router.history
					 */
					setActive: function (state) {
						if (state) {
							history.activeState = state;
							historyActiveIndex = state.uid;

							if (state.volatileRecord) {
								history.enableVolatileRecord();
								return;
							}
						}

						history.disableVolatileMode();
					},

					/**
					 * This method returns "back" if state is in history or "forward" if it is new state.
					 * @method getDirection
					 * @param {Object} state Checked state
					 * @return {"back"|"forward"}
					 * @static
					 * @member ns.router.history
					 */
					getDirection: function (state) {
						if (state) {
							return state.uid < historyActiveIndex ? "back" : "forward";
						}
						return "back";
					},

					/**
					 * This method sets volatile mode to true.
					 * @method enableVolatileRecord
					 * @static
					 * @member ns.router.history
					 */
					enableVolatileRecord: function () {
						historyVolatileMode = true;
					},

					/**
					 * This method sets volatile mode to false.
					 * @method disableVolatileMode
					 * @static
					 * @member ns.router.history
					 */
					disableVolatileMode: function () {
						historyVolatileMode = false;
					}
				};
			ns.router.history = history;
			}(window, ns));

/*global window, define, ns */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #AssistPanel Component
 *
 * @class ns.widget.wearable.AssistPanel
 * @extends ns.widget.BaseWidget
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 */
(function (document, ns) {
	"use strict";
				/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.wearable.AssistPanel
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				/**
				 * @property {Object} selectors Alias for class ns.util.selectors
				 * @member ns.widget.wearable.AssistPanel
				 * @private
				 * @static
				 * @readonly
				 */
				selectors = ns.util.selectors,
				utilDOM = ns.util.DOM,
				events = ns.event,
				Gesture = ns.event.gesture,
				STATE = {
					CLOSED: "closed",
					OPENED: "opened",
					SLIDING: "sliding",
					SETTLING: "settling"
				},
				CUSTOM_EVENTS = {
					OPEN: "assistpanelopen",
					CLOSE: "assistpanelclose"
				},
				ORIENTATION = {
					HORIZONTAL: "horizontal",
					VERTICAL: "vertical"
				},
				POSITION = {
					TOP: "top",
					BOTTOM: "bottom",
					LEFT: "left",
					RIGHT: "right"
				},
				positionFactory = {},
				/**
				 * AssistPanel constructor
				 * @method AssistPanel
				 */
				AssistPanel = function () {
					var self = this;
					/**
					 * AssistPanel field containing options
					 * @property options.position {string} Position of AssistPanel ("left" or "right")
					 * @property options.duration {number} Duration of AssistPanel entrance animation
					 * @property options.handle {string} selector of AssistPanel handler
					 * @property options.handleTranslate {number}
					 * @property options.dragEdge {number}
					 * @property options.overlay {boolean} Sets whether to show an overlay when AssistPanel is open.
					 * @property options.target {string} Set assist panel target element as the css selector
					 * @property options.checkScroll {boolean}
					 * @property options.enable {boolean} Enable assist panel component
					 */
					self.options = {
						position : POSITION.BOTTOM,
						duration : 300,
						handle: ".ui-assist-arrow",
						handleTranslate: 0.15,
						dragEdge: 0.2,
						overlay: true,
						target: ".ui-page",
						checkScroll: true,
						enable: true
					};

					self._ui = {};
					self._pos = {
						cur: 0,
						start: 0
					};

					self._orientation = ORIENTATION.HORIZONTAL;
					self._state = STATE.CLOSED;
				},
				/**
				 * Dictionary object containing commonly used classes
				 * @property {Object} classes
				 * @member ns.widget.wearable.AssistPanel
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					page : "ui-page",
					name : "ui-assist-panel",
					left : "ui-assist-panel-left",
					right : "ui-assist-panel-right",
					top : "ui-assist-panel-top",
					bottom : "ui-assist-panel-bottom",
					overlay : "ui-assist-panel-overlay",
					open: "ui-assist-panel-open",
					close: "ui-assist-panel-close"
				},
				/**
				 * {Object} AssistPanel widget prototype
				 * @member ns.widget.wearable.AssistPanel
				 * @private
				 * @static
				 */
				prototype = new BaseWidget();

			AssistPanel.prototype = prototype;
			AssistPanel.classes = classes;

			(function() {
				var f = positionFactory,
					top = f[POSITION.TOP] = {xy: "y", dir:"Top", size: "Height", gravit: -1, openDir: "down", closeDir:"up"},
					bottom = f[POSITION.BOTTOM] = {xy: "y", dir:"Top", size: "Height", gravit: 1, openDir: "up", closeDir:"down"},
					left = f[POSITION.LEFT] = {xy: "x", dir: "Left", size: "Width", gravit: -1, openDir: "right", closeDir:"left"},
					right = f[POSITION.RIGHT] = {xy: "x", dir: "Left", size: "Width", gravit: 1, openDir: "left", closeDir:"right"};

				top.check = left.check = function(event, target, edge) {
					var pos = event.detail["estimated" + this.xy.toUpperCase()],
						offset = target["offset"+this.dir],
						size = target["offset"+this.size];
					return pos > offset && pos < offset + size * edge;
				};

				bottom.check = right.check = function(event, target, edge) {
					var pos = event.detail["estimated" + this.xy.toUpperCase()],
						offset = target["offset"+this.dir],
						size = target["offset"+this.size];
					return pos > offset + size - size * edge && pos < offset + size;
				};

				top.scroll = left.scroll = function(element) {
					return element["scroll"+this.dir] !== 0;
				};

				bottom.scroll = right.scroll = function(element) {
					return element["scroll"+this.size] - element["scroll"+this.dir] !== element["client"+this.size];
				};

				f[POSITION.TOP].rscroll = f[POSITION.LEFT].rscroll = bottom.scroll;
				f[POSITION.BOTTOM].rscroll = f[POSITION.RIGHT].rscroll = top.scroll;

			}());

			/**
			 * Initialization of AssistPanel component
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					position = options.position,
					handle = options.handle;

				if ("top|bottom".indexOf(position) > -1) {
					self._orientation = ORIENTATION.VERTICAL;
				} else {
					self._orientation = ORIENTATION.HORIZONTAL;
				}

				element.classList.add(classes.name, classes[options.position]);

				ui.containerElement = selectors.getClosestBySelector(element, options.target) || document.body;
				ui.containerElement.style.overflow = "hidden";

				if (handle) {
					ui.handle = document.querySelector(handle);
				}

				if (options.overlay) {
					ui.overlay = self._createOverlay(element);
				}


				return element;
			};

			/**
			 * Creates AssistPanel overlay element
			 * @method _createOverlay
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._createOverlay = function (element) {
				var overlayElement = document.createElement("div");

				overlayElement.style.display = "none";
				overlayElement.classList.add(classes.overlay);
				element.parentNode.insertBefore(overlayElement, element);

				return overlayElement;
			};

			/**
			 * Binds events to a AssistPanel component
			 * @method _bindEvents
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					target = ui.containerElement;
	
				events.enableGesture(
					target,
					new Gesture.Drag({
						blockHorizontal: self._orientation === ORIENTATION.VERTICAL,
						blockVertical:self._orientation === ORIENTATION.HORIZONTAL
					}),
					new Gesture.Swipe({
						orientation: self._orientation
					})
				);
				events.on(target, "drag dragstart dragend dragcancel dragprepare dragrelease swipe", self, false);
	
				events.prefixedFastOn(element, "transitionEnd", self, false);
				events.on(window, "resize", self, false);
			};

			/**
			 * Unbind events
			 * @method unbindEvents
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._unbindEvents = function() {
				var self = this,
					element = self.element,
					target = self._ui.containerElement;

				events.disableGesture(target);
				events.off(target, "drag dragstart dragend dragcancel dragprepare dragrelease swipe", self, false);

				events.prefixedFastOff(element, "transitionEnd", self, false);
				events.off(window, "resize", self, false);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype.handleEvent = function (event) {
				var self = this;
				switch (event.type) {
					case "dragprepare":
						self._onStart(event);
						break;
					case "dragrelease":
						self._onEnd(event);
						break;
					case "drag":
						self._onDrag(event);
						break;
					case "dragstart":
						self._onDragStart(event);
						break;
					case "dragend":
						self._onDragEnd(event);
						break;
					case "dragcancel":
						self._onDragCancel(event);
						break;
					case "swipe":
						self._onSwipe(event);
						break;
					case "resize":
						self._onResize(event);
						break;
				}
			};

			function isCanDragAssistPanel(self, event) {
				var state = self._state,
					target = self._ui.containerElement,
					options = self.options,
					edge = options.dragEdge,
					position = options.position;

				if (state === STATE.OPENED) {
					return true;
				}

				if (state === STATE.CLOSED) {
					return positionFactory[position].check(event, target, edge);
				}

				return false;
			}

			function isScrollable(self, event) {
				var target = event.detail.srcEvent.target,
					state = self._state,
					ui = self._ui,
					options = self.options,
					position = options.position,
					elem = target,
					style,
					overflow,
					overflowXY;

				while(elem && elem !== ui.containerElement) {
					style = window.getComputedStyle(elem);
					overflow = style["overflow"];
					overflowXY = style["overflow-" + positionFactory[position].xy];
					if (("scroll|auto".indexOf(overflow) > -1 || "scroll|auto".indexOf(overflowXY) > -1) 
							&& elem.scrollHeight > elem.clientHeight
							&& positionFactory[position][state === STATE.CLOSED ? "scroll" : "rscroll"](elem)) {
						return true;
					}
					elem = elem.parentNode;
				}

				return false;
			}

			prototype._onStart = function(event) {
				var self = this,
					ui = self._ui,
					element = self.element,
					handle = ui.handle,
					options = self.options,
					position = options.position,
					state = self._state,
					pos = self._pos,
					eventTarget = event.detail.srcEvent.target,
					size = element["offset"+positionFactory[position].size];

				pos.state = null;

				if (!options.enable 
						|| (state !== STATE.CLOSED && state !== STATE.OPENED)
						|| (handle && state === STATE.CLOSED && eventTarget !== handle)
						|| (!handle && !isCanDragAssistPanel(self, event))
						|| isScrollable(self, event)) {
					event.preventDefault();
					return;
				}

				self._translate(state === STATE.OPENED ? 0 : element["offset"+positionFactory[position].size], 0);

				pos.state = state;
				pos.start = pos.cur;

				if (handle && eventTarget === handle && state === STATE.CLOSED) {
					self._state = STATE.SLIDING;
					self._translate(size - size * options.handleTranslate, 0);
					pos.start = pos.cur;
				}
			};

			prototype._onEnd = function() {
				var self = this,
					state = self._state;

				if (state === STATE.SLIDING) {
					self.close();
				}
			};

			/**
			 * Swipe event handler
			 * @method _onSwipe
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._onSwipe = function (event) {
				var self = this,
					pos = self._pos,
					state = pos.state,
					options = self.options,
					position = options.position,
					factory = positionFactory[position],
					direction = event.detail.direction;

				if (state === STATE.OPENED && factory["closeDir"] === direction) {
					this.close();
				} else if (state === STATE.CLOSED && factory["openDir"] === direction) {
					this.open();
				}

			};

			/**
			 * Resize event handler
			 * @method _onResize
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._onResize = function () {
				var self = this;
				// resize event handler
				self._refresh();
			};

			/**
			 * Dragstart event handler
			 * @method _onDragStart
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._onDragStart = function (event) {
				var self = this,
					state = self._state,
					options = self.options,
					pos = self._pos,
					position = options.position,
					direction = event.detail.direction,
					factory = positionFactory[position];

				if (factory[(state===STATE.OPENED ? "close": "open") + "Dir"] !== direction) {
					event.preventDefault();

					if (pos.state === STATE.OPENED) {
						this.open();
					} else {
						this.close();
					}

					return;
				}
			};
			/**
			 * Drag event handler
			 * @method _onDrag
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._onDrag = function (event) {
				var self = this,
					detail = event.detail,
					options = self.options,
					position = options.position,
					pos = self._pos,
					d =  "top|left".indexOf(position) > -1 ? -1 : 1,
					p = pos.start + detail["estimatedDelta" + positionFactory[position].xy.toUpperCase()] * d;

				self._state = STATE.SLIDING;
				self._translate(p, 0);
			};

			/**
			 * DragEnd event handler
			 * @method _onDragEnd
			 * @protected
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._onDragEnd = function () {
				var self = this,
					state = self._state,
					element = self.element,
					options = self.options,
					position = options.position,
					size = element["offset"+positionFactory[position].size],
					pos = self._pos,
					delta = event.detail["delta"+positionFactory[position].xy.toUpperCase()],
					lastEventDirection = event.detail.velocityDirection;

				if (state !== STATE.SLIDING) {
					return;
				}

				if ( (pos.state === STATE.OPENED && lastEventDirection === positionFactory[position].openDir) 
						|| (pos.state === STATE.CLOSED && lastEventDirection === positionFactory[position].closeDir)
						|| Math.abs(delta) < size / 3) {
					self._onDragCancel();
				} else {
					self[pos.state === STATE.OPENED ? "close" : "open"]();
				}
			};

			/**
			 * DragCancel event handler
			 * @method _onDragCancel
			 * @protected
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._onDragCancel = function () {
				var self = this,
					pos = self._pos,
					duration = self.options.duration;
				this[pos.state === STATE.CLOSED ? "_close" : "_open"](duration,false);
			};

			/**
			 * AssistPanel translate function
			 * @method _translate
			 * @param {number} p
			 * @param {number} duration
			 * @param {function} callback
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._translate = function (p, duration, callback) {
				var self = this,
					element = self.element,
					ui = self._ui,
					overlay = ui.overlay,
					options = self.options,
					position = options.position,
					prevPosition = self._pos.cur,
					d =  "top|left".indexOf(position) > -1 ? -1 : 1,
					max = element["offset"+positionFactory[position].size],
					newCallback = function() {
						if (callback) {
							callback();
						}
						if (overlay && p >= max) {
							overlay.style.display = "none";
						}
					},
					transformValue,
					opacityValue;

				p = Math.max(Math.min(p, max), 0);

				if (p === prevPosition) {
					newCallback();
					return;
				}

				if (overlay && prevPosition >= max) {
					overlay.style.display = "";
				}

				self._pos.cur = p;

				if (self._orientation === ORIENTATION.HORIZONTAL) {
					transformValue = "translate3d(" + p*d + "px, 0px, 0px)";
				} else {
					transformValue = "translate3d(0px, " + p*d + "px, 0px)";
				}

				utilDOM.setPrefixedStyle(element, "transition", utilDOM.getPrefixedValue("transform " + duration / 1000 + "s ease-out"));
				utilDOM.setPrefixedStyle(element, "transform", transformValue);

				if (overlay) {
					opacityValue = 1 - (p / max * (0.7-0.3) + 0.3) ;
					utilDOM.setPrefixedStyle(overlay, "transition", "opacity " + duration / 1000 + "s ease-out");
					overlay.style.opacity = opacityValue;
				}

				if (!duration) {
					newCallback();
				} else {
					events.prefixedFastOn(element, "transitionEnd", function handler() {
						events.prefixedFastOff(element, "transitionEnd", handler, false);
						newCallback();
					}, false);
				}

			};

			/**
			 * Set overlay opacity and visibility
			 * @method _setOverlay
			 * @param {number} x
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._setOverlay = function (x) {
				var self = this,
					options = self.options,
					overlay = self._ui.assistPanelOverlay,
					overlayStyle = overlay.style,
					absX = Math.abs(x),
					ratio = self._orientation === ORIENTATION.HORIZONTAL ? absX / options.width : absX / options.height;

				if (ratio < 1) {
					overlayStyle.visibility = "visible";
				} else {
					overlayStyle.visibility = "hidden";
				}
				overlayStyle.opacity = 1 - ratio;
			};

			/**
			 * Set active status in assist panel router
			 * @method _setActive
			 * @param {boolean} active
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._setActive = function (active) {
				var self = this,
					route = engine.getRouter().getRoute("assistPanel");
				if (active) {
					route.setActive(self);
				} else {
					route.setActive(null);
				}
			};

			/**
			 * Refreshes AssistPanel component
			 * @method _refresh
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._refresh = function () {
				// AssistPanel layout has been set by parent element layout
				var self = this;

				if (self._state !== STATE.CLOSED) {
					self.close(0);
				}
				self._init(self.element);
			};

			/**
			 * Enable AssistPanel component
			 * @method _enable
			 * @protected
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._enable = function () {
				this._oneOption("enable", true);
			};

			/**
			 * Disable AssistPanel component
			 * @method _disable
			 * @protected
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype._disable = function () {
				this._oneOption("enable", false);
			};

			function _clearStateClass(element) {
				[classes.open, classes.close].forEach(function(cls) {
					element.classList.remove(cls);
				});
			}

			/**
			 * Opens AssistPanel component
			 * @method open
			 * @param {number} [duration] Duration for opening, if is not set then method take value from options
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype.open = function (duration) {
				this._open(duration, true);
			};

			prototype._open = function (duration, isSetUrl) {
				var self = this,
					options = self.options,
					element = self.element;

				if (self._state !== STATE.OPENED) {
					duration = duration !== undefined ? duration : options.duration;

					_clearStateClass(element);
					self._state = STATE.SETTLING;
					self._translate(0, duration, function() {
						element.classList.add(classes.open);
						if(isSetUrl === true) {
							self._setActive(true);
						}
						self._state = STATE.OPENED;
						self.trigger(CUSTOM_EVENTS.OPEN);
					});
				}
			};

			/**
			 * Closes AssistPanel component
			 * @method close
			 * @param {number} [duration] Duration for closing, if is not set then method take value from options
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype.close = function (duration) {
				this._close(duration, true);
			};

			prototype._close = function (duration, isSetUrl) {
				var self = this,
					options = self.options,
					element = self.element,
					position = options.position;
	
				if (self._state !== STATE.CLOSED) {
					duration = duration !== undefined ? duration : options.duration;

					_clearStateClass(element);
					self._state = STATE.SETTLING;
					self._translate(element["offset"+positionFactory[position].size], duration, function() {
						element.classList.add(classes.close);
						if(isSetUrl === true) {
							self._setActive(null);
						}
						self._state = STATE.CLOSED;
						self.trigger(CUSTOM_EVENTS.CLOSE);
					});
				}
			};

			/**
			 * Transition AssistPanel component.
			 * This method use only positive integer number.
			 * @method transition
			 * @param {number} position
			 * @param {number} duration
			 * @member ns.widget.wearable.AssistPanel
			 */
			prototype.transition = function (position, duration) {
				var self = this,
					options = self.options;
				self._state = STATE.SLIDING;
				self._translate(position, duration || options.duration);
			};

			/**
			 * Get state of AssistPanel component.
			 * @method getState
			 * @return {string} Returns state of AssistPanel component
			 */
			prototype.getState = function () {
				return this._state;
			};

			/**
			 * Checks AssistPanel status
			 * @method isOpen
			 * @member ns.widget.wearable.AssistPanel
			 * @return {boolean} Returns true if AssistPanel is open
			 */
			prototype.isOpen = function () {
				return (this._state === STATE.OPENED);
			};

			/**
			 * Destroys AssistPanel component
			 * @method _destroy
			 * @member ns.widget.wearable.AssistPanel
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					options = self.options,
					element = self.element,
					ui = self._ui,
					target = ui.containerElement,
					overlay = ui.overlay;

				element.classList.remove(classes[options.position]);
				target.style.overflow = "";

				self._unbindEvents();

				if (overlay) {
					overlay.parentNode.removeChild(overlay);
				}

				ui = null;
			};

			ns.widget.wearable.AssistPanel = AssistPanel;
			engine.defineWidget(
				"AssistPanel",
				".ui-assist-panel",
				[
					"transition",
					"open",
					"close",
					"isOpen",
					"getState"
				],
				AssistPanel,
				"wearable"
			);

			}(window.document, ns));

/*global window, define, RegExp */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Path Utility
 * Object helps work with paths.
 * @class ns.util.path
 * @static
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
					/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.engine}
				* @member ns.util.path
				* @static
				* @private
				*/
			var engine = ns.engine,
				/**
				* Local alias for ns.util.object
				* @property {Object} utilsObject Alias for {@link ns.util.object}
				* @member ns.util.path
				* @static
				* @private
				*/
				utilsObject = ns.util.object,
				/**
				* Local alias for ns.util.selectors
				* @property {Object} utilsSelectors Alias for {@link ns.util.selectors}
				* @member ns.util.path
				* @static
				* @private
				*/
				utilsSelectors = ns.util.selectors,
				/**
				* Local alias for ns.util.DOM
				* @property {Object} utilsDOM Alias for {@link ns.util.DOM}
				* @member ns.util.path
				* @static
				* @private
				*/
				utilsDOM = ns.util.DOM,
				/**
				* Cache for document base element
				* @member ns.util.path
				* @property {HTMLBaseElement} base
				* @static
				* @private
				*/
				base,
				/**
				 * location object
				 * @property {Object} location
				 * @static
				 * @private
				 * @member ns.util.path
				 */
				location = {},
				path = {
					/**
					 * href part for mark state
					 * @property {string} [uiStateKey="&ui-state"]
					 * @static
					 * @member ns.util.path
					 */
					uiStateKey: "&ui-state",

					// This scary looking regular expression parses an absolute URL or its relative
					// variants (protocol, site, document, query, and hash), into the various
					// components (protocol, host, path, query, fragment, etc that make up the
					// URL as well as some other commonly used sub-parts. When used with RegExp.exec()
					// or String.match, it parses the URL into a results array that looks like this:
					//
					//	[0]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread#msg-content?param1=true&param2=123
					//	[1]: http://jblas:password@mycompany.com:8080/mail/inbox?msg=1234&type=unread
					//	[2]: http://jblas:password@mycompany.com:8080/mail/inbox
					//	[3]: http://jblas:password@mycompany.com:8080
					//	[4]: http:
					//	[5]: //
					//	[6]: jblas:password@mycompany.com:8080
					//	[7]: jblas:password
					//	[8]: jblas
					//	[9]: password
					//	[10]: mycompany.com:8080
					//	[11]: mycompany.com
					//	[12]: 8080
					//	[13]: /mail/inbox
					//	[14]: /mail/
					//	[15]: inbox
					//	[16]: ?msg=1234&type=unread
					//	[17]: #msg-content?param1=true&param2=123
					//	[18]: #msg-content
					//	[19]: ?param1=true&param2=123
					//
					/**
					* @property {RegExp} urlParseRE Regular expression for parse URL
					* @member ns.util.path
					* @static
					*/
					urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)((#[^\?]*)(\?.*)?)?/,

					/**
					* Abstraction to address xss (Issue #4787) by removing the authority in
					* browsers that auto decode it. All references to location.href should be
					* replaced with a call to this method so that it can be dealt with properly here
					* @method getLocation
					* @param {string|Object} url
					* @return {string}
					* @member ns.util.path
					*/
					getLocation: function (url) {
						var uri = this.parseUrl(url || window.location.href),
							hash = uri.hash,
							search = uri.hashSearch;
						// mimic the browser with an empty string when the hash and hashSearch are empty
						hash = hash === "#" && !search ? "" : hash;
						location = uri;
						// Make sure to parse the url or the location object for the hash because using location.hash
						// is autodecoded in firefox, the rest of the url should be from the object (location unless
						// we're testing) to avoid the inclusion of the authority
						return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash + search;
					},

					/**
					* Return the original document url
					* @method getDocumentUrl
					* @member ns.util.path
					* @param {boolean} [asParsedObject=false]
					* @return {string|Object}
					* @static
					*/
					getDocumentUrl: function (asParsedObject) {
						return asParsedObject ? utilsObject.copy(path.documentUrl) : path.documentUrl.href;
					},

					/**
					* Parse a location into a structure
					* @method parseLocation
					* @return {Object}
					* @member ns.util.path
					*/
					parseLocation: function () {
						return this.parseUrl(this.getLocation());
					},

					/**
					* Parse a URL into a structure that allows easy access to
					* all of the URL components by name.
					* If we're passed an object, we'll assume that it is
					* a parsed url object and just return it back to the caller.
					* @method parseUrl
					* @member ns.util.path
					* @param {string|Object} url
					* @return {Object} uri record
					* @return {string} return.href
					* @return {string} return.hrefNoHash
					* @return {string} return.hrefNoSearch
					* @return {string} return.domain
					* @return {string} return.protocol
					* @return {string} return.doubleSlash
					* @return {string} return.authority
					* @return {string} return.username
					* @return {string} return.password
					* @return {string} return.host
					* @return {string} return.hostname
					* @return {string} return.port
					* @return {string} return.pathname
					* @return {string} return.directory
					* @return {string} return.filename
					* @return {string} return.search
					* @return {string} return.hash
					* @return {string} return.hashSearch
					* @static
					*/
					parseUrl: function (url) {
						var matches;
						if (typeof url === "object") {
							return url;
						}
						matches = path.urlParseRE.exec(url || "") || [];

							// Create an object that allows the caller to access the sub-matches
							// by name. Note that IE returns an empty string instead of undefined,
							// like all other browsers do, so we normalize everything so its consistent
							// no matter what browser we're running on.
						return {
							href: matches[0] || "",
							hrefNoHash: matches[1] || "",
							hrefNoSearch: matches[2] || "",
							domain: matches[3] || "",
							protocol: matches[4] || "",
							doubleSlash: matches[5] || "",
							authority: matches[6] || "",
							username: matches[8] || "",
							password: matches[9] || "",
							host: matches[10] || "",
							hostname: matches[11] || "",
							port: matches[12] || "",
							pathname: matches[13] || "",
							directory: matches[14] || "",
							filename: matches[15] || "",
							search: matches[16] || "",
							hash: matches[18] || "",
							hashSearch: matches[19] || ""
						};
					},

					/**
					* Turn relPath into an absolute path. absPath is
					* an optional absolute path which describes what
					* relPath is relative to.
					* @method makePathAbsolute
					* @member ns.util.path
					* @param {string} relPath
					* @param {string} [absPath=""]
					* @return {string}
					* @static
					*/
					makePathAbsolute: function (relPath, absPath) {
						var absStack,
							relStack,
							directory,
							i;
						if (relPath && relPath.charAt(0) === "/") {
							return relPath;
						}

						relPath = relPath || "";
						absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";

						absStack = absPath ? absPath.split("/") : [];
						relStack = relPath.split("/");
						for (i = 0; i < relStack.length; i++) {
							directory = relStack[i];
							switch (directory) {
							case ".":
								break;
							case "..":
								if (absStack.length) {
									absStack.pop();
								}
								break;
							default:
								absStack.push(directory);
								break;
							}
						}
						return "/" + absStack.join("/");
					},

					/**
					* Returns true if both urls have the same domain.
					* @method isSameDomain
					* @member ns.util.path
					* @param {string|Object} absUrl1
					* @param {string|Object} absUrl2
					* @return {boolean}
					* @static
					*/
					isSameDomain: function (absUrl1, absUrl2) {
						return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
					},

					/**
					* Returns true for any relative variant.
					* @method isRelativeUrl
					* @member ns.util.path
					* @param {string|Object} url
					* @return {boolean}
					* @static
					*/
					isRelativeUrl: function (url) {
						// All relative Url variants have one thing in common, no protocol.
						return path.parseUrl(url).protocol === "";
					},

					/**
					 * Returns true for an absolute url.
					 * @method isAbsoluteUrl
					 * @member ns.util.path
					 * @param {string} url
					 * @return {boolean}
					 * @static
					 */
					isAbsoluteUrl: function (url) {
						return path.parseUrl(url).protocol !== "";
					},

					/**
					* Turn the specified realtive URL into an absolute one. This function
					* can handle all relative variants (protocol, site, document, query, fragment).
					* @method makeUrlAbsolute
					* @member ns.util.path
					* @param {string} relUrl
					* @param {string} absUrl
					* @return {string}
					* @static
					*/
					makeUrlAbsolute: function (relUrl, absUrl) {
						if (!path.isRelativeUrl(relUrl)) {
							return relUrl;
						}

						var relObj = path.parseUrl(relUrl),
							absObj = path.parseUrl(absUrl),
							protocol = relObj.protocol || absObj.protocol,
							doubleSlash = relObj.protocol ? relObj.doubleSlash : (relObj.doubleSlash || absObj.doubleSlash),
							authority = relObj.authority || absObj.authority,
							hasPath = relObj.pathname !== "",
							pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
							search = relObj.search || (!hasPath && absObj.search) || "",
							hash = relObj.hash;

						return protocol + doubleSlash + authority + pathname + search + hash;
					},

					/**
					* Add search (aka query) params to the specified url.
					* If page is embedded page, search query will be added after
					* hash tag. It's allowed to add query content for both external
					* pages and embedded pages.
					* Examples:
					* http://domain/path/index.html#embedded?search=test
					* http://domain/path/external.html?s=query#embedded?s=test
					* @method addSearchParams
					* @member ns.util.path
					* @param {string|Object} url
					* @param {Object|string} params
					* @return {string}
					*/
					addSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? this.getAsURIParameters(params) : params,
							searchChar = '',
							urlObjectHash = urlObject.hash;

						if (path.isEmbedded(url) && paramsString.length > 0) {
							searchChar = urlObject.hashSearch || "?";
							return urlObject.hrefNoHash + (urlObjectHash || "") + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString ;
						}

						searchChar = urlObject.search || "?";
						return urlObject.hrefNoSearch + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString + (urlObjectHash || "");
					},

					/**
					 * Add search params to the specified url with hash
					 * @method addHashSearchParams
					 * @member ns.util.path
					 * @param {string|Object} url
					 * @param {Object|string} params
					 * @returns {string}
					 */
					addHashSearchParams: function (url, params) {
						var urlObject = path.parseUrl(url),
							paramsString = (typeof params === "object") ? path.getAsURIParameters(params) : params,
							hash = urlObject.hash,
							searchChar = hash ? (hash.indexOf("?") < 0 ? hash + "?" : hash + "&") : "#?";
						return urlObject.hrefNoHash + searchChar + (searchChar.charAt(searchChar.length - 1) === "?" ? "" : "&") + paramsString;
					},

					/**
					* Convert absolute Url to data Url
					* - for embedded pages strips parameters
					* - for the same domain as document base remove domain
					* otherwise returns decoded absolute Url
					* @method convertUrlToDataUrl
					* @member ns.util.path
					* @param {string} absUrl
					* @param {string} dialogHashKey
					* @param {Object} documentBase uri structure
					* @return {string}
					* @static
					*/
					convertUrlToDataUrl: function (absUrl, dialogHashKey, documentBase) {
						var urlObject = path.parseUrl(absUrl);

						if (path.isEmbeddedPage(urlObject, !!dialogHashKey)) {
							// Keep hash and search data for embedded page
							return path.getFilePath(urlObject.hash + urlObject.hashSearch, dialogHashKey);
						}
						documentBase = documentBase || path.documentBase;
						if (path.isSameDomain(urlObject, documentBase)) {
							return urlObject.hrefNoHash.replace(documentBase.domain, "");
						}

						return window.decodeURIComponent(absUrl);
					},

					/**
					* Get path from current hash, or from a file path
					* @method get
					* @member ns.util.path
					* @param {string} newPath
					* @return {string}
					*/
					get: function (newPath) {
						if (newPath === undefined) {
							newPath = this.parseLocation().hash;
						}
						return this.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, '');
					},

					/**
					* Test if a given url (string) is a path
					* NOTE might be exceptionally naive
					* @method isPath
					* @member ns.util.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					isPath: function (url) {
						return (/\//).test(url);
					},

					/**
					* Return a url path with the window's location protocol/hostname/pathname removed
					* @method clean
					* @member ns.util.path
					* @param {string} url
					* @param {Object} documentBase  uri structure
					* @return {string}
					* @static
					*/
					clean: function (url, documentBase) {
						return url.replace(documentBase.domain, "");
					},

					/**
					* Just return the url without an initial #
					* @method stripHash
					* @member ns.util.path
					* @param {string} url
					* @return {string}
					* @static
					*/
					stripHash: function (url) {
						return url.replace(/^#/, "");
					},

					/**
					* Return the url without an query params
					* @method stripQueryParams
					* @member ns.util.path
					* @param {string} url
					* @return {string}
					* @static
					*/
					stripQueryParams: function (url) {
						return url.replace(/\?.*$/, "");
					},

					/**
					* Validation proper hash
					* @method isHashValid
					* @member ns.util.path
					* @param {string} hash
					* @static
					*/
					isHashValid: function (hash) {
						return (/^#[^#]+$/).test(hash);
					},

					/**
					* Check whether a url is referencing the same domain, or an external domain or different protocol
					* could be mailto, etc
					* @method isExternal
					* @member ns.util.path
					* @param {string|Object} url
					* @param {Object} documentUrl uri object
					* @return {boolean}
					* @static
					*/
					isExternal: function (url, documentUrl) {
						var urlObject = path.parseUrl(url);
						return urlObject.protocol && urlObject.domain !== documentUrl.domain ? true : false;
					},

					/**
					* Check if the url has protocol
					* @method hasProtocol
					* @member ns.util.path
					* @param {string} url
					* @return {boolean}
					* @static
					*/
					hasProtocol: function (url) {
						return (/^(:?\w+:)/).test(url);
					},

					/**
					 * Check if the url refers to embedded content
					 * @method isEmbedded
					 * @member ns.util.path
					 * @param {string} url
					 * @returns {boolean}
					 * @static
					 */
					isEmbedded: function (url) {
						var urlObject = path.parseUrl(url);

						if (urlObject.protocol !== "") {
							return (!path.isPath(urlObject.hash) && !!urlObject.hash && (urlObject.hrefNoHash === path.parseLocation().hrefNoHash));
						}
						return (/\?.*#|^#/).test(urlObject.href);
					},

					/**
					* Get the url as it would look squashed on to the current resolution url
					* @method squash
					* @member ns.util.path
					* @param {string} url
					* @param {string} [resolutionUrl=undefined]
					* @return {string}
					*/
					squash: function (url, resolutionUrl) {
						var href,
							cleanedUrl,
							search,
							stateIndex,
							isPath = this.isPath(url),
							uri = this.parseUrl(url),
							preservedHash = uri.hash,
							uiState = "";

						// produce a url against which we can resole the provided path
						resolutionUrl = resolutionUrl || (path.isPath(url) ? path.getLocation() : path.getDocumentUrl());

						// If the url is anything but a simple string, remove any preceding hash
						// eg #foo/bar -> foo/bar
						//	#foo -> #foo
						cleanedUrl = isPath ? path.stripHash(url) : url;

						// If the url is a full url with a hash check if the parsed hash is a path
						// if it is, strip the #, and use it otherwise continue without change
						cleanedUrl = path.isPath(uri.hash) ? path.stripHash(uri.hash) : cleanedUrl;

						// Split the UI State keys off the href
						stateIndex = cleanedUrl.indexOf(this.uiStateKey);

						// store the ui state keys for use
						if (stateIndex > -1) {
							uiState = cleanedUrl.slice(stateIndex);
							cleanedUrl = cleanedUrl.slice(0, stateIndex);
						}

						// make the cleanedUrl absolute relative to the resolution url
						href = path.makeUrlAbsolute(cleanedUrl, resolutionUrl);

						// grab the search from the resolved url since parsing from
						// the passed url may not yield the correct result
						search = this.parseUrl(href).search;

						// @TODO all this crap is terrible, clean it up
						if (isPath) {
							// reject the hash if it's a path or it's just a dialog key
							if (path.isPath(preservedHash) || preservedHash.replace("#", "").indexOf(this.uiStateKey) === 0) {
								preservedHash = "";
							}

							// Append the UI State keys where it exists and it's been removed
							// from the url
							if (uiState && preservedHash.indexOf(this.uiStateKey) === -1) {
								preservedHash += uiState;
							}

							// make sure that pound is on the front of the hash
							if (preservedHash.indexOf("#") === -1 && preservedHash !== "") {
								preservedHash = "#" + preservedHash;
							}

							// reconstruct each of the pieces with the new search string and hash
							href = path.parseUrl(href);
							href = href.protocol + "//" + href.host + href.pathname + search + preservedHash;
						} else {
							href += href.indexOf("#") > -1 ? uiState : "#" + uiState;
						}

						return href;
					},

					/**
					* Check if the hash is preservable
					* @method isPreservableHash
					* @member ns.util.path
					* @param {string} hash
					* @return {boolean}
					*/
					isPreservableHash: function (hash) {
						return hash.replace("#", "").indexOf(this.uiStateKey) === 0;
					},

					/**
					* Escape weird characters in the hash if it is to be used as a selector
					* @method hashToSelector
					* @member ns.util.path
					* @param {string} hash
					* @return {string}
					* @static
					*/
					hashToSelector: function (hash) {
						var hasHash = (hash.substring(0, 1) === "#");
						if (hasHash) {
							hash = hash.substring(1);
						}
						return (hasHash ? "#" : "") + hash.replace(new RegExp('([!"#$%&\'()*+,./:;<=>?@[\\]^`{|}~])', 'g'), "\\$1");
					},

					/**
					* Check if the specified url refers to the first page in the main application document.
					* @method isFirstPageUrl
					* @member ns.util.path
					* @param {string} url
					* @param {Object} documentBase uri structure
					* @param {boolean} documentBaseDiffers
					* @param {Object} documentUrl uri structure
					* @return {boolean}
					* @static
					*/
					isFirstPageUrl: function (url, documentBase, documentBaseDiffers, documentUrl) {
						var urlStructure,
							samePath,
							firstPage,
							firstPageId,
							hash;

						documentBase = documentBase === undefined ? path.documentBase : documentBase;
						documentBaseDiffers = documentBaseDiffers === undefined ? path.documentBaseDiffers : documentBaseDiffers;
						documentUrl = documentUrl === undefined ? path.documentUrl : documentUrl;

						// We only deal with absolute paths.
						urlStructure = path.parseUrl(path.makeUrlAbsolute(url, documentBase));

						// Does the url have the same path as the document?
						samePath = urlStructure.hrefNoHash === documentUrl.hrefNoHash || (documentBaseDiffers && urlStructure.hrefNoHash === documentBase.hrefNoHash);

						// Get the first page element.
						firstPage = engine.getRouter().firstPage;

						// Get the id of the first page element if it has one.
						firstPageId = firstPage ? firstPage.id : undefined;
						hash = urlStructure.hash;

						// The url refers to the first page if the path matches the document and
						// it either has no hash value, or the hash is exactly equal to the id of the
						// first page element.
						return samePath && (!hash || hash === "#" || (firstPageId && hash.replace(/^#/, "") === firstPageId));
					},

					/**
					* Some embedded browsers, like the web view in Phone Gap, allow cross-domain XHR
					* requests if the document doing the request was loaded via the file:// protocol.
					* This is usually to allow the application to "phone home" and fetch app specific
					* data. We normally let the browser handle external/cross-domain urls, but if the
					* allowCrossDomainPages option is true, we will allow cross-domain http/https
					* requests to go through our page loading logic.
					* @method isPermittedCrossDomainRequest
					* @member ns.util.path
					* @param {Object} docUrl
					* @param {string} reqUrl
					* @return {boolean}
					* @static
					*/
					isPermittedCrossDomainRequest: function (docUrl, reqUrl) {
						return ns.getConfig('allowCrossDomainPages', false) &&
							docUrl.protocol === "file:" &&
							reqUrl.search(/^https?:/) !== -1;
					},

					/**
					* Convert a object data to URI parameters
					* @method getAsURIParameters
					* @member ns.util.path
					* @param {Object} data
					* @return {string}
					* @static
					*/
					getAsURIParameters: function (data) {
						var url = '',
							key;
						for (key in data) {
							if (data.hasOwnProperty(key)) {
								url += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
							}
						}
						return url.substring(0, url.length - 1);
					},

					/**
					* Document Url
					* @member ns.util.path
					* @property {string|null} documentUrl
					*/
					documentUrl: null,

					/**
					* The document base differs
					* @member ns.util.path
					* @property {boolean} documentBaseDiffers
					*/
					documentBaseDiffers: false,

					/**
					* Set location hash to path
					* @method set
					* @member ns.util.path
					* @param {string} path
					* @static
					*/
					set: function (path) {
						location.hash = path;
					},

					/**
					* Return the substring of a file path before the sub-page key,
					* for making a server request
					* @method getFilePath
					* @member ns.util.path
					* @param {string} path
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					getFilePath: function (path, dialogHashKey) {
						var splitkey = '&' + ns.getConfig('subPageUrlKey', '');
						return path && path.split(splitkey)[0].split(dialogHashKey)[0];
					},

					/**
					* Remove the preceding hash, any query params, and dialog notations
					* @method cleanHash
					* @member ns.util.path
					* @param {string} hash
					* @param {string} dialogHashKey
					* @return {string}
					* @static
					*/
					cleanHash: function (hash, dialogHashKey) {
						return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
					},

					/**
					* Check if url refers to the embedded page
					* @method isEmbeddedPage
					* @member ns.util.path
					* @param {string} url
					* @param {boolean} allowEmbeddedOnlyBaseDoc
					* @return {boolean}
					* @static
					*/
					isEmbeddedPage: function (url, allowEmbeddedOnlyBaseDoc) {
						var urlObject = path.parseUrl(url);

						//if the path is absolute, then we need to compare the url against
						//both the documentUrl and the documentBase. The main reason for this
						//is that links embedded within external documents will refer to the
						//application document, whereas links embedded within the application
						//document will be resolved against the document base.
						if (urlObject.protocol !== "") {
							return (urlObject.hash &&
									( allowEmbeddedOnlyBaseDoc ?
											urlObject.hrefNoHash === path.documentUrl.hrefNoHash :
											urlObject.hrefNoHash === path.parseLocation().hrefNoHash ));
						}
						return (/^#/).test(urlObject.href);
					}
				};

			path.documentUrl = path.parseLocation();

			base = document.querySelector('base');

			/**
			* The document base URL for the purposes of resolving relative URLs,
			* and the name of the default browsing context for the purposes of
			* following hyperlinks
			* @member ns.util.path
			* @property {Object} documentBase uri structure
			* @static
			*/
			path.documentBase = base ? path.parseUrl(path.makeUrlAbsolute(base.getAttribute("href"), path.documentUrl.href)) : path.documentUrl;

			path.documentBaseDiffers = (path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash);

			/**
			* Get document base
			* @method getDocumentBase
			* @member ns.util.path
			* @param {boolean} [asParsedObject=false]
			* @return {string|Object}
			* @static
			*/
			path.getDocumentBase = function (asParsedObject) {
				return asParsedObject ? utilsObject.copy(path.documentBase) : path.documentBase.href;
			};

			/**
			* Find the closest page and extract out its url
			* @method getClosestBaseUrl
			* @member ns.util.path
			* @param {HTMLElement} element
			* @param {string} selector
			* @return {string}
			* @static
			*/
			path.getClosestBaseUrl = function (element, selector) {
				// Find the closest page and extract out its url.
				var url = utilsDOM.getNSData(utilsSelectors.getClosestBySelector(element, selector), "url"),
					baseUrl = path.documentBase.hrefNoHash;

				if (!ns.getConfig('dynamicBaseEnabled', true) || !url || !path.isPath(url)) {
					url = baseUrl;
				}

				return path.makeUrlAbsolute(url, baseUrl);
			};

			ns.util.path = path;
			}(window, window.document, ns));

/*global define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Route Namespace
 * Object contains rules for router.
 *
 * @class ns.router.route
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (ns) {
	"use strict";
				ns.router.route = ns.router.route || {};
			}(ns));

/*global window, define, XMLHttpRequest, Node, HTMLElement, ns */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Router
 * Main class to navigate between pages and popups in profile Wearable.
 *
 * @class ns.router.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
					/**
				 * Local alias for ns.util
				 * @property {Object} util Alias for {@link ns.util}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
			var util = ns.util,
				/**
				 * Local alias for ns.event
				 * @property {Object} eventUtils Alias for {@link ns.event}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				eventUtils = ns.event,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				DOM = util.DOM,
				/**
				 * Local alias for ns.util.path
				 * @property {Object} path Alias for {@link ns.util.path}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				path = util.path,
				/**
				 * Local alias for ns.util.selectors
				 * @property {Object} selectors Alias for {@link ns.util.selectors}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				selectors = util.selectors,
				/**
				 * Local alias for ns.util.object
				 * @property {Object} object Alias for {@link ns.util.object}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				object = util.object,
				/**
				 * Local alias for ns.engine
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Local alias for ns.router
				 * @property {Object} routerMicro Alias for namespace ns.router
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				routerMicro = ns.router,
				/**
				 * Local alias for ns.router.history
				 * @property {Object} history Alias for {@link ns.router.history}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				history = routerMicro.history,
				/**
				 * Local alias for ns.router.route
				 * @property {Object} route Alias for namespace ns.router.route
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				route = routerMicro.route,
				/**
				 * Local alias for document body element
				 * @property {HTMLElement} body
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				body = document.body,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.router.Router
				 * @private
				 * @static
				 */
				slice = [].slice,

				/**
				 * Router locking flag
				 * @property {boolean} [_isLock]
				 * @member ns.router.Router
				 * @private
				 */
				_isLock = false,

				ORDER_NUMBER = {
					1: "page",
					10: "panel",
					100: "popup",
					1000: "drawer",
					1001: "assistPanel",
					2000: "circularindexscrollbar"
				},

				Page = ns.widget.core.Page,

				Router = function () {
					var self = this;

					/**
					 * Element of the page opened as first.
					 * @property {?HTMLElement} [firstPage]
					 * @member ns.router.Router
					 */
					self.firstPage = null;
					/**
					 * The container of widget.
					 * @property {?ns.widget.core.PageContainer} [container]
					 * @member ns.router.Router
					 */
					self.container = null;
					/**
					 * Settings for last open method
					 * @property {Object} [settings]
					 * @member ns.router.Router
					 */
					self.settings = {};
				};

			/**
			 * Default values for router
			 * @property {Object} defaults
			 * @property {boolean} [defaults.fromHashChange = false] Sets if will be changed after hashchange.
			 * @property {boolean} [defaults.reverse = false] Sets the direction of change.
			 * @property {boolean} [defaults.showLoadMsg = true] Sets if message will be shown during loading.
			 * @property {number} [defaults.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @property {boolean} [defaults.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @member ns.router.Router
			 */
			Router.prototype.defaults = {
				fromHashChange: false,
				reverse: false,
				showLoadMsg: true,
				loadMsgDelay: 0,
				volatileRecord: false
			};

			/**
			 * Find the closest link for element
			 * @method findClosestLink
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function findClosestLink(element) {
				while (element) {
					if (element.nodeType === Node.ELEMENT_NODE && element.nodeName && element.nodeName === "A") {
						break;
					}
					element = element.parentNode;
				}
				return element;
			}

			/**
			 * Handle event link click
			 * @method linkClickHandler
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function linkClickHandler(router, event) {
				var link = findClosestLink(event.target),
					href,
					useDefaultUrlHandling,
					options;

				if (link && event.which === 1) {
					href = link.getAttribute("href");
					useDefaultUrlHandling = (link.getAttribute("rel") === "external") || link.hasAttribute("target");
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						router.open(href, options, event);
						eventUtils.preventDefault(event);
					}
				}
			}

			/**
			 * Handle event for pop state
			 * @method popStateHandler
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function popStateHandler(router, event) {
				var state = event.state,
					prevState = history.activeState,
					rules = routerMicro.route,
					maxOrderNumber = 0,
					orderNumberArray = [],
					inTransition = router.getContainer().inTransition,
					ruleKey,
					options,
					to,
					url,
					isContinue = true,
					reverse = state && history.getDirection(state) === "back",
					transition;

				if (_isLock || (inTransition && reverse)) {
					history.disableVolatileMode();
					history.replace(prevState, prevState.stateTitle, prevState.stateUrl);
					return;
				}

				if (state) {
					to = state.url;
					transition = reverse ? ((prevState && prevState.transition) || "none") : state.transition;
					options = object.merge({}, state, {
						reverse: reverse,
						transition: transition,
						fromHashChange: true
					});

					url = path.getLocation();

					for (ruleKey in rules) {
						if (rules.hasOwnProperty(ruleKey)) {
							if (rules[ruleKey].active) {
								orderNumberArray.push(rules[ruleKey].orderNumber);
							}
						}
					}
					maxOrderNumber = Math.max.apply(null, orderNumberArray);
					if (rules[ORDER_NUMBER[maxOrderNumber]] && rules[ORDER_NUMBER[maxOrderNumber]].onHashChange(url, options, prevState)) {
						if (maxOrderNumber === 10) {
							// rule is panel
							return;
						}
						isContinue = false;
					}

					history.setActive(state);
					if (isContinue) {
						router.open(to, options);
					}
				} else {
					url = path.getLocation();
					if (prevState) {
						if (prevState.absUrl !== url && prevState.stateUrl !== url) {
							history.enableVolatileRecord();
							router.open(url);
						}
					}
				}
			}

			/**
			 * Detect rel attribute from HTMLElement
			 * @param {HTMLElement} to
			 * @member ns.router.Router
			 * @method detectRel
			 */
			Router.prototype.detectRel = function (to) {
				var rule,
					i;

				for (i in route) {
					rule = route[i];
					if (selectors.matchesSelector(to, rule.filter)) {
						return i;
					}
				}
			};

			/**
			 * Change page to page given in parameter "to".
			 * @method open
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @member ns.router.Router
			 */
			Router.prototype.open = function (to, options, event) {
				var rel,
					rule,
					deferred = {},
					filter,
					stringId,
					toElement,
					self = this;

				to = getHTMLElement(to);
				rel = ((options && options.rel) || (to instanceof HTMLElement && this.detectRel(to)) || "page");
					rule = route[rel];
				if (_isLock) {
					return;
				}

				if (rel === "back") {
					history.back();
					return;
				}

				if (rule) {
					options = object.merge(
						{
							rel: rel
						},
						this.defaults,
						rule.option(),
						options
					);
					filter = rule.filter;
					deferred.resolve = function (options, content) {
						rule.open(content, options, event);
					};
					deferred.reject = function (options) {
						eventUtils.trigger(self.container.element, "changefailed", options);
					};
					if (typeof to === "string") {
						if (to.replace(/[#|\s]/g, "")) {
							this._loadUrl(to, options, rule, deferred);
						}
					} else {
						if (to && selectors.matchesSelector(to, filter)) {
							deferred.resolve(options, to);
						} else {
							deferred.reject(options);
						}
					}
				} else {
					throw new Error("Not defined router rule [" + rel + "]");
				}
			};

			/**
			 * Method initializes page container and builds the first page if flag autoInitializePage is set.
			 * @method init
			 * @param {boolean} justBuild
			 * @member ns.router.Router
			 */
			Router.prototype.init = function (justBuild) {
				var page,
					containerElement,
					container,
					firstPage,
					pages,
					activePages,
					ruleKey,
					rules = routerMicro.route,
					location = window.location,
					PageClasses = Page.classes,
					uiPageActiveClass = PageClasses.uiPageActive,
					pageDefinition = ns.engine.getWidgetDefinition("Page"),
					pageSelector = pageDefinition.selector,
					self = this;

				body = document.body;
				containerElement = ns.getConfig("pageContainer") || body;
				pages = slice.call(containerElement.querySelectorAll(pageSelector));
				if (!ns.getConfig("pageContainerBody", false)) {
					containerElement = pages.length ? pages[0].parentNode : containerElement;
				}
				self.justBuild = justBuild;

				if (ns.getConfig("autoInitializePage", true)) {
					firstPage = containerElement.querySelector("." + uiPageActiveClass);
					if (!firstPage) {
						firstPage = pages[0];
					}

					if (firstPage) {
						activePages = containerElement.querySelectorAll("." + uiPageActiveClass);
						slice.call(activePages).forEach(function (page) {
							page.classList.remove("." + uiPageActiveClass);
						});
					}

					if (location.hash) {
						//simple check to determine if we should show firstPage or other
						page = document.getElementById(location.hash.replace("#", ""));
						if (page && selectors.matchesSelector(page, pageSelector)) {
							firstPage = page;
						}
					}

					if (!firstPage && ns.getConfig("addPageIfNotExist", true)) {
						firstPage = Page.createEmptyElement();
						while(containerElement.firstChild) {
							firstPage.appendChild(containerElement.firstChild);
						}
						containerElement.appendChild(firstPage);
					}

					if (justBuild) {
												//engine.createWidgets(containerElement, true);
						container = engine.instanceWidget(containerElement, "pagecontainer");
						if (firstPage) {
							self.register(container, firstPage);
						}
						return;
					}
				}

				for (ruleKey in rules) {
					if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].init) {
						rules[ruleKey].init();
					}
				}

				container = engine.instanceWidget(containerElement, "pagecontainer");
				self.register(container, firstPage);
			};

			/**
			 * Method removes all events listners set by router.
			 * @method destroy
			 * @member ns.router.Router
			 */
			Router.prototype.destroy = function () {
				var self = this;
				window.removeEventListener("popstate", self.popStateHandler, false);
				if (body) {
					body.removeEventListener("pagebeforechange", self.pagebeforechangeHandler, false);
					body.removeEventListener("vclick", self.linkClickHandler, false);
				}
			};

			/**
			 * Method sets container.
			 * @method setContainer
			 * @param {ns.widget.core.PageContainer} container
			 * @member ns.router.Router
			 */
			Router.prototype.setContainer = function (container) {
				this.container = container;
			};

			/**
			 * Method returns container.
			 * @method getContainer
			 * @return {ns.widget.core.PageContainer} container of widget
			 * @member ns.router.Router
			 */
			Router.prototype.getContainer = function () {
				return this.container;
			};

			/**
			 * Method returns ths first page.
			 * @method getFirstPage
			 * @return {HTMLElement} the first page
			 * @member ns.router.Router
			 */
			Router.prototype.getFirstPage = function () {
				return this.firstPage;
			};

			/**
			 * Method registers page container and the first page.
			 * @method register
			 * @param {ns.widget.core.PageContainer} container
			 * @param {HTMLElement} firstPage
			 * @member ns.router.Router
			 */
			Router.prototype.register = function (container, firstPage) {
				var self = this;
				self.container = container;
				self.firstPage = firstPage;

				self.linkClickHandler = linkClickHandler.bind(null, self);
				self.popStateHandler = popStateHandler.bind(null, self);

				document.addEventListener("vclick", self.linkClickHandler, false);
				window.addEventListener("popstate", self.popStateHandler, false);

				eventUtils.trigger(document, "themeinit", self);

				if (ns.getConfig("loader", false)) {
					container.element.appendChild(self.getLoader().element);
				}
				history.enableVolatileRecord();
				if (firstPage) {
					self.open(firstPage, { transition: "none" });
				}
				this.getRoute("popup").setActive(null);
			};

			/**
			 * Convert string id to HTMLElement or return HTMLElement if is given
			 * @method getHTMLElement
			 * @param {string|HTMLElement} idOrElement
			 * @returns {HTMLElement}
			 */
			function getHTMLElement(idOrElement) {
				var stringId,
					toElement;
				if (typeof idOrElement === "string") {
					if (idOrElement[0] === "#") {
						stringId = idOrElement.substr(1);
					} else {
						stringId = idOrElement;
					}
					toElement = document.getElementById(stringId);
					if (toElement) {
						idOrElement = toElement;
					}
				}
				return idOrElement;
			}

			/*
			* Method close route element, eg page or popup.
			* @method close
			* @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			* @param {Object} [options]
			* @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain
			* @member ns.router.Router
			*/
			Router.prototype.close = function (to, options) {
				var rel = (options && options.rel) || "back",
					rule = route[rel];

				if (rel === "back") {
					history.back();
				} else {
					if (rule) {
						rule.close(getHTMLElement(to), options);
					} else {
						throw new Error("Not defined router rule [" + rel + "]");
					}
				}
			};

			/**
			 * Method opens popup.
			 * @method openPopup
			 * @param {HTMLElement|string} to Id or HTMLElement of popup.
			 * @param {Object} [options]
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @member ns.router.Router
			 */
			Router.prototype.openPopup = function (to, options) {
				this.open(to, object.fastMerge({rel: "popup"}, options));
			};

			/**
			 * Method closes popup.
			 * @method closePopup
			 * @param {Object} options
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext= in ui-pre-in] options.ext
			 * @member ns.router.Router
			 */
			Router.prototype.closePopup = function (options) {
				var popupRoute = this.getRoute("popup");

				if (popupRoute) {
					popupRoute.close(null, options);
				}
			};

			Router.prototype.lock = function () {
				_isLock = true;
			};

			Router.prototype.unlock = function () {
				_isLock = false;
			};

			/**
			 * Load content from url
			 * @method _loadUrl
			 * @param {string} url
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadUrl = function (url, options, rule, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					request,
					detail = {},
					self = this;

				// If the caller provided data append the data to the URL.
				if (options.data) {
					absUrl = path.addSearchParams(absUrl, options.data);
					options.data = undefined;
				}

				content = rule.find(absUrl);

				if (!content && path.isEmbedded(absUrl)) {
					deferred.reject(detail);
					return;
				}
				// If the content we are interested in is already in the DOM,
				// and the caller did not indicate that we should force a
				// reload of the file, we are done. Resolve the deferrred so that
				// users can bind to .done on the promise
				if (content) {
					detail = object.fastMerge({absUrl: absUrl}, options);
					deferred.resolve(detail, content);
					return;
				}

				if (options.showLoadMsg) {
					self._showLoading(options.loadMsgDelay);
				}

				// Load the new content.
				eventUtils.trigger(self.getContainer().element, options.rel + "beforeload");
				request = new XMLHttpRequest();
				request.responseType = "document";
				request.overrideMimeType("text/html");
				request.open("GET", absUrl);
				request.addEventListener("error", self._loadError.bind(self, absUrl, options, deferred));
				request.addEventListener("load", function (event) {
					var request = event.target;
					if (request.readyState === 4) {
						if (request.status === 200 || (request.status === 0 && request.responseXML)) {
							self._loadSuccess(absUrl, options, rule, deferred, request.responseXML);
							eventUtils.trigger(self.getContainer().element, options.rel + "load");
						} else {
							self._loadError(absUrl, options, deferred);
						}
					}
				});
				request.send();
			};

			/**
			 * Error handler for loading content by AJAX
			 * @method _loadError
			 * @param {string} absUrl
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadError = function (absUrl, options, deferred) {
				var detail = object.fastMerge({url: absUrl}, options),
					self = this;
				// Remove loading message.
				if (options.showLoadMsg) {
					self._showError(absUrl);
				}

				eventUtils.trigger(self.container.element, "loadfailed", detail);
				deferred.reject(detail);
			};

			// TODO it would be nice to split this up more but everything appears to be "one off"
			//	or require ordering such that other bits are sprinkled in between parts that
			//	could be abstracted out as a group
			/**
			 * Success handler for loading content by AJAX
			 * @method _loadSuccess
			 * @param {string} absUrl
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @param {string} html
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadSuccess = function (absUrl, options, rule, deferred, html) {
				var detail = object.fastMerge({url: absUrl}, options),
					content = rule.parse(html, absUrl);

				// Remove loading message.
				if (options.showLoadMsg) {
					this._hideLoading();
				}

				if (content) {
					deferred.resolve(detail, content);
				} else {
					deferred.reject(detail);
				}
			};

			// TODO the first page should be a property set during _create using the logic
			//	that currently resides in init
			/**
			 * Get initial content
			 * @method _getInitialContent
			 * @member ns.router.Router
			 * @return {HTMLElement} the first page
			 * @protected
			 */
			Router.prototype._getInitialContent = function () {
				return this.firstPage;
			};

			/**
			 * Show the loading indicator
			 * @method _showLoading
			 * @param {number} delay
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._showLoading = function (delay) {
				this.container.showLoading(delay);
			};

			/**
			 * Report an error loading
			 * @method _showError
			 * @param {string} absUrl
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._showError = function (absUrl) {
				ns.error("load error, file: ", absUrl);
			};

			/**
			 * Hide the loading indicator
			 * @method _hideLoading
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._hideLoading = function () {
				this.container.hideLoading();
			};

			/**
			 * Returns true if popup is active.
			 * @method hasActivePopup
			 * @return {boolean}
			 * @member ns.router.Router
			 */
			Router.prototype.hasActivePopup = function () {
				var popup = this.getRoute("popup");
				return popup && popup.hasActive();
			};

			/**
			 * This function returns proper route.
			 * @method getRoute
			 * @param {string} Type of route
			 * @return {?ns.router.route.interface}
			 * @member ns.router.Router
			 */
			Router.prototype.getRoute = function (type) {
				return route[type];
			};


			/**
			 * Returns loader widget
			 * @return {ns.widget.mobile.Loader}
			 * @member ns.router.Page
			 * @method getLoader
			 */
			Router.prototype.getLoader = function () {
				var loaderElement = document.querySelector("[data-role=loader],.ui-loader");

				if (!loaderElement) {
					loaderElement = document.createElement("div");
					DOM.setNSData(loaderElement, "role", "loader");
				}

				return engine.instanceWidget(loaderElement, "Loader");
			};

			routerMicro.Router = Router;

			engine.initRouter(Router);
			}(window, window.document, ns));

/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Route Page
 * Support class for router to control changing pages.
 * @class ns.router.route.page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
				var util = ns.util,
				path = util.path,
				DOM = util.DOM,
				object = util.object,
				utilSelector = util.selectors,
				history = ns.router.history,
				engine = ns.engine,
				Page = ns.widget.core.Page,
				baseElement,
				routePage = {},
				head;

			/**
			 * Tries to find a page element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found
			 * @method findPageAndSetDataUrl
			 * @param {string} dataUrl DataUrl of searching element
			 * @param {string} filter Query selector for searching page
			 * @return {?HTMLElement}
			 * @private
			 * @static
			 * @member ns.router.route.page
			 */
			function findPageAndSetDataUrl(dataUrl, filter) {
				var id = path.stripQueryParams(dataUrl).replace("#", ""),
					page = document.getElementById(id);

				if (page && utilSelector.matchesSelector(page, filter)) {
					if (dataUrl === id) {
						DOM.setNSData(page, "url", "#" + id);
					} else {
						DOM.setNSData(page, "url", dataUrl);
					}

				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					page = null;
				}
				// @TODO ... else
				// probably there is a need for running onHashChange while going back to a history entry
				// without state, eg. manually entered #fragment. This may not be a problem on target device
				return page;
			}

			routePage.orderNumber = 1;
			/**
			 * Property containing default properties
			 * @property {Object} defaults
			 * @property {string} defaults.transition="none"
			 * @static
			 * @member ns.router.route.page
			 */
			routePage.defaults = {
				transition: "none"
			};

			/**
			 * Property defining selector for filtering only page elements
			 * @property {string} filter
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.filter = engine.getWidgetDefinition("Page").selector.replace(/(\s*)/g, "" );

			/**
			 * Returns default route options used inside Router.
			 * @method option
			 * @static
			 * @member ns.router.route.page
			 * @return {Object} default route options
			 */
			routePage.option = function () {
				var defaults = object.merge({}, routePage.defaults);
				defaults.transition = ns.getConfig('pageTransition', defaults.transition);
				return defaults;
			};

			routePage.init = function() {
				var pages = [].slice.call(document.querySelectorAll(this.filter));
				pages.forEach(function (page) {
					if (!DOM.getNSData(page, "url")) {
						DOM.setNSData(page, "url", (page.id && "#" + page.id) || location.pathname + location.search);
					}
				});
			};

			/**
			 * This method changes page. It sets history and opens page passed as a parameter.
			 * @method open
			 * @param {HTMLElement|string} toPage The page which will be opened.
			 * @param {Object} [options]
			 * @param {boolean} [options.fromHashChange] Sets if call was made on hash change.
			 * @param {string} [options.dataUrl] Sets if page has url attribute.
			 * @member ns.router.route.page
			 */
			routePage.open = function (toPage, options) {
				var pageTitle = document.title,
					url,
					state = {},
					router = engine.getRouter();

				if (toPage === router.getFirstPage() && !options.dataUrl) {
					url = path.documentUrl.hrefNoHash;
				} else {
					url = DOM.getNSData(toPage, "url");
				}

				pageTitle = DOM.getNSData(toPage, "title") || utilSelector.getChildrenBySelector(toPage, ".ui-header > .ui-title").textContent || pageTitle;
				if (!DOM.getNSData(toPage, "title")) {
					DOM.setNSData(toPage, "title", pageTitle);
				}

				if (url && !options.fromHashChange) {
					if (!path.isPath(url) && url.indexOf("#") < 0) {
						url = path.makeUrlAbsolute("#" + url, path.documentUrl.hrefNoHash);
					}

					state = object.merge(
						{},
						options,
						{
							url: url
						}
					);

					history.replace(state, pageTitle, url);
				}

				// write base element
				this._setBase(url);

				//set page title
				document.title = pageTitle;
				this.active = true;
				this.getContainer().change(toPage, options);

			};

			/**
			 * This method determines target page to open.
			 * @method find
			 * @param {string} absUrl Absolute path to opened page
			 * @member ns.router.route.page
			 * @return {?HTMLElement} Element of page to open.
			 */
			routePage.find = function (absUrl) {
				var self = this,
					router = engine.getRouter(),
					dataUrl = self._createDataUrl(absUrl),
					initialContent = router.getFirstPage(),
					pageContainer = router.getContainer(),
					page,
					selector = "[data-url='" + dataUrl + "']",
					filterRegexp = /,/gm;

				if (/#/.test(absUrl) && path.isPath(dataUrl)) {
					return null;
				}

				// Check to see if the page already exists in the DOM.
				// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
				//      are a valid url char and it breaks on the first occurence
				// prepare selector for new page
				selector += self.filter.replace(filterRegexp, ",[data-url='" + dataUrl + "']");
				page = pageContainer.element.querySelector(selector);

				// If we failed to find the page, check to see if the url is a
				// reference to an embedded page. If so, it may have been dynamically
				// injected by a developer, in which case it would be lacking a
				// data-url attribute and in need of enhancement.
				if (!page && dataUrl && !path.isPath(dataUrl)) {
					//Remove search data
					page = findPageAndSetDataUrl(dataUrl, self.filter);
				}

				// If we failed to find a page in the DOM, check the URL to see if it
				// refers to the first page in the application. Also check to make sure
				// our cached-first-page is actually in the DOM. Some user deployed
				// apps are pruning the first page from the DOM for various reasons.
				// We check for this case here because we don't want a first-page with
				// an id falling through to the non-existent embedded page error case.
				if (!page &&
						path.isFirstPageUrl(dataUrl) &&
						initialContent) {
					page = initialContent;
				}

				return page;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * Sets document base to parsed document absolute path.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed page
			 * @member ns.router.route.page
			 * @return {?HTMLElement} Element of page in parsed document.
			 */
			routePage.parse = function (html, absUrl) {
				var self = this,
					page,
					dataUrl = self._createDataUrl(absUrl);

				// write base element
				// @TODO shouldn't base be set if a page was found?
				self._setBase(absUrl);

				// Finding matching page inside created element
				page = html.querySelector(self.filter);

				// If a page exists...
				if (page) {
					// TODO tagging a page with external to make sure that embedded pages aren't
					// removed by the various page handling code is bad. Having page handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(page, "url", dataUrl);
					DOM.setNSData(page, "external", true);
				}
				return page;
			};

			/**
			 * This method handles hash change, **currently does nothing**.
			 * @method onHashChange
			 * @static
			 * @member ns.router.route.page
			 * @return {null}
			 */
			routePage.onHashChange = function (/* url, options */) {
				return null;
			};

			/**
			 * This method creates data url from absolute url given as argument.
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 * @return {string}
			 */
			routePage._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl, true);
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed
			 * @member ns.router.route.page
			 */
			routePage.onOpenFailed = function (/* options */) {
				this._setBase(path.parseLocation().hrefNoSearch);
			};

			/**
			 * This method returns base element from document head.
			 * If no base element is found, one is created based on current location.
			 * @method _getBaseElement
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 * @return {HTMLElement}
			 */
			routePage._getBaseElement = function () {
				// Fetch document head if never cached before
				if (!head) {
					head = document.querySelector("head");
				}
				// Find base element
				if (!baseElement) {
					baseElement = document.querySelector("base");
					if (!baseElement) {
						baseElement = document.createElement("base");
						baseElement.href = path.documentBase.hrefNoHash;
						head.appendChild(baseElement);
					}
				}
				return baseElement;
			};

			/**
			 * Sets document base to url given as argument
			 * @method _setBase
			 * @param {string} url
			 * @protected
			 * @member ns.router.route.page
			 */
			routePage._setBase = function (url) {
				var base = this._getBaseElement(),
					baseHref = base.href;

				if (path.isPath(url)) {
					url = path.makeUrlAbsolute(url, path.documentBase);
					if (path.parseUrl(baseHref).hrefNoSearch !== path.parseUrl(url).hrefNoSearch) {
						base.href = url;
						path.documentBase = path.parseUrl(path.makeUrlAbsolute(url, path.documentUrl.href));
					}
				}
			};

			/**
			 * Returns container of pages
			 * @method getContainer
			 * @return {?ns.widget.core.Page}
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.getContainer = function () {
				return engine.getRouter().getContainer();
			};

			/**
			 * Returns active page.
			 * @method getActive
			 * @return {?ns.widget.core.Page}
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.getActive = function () {
				return this.getContainer().getActivePage();
			};

			/**
			 * Returns element of active page.
			 * @method getActiveElement
			 * @return {HTMLElement}
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.getActiveElement = function () {
				return this.getActive().element;
			};
			ns.router.route.page = routePage;

			}(window.document, ns));

/*global window, define, ns */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Route Popup
 * Support class for router to control changing pupups.
 * @class ns.router.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
				var
			/**
			 * @property {Object} Popup Alias for {@link ns.widget.Popup}
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			Popup = ns.widget.core.Popup,
			util = ns.util,
			routePopup = {
				/**
				 * Object with default options
				 * @property {Object} defaults
				 * @property {string} [defaults.transition='none'] Sets the animation used during change of popup.
				 * @property {?HTMLElement} [defaults.container=null] Sets container of element.
				 * @property {boolean} [defaults.volatileRecord=true] Sets if the current history entry will be modified or a new one will be created.
				 * @member ns.router.route.popup
				 * @static
				 */
				defaults: {
					transition: "none",
					container: null,
					volatileRecord: true
				},
				/**
				 * Popup Element Selector
				 * @property {string} filter
				 * @member ns.router.route.popup
				 * @static
				 */
				filter: "." + Popup.classes.popup,
				/**
				 * Storage variable for active popup
				 * @property {?HTMLElement} activePopup
				 * @member ns.router.route.popup
				 * @static
				 */
				activePopup: null,
				/**
				 * Dictionary for popup related event types
				 * @property {Object} events
				 * @property {string} [events.POPUP_HIDE='popuphide']
				 * @member ns.router.route.popup
				 * @static
				 */
				events: {
					POPUP_HIDE: "popuphide"
				}
			},
			/**
			 * Alias for {@link ns.engine}
			 * @property {Object} engine
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			engine = ns.engine,
			/**
			 * Alias for {@link ns.util.path}
			 * @property {Object} path
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			path = ns.util.path,
			/**
			 * Alias for {@link ns.util.selectors}
			 * @property {Object} utilSelector
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			utilSelector = ns.util.selectors,
			/**
			 * Alias for {@link ns.router.history}
			 * @property {Object} history
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			history = ns.router.history,
			/**
			 * Alias for {@link ns.util.DOM}
			 * @property {Object} DOM
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			DOM = ns.util.DOM,
			/**
			 * Alias for Object utils
			 * @method slice
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			object = ns.util.object,
			/**
			 * Popup's hash added to url
			 * @property {string} popupHashKey
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			popupHashKey = "popup=true",
			/**
			 * Regexp for popup's hash
			 * @property {RegExp} popupHashKeyReg
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			popupHashKeyReg = /([&|\?]popup=true)/;

			/**
			 * Tries to find a popup element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found.
			 * @method findPopupAndSetDataUrl
			 * @param {string} id
			 * @param {string} filter
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			function findPopupAndSetDataUrl(id, filter) {
				var popup,
					hashReg = /^#/;

				id = id.replace(hashReg,"");
				popup = document.getElementById(id);

				if (popup && utilSelector.matchesSelector(popup, filter)) {
					DOM.setNSData(popup, "url", "#" + id);
				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					popup = null;
				}
				// @TODO ... else
				// probably there is a need for running onHashChange while going back to a history entry
				// without state, eg. manually entered #fragment. This may not be a problem on target device
				return popup;
			}

			routePopup.orderNumber = 100;
			/**
			 * This method returns default options for popup router.
			 * @method option
			 * @return {Object}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.option = function () {
				var defaults = object.merge({}, routePopup.defaults);
				defaults.transition = ns.getConfig("popupTransition", defaults.transition);
				return defaults;
			};

			/**
			 * This method sets active popup and manages history.
			 * @method setActive
			 * @param {?ns.widget.core.popup} activePopup
			 * @param {Object} options
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.setActive = function (activePopup, options) {
				var url,
					pathLocation = path.getLocation(),
					documentUrl = pathLocation.replace(popupHashKeyReg, "");

				this.activePopup = activePopup;

				if (activePopup) {
					// If popup is being opened, the new state is added to history.
					if (options && !options.fromHashChange && options.history) {
						url = path.addHashSearchParams(documentUrl, popupHashKey);
						history.replace(options, "", url);
					}
					this.active = true;
				} else if (pathLocation !== documentUrl) {
					// If popup is being closed, the history.back() is called
					// but only if url has special hash.
					// Url is changed after opening animation and in some cases,
					// the popup is closed before this animation and then the history.back
					// could cause undesirable change of page.
					this.active = false;
					history.back();
				}
			};

			/**
			 * This method opens popup if no other popup is opened.
			 * It also changes history to show that popup is opened.
			 * If there is already active popup, it will be closed.
			 * @method open
			 * @param {HTMLElement|string} toPopup
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = 'popup'] Represents kind of link as 'page' or 'popup' or 'external' for linking to another domain.
			 * @param {string} [options.transition = 'none'] Sets the animation used during change of popup.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {string} [options.container = null] Selector for container.
			 * @param {boolean} [options.volatileRecord=true] Sets if the current history entry will be modified or a new one will be created.
			 * @param {Event} event
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.open = function (toPopup, options, event) {
				var self = this,
					popup,
					router = engine.getRouter(),
					events = self.events,
					removePopup = function () {
						document.removeEventListener(events.POPUP_HIDE, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						self.activePopup = null;
					},
					openPopup = function () {
						var positionTo = options["position-to"];
						// add such option only if it exists
						if (positionTo) {
							options.positionTo = positionTo;
						}
						if (event && event.touches) {
							options.x = event.touches[0].clientX;
							options.y = event.touches[0].clientY;
						} else if (event){
							options.x = event.clientX;
							options.y = event.clientY;
						}

						document.removeEventListener(events.POPUP_HIDE, openPopup, false);
						popup = engine.instanceWidget(toPopup, "Popup", options);
						popup.open(options);
						self.activePopup = popup;
					},
					activePage = router.container.getActivePage(),
					container;

				if (DOM.getNSData(toPopup, "external") === true) {
					container = options.container ? activePage.element.querySelector(options.container) : activePage.element;
					if (toPopup.parentNode !== container) {
						toPopup = util.importEvaluateAndAppendElement(toPopup, container);
					}
					document.addEventListener(routePopup.events.POPUP_HIDE, removePopup, false);
				}

				if (self.hasActive()) {
					document.addEventListener(events.POPUP_HIDE, openPopup, false);
					self.close();
				} else {
					openPopup();
				}
				this.active = true;
			};

			/**
			 * This method closes active popup.
			 * @method close
			 * @param {ns.widget.core.Popup} [activePopup]
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext= in ui-pre-in] options.ext
			 * @param {Object} options
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup.close = function (activePopup, options) {
				var popupOptions,
					pathLocation = path.getLocation(),
					documentUrl = pathLocation.replace(popupHashKeyReg, "");

				options = options || {};

				if (activePopup && !(activePopup instanceof Popup)) {
					activePopup = engine.instanceWidget(activePopup, "Popup", options);
				}
				activePopup = activePopup || this.activePopup;

				// if popup is active
				if (activePopup) {
					popupOptions = activePopup.options;
					// we check if it changed the history
					if (popupOptions.history && pathLocation !== documentUrl) {
						// and then set new options for popup
						popupOptions.transition = options.transition || popupOptions.transition;
						popupOptions.ext = options.ext || popupOptions.ext;
						// unlock the router if it was locked
						if (!popupOptions.dismissible) {
							engine.getRouter().unlock();
						}
						// and call history.back()
						history.back();
					} else {
						// if popup did not change the history, we close it normally
						activePopup.close(options || {});
					}
					return true;
				}
				return false;
			};

			/**
			 * This method handles hash change.
			 * It closes opened popup.
			 * @method onHashChange
			 * @param {string} url
			 * @param {object} options
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.onHashChange = function (url, options) {
				var activePopup = this.activePopup;

				if (activePopup) {
					activePopup.close(options);
					// Default routing setting cause to rewrite further window history
					// even if popup has been closed
					// To prevent this onHashChange after closing popup we need to change
					// disable volatile mode to allow pushing new history elements
					this.active = false;
					return true;
				}
				return false;
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed
			 * @member ns.router.route.popup
			 * @return {null}
			 * @static
			 */
			routePopup.onOpenFailed = function (/* options */) {
				return null;
			};

			/**
			 * This method finds popup by data-url.
			 * @method find
			 * @param {string} absUrl Absolute path to opened popup
			 * @return {HTMLElement} Element of popup
			 * @member ns.router.route.popup
			 */
			routePopup.find = function (absUrl) {
				var self = this,
					dataUrl = self._createDataUrl(absUrl),
					activePage = engine.getRouter().getContainer().getActivePage(),
					popup;

				popup = activePage.element.querySelector("[data-url='" + dataUrl + "']" + self.filter);

				if (!popup && dataUrl && !path.isPath(dataUrl)) {
					popup = findPopupAndSetDataUrl(dataUrl, self.filter);
				}

				return popup;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed popup
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 */
			routePopup.parse = function (html, absUrl) {
				var self = this,
					popup,
					dataUrl = self._createDataUrl(absUrl);

				popup = html.querySelector(self.filter);

				if (popup) {
					// TODO tagging a popup with external to make sure that embedded popups aren't
					// removed by the various popup handling code is bad. Having popup handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(popup, "url", dataUrl);
					DOM.setNSData(popup, "external", true);
				}

				return popup;
			};

			/**
			 * Convert url to data-url
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @return {string}
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl);
			};

			/**
			 * Return true if active popup exists.
			 * @method hasActive
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.hasActive = function () {
				return !!this.activePopup;
			};

			/**
			 * Returns active popup.
			 * @method getActive
			 * @return {?ns.widget.core.Popup}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.getActive = function () {
				return this.activePopup;
			};

			/**
			 * Returns element of active popup.
			 * @method getActiveElement
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.getActiveElement = function () {
				var active = this.getActive();
				return active && active.element;
			};

			ns.router.route.popup = routePopup;

			}(window, window.document, ns));

/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Route Drawer
 * Support class for router to control assist panel widget in profile Wearable.
 * @class ns.router.route.assistPanel
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
				var CoreAssistPanel = ns.widget.wearable.AssistPanel,
				path = ns.util.path,
				history = ns.router.history,
				engine = ns.engine,
				routeAssistPanel = {},
				assistPanelHashKey = "assistPanel=true",
				assistPanelHashKeyReg = /([&|\?]assistPanel=true)/;

			routeAssistPanel.orderNumber = 1001;
			/**
			 * Property containing default properties
			 * @property {Object} defaults
			 * @property {string} defaults.transition="none"
			 * @static
			 * @member ns.router.route.assistPanel
			 */
			routeAssistPanel.defaults = {
				transition: "none"
			};

			/**
			 * Property defining selector for filtering only assistPanel elements
			 * @property {string} filter
			 * @member ns.router.route.assistPanel
			 * @static
			 */
			routeAssistPanel.filter = "." + CoreAssistPanel.classes.assistPanel;


			/**
			 * Returns default route options used inside Router.
			 * But, assist panel router has not options.
			 * @method option
			 * @static
			 * @member ns.router.route.assistPanel
			 * @return null
			 */
			routeAssistPanel.option = function () {
				return null;
			};

			/**
			 * This method opens the assist panel.
			 * @method open
			 * @param {HTMLElement} assistPanelElement
			 * @member ns.router.route.assistPanel
			 */
			routeAssistPanel.open = function (assistPanelElement) {
				/*var drawer = engine.instanceWidget(drawerElement, "Drawer");
				drawer.open();*/
				return;
			};

			/**
			 * This method determines target assist panel to open.
			 * @method find
			 * @param {string} absUrl Absolute path to opened assist panel widget
			 * @member ns.router.route.assistPanel
			 * @return {?HTMLElement} assistPanelElement
			 */
			routeAssistPanel.find = function (absUrl) {
				var dataUrl = path.convertUrlToDataUrl(absUrl),
					activePage = engine.getRouter().getContainer().getActivePage(),
					assistPanel;

				assistPanel = activePage.element.querySelector("#" + dataUrl);

				return assistPanel;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * But, assist panel router doesn't need to that.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed page
			 * @member ns.router.route.assistPanel
			 */
			routeAssistPanel.parse = function (html, absUrl) {
				return null;
			};

			/**
			 * This method sets active assist panel and manages history.
			 * @method setActive
			 * @param {Object} activeAssistPanel
			 * @member ns.router.route.assistPanel
			 * @static
			 */
			routeAssistPanel.setActive = function (activeAssistPanel) {
				var url,
					pathLocation = path.getLocation(),
					documentUrl = pathLocation.replace(assistPanelHashKeyReg, "");

				this._activeAssistPanel = activeAssistPanel;

				if(activeAssistPanel) {
					url = path.addHashSearchParams(documentUrl, assistPanelHashKey);
					history.replace({}, "", url);
					this.active = true;
				} else if (pathLocation !== documentUrl) {
					history.back();
				}
			};

			/**
			 * This method handles hash change.
			 * @method onHashChange
			 * @param {String} url
			 * @param {Object} options
			 * @param {String} prev Previous url string
			 * @static
			 * @member ns.router.route.assistPanel
			 * @return {null}
			 */
			routeAssistPanel.onHashChange = function (url, options, prev) {
				var self = this,
					activeAssistPanel = self._activeAssistPanel,
					stateUrl = prev.stateUrl;

				if (activeAssistPanel && stateUrl.search(assistPanelHashKey) > 0 && url.search(assistPanelHashKey) < 0) {
					activeAssistPanel.close(options);
					this.active = false;
					return true;
				}
				return null;
			};

			ns.router.route.assistPanel = routeAssistPanel;

			}(window.document, ns));

/*global window, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint plusplus: true, nomen: true */
/**
 * @class tau.navigator
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
(function (document, ns) {
	"use strict";
	
			document.addEventListener("beforerouterinit", function () {
				ns.setConfig('autoInitializePage', ns.autoInitializePage);
			}, false);

			document.addEventListener("routerinit", function (evt) {
				var router = evt.detail,
					routePage = router.getRoute("page"),
					history = ns.router.history,
					back = history.back.bind(router),
					classes = ns.widget.core.Page.classes,
					pageActiveClass = classes.uiPageActive;
				/**
				 * @method changePage
				 * @inheritdoc ns.router.Router#open
				 * @member tau
				 */
				ns.changePage = router.open.bind(router);
				document.addEventListener('pageshow', function () {
					/**
					 * Current active page
					 * @property {HTMLElement} activePage
					 * @member tau
					 */
					ns.activePage = document.querySelector('.' + pageActiveClass);
				});
				/**
				 * First page element
				 * @inheritdoc ns.router.Router#firstPage
				 * @property {HTMLElement} firstPage
				 * @member tau
				 */
				ns.firstPage = router.getFirstPage();
				/**
				 * Returns active page element
				 * @inheritdoc ns.router.Router#getActivePageElement
				 * @method getActivePage
				 * @member tau
				 */
				ns.getActivePage = routePage.getActiveElement.bind(routePage);
				/**
				 * @inheritdoc ns.router.history#back
				 * @method back
				 * @member tau
				 */
				ns.back = back;
				/**
				 * @inheritdoc ns.router.Router#init
				 * @method initializePage
				 * @member tau
				 */
				ns.initializePage = router.init.bind(router);
				/**
				 * Page Container widget
				 * @property {HTMLElement} pageContainer
				 * @inheritdoc ns.router.Router#container
				 * @member tau
				 */
				ns.pageContainer = router.container;
				/**
				 * @method openPopup
				 * @inheritdoc ns.router.Router#openPopup
				 * @member tau
				 */
				ns.openPopup = function(to, options) {
					var htmlElementTo;
					if (to && to.length !== undefined && typeof to === 'object') {
						htmlElementTo = to[0];
					} else {
						htmlElementTo = to;
					}
					router.openPopup(htmlElementTo, options);
				};
				/**
				 * @method closePopup
				 * @inheritdoc ns.router.Router#closePopup
				 * @member tau
				 */
				ns.closePopup = router.closePopup.bind(router);

			}, false);

			}(window.document, ns));

/*global define, window */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	"use strict";
				if (ns.getConfig("autorun", true) === true) {
				ns.engine.run();
			}
			}(ns));

/*global define, ns */
			ns.info.profile = "fit2";
			
}(window, window.document));
