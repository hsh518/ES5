//Vue 实例类
class Vue {
  constructor(options){
    this.data=options.data;
    this.methods=options.methods;
    this.el=options.el;
    for(let key in this.data){
      this.porxykeys(key);
    }
    new Observer(this.data);
    new Compile(this,this.el);
    // 钩子函数mouted
    if(options.mouted){
      options.mouted.call(this);
    }
  }
  //this.data映射到this
  porxykeys (key){
    Object.defineProperty(this,key,{
      get(){
        return this.data[key];
      },
      set(newval){
        this.data[key]=newval;
      }
    })
  }
}
//数据拦截
class Observer {
  constructor(data){
    this.data=data;
    this.walk();
  }
  walk(){
    for(let key in this.data){
        this.defineReactive(this.data,key,this.data[key])
    }
  }
  defineReactive(data,key,value){
    let dep=new Dep();
    if (value && typeof value ==='object') {
      new Observer(data)
    }
      Object.defineProperty(data,key,{
        get(){
          if(Dep.target){
            dep.addSub(Dep.target);
          }
          return value
        },
        set(newvalue){
          if(value===newvalue){
            console.log('t');
            return false
          }
          value=newvalue;
          dep.notify();
        }
      })
  }
}
//发布
class Dep {
  constructor(){
    this.subs=[]
  }
  // 添加订阅者
  addSub(watcher){
    this.subs.push(watcher);
  }
  // 发布订阅事件
  notify(){
    this.subs.forEach((watcher)=>{
      watcher.update()
    })
  }
}
//储存watcher
Dep.target=null;
//订阅
class Watcher {
  constructor(vm,key,cb){
    this.vm=vm;
    this.key=key;
    this.cb=cb;
    this.value=this.getvalue();

  }
  // 订阅事件
  update(){
    const value=this.vm.data[this.key];
    if(value!==this.value){
      this.value=value;
    }
    this.cb(this.value);
  }
  //添加订阅
  getvalue(){
    Dep.target=this;
    let value=this.vm[this.key];
    Dep.target=null;
    return value;
  }
}
// 数据响应
class Compile {
  constructor(vm,el){
    this.vm=vm;
    this.el=document.querySelector(el);
    this.fragment=null;
    this.init()
  }
  init(){
    if(this.el){
        this.fragment=this.nodeToFragment();
        this.compileElement(this.fragment);
        this.el.appendChild(this.fragment);
    }
  }
  // 创建虚拟dom
  nodeToFragment(){
    const fragment=document.createDocumentFragment();
    let child=this.el.firstChild;
    while(child){
      fragment.appendChild(child);
      child=this.el.firstChild;
    }
    return fragment;
  }
  // 数据绑定
  compileElement(fragment){
    const childNodes=fragment.childNodes;
    const reg=/\{\{(.*)\}\}/;

    [].slice.call(childNodes).forEach((node)=>{
      const text=node.textContent;
      if(this.isElementNode(node)){
        // dom节点上的数据绑定
          this.compile(node);
      }else if(this.isTextNode(node) && reg.test(text)){
        // 文本节点上的数据绑定
        this.compileText(node,reg.exec(text)[1].replace(/(^\s*)|(\s*$)/g, ""));//找出匹配的属性并去除俩边的空格
      } 
      if(node.childNodes&&node.childNodes.length){
        this.compileElement(node);
      } 
    })
  }
  //属性及指令
  compile(node){
    const attrs=node.attributes;
    //转数组
    [].slice.call(attrs).forEach((attr)=>{
      const attrName=attr.name;
      if(this.isDirective(attrName)){
        const key = attr.value;
        const dir=attrName.substring(2);

        if(this.isEventDirective(dir)){
          this.compileEvent(node,this.vm,key,dir);

        }else if(this.isAttrDirective(dir)){
          this.compileAttr(node,this.vm,key,dir);
          new Watcher(this.vm,key,()=>{
            this.compileAttr(node,this.vm,key,dir);
          })

        }else{
          switch(dir){
            case 'text':
              this.compileText(node,key)
            break;
            case 'html':
              this.compileHtml(node,key)
            break;
            case 'model':
              this.compileModel(node,key)
            break;
            default:
              return false;
          }
        }
      }
    })
  }
  //node事件监听
  compileEvent(node,vm,key,dir){
    const event_type=dir.split(':')[1];
    if(!vm.methods&&!vm.methods[key]){
      return false
    }
    const cb=vm.methods[key];
    node.addEventListener(event_type,cb.bind(vm),false)
  }
  //html绑定
  compileHtml(node,key){
    const initHtml=this.vm[key];
    this.updateHtml(node,initHtml);
    new Watcher(this.vm,key,(value)=>{
      this.updateHtml(node,value)
    })

  }
  //属性绑定
  compileAttr(node,key,dir){
    const attrName=dir.split(':')[1];
    const initAttr=this.vm[key];
    this.updateAttr(node,attrName,initAttr);
    new Watcher(this.vm,key,(value)=>{
      this.updateAttr(node,attrName,value);
    })
  }
  //处理文本绑定数据
  compileText(node,key){

    const initText=this.vm[key];
    this.updateText(node,initText);
    new Watcher(this.vm,key,(value)=>{

      this.updateText(node,value)
    })
  }
  //数据双向绑定
  compileModel(node,key){
    const initValue=this.vm[key];
    this.updateAttr(node,'value',initValue);
    new Watcher(this.vm,key,(value)=>{
      this.updateAttr(node,'value',value);
    })
    //input框input事件
    node.addEventListener('input',()=>{
      this.updateData(node,this.vm,key)
    },false)
  }
  //更新html
  updateHtml(node,value){
    node.innerHTML=typeof value === 'undenfind' ? '' : value
  }
  //更新text
  updateText(node,value){
    node.textContent=typeof value === 'undenfind' ? '' : value;
  }
  //更新attr
  updateAttr(node,attrName,value){
    node.setAttribute(attrName,typeof value === 'undenfind' ? '' : value);
  }
  //双向绑定更新data
  updateData(node,vm,key){
    vm[key]=node.value;
  }
  //判断是否为dom节点
  isElementNode(node){
    return node.nodeType === 1;
  }
  //判断是否为文本节点
  isTextNode(node){
    return node.nodeType === 3;
  }
  //判断是否为绑定属性
  isDirective(attr){
    return attr.indexOf('v-') === 0;
  }
  //判断是否为事件绑定
  isEventDirective(dir){
    return dir.indexOf('on:') === 0;
  }
  //判断是否为属性绑定
  isAttrDirective(dir){
    return dir.indexOf('bind:') === 0;
  }
}





// let app=new Vue({
//   data:{
//     a:1,
//     b:2
//   }
// })


