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
cd my-vue

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

  - 通过调用initMixin(Vue)方法，initMixin的入参是Vue构造函数，方法内部通过Vue.prototype._init挂载_init

疑问：_init方法做了什么事？

  _init方法的入参是Vue初始化的options

  1. vm._uid：_init执行次数
  2. initLifecycle(vm) 初始化生命周期
  3. initEvents(vm) 初始化事件
  4. initRender(vm) 初始化渲染
  5. 执行 beforeCreate 钩子函数
  6. initInjections(vm) 在初始化data\props之前解析注入
  7. initState(vm) 解析注入
  8. initProvide(vm) 在初始化data\props之后解析服务
  9. 执行 created 钩子函数

### 响应式系统

#### 响应式对象

##### 劫持对象

...

##### 劫持数组

...

### 虚拟DOM

> 虚拟dom（Virtual DOM）：真实dom的虚拟dom节点，是VNode实例

Vue中的虚拟DOM的作用
  - vue是数据驱动，数据发生变化则需要更新视图
  - 如果要更新视图，则必须进行dom操作
    - 但是因为浏览器标准把DOM设计的非常复杂（数据结构复杂）
    - 所以，频繁的dom操作非常消耗性能
  - 因此，虚拟DOM的作用就是提升DOM操作的性能
  - 既然要更新视图必须进行DOM操作，那么要提升性能，我们必须减少无效的DOM操作
  - 如何提升DOM操作性能？
    - 原理：通过对比数据变化，计算只需要更新的地方，用JS的计算换取DOM操作消耗的性能，尽量减少DOM操作
    - 实现：通过DOM-Diff算法计算需要更新的虚拟DOM节点，然后更新视图

> 总结：虚拟DOM的最大作用和用途是通过DOM-Diff算法对比数据变化，减少DOM操作，提升视图更新性能

#### VNode

> VNode：是Vue中描述dom节点的类，包含描述真实DOM节点的一系列属性。

VNode作用
  - 视图渲染前，把template模板编译成VNode并缓存
  - 数据发生变化时，与缓存VNode对比，找出有差异VNode对应的真实DOM节点
  - 然后创建真实DOM节点并插入视图，完成视图更新

##### VNode类源码

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string, // 标签名
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

##### VNode类型

- 注释节点
- 文本节点
- 元素节点
- 组件节点
- 函数式组件节点
- 克隆节点

创建注释节点

  - text：注释信息
  - isComment：注释节点标志

```js
// 创建注释节点
export const createCommentNode = (text: string = '') => {
  const node = new VNode()
  ndoe.text = text
  node.isComment = true
  return node 
}
```

创建文本节点

  - 标签名、VNodeData、孩子节点都为undefined
  - 文本内容text有值

```js
// 创建注释节点
export const createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, val)
}
```

##### DOM-Diff算法

> 新VNode与缓存VNode找出差异的过程，这个过程称为patch，指对旧VNode的修补。

patch
  - 对比：以新VNode为基准，对比旧VNode
  - 创建节点：新VNode有的节点，旧VNode没有，则在旧VNode创建节点
  - 删除节点：新VNode没有的节点，旧VNode有，则在旧VNode删除节点
  - 更新节点：新VNode有的节点，旧VNode也有，则以新VNode为准，更新旧VNode
  - 总之：patch的过程就是以新VNode为准，把新VNode同步到旧VNode，最后让新旧VNode保持一致的过程

### 模板编译

...