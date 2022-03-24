class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    // data中属性的名称
    this.key = key
    // 回掉函数 负责更新视图
    this.cb = cb
    Dep.target = this

    // 获取更新前的旧值
    this.oldValue = vm[key]

    Dep.target = null
  }

  update() {
    // 当数据发生变化 更新试图
    let newValue = this.vm[this.key]
    if (newValue === this.oldValue) return
    this.cb(newValue)
  }
}
