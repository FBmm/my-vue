import { initState } from './state'

// vue初始化函数
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        console.log('init')
        // 数据劫持
        const vm = this; // vue中使用 this.$options 指的就是用户传递的属性
        vm.$options = options;

        // 初始化状态
        initState(vm);
    }
}