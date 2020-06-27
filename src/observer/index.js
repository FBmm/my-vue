
import {isObject} from '../util/index'

class Observer {
    constructor() {
        
    }
}

// 把 data 中的数据 都是用Ob.def()重新定义 ES5 不兼容ie8及以下
export function observe(data) {
    let isObj = isObject(data)
    console.log(isObj)
    if (isObj) return
    new Observer(data) // 用来观测对象 
}