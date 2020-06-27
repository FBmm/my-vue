
import { isObject } from '../util/index'
import { arrayMethod } from './array'

class Observer {
    constructor(value) {
        // 如果vue数据层级太深。需要递归去解析对象的属性，依次增加set和get方法
        if (Array.isArray(value)) {
            // console.log(value)
            // arrayMethod()
            this.observerArray(value)
        } else {
            this.walk(value)
        }
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            // 注：这里对对象和数组都有劫持作用，但是只监听以索引方式改变数组的值，并且有性能问题
            defineReactive(data, key, data[key]) // 定义响应式数据
        })
    }
    observerArray(value) {
        value.forEach(item => {
            this.walk(item)
        })
    }
}

// 定义响应式数据
function defineReactive(data, key, value) {
    observe(value) // 递归实现深度检测
    Object.defineProperty(data, key, {
        get() { // 监听获取值
            return value
        },
        set(newValue) { // 监听设置值
            if (newValue === value) return
            console.log('值发生变化', key, newValue)
            observe(newValue) // 继续劫持设置的新值 有可能是一个新对象
            value = newValue
        },
    })
}

// 把 data 中的数据 都是用Ob.def()重新定义 ES5 不兼容ie8及以下
export function observe(data) {
    let isObj = isObject(data)
    if (!isObj) return
    return new Observer(data) // 用来观测对象 
}