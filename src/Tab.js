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

const getData = R.applySpec({
  __navItems: getNavItems,
  __selectedId: R.always(0),
  __startX: R.always(null),
  __endX: R.always(null),
  __moveX: R.always(null),
  __animationFrame: AnimationFrame.createAF,
  __paneItems: getPaneItems
})

export default class Tab extends HTMLElement {
  static get tagName () {
    return 'x-tab'.toUpperCase()
  }

  __bind () {
    const methods = [
      '__onNavClick',
      '__onTouchEnd',
      '__onTouchMove',
      '__onTouchStart',
      '__updateAnimation'
    ]
    bindMethods(this, methods)
  }

  __onTouchStart (ev) {
    this.__startX = touchClientX(ev)
    const {paneContainerEL, sliderEL} = this.__view
    setupElements([paneContainerEL, sliderEL])
  }

  __onTouchEnd (ev) {
    const {paneContainerEL, sliderEL} = this.__view
    this.__endX = touchClientX(ev)
    this.__updateSelected()
    AnimationFrame.stopAF(this.__animationFrame)
    tearDownElements([paneContainerEL, sliderEL])
  }

  __onTouchMove (ev) {
    const clientX = touchClientX(ev)
    this.__moveX = clientX
    if (this.__isMovable()) {
      AnimationFrame.startAF(this.__animationFrame, this.__updateAnimation)
    }
  }

  __isMovable () {
    const diff = this.__startX - this.__moveX
    const count = this.__count
    const Movable = R.compose(inRange(-1, count), R.add(this.__selectedId), numberSign)
    return Movable(diff)
  }

  __updateSelected () {
    const diff = this.__startX - this.__endX
    const direction = numberSign(diff)
    const selectedId = this.__selectedId + direction
    const threshold = 0.20 * this.__dimensions.width
    if (Math.abs(diff) > threshold && direction !== 0 && this.__isMovable()) {
      removeActive(this.__selectedEL)
      this.__selectedId = selectedId
      this.__showSelectedPane()
      this.__updateSlider()
      addActive(this.__selectedEL)
    } else {
      this.__showSelectedPane()
      this.__updateSlider()
    }
  }

  __onNavClick (id) {
    removeActive(this.__selectedEL)
    this.__selectedId = id
    this.__updateSlider()
    addActive(this.__selectedEL)
    this.__showSelectedPane()
  }

  __showSelectedPane () {
    const width = this.__width
    const x = width * this.__selectedId
    setTranslateX(this.__view.paneContainerEL, -x)
  }

  __translateSlider () {
    const currentX = this.__width * this.__selectedId / this.__count
    const x = currentX + (this.__startX - this.__moveX) / this.__count
    setTranslateX(this.__view.sliderEL, x)
  }

  __updateSlider () {
    const width = this.__width / this.__count
    setTranslateX(this.__view.sliderEL, width * this.__selectedId)
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

  __translatePane () {
    const currentX = -this.__selectedId * this.__dimensions.width
    const x = currentX + (this.__moveX - this.__startX)
    setTranslateX(this.__view.paneContainerEL, x)
  }

  __updateAnimation () {
    this.__translateSlider()
    this.__translatePane()
  }
}
