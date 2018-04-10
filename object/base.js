//数据属性：
/*
  configurable(可配置)：是否可以使用delete删除，能否修改属性特性，或者能否把属性修改为访问器属性，默认为true
  enumerable(枚举)：是否可以枚举，默认为true
  writable(可写)：是否可以修改属性的值，默认为true
  value(值)：属性值，默认为undefind
*/
//修改默认属性Object.defineProperty
// let person={age:1};
// Object.defineProperty(person,"name",{
//   configurable:false,
//   enumerable:false,
//   writable:true,
//   value:'kant'
// })
// person.name=[1,2];
// delete person.name;
// console.log(person.name)
// console.log(person)

//访问器属性：
/*
  configurable(可配置)：是否可以使用delete删除，能否修改属性特性，或者能否把属性修改为访问器属性，默认为true
  enumerable(枚举)：是否可以枚举，默认为true
  get(读取)：读取属性时调用的函数，默认为undefind
  set(写入)：写入时调用的函数，默认为undefind
*/
// let person={
//   name:'kant',
//   num:1
// }
// Object.defineProperty(person,'name',{
//   get(){
//     return 'error'
//   },
//   set(newvalue){
//     this.num++;
//   }
// })
// person.name='jone';
// console.log(person.name);
// console.log(person);

//定义多个属性Object.defindProperties()
// let person={};
// Object.defineProperties(person,{
//   name:{
//     enumerable:true,
//     value:'kant'
//   },
//   age:{
//     get(){
//       return 20
//     },
//     set(){
     
//     }
//   }
// })
// person.age=1;
// for( let key in person){
//   console.log(person[key]);
// }
// console.log(person.age); 

//读取属性的特性Object.getOwnPropertyDescriptor()
// let person={};
// Object.defineProperty(person,"name",{
//   configurable:false,
//   enumerable:false,
//   writable:true,
//   value:'kant'
// })
// console.log(Object.getOwnPropertyDescriptor(person,'name'));

//Object.keys();
// let person={name:'kant',age:12}
// console.log(Object.keys(person));

//获取所有实例属性Object.getOwnPropertyNames()
// let person={name:'kant',age:10}
// Object.defineProperty(person,'name',{
//   enumerable:false
// })
// console.log(Object.keys(person))
// console.log(Object.getOwnPropertyNames(person))

