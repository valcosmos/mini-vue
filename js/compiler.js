class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  // 编译模板
  compile(el) {
    // 获取el的所有子节点
    let childNodes = el.childNodes // 是一个伪数组
    Array.from(childNodes).forEach((node) => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compileElement(node)
      }
      // 判断node 是否存在子节点
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译文本节点 处理差值表达式
  compileText(node) {
    const reg = /\{\{(.+)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      // 获取属性的名字
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substring(2) // v-text 截取tex之后变成 text  v-model ==> model
        let key = attr.value // 获取指令中的值 v-text : msg  v-model: msg count
        this.update(node, key, attrName)
      }
    })
  }

  update(node, key, attrName) {
    // textUpdater
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  // 处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }
  // 处理v-model
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 判断元素属性 是否为指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  // 判断是否为文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }

  // 判断是否为元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
