---
title: 【实践】手写 Promise
date: 2022-09-08 15:30:57
tags: [JS]
categories: [实践]
---

## 基本逻辑
- Promise具有3种状态：pending、fulfilled、rejected;
- pending可以转换诚fulfiiled或者rejected;
- fulfilled不可转变状态，且必须有一个不变的值;
  - 即`new Promise((resolve, reject)=>{resolve(value)})` resolve为成功，接收参数value，状态改变为fulfilled，不可再次改变。
- reject不可转变状态，且必须有一个不变的原因;
  - 即`new Promise((resolve, reject)=>{reject(reason)}) `reject为失败，接收参数reason，状态改变为rejected，不可再次改变。
- 若是executor函数报错 直接执行reject();

```javascript
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
    // executor执行报错，执行reject
    try{
      executor(resolve,reject)
    }catch(err){
      reject(err)
    }
  }
}
```