import { observe } from './observer/index.js'

export function initState(vm) {
    const opts = vm.$options;
    console.log(opts)
    // vue数据来源 属性、方法、数据、计算属性、watch
    if (opts.props) {
        initProps(vm)
    }
    if (opts.methods) {
        initMethod(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

function initProps() {}
function initMethod() {}
function initData(vm) {
    // 数据初始化工作
    let data = vm.$options.data

    // data 属性挂载到 vm._data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data
    console.log('初始化数据', vm)

    // 对象劫持 用户改变了数据 通知修改视图
    // MVVM模式，数据变化可以驱动视图变化
    // Object.definedProperty() 通过getter、setter劫持数据
    observe(data) // 响应式原理
}
function initComputed() {}
function initWatch() {}