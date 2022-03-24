// 搜集依赖 添加观察者 在getter
class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = []
  }

  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发送通知
  nodify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
