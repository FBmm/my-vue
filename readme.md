# vue源码

2020.6.27

和公司前端大佬聊一些关于vue技术的时候，有几个问题记忆尤深，今天开始总结

> - vue的精髓是什么吗？
>    - 我当时回答的是响应式系统，他的理解则是模板编译。
> - 如果有一天vue消失了，你能手写一个vue或者与vue类似的框架吗？
>    - 我的回答是不可以。

知其然，知其所以然，加油

## 运行项目

```sh
# clone the project
git clone git@github.com:FBmm/my-vue.git

# enter the project directory
cd vue-admin

# install dependency
npm install

# develop
npm run serve # rollup内置环境启动项目

# build
npm run build # 打包源码
```

## 目录结构

```sh
├── public                          # 静态资源
│   │── index.html                  # html模板文件
├── src                             # vue源码
│   │── index.js                    # vue入口函数
│   │── init.js                     # vue初始化函数init
│   │── state.js                    # 初始化props,methods,data,computed,watch
├── .babelrc                        # babel-loader配置
├── .gitignore                      # git版本管理忽略配置
├── package-lock.json               # 项目配置、脚本命令、模块依赖管理
├── package.json                    # 应用
├── rollup.config.js                # rollup.js配置
├── readme.md                       # readme
```

## vue源码解析

### vue初始化

初始化相关代码

```js
  ...
  function Vue (options) {
    if (process.env.NODE_ENV !== 'production' &&
      !(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword')
    }
    this._init(options)
  }

  initMixin(Vue)
  stateMixin(Vue)
  eventsMixin(Vue)
  lifecycleMixin(Vue)
  renderMixin(Vue)
  ...
```

#### 声明Vue构造函数，构造函数做的两件事

###### 1. 非生产环境并且不是通过new关键字调用Vue构造函数，则提示警告信息

疑问：this instanceof Vue 如何判断函数是new关键字调用？

  - 首先，我们要知道this在function函数（非箭头函数）中的指向问题，大致的原则是谁调用指向谁，如果把function函数当做构造函数通过new创建实例，则指向实例
  - 所以，如果此处是普通调用Vue()，则this应该指向的是window对象，所以window对象的构造函数应该是Window，this instanceof Vue // false
  - 如果通过new调用，则this指向Vue实例，所以 this instanceof Vue // true

###### 2. 调用挂载在Vue构造函数上的_init方法

疑问：_init是何时挂载到Vue构造函数上的？

...

疑问：_init方法做了什么事？

...

### 响应式系统

#### 响应式对象

##### 劫持对象

源码理解完毕，文档待更新

##### 劫持数组

源码理解部分
