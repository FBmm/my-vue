// 重写数组的7个方法：push pop shift unshift reverse sort splice 

const oldArrayMethods = Array.prototype

export const arrayMethod = Object.create(oldArrayMethods)

const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reverse',
    'sort'
]

methods.forEach(method => {
    arrayMethod[method] = function (...args) {
        console.log('调用了', method)
        return oldArrayMethods[method].apply(this, args)
    }
})