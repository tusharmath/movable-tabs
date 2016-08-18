/**
 * Created by tushar.mathur on 18/08/16.
 */

'use strict'

export default class AnimationFrame {
  constructor () {
    this.__frame = null
  }

  static create () {
    return new AnimationFrame()
  }

  static start (animationFrame, cb) {
    return animationFrame.start(cb)
  }

  static stop (animationFrame) {
    return animationFrame.stop()
  }

  __update (cb) {
    this.__frame = requestAnimationFrame(() => {
      cb()
      this.__update(cb)
    })
  }

  start (cb) {
    if (!this.__frame) this.__update(cb)
    return this
  }

  stop () {
    cancelAnimationFrame(this.__frame)
  }
}
