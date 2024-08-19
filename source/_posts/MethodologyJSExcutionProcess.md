---
title: 【方法论】JS 执行流程
date: 2023-02-21 00:56:48
tags:
  - JS
  - JS进阶
categories:
  - 方法论
---

## `前言`

本文主要解释 JS 引擎在遇见 script 代码块时，从编译到执行具体经历了些什么？

一些关于作用域与闭包还有`this`关键字的问题可能被解答：

- 为什么会产生变量提升？
- 闭包的产生原理是什么？
- 多个 script 代码块间是以什么顺序来执行的？
- 为什么定义在不同代码块间的方法可以共通？通过本文都可以得到解答。

## `基础概念`

- JavaScript 是一种具有函数优先的轻量级，解释型或即时编译型的编程语言。
  `解释型`：JS 引擎在运行 JS 代码时，是利用解释器一边编译一边执行的。
  
  如此便避免不了一种情况：某些代码多次重复的运行，例如 for 循环，在编译型语言中，for 循环块中的代码将以机器码执行多次；而在解释型语言中，for 循环块中的代码将被解释多次并执行，如此便有了很大的耗损。
  
  `即时编译型`：于是 JS 引擎就加入了`JIT`（Just-in-time）进行编译优化，例如对重复语句和类型判断进行优化。

- 引擎、编译器与作用域
    引擎：从头到尾负责整个 javascript 程序的编译及执行过程。浏览器不同，其引擎也不同，比如 Chrome 采用的是 v8，Safari 采用的是 SquirrelFish Extreme。
    
    编译器：编译过程主要分为”词法分析”、“语法分析”及“代码生成“。
    
   >作用域（Scope）：根据名称查找变量的一套规则，用于管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找。

- 执行上下文（Excution Context EC）&& 执行上下文栈（Excution Context Stack ECS）
    存在三种 EC：全局执行上下文  GlobalEC ，函数执行上下文  Function EC，Eval。
    
    ECS：引擎记录 EC 的容器，栈底是 GlobalEC ，只有在关闭页面时出栈；栈顶是当前正在执行的 EC ，函数执行完毕后出栈，并将执行权交给下一个 EC 。

- 变量对象（Variable Object）&& 活动对象（Activation Object）
    VO：EC 中用来存储变量声明（必须是 var 关键字声明而不是 let 与 const）与函数声明（必须是显式声明而不是表达式）的容器。由引擎实现，不能访问到。
    
    AO：可以理解为 VO 的实例化，函数调用时在 EC 中被激活，成员属性能被访问。

- LHS（Left Hand Side） && RHS（Right Hand Side）
    LHS：赋值操作的目标。例如：a=2; 是对 a 进行 LHS 查询。
    
    RHS：赋值操作的源头。例如：console.log(a); 是对 a 进行 RHS 查询。
    
   >非严格模式下，LHS 查询不到变量会在顶层作用域创建具有该名称的变量，RHS 查询不到变量会报 ReferenceError 的异常；严格模式下禁止自动创建全局变量，两种查询方式失败均报 ReferenceError 的异常。

## `JS 代码执行流程`

1. -->进入 script 标签
2. -->【预编译】JS 引擎创建全局 EC，全局 EC 入栈
3. -->【编译】JS 解释器开始对代码`逐行`进行分词、语法分析、代码生成
4. -->有错则抛出，终止执行；无错继续向下逐行执行
5. -->【预编译】调用函数前，创建函数 EC，EC 入栈
6. -->【编译】
7. -->有错则抛出，终止执行；无错继续向下执行
8. -->函数执行完毕，EC 出栈
9. -->继续以上步骤
10. -->页面销毁，全局 EC 出栈
11. -->结束

`创建当前环境 EC 流程如下：`

1、初始化作用域 [[Scope]]，（拷贝传入的父执行上下文的 Scope），数据结构应该是数组或者链表。
 
例如：[[Scope]] : AO1（当前）-->VO（全局）

2、创建活动对象，创建完成之后，将活动对象推入作用域链的最前端：

例如：[[Scope]] : AO2（当前）-->AO1（父级）-->VO（全局）

2.1、创建 arguments 对象，检查上下文，初始化参数名称和值并创建引用的复制。（函数中存在）

2.2、创建形参，通过实参赋值。（函数中存在）

2.3、扫描上下文的函数声明（而非函数表达式）：

为发现的每一个函数，在变量对象上创建一个属性——确切的说是函数的名字——其有一个指向函数在内存中的引用。如果函数的名字已经存在，引用指针将被重写。函数声明比变量优先级要高，并且定义过程不会被变量覆盖，除非是赋值

2.4、扫描上下文的变量声明：

为发现的每个变量声明，在变量对象上创建一个属性——就是变量的名字，并且将变量的值初始化为 undefined，如果变量的名字已经在变量对象里存在，将不会进行任何操作并继续扫描。

3、求出上下文内部 this 的值。

> 从以上流程中可以观察到`作用域、变量提升和 this`，接下来结合代码具体分析。

## `代码分析`

