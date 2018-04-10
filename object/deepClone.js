function deepClone(obj){
  let cloneObj={};
  function clone(obj,cloneobj){
    for(key in obj){
      if(typeof obj[key]==="object"){
        cloneobj[key]={};
        clone(obj[key],cloneobj[key]);
      }else{
        cloneobj[key]=obj[key]
      }
    }
  }
  clone(obj,cloneObj);
  return cloneObj;
}
obj=Object.create({name:'kant'})
console.log(obj)
obj={
  a:1,
  b:2,
  c:{
    a:1,
    b:2,
    c:{
      a:1,
      b:2
    }
  }
}
let c_obj=deepClone(obj);
c_obj.c.c.a=0;
console.log(obj);
console.log(c_obj);
console.log(obj.name)