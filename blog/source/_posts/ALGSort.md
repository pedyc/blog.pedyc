---
title: 【算法基础】排序
date: 2023-02-13 09:30:57
tags: [JS,算法]
categories: [算法]
---

![sort](ALGSort/sort.png)
## 冒泡排序 θ(n^2)
## 选择排序 θ(n^2)
`实现逻辑`
1. 比较相邻的元素，如果第一个比第二个大，交换它们两个
2. 对每一组相邻元素进行比较交换操作，从第一对到最后一对。结束后最大值在最后一位元素
3. 重复以上步骤，除了最后一个元素
4. 持续以上步骤，知道没有任何一对元素需要比较

`伪代码实现`
```javascript
// 对数组A进行排序
SELECTION-SORT(A)
for i=0 to A.length-1
	key = A[i]
	j = i+1
	min = A[j]
	for(j to A.length)
		if(min>=A[j])
			min=A[j]
			idx=j
	if(A[i]>min)
		A[i] = min
		A[idx] = key		
```
`代码实现`
## 插入排序 θ(n^2)
`实现逻辑`
`伪代码实现`
`代码实现`
## 