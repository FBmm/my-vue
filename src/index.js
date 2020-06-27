import { initMixin } from './init'
// vue核心代码
function Vue(options) {
    // 进行vue初始化
    this._init(options)
}

// 在vue原型上挂载_init方法
initMixin(Vue)

export default Vue