// 检测数组isArray()
// let arr=[1,2];
// const str=1;
// console.log(Array.isArray(arr));// true
// console.log(Array.isArray(str));// false
// console.log(arr instanceof Array)// true

//栈方法push(),pop()
// let num=[1,2];
// num.push(3,4);
// console.log(num);// [1,2,3,4]
// num.pop();
// console.log(num);// [1,2,3]

//对列方法shift() unshift()
// let num=[1,2];
// num.shift();
// console.log(num);// [2]
// num.unshift(0);
// console.log(num);// [0,2]

//重排序方法reverse() sort()
// let num=[1,2,3,4,5]
// num.reverse();
// console.log(num);// [ 5, 4, 3, 2, 1 ]
// num.sort();
// console.log(num);// [1,2,3,4,5]
//sort()
// let num=[1,10,5,225]
// num.sort();
// console.log(num);// [ 1, 10, 225, 5 ]
// function compare_r(v1,v2){
//   if (v1>v2) {
//     return 1
//   }else if(v1<v2){
//     return -1
//   }else{
//     return 0
//   }
// }
// function compare_l(v1,v2){
//   if (v1<v2) {
//     return 1
//   }else if(v1>v2){
//     return -1
//   }else{
//     return 0
//   }
// }
// num.sort(compare_r);
// console.log(num);// [1,5,10,255]
// num.sort(compare_l)
// console.log(num);// [255,10,5,1]

//操作方法
// concat()
// let num=[1,2,3];
// let num2=num.concat();
// console.log(num2);// [1,2,3]
// num2[0]=0;
// console.log(num);// [1,2,3]
// let num3=num.concat(4,[5,6]);
// console.log(num3);// [1,2,3,4,5,6]
//splice()
// let num=[1,2,3,4]
// //   删除
// num.splice(1,1);
// console.log(num);// [1,3,4]
// //  插入
// num.splice(1,0,5);// [1,5,3,4]
// console.log(num)
// // 替换
// num.splice(1,1,6);
// console.log(num);// [1,6,3,4]

//位置方法indexOf() lastIndexOf()
// let num=[1,2,3,2,2]
// console.log(num.indexOf(2,4));// 4
// console.log(num.lastIndexOf(2,3));// 3

//迭代方法
// let num=[1,2,3,4];
// every()
// let bol_t=num.every((item,index,array)=>item>0);
// let bol_f=num.every((item,indec,array)=>item>2);
// console.log(bol_t,bol_f);// true false
// some()
// let bol_t=num.some((item,index,arr)=>item>3)
// let bol_f=num.some((item,index,arr)=>item<0)
// console.log(bol_t,bol_f);// true false
// filter()
// let filter_arr=num.filter((item,index,arr)=>item>2);
// console.log(filter_arr);// [3,4]
// forEach()
// num.forEach((item,index,arr)=>{
//   console.log(item);
// })
// map
// let map_arr=num.map((item,index,arr)=>item*2);
// console.log(map_arr);// [2,4,6,8]

//并归方法reduce() reduceRight
// let num=[1,2,3]
// let add=num.reduce((pev,cur,index,arr)=>pev+cur);
// console.log(add);// 6



