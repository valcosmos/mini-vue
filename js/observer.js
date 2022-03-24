// 负责把data中的数据变成响应式数据
class Observer {
  constructor(data) {
    // 遍历data 转换成getter setter
    this.walk(data)
  }

  walk(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(obj, key, value) {
    let that = this
    let dep = new Dep()
    this.walk(value)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 获取观察者
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newVal) {
        if (newVal === value) return
        value = newVal
        // 发送通知 更新视图
        that.walk(newVal)
        dep.nodify()
      }
    })
  }
}
