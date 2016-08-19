/**
 * Created by tushar.mathur on 18/08/16.
 */

'use strict'

export default class AnimationFrame {
  constructor () {
    this.__frame = null
  }

  static createAF () {
    return new AnimationFrame()
  }

  static startAF (animationFrame, cb) {
    return animationFrame.__start(cb)
  }

  static stopAF (animationFrame) {
    return animationFrame.__stop()
  }

  __update (cb) {
    this.__frame = requestAnimationFrame(() => {
      cb()
      this.__update(cb)
    })
  }

  __start (cb) {
    if (!this.__frame) this.__update(cb)
    return this
  }

  __stop () {
    cancelAnimationFrame(this.__frame)
    this.__frame = null
  }
}
