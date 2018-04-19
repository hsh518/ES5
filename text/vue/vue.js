class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach(watcher => {
      watcher.update();
    });
  }
}

Dep.target = null;

class Observer {
  constructor(data) {
    this.data = data;
    this.walk();
  }

  walk() {
    Object.keys(this.data).forEach(key => {
      this.defineReactive(this.data, key, this.data[key]);
    });
  }

  defineReactive(data, key, value) {
    const dep = new Dep();

    if ( value && typeof value === 'object' ) {
      new Observer(value);
    }

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return value;
      },
      set(newVal) {
        if (newVal === value) {
          return false;
        }
        value = newVal;
        dep.notify();
      }
    });
  }
}

class Watcher {
  constructor(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;

    // 将自己添加到订阅器的操作
    this.value = this.getValue();
  }

  update() {
    const value = this.vm.data[this.exp];
    const oldValue = this.value;
    if (value !== oldValue) {
      this.value = value;
      this.cb.call(this.vm, value, oldValue);
    }
  }

  getValue() {
    Dep.target = this;
    const value = this.vm.data[this.exp];
    Dep.target = null;
    return value;
  }
}

class Compile {
  constructor(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
  }

  init() {
    if (this.el) {
     
      this.fragment = this.nodeToFragment();
      this.compileElement(this.fragment);
   

      this.el.appendChild(this.fragment);

    }
  }

  nodeToFragment() {
    const fragment = document.createDocumentFragment();
    let child = this.el.firstChild;
    console.log(this.el.firstChild)
    while (child) {
      fragment.appendChild(child);
      child = this.el.firstChild
      console.log(child)
    }
       // console.log(fragment)
    return fragment;
  }

  compileElement(fragment) {

    const childNodes = fragment.childNodes;
    [].slice.call(childNodes).forEach((node) => {
      const reg = /\{\{(.*)\}\}/;
      const text = node.textContent;

      if (this.isElementNode(node)) {
        this.compile(node);

      } else if (this.isTextNode(node) && reg.test(text)) {

        this.compileText(node, reg.exec(text)[1]);
      }

      if (node.childNodes && node.childNodes.length) {

        this.compileElement(node);
      }
    });
  }

  compile(node) {
    const nodeAttrs = node.attributes;
    Array.prototype.forEach.call(nodeAttrs, (attr) => {
      const attrName = attr.name;
      if (this.isDirective(attrName)) {
        const exp = attr.value;
        const dir = attrName.substring(2);
        if (this.isEventDirective(dir)) {
          // 事件指令
          this.compileEvent(node, this.vm, exp, dir);

        } else {

          // v-model 指令
          this.compileModel(node, this.vm, exp);
        }
        node.removeAttribute(attrName);
      }
    });
  }

  compileEvent (node, vm, exp, dir) {
    const eventType = dir.split(':')[1];
    const cb = vm.methods && vm.methods[exp];

    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false);
    }
  }

  compileModel (node, vm, exp) {
    let val = vm[exp];

    // 更新内容
    this.modelUpdater(node, val);

    // 添加订阅
    new Watcher(vm, exp, (value) => {
      // 数据改变时的回调函数
      this.modelUpdater(node, value);
    });

    // 事件监听
    node.addEventListener('input', (e) => {
      const newValue = e.target.value;
      if (val === newValue) {
        return false;
      }
      vm[exp] = newValue;
      val = newValue;
    });
  }

  compileText(node, exp) {
    const initText = this.vm[exp];

    this.updateText(node, initText);

    new Watcher(this.vm, exp, (value) => {
      this.updateText(node, value);
    });
  }

  updateText (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  }

  modelUpdater(node, value) {
    node.value = typeof value === 'undefined' ? '' : value;
  }

  isDirective(attr) {
    return attr.indexOf('v-') === 0;
  }

  isEventDirective(dir) {
    return dir.indexOf('on:') === 0;
  }

  isElementNode (node) {
    return node.nodeType === 1;
  }

  isTextNode(node) {
    return node.nodeType === 3;
  }
}

class SimpleVue {
  constructor(options) {

    this.data = options.data;
    this.methods = options.methods;

    // 数据劫持
    Object.keys(this.data).forEach((key) => {
      this.proxyKeys(key);
    });

    // 数据观察 - 搜集依赖
    new Observer(this.data);

    // 编译模板 - 添加订阅者
    new Compile(options.el, this);

    // 所有事情处理好后执行 mounted 函数
    options.mounted.call(this);
  }

  proxyKeys (key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get() {
        return this.data[key];
      },
      set(newVal) {
        this.data[key] = newVal;
      }
    });
  }
}

new SimpleVue({
  el: '#app',
  data: {
    title: 'this is title',
    name: 'this is name',
    count: 1
  },
  methods: {
    clickMe: function () {
      console.log(this);
      this.count ++;
    }
  },
  mounted: function () {
    window.setTimeout(() => {
      this.title = 'hello world';
    }, 1000);
  }
});