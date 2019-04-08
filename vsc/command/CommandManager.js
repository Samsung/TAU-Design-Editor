/**
 * This module contains set of functions simulating Brackets API behaviour,
 * which is non existent while Design Editor is used
 * as Visual Studio Code extension.
 *
 * @todo implement ProjectManager module methods
 * (http://suprem.sec.samsung.net/jira/browse/TIZENWF-2012)
 */
module.exports = class CommandManager {
	/**
	 * Retrieves a Command object by id
	 * @param {string} id
	 * @return {Command}
	 */
	static get(id) {
		return null;
	}

	/**
	 * Registers a global command.
	 * @param {string} name - text that will be displayed
	 * 		in the UI to represent command
	 * @param {string} id - unique identifier for command.
	 *      Core commands in Brackets use a simple commandtitle
	 * 		as an id, for example "open.file".
	 *      Extensions should use the following format:
	 * 		"author.myextension.mycommandname".
	 *      For example, "lschmitt.csswizard.format.css".
	 * @param {function(...)} commandFn - the function to call when the
	 * 		command is executed. Any arguments passed to
	 *     	execute() (after the id) are passed as arguments
	 * 		to the function. If the function is asynchronous,
	 *     	it must return a jQuery promise that is resolved
	 * 		when the command completes. Otherwise, the
	 *     	CommandManager will assume it is synchronous,
	 * 		and return a promise that is already resolved.
	 * @return {?Command}
	 */
	static register(name, id, commandFn) {
		return null;
	}
};
