/**
 * Mock for registerElement
 *
 * @param {string} tagName - The name of the custom element.
 * The name must contain a dash (-), for example my-tag.
 * @param {object} options - An object with properties prototype to base the custom element on,
 * and extends, an existing tag to extend. Both of these are optional.
 *
 * Based on: https://developer.mozilla.org/en-US/docs/Web/API/Document/registerElement
 */
document.registerElement = (tagName, options) => options;
