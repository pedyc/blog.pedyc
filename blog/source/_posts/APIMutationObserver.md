---
title: 【API】MutationObserver
date: 2023-01-11 09:30:57
tags: [JS]
categories: [API]
---
## [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
> `MutationObserver` 接口提供了监视对 DOM 树所做更改的能力。它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。

## 构造函数

MutationObserver()

语法：
```javascript
// 创建并返回一个新的 MutationObserver 它会在指定的 DOM 发生变化时被调用。
var observer = new MutationObserver(callback);
```
this
new绑定 用于类的构造函数
显式绑定 call apply bind
隐式绑定 绑定到调用函数的对象
默认绑定

其他：
箭头函数 继承外层this


