/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import {Jss} from 'jss'
import preset from 'jss-preset-default'
import TabPane from './TabPane'
import view from './Tab.view'
import style from './Tab.style'
import findChildrenOfType from './lib/findChildrenOfType'
import * as R from 'ramda'
import createStyleTag from './lib/createStyleTag'
import bindMethods from './lib/bindMethods'
import wrapElements from './lib/wrapElements'
import touchClientX from './lib/touchClientX'
import numberSign from './lib/numberSign'
import inRange from './lib/inRange'
import removeClass from './lib/removeClass'
import AnimationFrame from './lib/AnimationFrame'
import addClass from './lib/addClass'
import setTranslateX from './lib/setTranslateX'

const jss = new Jss(preset())
const styleSheets = createStyleTag(jss, style)
const getNavItems = R.compose(
  R.map(R.path(['attributes', 'title', 'value'])),
  findChildrenOfType(TabPane)
)
const getPaneItems = R.compose(
  R.map(wrapElements('.pane-item')),
  R.pluck('children'),
  findChildrenOfType(TabPane)
)
const setupElements = R.juxt([
  R.forEach(addClass('transformable')),
  R.forEach(removeClass('animated'))
])
const tearDownElements = R.juxt([
  R.forEach(removeClass('transformable')),
  R.forEach(addClass('animated'))
])
const addActive = addClass('active')
const removeActive = removeClass('active')
const methods = [
  '__onNavClick',
  '__onTouchEnd',
  '__onTouchMove',
  '__onTouchStart'
]
const getData = R.applySpec({
  __navItems: getNavItems,
  __selectedId: R.always(0),
  __startX: R.always(null),
  __endX: R.always(null),
  __moveX: R.always(null),
  __animationFrame: AnimationFrame.createAF,
  __paneItems: getPaneItems
})
const calcResetPaneX = (width, id) => -width * id
const calcTranslateSliderX = (width, id, count, startX, moveX) => (width * id + startX - moveX) / count
const calcResetSliderX = (width, count, id) => width / count * id
const calcTranslatePaneX = (id, width, moveX, startX) => -id * width + moveX - startX
const isMovable = (startX, moveX, id, count, width) => {
  const currentX = width * id + startX - moveX
  return inRange(0, width * (count - 1), currentX)
}

export default class Tab extends HTMLElement {
  static get tagName () {
    return 'x-tab'.toUpperCase()
  }

  __bind () { bindMethods(this, methods) }

  get __elements () {
    const {paneContainerEL, sliderEL} = this.__view
    return [paneContainerEL, sliderEL]
  }

  __onTouchStart (ev) {
    this.__startX = touchClientX(ev)
    setupElements(this.__elements)
  }

  __onTouchEnd (ev) {
    this.__endX = touchClientX(ev)
    const diff = this.__startX - this.__endX
    const direction = numberSign(diff)
    const selectedId = this.__selectedId + direction
    const threshold = 0.20 * this.__width
    if (Math.abs(diff) > threshold && direction !== 0 && isMovable(this.__startX, this.__moveX, this.__selectedId, this.__count, this.__width)) {
      removeActive(this.__selectedEL)
      this.__selectedId = selectedId
      addActive(this.__selectedEL)
    }
    AnimationFrame.stopAF(this.__animationFrame)
    tearDownElements(this.__elements)
    setTranslateX(this.__view.paneContainerEL, calcResetPaneX(this.__width, this.__selectedId))
    setTranslateX(this.__view.sliderEL, calcResetSliderX(this.__width, this.__count, this.__selectedId))
  }

  __onTouchMove (ev) {
    const moveX = touchClientX(ev)
    if (isMovable(this.__startX, moveX, this.__selectedId, this.__count, this.__width)) {
      this.__moveX = moveX
      AnimationFrame.startAF(this.__animationFrame, () => {
        setTranslateX(this.__view.sliderEL, calcTranslateSliderX(this.__width, this.__selectedId, this.__count, this.__startX, this.__moveX))
        setTranslateX(this.__view.paneContainerEL, calcTranslatePaneX(this.__selectedId, this.__width, this.__moveX, this.__startX))
      })
    }
  }

  __isMovable () {
    const diff = this.__startX - this.__moveX
    const count = this.__count
    const Movable = R.compose(inRange(-1, count), R.add(this.__selectedId), numberSign)
    return Movable(diff)
  }

  __onNavClick (id) {
    removeActive(this.__selectedEL)
    this.__selectedId = id
    addActive(this.__selectedEL)
    setTranslateX(this.__view.sliderEL, calcResetSliderX(this.__width, this.__count, this.__selectedId))
    setTranslateX(this.__view.paneContainerEL, calcResetPaneX(this.__width, this.__selectedId))
  }

  get __selectedEL () { return this.__view.navListEL[this.__selectedId] }

  get __width () { return this.__dimensions.width }

  get __count () { return this.__navItems.length }

  createdCallback () {
    /**
     * Bind handlers
     */
    this.__bind()

    /**
     * Create ShadowRoot
     */
    const shadow = this.createShadowRoot()

    /**
     * Get Initial Data
     * @private
     */
    Object.assign(this, getData(this))

    /**
     * Create view
     * @private
     */
    this.__view = view({$: this})

    /**
     * Render View for the first time
     */
    shadow.appendChild(styleSheets)
    shadow.appendChild(this.__view.children)

    /**
     * Get Dimensions
     * @private
     */
    this.__dimensions = this.getBoundingClientRect()
  }
}
