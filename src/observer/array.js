/**
 * 重写数组的7个方法：push pop shift unshift reverse sort splice 
 */
const oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods)

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reverse',
    'sort'
]

methodsToPatch.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log('调用了', method)
        console.log(this)
        const ob = this.__ob__
        const result = oldArrayMethods[method].apply(this, args)
        let inserted
        switch(method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        // 劫持数组新增项
        if (inserted) {
            ob.observeArray(inserted)
        }
        return result
    }
})