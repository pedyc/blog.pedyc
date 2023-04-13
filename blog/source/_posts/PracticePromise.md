---
title: 【实践】手写 Promise
date: 2021-09-08 15:30:57
tags: [JS]
categories: [实践]
---
## 前言

- [Promise/A+规范](https://github.com/promises-aplus/promises-spec)
- [Promise/A+测试](https://github.com/promises-aplus/promises-tests)

## 标识符
- promise：是一个拥有 then 方法的对象或函数，其行为符合本规范
- thenable：是一个定义了 then 方法的对象或函数。这个主要是用来兼容一些老的 Promise 实现，只要一个 Promise 实现是 thenable，也就是拥有 then 方法的，就可以跟 Promises/A+兼容。
- value：指 reslove 出来的值，可以是任何合法的 JS 值（包括 undefined , thenable 和 promise 等）
- reason：拒绝原因，是 reject 里面传的参数，表示 reject 的原因
- exception：异常，在 Promise 里面用 throw 抛出来的值
## 基本逻辑
- Promise 具有 3 种状态：pending、fulfilled、rejected;
- pending 可以转换诚 fulfiiled 或者 rejected;
- fulfilled 不可转变状态，且必须有一个不变的值 (value);
  - 即`new Promise((resolve, reject)=>{resolve(value)})` resolve 为成功，接收参数 value，状态改变为 fulfilled，不可再次改变。
- reject 不可转变状态，且必须有一个不变的原因 (reason);
  - 即`new Promise((resolve, reject)=>{reject(reason)}) `reject 为失败，接收参数 reason，状态改变为 rejected，不可再次改变。
- 若是 executor 函数报错 直接执行 reject();

## thenable
语法：
```typescript
promise.then(onFulliled, onRejected)
```

```typescript
class Promise{
  constructor(executor){
    this.state='pending';
    this.value=undefined;
    this.reason=undefined;
    let resolve=value=>{
      if(this.state=='pending'){
        this.state='fulfilled';
        this.value=value;
      }
    }
    let reject=reason=>{
      if(this.state=='pending'){
        this.state='rejected';
        this.reason=reason;
      }
    }
    // executor 执行报错，执行 reject
    try{
      executor(resolve,reject)
    }catch(err){
      reject(err)
    }
  }
}
```

## 参考资料
[手写一个 Promise/A+, 完美通过官方 872 个测试用例](https://segmentfault.com/a/1190000023157856)