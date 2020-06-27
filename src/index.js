import { initMixin } from './init'
// Vue构造函数
function Vue(options) {
    // 进行vue初始化
    this._init(options)
}

// 在Vue原型上挂载_init方法
initMixin(Vue)

export default Vue