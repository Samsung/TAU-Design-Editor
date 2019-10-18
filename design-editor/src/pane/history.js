import {EVENTS, eventEmitter} from '../events-emitter';

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
		eventEmitter.emit(EVENTS.HistoryChanged, {
			'historyLength':	 this._history.length,
			'undoHistoryLength': this._undoHistory.length
		});
	}

	undo() {
		const state = this._history.pop();
		if (!state)
			return null;
		this._undoHistory.push(state);
		eventEmitter.emit(EVENTS.HistoryChanged, {
			'historyLength':	 this._history.length,
			'undoHistoryLength': this._undoHistory.length
		});
		return state;
	}

	redo() {
		const state = this._undoHistory.pop();
		if (!state)
			return null;
		this._history.push(state);
		eventEmitter.emit(EVENTS.HistoryChanged, {
			'historyLength': 	 this._history.length,
			'undoHistoryLength': this._undoHistory.length
		});
		return state;
	}
}
export default History;
