// 接受初始化参数
// 接受data中的属性注入到vue中 并且转换成 getter/setter
// 调用observer监听data中所有属性的变化
// 调用compiler解析指令和差值表达式

// _proxyData将data中的属性转换成getter/setter 并注入到vue实例中

class Vue {
  constructor(options) {
    // 接受传递过来的选项 并且进行保存
    this.$options = options || {}
    // 获取选项参数中的data
    this.$data = options.data || {}
    // 获取元素
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    // 将data注入到vue实例中，转换成getter/setter
    this._proxyData(this.$data)

    // 调用observer监听数据的变化
    new Observer(this.$data)

    // 调用compiler 解析指令和插值表达式
    new Compiler(this)
  }

  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newVal) {
          if (data[key] === newVal) return
          data[key] = newVal
        }
      })
    })
  }
}


// 给属性赋值为对象，对象是否是响应式   是