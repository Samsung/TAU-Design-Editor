/**
 * Container for Undo/Redo operation.
 */
class History {

	constructor() {
		this.invalidate();
	}

	invalidate() {
		this._history = [];
		this._undoHistory = [];
	}

	add(operation) {
		this._undoHistory = [];
		this._history.push(operation);
	}

	undo() {
		const state = this._history.pop();
		if (!state)
			return null;
		this._undoHistory.push(state);
		return state;
	}

	redo() {
		const state = this._undoHistory.pop();
		if (!state)
			return null;
		this._history.push(state);
		return state;
	}
}
export default History;
