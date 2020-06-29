import { initState } from './state'

import { compileToFunction } from './compiler/index.js'
// vue初始化函数
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // 数据劫持
        const vm = this; // vue中使用 this.$options 指的就是用户传递的属性
        vm.$options = options;

        // 初始化状态 props,methods,data,computed,watch
        initState(vm);

        // 如果用户传入了el 实现挂在流程
        if(vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function(el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)

        // 默认先查找有没有render方法 没有render 会使用template 没有template则使用el

        if (!options.render) {
            let template = options.template
            if (!template && el) {
                template = el.outerHTML
            }
            const render = compileToFunction(template)
            options.render = render
        }
    }
}