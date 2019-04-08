'use babel';

import editorAtom from './editor/atom';
import editorBrackets from './editor/brackets';

const editor = (window.atom !== undefined) ? editorAtom : editorBrackets;

export default editor;
