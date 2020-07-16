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
  tag: string | void; // 标签名
  data: VNodeData | void; // 标签属性
  children: ?Array<VNode>; // 子节点
  text: string | void; // 当前节点的文本
  elm: Node | void; // 当前VNode对应的真实dom节点
  ns: string | void; // 命名空间
  context: Component | void; // rendered in this component's scope
  key: string | number | void; // 节点的key 值是data.key 也就是Vue模板声明的key
  componentOptions: VNodeComponentOptions | void; // 组件options
  componentInstance: Component | void; // component instance -  当前节点对应组件的实例
  parent: VNode | void; // component placeholder node - 父节点

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder? - 是否是注释节点
  isCloned: boolean; // is a cloned node? - 是否是克隆节点
  isOnce: boolean; // is a v-once node? - 是否有v-once指令
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
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

注释节点

  - text属性：注释信息
  - isComment属性：注释节点标志

```js
// 创建注释节点
export const createCommentNode = (text: string = '') => {
  const node = new VNode()
  ndoe.text = text
  node.isComment = true
  return node 
}
```

文本节点

  - 标签名、VNodeData、孩子节点都为undefined
  - 文本内容text有值

```js
// 创建注释节点
export const createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, val)
}
```

元素节点

  - tag属性：描述节点标签
  - data属性：描述节点属性如class、attributes
  - children属性：描述子节点信息

##### DOM-Diff算法

> 新VNode与缓存VNode找出差异的过程，这个过程称为patch，指对旧VNode的修补。

patch

  - 对比：以新VNode为基准，对比旧OldVNode
  - 创建节点：新VNode有的节点，旧OldVNode没有，则在旧OldVNode创建节点
  - 删除节点：新VNode没有的节点，旧OldVNode有，则在旧OldVNode删除节点
  - 更新节点：新VNode有的节点，旧OldVNode也有，则以新VNode为准，更新旧OldVNode
  - 总之：patch的过程就是以新VNode为准，把新VNode同步到旧OldVNode，最后让新旧OldVNode保持一致的过程

创建节点

只有注释节点、文本节点、元素节点能被创建并插入到DOM中

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  vnode.isRootInsert = !nested // for transition enter check
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    if (process.env.NODE_ENV !== 'production') {
      if (data && data.pre) {
        creatingElmInVPre++
      }
      if (isUnknownElement(vnode, creatingElmInVPre)) {
        warn(
          'Unknown custom element: <' + tag + '> - did you ' +
          'register the component correctly? For recursive components, ' +
          'make sure to provide the "name" option.',
          vnode.context
        )
      }
    }

    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      // in Weex, the default insertion order is parent-first.
      // List items can be optimized to use children-first insertion
      // with append="tree".
      const appendAsTree = isDef(data) && isTrue(data.appendAsTree)
      if (!appendAsTree) {
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        insert(parentElm, vnode.elm, refElm)
      }
      createChildren(vnode, children, insertedVnodeQueue)
      if (appendAsTree) {
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        insert(parentElm, vnode.elm, refElm)
      }
    } else {
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)
    }

    if (process.env.NODE_ENV !== 'production' && data && data.pre) {
      creatingElmInVPre--
    }
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```

- VNode有tag属性判断是元素节点，如果是元素节点调用createElement方法，然后递归遍历创建所有子节点，创建好子节点后调用 insert 方法插入到当前元素节点，最后把元素节点插入到DOM中。
  - insert方法：
- Vnode isComment属性为true 判断是注释节点，如果是注释节点，调用createComment方法创建注释节点，再插入DOM
- 如果VNode不是元素节点也不是注释节点，那么认为是文本节点，调用createTextNode方法创建文本节点，再插入DOM

> nodeOps：跨平台兼容，封装节点操作

更新节点

```js
  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    const elm = vnode.elm = oldVnode.elm

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.

    // 克隆节点或者是有v-once指令的静态节点  并且key没有改变 则不更新
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    // 旧VNode子节点
    const oldCh = oldVnode.children
    // 新VNode子节点
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    // 新VNode不是文本节点
    if (isUndef(vnode.text)) {
      // 新旧VNode都有子节点
      if (isDef(oldCh) && isDef(ch)) {
        // 新VNode不是旧VNode 更新旧VNode子节点
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) { // 只有新VNode有子节点 并且旧Vnode没有子节点
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        // 旧VNode是文本节点 并且有内容
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '') // 清空真实dom元素的内容
        // 把新vnode子节点新增到真实dom中
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) { // 旧Vnode有子节点 新Vnode没有子节点
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) { // 新旧VNode都没有子节点 旧VNode是文本节点
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) { // 新VNode是文本节点 并且与旧vnode文本内容不同
      nodeOps.setTextContent(elm, vnode.text) // 替换真实dom文本内容
    }
    // 新VNode有元素属性
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
```
由上面代码知道，更新节点的核心步骤为：
- 如果VNode与oldVNode是否相同，则中断执行
- 如果VNode与oldVNode是静态克隆节点或者有v-once指令，并且key没有改变，则中断执行
- 如果VNode不是文本节点
  - 如果VNode与oldVNode都有子节点并且不相同，更新子节点 ```updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)```
  - 如果只有VNode有子节点，oldVNode没有子节点
    - 如果oldVNode是文本节点并且有内容，清空真实dom的内容  ```nodeOps.setTextContent(elm, '')```
    - 添加VNode的子节点到真实dom ```addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)```
  - 如果只有oldVNode有子节点，VNode没有子节点
    - 删除dom中的子节点 ```removeVnodes(elm, oldCh, 0, oldCh.length - 1)```
  - 如果VNode和oldVNode都没有子节点，但是oldVNode文本节点有内容
    - 清空真实dom的文本节点内容 ```nodeOps.setTextContent(elm, '')```
- 如果VNode是文本节点
  - 并且与oldVNode text属性不同，用VNode的text替换真实dom的text ```nodeOps.setTextContent(elm, vnode.text)```

> 总结：上面过程有一个增加节点操作，一个删除节点操作，一个更新节点操作，一个替换文本操作，两个清空文本操作

##### 更新子节点

如果新VNode和旧oldVNode都有子节点，则需要对比子节点，外层循环是VNode子节点数组（vCh），内层循环是oldVNode子节点数组

对比过程主要分四种情况：创建子节点、删除子节点、移动子节点、更新子节点

- 创建子节点
  - 如果第一个外层循环遍历结束


### 模板编译

编译```<template></template>```标签中的Vue模板内容，找出原生HTML和非原生HTML，生成render函数的过程称为模板编译。render函数会将模板内容生成VNode。

#### 渲染流程

- 模板解析阶段：通过正则将模板字符串解析成AST语法树
- 优化阶段：遍历AST，标记静态节点
- 代码生成阶段：将AST转换成渲染函数

#### 模板解析阶段

解析器
- HTML解析器
- 文本解析器
- 过滤器解析器

> 解析流程：先用HTML解析器解析整个模板，在解析过程如果遇到文本内容，就调用文本解析器来解析文本，如果文本中包含过滤器就调用过滤器解析器。

#### HTML解析器

解析模板的同时调用钩子函数生成对应的AST节点，最终将整个模板字符串解析为AST。

钩子函数：
  - start：解析开始标签
  - end：解析结束标签
  - chars：解析文本
  - comment：解析注释

如何解析不同内容？

...
