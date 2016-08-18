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
import translateX from './lib/translateX'
import touchClientX from './lib/touchClientX'
import numberSign from './lib/numberSign'
import inRange from './lib/inRange'
import removeClass from './lib/removeClass'
import AnimationFrame from './lib/AnimationFrame'
import addClass from './lib/addClass'

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
const addAnimatedCSS = addClass('animated')
const removeAnimatedCSS = removeClass('animated')
const addTransformableCSS = addClass('transformable')
const removeTransformableCSS = removeClass('transformable')
const addActive = addClass('active')
const removeActive = removeClass('active')

const getData = R.applySpec({
  __navItems: getNavItems,
  __selectedId: R.always(0),
  __startX: R.always(null),
  __endX: R.always(null),
  __moveX: R.always(null),
  __animationFrame: AnimationFrame.create,
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
    addTransformableCSS(paneContainerEL)
    addTransformableCSS(sliderEL)
    removeAnimatedCSS(paneContainerEL)
    removeAnimatedCSS(sliderEL)
  }

  __onTouchEnd (ev) {
    const {paneContainerEL, sliderEL} = this.__view
    this.__endX = touchClientX(ev)
    this.__updateSelected()
    AnimationFrame.stop(this.__animationFrame)
    removeTransformableCSS(paneContainerEL)
    removeTransformableCSS(sliderEL)
    addAnimatedCSS(paneContainerEL)
    addAnimatedCSS(sliderEL)
  }

  __onTouchMove (ev) {
    const clientX = touchClientX(ev)
    this.__moveX = clientX
    if (this.__isMovable()) {
      AnimationFrame.start(this.__animationFrame, this.__updateAnimation)
    }
  }

  __isMovable () {
    const diff = this.__startX - this.__moveX
    const count = this.__navItems.length
    const Movable = R.compose(inRange(-1, count), R.add(this.__selectedId), numberSign)
    return Movable(diff)
  }

  __updateSelected () {
    const diff = this.__startX - this.__endX
    const direction = numberSign(diff)
    const selectedId = this.__selectedId + direction
    const threshold = 0.20 * this.__dimensions.width
    if (Math.abs(diff) > threshold && direction !== 0 && this.__isMovable()) {
      this.__deactivateSelectedNavItem()
      this.__selectedId = selectedId
      this.__showSelectedPane()
      this.__updateSlider()
      this.__activateSelectedNavItem()
    } else {
      this.__showSelectedPane()
      this.__updateSlider()
    }
  }

  __onNavClick (id) {
    this.__deactivateSelectedNavItem()
    this.__selectedId = id
    this.__updateSlider()
    this.__activateSelectedNavItem()
    this.__showSelectedPane()
  }

  __showSelectedPane () {
    const width = this.__dimensions.width
    const x = width * this.__selectedId
    this.__view.paneContainerEL.style.transform = translateX(-x)
  }

  __translateSlider () {
    const currentX = this.__dimensions.width * this.__selectedId / this.__navItems.length
    const x = currentX + (this.__startX - this.__moveX) / this.__navItems.length
    this.__view.sliderEL.style.transform = translateX(x)
  }

  __updateSlider () {
    const width = this.__dimensions.width / this.__navItems.length
    this.__view.sliderEL.style.transform = translateX(width * this.__selectedId)
  }

  __deactivateSelectedNavItem () {
    const el = this.__view.navListEL[this.__selectedId]
    removeActive(el)
  }

  __activateSelectedNavItem () {
    const el = this.__view.navListEL[this.__selectedId]
    addActive(el)
  }

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
    this.__view.paneContainerEL.style.transform = translateX(x)
  }

  __updateAnimation () {
    this.__translateSlider()
    this.__translatePane()
  }
}
