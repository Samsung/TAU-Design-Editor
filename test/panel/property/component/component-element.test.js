import { expect } from 'chai';
import '@/general-test-config';
import '@/brackets/brackets-test-config';

import { Component } from '@/panel/property/component/component-element';

describe('component-element', () => {

	describe('_setIcon basic test', () => {
		const componentName = 'test-component';
		const getContext = () => ({
			_profile: 'mobile',
			_shape: 'rectangle',
			// mock of component list
			componentsInfo: {
				[componentName]: {
					options: {
						path: '/path/to/component',
						resources: {
							icon: './path/to/icon'
						}
					}
				}
			}
		});

		const createItem = () => {
			const div = document.createElement('div');

			div.dataset['componentName'] = componentName;

			return div;
		};

		describe ('should set proper path to image', () => {
			it('when component structure is: resources -> icon:string', () => {
				const itemList = [
					createItem()
				];
				const _setIcon = Component.prototype._setIcon.bind(getContext());

				_setIcon(itemList);

				const expectedIconFullPath = '/path/to/component/path/to/icon';
				expect(itemList[0].style['backgroundImage'])
					.to.equal(`url(${expectedIconFullPath})`);

				// eslint-disable-next-line no-unused-expressions
				expect(
					itemList[0].classList
						.contains('closet-component-element-list-item-noicon')
				).to.be.false;
			});

			it('when component structure is: resources -> icon -> [_profile]:string', () => {
				const itemList = [
					createItem()
				];
				const context = getContext();
				const oldPath = context.componentsInfo[componentName].options.resources.icon;
				context.componentsInfo[componentName].options.resources.icon = {
					[context._profile]: oldPath
				};

				const _setIcon = Component.prototype._setIcon.bind(context);

				_setIcon(itemList);

				const expectedIconFullPath = '/path/to/component/path/to/icon';
				expect(itemList[0].style['backgroundImage'])
					.to.equal(`url(${expectedIconFullPath})`);

				// eslint-disable-next-line no-unused-expressions
				expect(
					itemList[0].classList
						.contains('closet-component-element-list-item-noicon')
				).to.be.false;
			});

			it('when component structure is: resources -> icon -> [profile] -> [_shape]:string', () => {
				const itemList = [
					createItem()
				];
				const context = getContext();
				const oldPath = context.componentsInfo[componentName].options.resources.icon;
				context.componentsInfo[componentName].options.resources.icon = {
					[context._profile]: {
						[context._shape]: oldPath
					}
				};

				const _setIcon = Component.prototype._setIcon.bind(context);

				_setIcon(itemList);

				const expectedIconFullPath = '/path/to/component/path/to/icon';
				expect(itemList[0].style['backgroundImage'])
					.to.equal(`url(${expectedIconFullPath})`);

				// eslint-disable-next-line no-unused-expressions
				expect(
					itemList[0].classList
						.contains('closet-component-element-list-item-noicon')
				).to.be.false;
			});
		});

		it ('should work properly with Windows paths', () => {
			const p1 = 'Documents\\Newsletters';
			const p2 = '2018\\January.xlsx';

			const context = getContext();
			context.componentsInfo[componentName].options.path = p1;
			context.componentsInfo[componentName].options.resources.icon = p2;
			const _setIcon = Component.prototype._setIcon.bind(context);
			const itemList = [
				createItem()
			];

			_setIcon(itemList);

			const properIconFullPath = 'Documents/Newsletters/2018/January.xlsx';

			expect(itemList[0].style['backgroundImage'])
				.to.equal(`url(${properIconFullPath})`);

			// eslint-disable-next-line no-unused-expressions
			expect(
				itemList[0].classList
					.contains('closet-component-element-list-item-noicon')
			).to.be.false;
		});

		it ('should work properly with empty array', () => {
			const itemList = [];
			const _setIcon = Component.prototype._setIcon.bind(getContext());

			expect(() => _setIcon(itemList)).not.to.throw();
		});

		it ('should handle empty or null argument', () => {
			const _setIcon = Component.prototype._setIcon.bind(getContext());

			expect(() => _setIcon()).not.to.throw();
			expect(() => _setIcon(null)).not.to.throw();
		});
	});
});
