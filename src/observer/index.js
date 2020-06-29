
import { isObject } from '../util/index'
import { arrayMethods } from './array'

// 观察者对象
class Observer {
    constructor(value) {
        // 如果vue数据层级太深。需要递归去解析对象的属性，依次增加set和get方法
        console.log(value)
        // value.__ob__ = this // 无限递归导致栈溢出
        def(value, '__ob__', this) // __ob__赋值时定义为不可枚举避免无限递归 指向Observer，调用数组方法拦截器里调用observeArray
        if (Array.isArray(value)) {
            value.__proto__ = arrayMethods
            this.observeArray(value)
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
    observeArray(value) {
        value.forEach(item => {
            this.walk(item)
        })
    }
}

// 定义响应式数据 - 响应式核心 每个可观察对象通过getter、setter订阅 当时值改变时发布通知
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

// 定义不可枚举属性
function def(obj, key, val) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: false,
        writable: true,
        configurable: true,
    })
}

// 把 data 中的数据 都是用Ob.def()重新定义 ES5 不兼容ie8及以下
export function observe(data) {
    let isObj = isObject(data)
    if (!isObj) return
    return new Observer(data) // 用来观测对象 
}