import { expect } from 'chai';

import { containerExpander } from '@/pane/utils/design-editor-element-utils';

describe('design-editor-element-utils', () => {
	describe('containerExpander', () => {
		let container, initialHeight, initialOverflowY;
		const getBox = (size) => {
			const div = document.createElement('div');
			div.style.height = `${size}px`;
			div.style.width = `${size}px`;

			return div;
		};

		const hasInitialStyles = () => {
			expect(container.style.height).to.equal(initialHeight);
			expect(container.style.overflowY).to.equal(initialOverflowY);
		};

		beforeEach(() => {
			const containerId = 'container-1';

			container = document.createElement('div');
			container.setAttribute('data-id', containerId);
			container.style.height = '100px';

			initialHeight = container.style.height;
			initialOverflowY = container.style.overflowY;
		});

		it('expand container to roll out and roll back when it\' height is smaller than its children height', () => {
			container.appendChild(getBox(100));
			container.appendChild(getBox(100));
			container.appendChild(getBox(100));

			containerExpander.rollOut(container);
			expect(parseInt(container.style.height)).to.be.above(parseInt('100px'));

			containerExpander.rollBack(container.getAttribute('data-id'));
			hasInitialStyles();
		});

		it('don\'t change style of element whose height is larger or equal than its children\'s height', () => {
			container.appendChild(getBox(80));

			containerExpander.rollOut(container);
			hasInitialStyles();

			containerExpander.rollBack(container.getAttribute('data-id'));
			hasInitialStyles();
		});

		it('doesn\'t roll back element that hasn\'t been rolled out', () => {
			containerExpander.rollBack(container.getAttribute('data-id'));
			hasInitialStyles();
			expect(containerExpander.wasExtended).to.equal(false);
		});

		it('doesn\'t roll out element that is not a container', () => {
			// TODO
		});
	});
});
