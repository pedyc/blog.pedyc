---
title: 【一些有趣的问题】02，作用域与闭包
date: 2021-02-25 9:30:54
tags: [JS]
categories: [一些有趣的问题]
---

## 问题1
`以下语句会如何输出？`
```javascript
for(var i=0;i<5;i++){
    console.log('i',i)
    setTimeout(function(){
        console.log(i);
    },1000)
}
```
`结果`：![结果](./someInterestingQuestions01/q1.png)

`原因`：异步代码会在同步代码执行完毕后执行

`分析`：在执行 setTimeout 中的 console.log 打印变量 i 时，对标识符 i 进行 RHS 查询，因为在当前作用域找不到对应标识符，所以向上前往父级作用域寻找。所以打印的其实是 for 循环中声明的变量 i，而此时已经经过循环赋值变成了5

**解决方案一：**
```javascript
for(var i=0;i<5;i++){
    (function(i){
        setTimeout(function(){
            console.log(i);
        },1000)
    })(i)
}
```
` 结果`：1秒后连续打印 0 1 2 3 4 

`原因`：IIFE 使得对打印的标识符 i 的查询终止于当前作用域，不用向上继续查询 分析：console.log 打印变量 i 时，发现该标识符对应当前作用域中的形参，其值为传入的实参。所以每次执行 console.log 语句，变量 i 的值都会被覆盖，第一次为 0，第二次为 1，依次类推打印 0 1 2 3 4，而 for 循环中声明的变量 i，其值为5

**解决方案二：**
```javascript
for(let i=0;i<5;i++){
  setTimeourt(function(){
    console.log(i);
  },1000)
}
```
`结果`：1秒后连续打印 0 1 2 3 4

`原因`：let 声明不会产生变量提升，并且会绑定当前作用域。for 循环头部的 let 声明会有一个特殊的行为，这个行为指出变量在循环过程中不止被声明一次，每次迭代都会声明。随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。

---

## 问题2
```javascript
function Foo() {
    var i = 0;
    return function() {
        console.log(i++);
    }
}

var f1 = Foo(),
    f2 = Foo();
f1();
f1();
f2();
```
`结果`：![结果](./someInterestingQuestions01/q2.png)

`原因`：

第一次调用函数f1()：打印 0，创建闭包，此时局部变量i=1；

第二次调用函数f1()：打印 1，创建闭包，此时局部变量i=2；

第一次调用函数f2()：打印 0，因为函数f1、f2指向不同对象。

--- 
## 问题3
```javascript
function Foo() {
  // 类变量a
  Foo.a = function () {
    console.log(1);
  }
  // 实例变量a，每个实例都有一个
  this.a = function () {
    console.log(2);
  }
}
// 实例变量a，所有实例共享一个
Foo.prototype.a = function () {
  console.log(3);
}
// 类变量a
Foo.a = function () {
  console.log(4);
}

Foo.a();
let obj = new Foo();
obj.a();
Foo.a();
```
`结果`：![结果](./someInterestingQuestions01/q3.png)

`原因`：

打印4：一开始Foo方法并未调用，输出的是函数体外的变量a，此时可以把Foo当作对象，Foo.a为其对象属性。

打印2：使用new操作符实例化Foo后，obj.a首先查找obj上的标识符a，如果找不到的话沿着原型链向上查找，也找不到的话返回undefined。

打印1：此时Foo方法已经调用，方法体内的类变量a覆盖原来已经赋值的类变量a。
