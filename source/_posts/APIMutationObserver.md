---
title: 【API】MutationObserver
date: 2023-01-11 09:30:57
tags:
  - JS
  - API
categories:
  - API
---

在使用第三方库时，常用需求之一是在 DOM 元素创建时注册一个时间监听器或 DOM 元素删除时注销事件监听器，但我们难以知道具体 DOM 元素的创建时间、删除时间，所以一般的实现方式是使用轮询的方法，判断 DOM 元素是否存在，如果存在则继续逻辑，这种轮询的方式也可以用 Promise 优化一下改成异步执行。但即使如此也仍有不小的额外开销，而 MutationObserver 提供了一种原生的检测方式。

## [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)
> `MutationObserver` 接口提供了监视对 DOM 树所做更改的能力。它被设计为旧的 Mutation Events 功能的替代品，该功能是 DOM3 Events 规范的一部分。

## 构造函数

MutationObserver()

语法：
```javascript
// 创建并返回一个新的 MutationObserver 它会在指定的 DOM 发生变化时被调用。
var observer = new MutationObserver(callback);

function callback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    switch(mutation.type) {
      case 'childList':
        /* 从树上添加或移除一个或更多的子节点；参见 mutation.addedNodes 与
           mutation.removedNodes */
        break;
      case 'attributes':
        /* mutation.target 中某节点的一个属性值被更改；该属性名称在 mutation.attributeName 中，
           该属性之前的值为 mutation.oldValue */
        break;
    }
  });
}
```
- callback
  - 一个回调函数，每当被指定的节点或子树以及配置项有 DOM 变动时会被调用。回调函数拥有两个参数：一个是描述所有被触发改动的 `MutationRecord` 对象数组，另一个是调用该函数的 MutationObserver 对象。参见下方的示例了解更多细节
  - [MutationRecord](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord)
    - MutationRecord.type
    - MutationRecord.target
    - MutationRecord.addedNodes
    - MutationRecord.removedNodes
    - MutationRecord.previousSibling
    - MutationRecord.nextSibling
    - MutationRecord.attributeName
    - MutationRecord.attributeNamespace
    - MutationRecord.oldValue
- return
  - 一个新的、包含监听 DOM 变化回调函数的 MutationObserver 对象。

## 方法
- disconnect：阻止 MutationObserver 实例继续接收的通知，直到再次调用其 observe() 方法，该观察者对象包含的回调函数都不会再被调用。
- [observe](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe)：配置 MutationObserver 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知。
  - target：DOM 树中的一个要观察变化的 DOM Node (可能是一个 Element)，或者是被观察的子节点树的根节点。
  - options：此对象的配置项描述了 DOM 的哪些变化应该报告给 MutationObserver 的 callback。当调用 observe() 时，childList、attributes 和 characterData 中，必须有一个参数为 true。否则会抛出 TypeError 异常。
- takeRecords：从 MutationObserver 的通知队列中删除所有待处理的通知，并将它们返回到 MutationRecord 对象的新 Array 中。

## 示例
```javascript
 // 选择需要观察变动的节点
const targetNode = document.getElementById('some-id');

// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();
```