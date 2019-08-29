import { shallowMount } from '@vue/test-utils';
import { createMessageMixin } from '@/components/mixins/message.js';
import FlashMessageElem from '@/components/FlashMessage.vue';

jest.useFakeTimers();

// default config
let config = {
	name: 'flashMessage',
	tag: 'FlashMessage',
	time: 8000,
	icon: true,
	strategy: 'single'
};

let FlashMessage = Object.assign(FlashMessageElem, createMessageMixin(config));

describe('Test FlashMessage Compoent', () => {
	let cmp;

	describe('FlashMesage with "single" strategy', () => {
		beforeEach(() => {
			cmp = shallowMount(FlashMessage, {
				propsData: {
					messageObj: {
						id: 1,
						status: 'error',
						title: 'error title',
						message: 'error message',
						clickable: true,
						icon: 'www.icon-link.ru',
						time: 8000,
						blockClass: null,
						iconClass: null,
						contentClass: null,
						mounted: null,
						destroyed: null
					}
				},
				mocks: {
					flashMessage: {
						$emit: jest.fn(),
						$once: jest.fn()
					}
				}
			});
		});

		it('Component should exist', () => {
			expect(cmp.exists()).toBe(true);
		});

		describe('Testing data object of mounted component', () => {
			it('FlashMesage has property "id" and it is equal to "1"', () => {
				expect(cmp.vm.messageObj.id).toBe(1);
			});

			it('FlashMesage has property "timeoutId" and it equal to "undefined"', () => {
				expect(typeof cmp.vm.timeoutId).toBe('number');
			});

			it('FlashMesage has property "time" and it is equal to "8000"', () => {
				expect(cmp.vm.messageObj.time).toBe(8000);
			});

			it('FlashMesage has property "status" and it is equal to "error"', () => {
				expect(cmp.vm.messageObj.status).toBe('error');
			});

			it('FlashMesage has property "title" and it is equal to "error title"', () => {
				expect(cmp.vm.messageObj.title).toBe('error title');
			});

			it('FlashMesage has property "message" and it is equal to "error message"', () => {
				expect(cmp.vm.messageObj.message).toBe('error message');
			});

			it('FlashMesage has property "icon" and it is equal to "www.icon-link.ru"', () => {
				expect(cmp.vm.messageObj.icon).toBe('www.icon-link.ru');
			});

			it('FlashMesage has property "clickable" and it is equal to "true"', () => {
				expect(cmp.vm.messageObj.clickable).toBe(true);
			});

			it('FlashMesage has property "blockClass" and it is an qual to "null"', () => {
				expect(cmp.vm.messageObj.blockClass).toBe(null);
			});

			it('FlashMesage has property "iconClass" and it is an qual to "null"', () => {
				expect(cmp.vm.messageObj.iconClass).toBe(null);
			});

			it('FlashMesage has property "contentClass" and it is an qual to "null"', () => {
				expect(cmp.vm.messageObj.contentClass).toBe(null);
			});

			it('FlashMesage has property "mounted" and it is an qual to "null"', () => {
				expect(cmp.vm.messageObj.mounted).toBe(null);
			});

			it('FlashMesage has property "destroyed" and it is an qual to "null"', () => {
				expect(cmp.vm.messageObj.destroyed).toBe(null);
			});
		});

		describe('Test classes', () => {
			it('When user set "blockClass" element sould have specified class', () => {
				cmp.setProps({
					messageObj: {
						blockClass: 'custom-user-class'
					}
				});
				cmp.vm.$forceUpdate();
				let elem = cmp.find('._vue-flash-msg-body');
				expect(elem.is('div')).toBe(true);
				expect(elem.classes()).toContain('custom-user-class');
			});

			it('When user set "iconClass" element sould have specified class', () => {
				cmp.setProps({
					messageObj: {
						icon: 'iconUrl',
						iconClass: 'custom-icon-class'
					}
				});
				cmp.vm.$forceUpdate();
				let elem = cmp.find('._vue-flash-msg-body__icon');
				expect(elem.is('div')).toBe(true);
				expect(elem.classes()).toContain('custom-icon-class');
			});

			it('When user set "contentClass" element sould have specified class', () => {
				cmp.setProps({
					messageObj: {
						contentClass: 'custom-content-class'
					}
				});
				cmp.vm.$forceUpdate();
				let elem = cmp.find('._vue-flash-msg-body__content');
				expect(elem.is('div')).toBe(true);
				expect(elem.classes()).toContain('custom-content-class');
			});
		});

		describe('Test components methods', () => {
			it('methods.setTimeout should take invoke setTimeout function with two args "cb" and "time"', () => {
				expect(cmp.vm.setTimeout).toBeInstanceOf(Function);
				cmp.vm.setTimeout(1);
				expect(setTimeout).toHaveBeenCalledWith(1, 8000);
				setTimeout.mockClear();
			});

			it('methods.clearData should invoke clearTimeout method if data.timeoutId to be truthly and argument "clear" === true', () => {
				expect(cmp.vm.clearData).toBeInstanceOf(Function);
				cmp.setData({ timeoutId: 1 });
				cmp.vm.clearData();
				expect(clearTimeout).toHaveBeenCalledWith(1);
				clearTimeout.mockClear();
			});

			it('methods.clearData should emit EventBus "deleteMessage" if data.timeoutId or argument "clear" are falsy', () => {
				cmp.setData({ timeoutId: undefined });
				cmp.vm.clearData();
				expect(cmp.vm.flashMessage.$emit).toHaveBeenCalledWith(
					'deleteMessage',
					1
				);
			});

			it('methods.clickHandler should invoke methods.clearData if props.messageObj.clickable is truthly', () => {
				cmp.setMethods({ clearData: jest.fn() });
				cmp.vm.clickHandler();
				expect(cmp.vm.clearData).toHaveBeenCalled();
			});

			it('methods.clickHandler should not invoke methods.clearData if props.messageObj.clickable is falsy', () => {
				cmp.setMethods({ clearData: jest.fn() });
				cmp.setProps({
					messageObj: {
						clickable: false
					}
				});
				cmp.vm.clickHandler();
				expect(cmp.vm.clearData).not.toHaveBeenCalled();
			});
		});

		describe("Test component's lifecycle hooks", () => {
			let hooksCmp;
			let mountedSpy = jest.fn();
			let destroyedSpy = jest.fn();

			beforeEach(() => {
				hooksCmp = shallowMount(FlashMessage, {
					propsData: {
						messageObj: {
							id: 1,
							status: 'error',
							title: 'error title',
							message: 'error message',
							clickable: true,
							icon: 'www.icon-link.ru',
							time: 8000,
							blockClass: null,
							iconClass: null,
							contentClass: null,
							mounted: mountedSpy,
							destroyed: destroyedSpy
						}
					},
					mocks: {
						flashMessage: {
							$emit: jest.fn(),
							$once: jest.fn()
						}
					}
				});
			});

			it('If props.messageObj.mounted is Function should invoke props.messageObj.mounted in "mounted" lifecycle hook', () => {
				expect(mountedSpy).toHaveBeenCalled();
				mountedSpy.mockClear();
			});

			it('If props.messageObj.destroyed is Function should invoke props.messageObj.destroyed in "destroyed" lifecycle hook', () => {
				hooksCmp.destroy();
				expect(destroyedSpy).toHaveBeenCalled();
				destroyedSpy.mockClear();
			});

			it('If props.messageObj.destroyed is notFunction should not invoke props.messageObj.destroyed in "destroyed" lifecycle hook', () => {
				hooksCmp.setProps({
					messageObj: {
						destroyed: null
					}
				});
				hooksCmp.destroy();
				expect(destroyedSpy).not.toHaveBeenCalled();
				destroyedSpy.mockClear();
			});
		});

		describe('Test custom position of message', () => {
			it('When user set "x" and "y" props, message block should have inline style with position fixed and coords', () => {
				cmp.setProps({
					messageObj: {
						position: 'left top',
						x: 100,
						y: 200
					}
				});
				cmp.vm.$forceUpdate();
				let elem = cmp.find('._vue-flash-msg-body');
				expect(elem.element.style.position).toBe('fixed');
				expect(elem.element.style.left).toBe('100px');
				expect(elem.element.style.top).toBe('200px');
			});
		});
	});
});