一、EC 创建流程与变量提升
```javascript
var a = "outer";

function foo(i) {
    console.log(a+'--a--start');
    console.log(b+'--b--start');
    console.log(c+'--c--start');
    var a = 'hello';
    var b = function () {};

    function c() {};
    console.log(`------------`);
    console.log(a+'--a--end');
    console.log(b+'--b--end');
    console.log(c+'--c--end');

    console.log(this);
}

foo(22);// 对形参 i 的 LHS 查询

//结果：
undefined--a--start// 变量 a 声明时提升赋值为 undefined
undefined--b--start// 变量 b 声明时提升赋值为 undefined
ƒ c() {}--c--start// 函数 c 声明时提升指向 c 的引用
------------
hello--a--end// 此时赋值语句执行完毕，a 的值为 hello
ƒ() {}--b--end// 此时赋值语句执行完毕，b 指向 b 的引用
ƒ c() {}--c--end// 无变化

// 分析
// 代码载入前，创建全局 EC 的伪代码
GlobalEC : {
    [[Scope]] : [{VO}],
    VO : {
        foo : fnFoo,// 函数声明优先，指向函数 Foo 的引用
        a :  undefined// 变量声明
    },
    this// 指向全局
}
// 调用函数 foo(22) 时，创建当前 EC 的伪代码
CurrentEC : {
    [[Scope]] : [{AO}, {VO}],
    AO : {
        // 顺序：arguments 对象 形参 函数声明 变量声明
        arguments : {
            0 : 22,
            length : 1
        },
        i : 22,// 形参，接受实参赋值
        c : fnC,//指向函数 c 的引用
        a : undefined,
        b : undefined
    },
    this// 指向函数的调用者，这里指向全局
}
```

二、多个 script 块间的执行过程
```html
 <script>
     console.log('script1 start');

     console.log('a',a);
     var b=2;

     console.log('script1 end');
 </script>

 <script>
     console.log('script2 start');

     var a=1;
     console.log('b',b);

     console.log('script2 end');
 </script>

 <!-- 
     script1 start
     Uncaught ReferenceError: a is not defined
     script2 start
     b undefined
     script2 end
  -->
 ```
 1. 从代码运行结果可以看出，JS 执行流在进入第一个 script 块时，首先会创建全局 EC ，将 b 的声明加入 AO 并推入作用域中（所以第二个 script 块中的代码才能访问到 b），全局 EC 压入 ECS。
 2. 逐行的进行分词、语法检查、代码生成，然后执行。
     2.1、在 console.log('script1 start'); 这行代码中，不存在语法错误，执行，输出 start。
     2.2、在 console.log('a',a); 这行代码中，对变量 a 进行 RHS 查询，在作用域链中找不到 a ，报 ReferenceError，script 块中断执行。
 3. JS 执行流进入第二个 script 块，仍然在全局 EC（JS 引擎只会存在一个全局 EC），将 a 的声明加入 AO（与第一个代码块相同，每个 EC 绑定唯一的 VO|AO） 并推入作用域。
 4. 逐行的进行分词、语法检查、代码生成，然后执行。
     4.1、在 console.log('b',b); 这行代码中，对变量 b 进行 RHS 查询，在作用域的 AO 中找到对应的值 undefined，输出 b undefined。
 5. 结束
三、闭包的产生
```javascript
// 首先明确什么是闭包？可以使用如下定义：
// 函数在定义的词法作用域以外的地方被调用，闭包使得函数可以继续访问定义时的词法作用域。

// 例子
function fn(){
    var a = 'JavaScript';
    function func(){
        console.log(a);
    }
    return func;
}

var func = fn();
func(); // JavaScript
```
- func 函数执行的位置和定义的位置是不相同的，func 是在函数 fn 中定义的，但执行却是在全局环境中，虽然是在全局函数中执行的，但函数仍然可以访问当定义时的词法作用域。
- 当函数执行结束后其活动变量就会被销毁，但是在上面的例子中却不是这个样子。但函数 fn 执行结束之后，fn 对象的活动变量并没有被销毁，这是因为 fn 返回的函数 func 的作用域链还保持着 fn 的活动变量，因此 JavaScript 的垃圾回收机制不会回收 fn 活动变量。虽然返回的函数 func 是在全局环境下执行的，但是其作用域链的存储的活动（变量）对象的顺序分别是：func 的活动对象、fn 的活动对象、全局变量对象。因此在 func 函数执行时，会顺着作用域链查找标识符，也就能访问到 fn 所定义的词法作用域（即 fn 函数的活动变量）也就不足为奇了。
## `总结`

问：多个 script 块间的执行顺序

> 答：多个 script 代码块从上到下按序载入，语法分析阶段报错的话，结束本代码块的执行，执行流进入下一个代码块。多个代码块共享全局执行上下文，可以访问到其他代码块定义的变量和方法。

问：为什么会产生变量提升与函数提升？
> 答：在代码执行之前的预编译阶段，创建当前 EC 时，会在活动对象上创建一个与函数声明与变量声明对应的属性，然后将活动对象推入作用域链。在查询变量时，是通过作用域链进行 RHS 查询。所以会查询到作用域链上已经定义的函数与变量。

问：闭包的产生
> 答：简单来说，闭包中的函数所对应的作用域链上仍然保留了父级活动对象，所以可以对父级活动对象的属性进行查询。

## `参考资料`

- 《你不知道的 Javascript》（上卷），第一部分，作用域和闭包
- [JS 引擎的执行过程](https://heyingye.github.io/2018/03/19/js%E5%BC%95%E6%93%8E%E7%9A%84%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B%EF%BC%88%E4%B8%80%EF%BC%89/)
- [彻底明白作用域、执行上下文](https://segmentfault.com/a/1190000013915935)
- [深入理解 JavaScript 的执行流程，执行上下文 EC、变量对象 VO、活动对象 AO、作用域 Scope](https://blog.csdn.net/yangxinxiang84/article/details/113051811?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&dist_request_id=1328641.10297.16155372256670345&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control)
- [浅谈 JS 的 VO|AO](https://blog.csdn.net/Ancecis/article/details/104382441)
- [JS 运行机制之执行顺序](https://blog.csdn.net/chen_zw/article/details/18502937?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-6.control&dist_request_id=&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-6.control)
- [我所认识的作用域链与原型链](https://github.com/MrErHu/blog/issues/16)
