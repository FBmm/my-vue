# vue源码

2020.6.27

和公司前端大佬聊一些关于vue技术的时候，有几个问题记忆尤深，今天开始总结

> - vue的精髓是什么吗？
>    - 我当时回答的是响应式系统，他的理解则是模板编译。
> - 如果有一天vue消失了，你能手写一个vue或者与vue类似的框架吗？
>    - 我的回答是不可以。

知其然，知其所以然，加油

## 目录结构

```sh
├── public                          # 静态资源
│   │── index.html                  # html模板文件
├── src                             # vue源码
├── .babelrc                        # babel-loader配置
├── .gitignore                      # git版本管理忽略配置
├── package-lock.json               # 项目配置、脚本命令、模块依赖管理
├── package.json                    # 应用
├── rollup.config.js                # rollup.js配置
├── readme.md                       # readme
```
