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
import toBetweenRange from './lib/toBetweenRange'

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
  selected: R.always(0),
  startX: R.always(0),
  moveX: R.always(0),
  __animationFrame: AnimationFrame.createAF,
  __paneItems: getPaneItems
})
const calcResetPaneX = ({width, selected}) => -width * selected
const calcTranslateSliderX = ({width, selected, count, startX, moveX}) => (width * selected + startX - moveX) / count
const calcResetSliderX = ({width, count, selected}) => width / count * selected
const calcTranslatePaneX = ({selected, width, moveX, startX}) => -selected * width + moveX - startX
const isMovable = ({startX, moveX, selected, count, width}) => {
  const currentX = width * selected + startX - moveX
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
    this.startX = touchClientX(ev)
    setupElements(this.__elements)
  }

  __onTouchEnd (ev) {
    const diff = this.startX - touchClientX(ev)
    const direction = numberSign(diff)
    const selectedId = toBetweenRange(0, this.count - 1, this.selected + direction)
    const threshold = 0.20 * this.width
    if (Math.abs(diff) > threshold && this.selected !== selectedId) {
      removeActive(this.__selectedEL)
      this.selected = selectedId
      addActive(this.__selectedEL)
    }
    AnimationFrame.stopAF(this.__animationFrame)
    tearDownElements(this.__elements)
    setTranslateX(this.__view.paneContainerEL, calcResetPaneX(this))
    setTranslateX(this.__view.sliderEL, calcResetSliderX(this))
  }

  __onTouchMove (ev) {
    const moveX = touchClientX(ev)
    const {startX, selected, count, width} = this
    if (isMovable({startX, moveX, selected, count, width})) {
      this.moveX = moveX
      AnimationFrame.startAF(this.__animationFrame, () => {
        setTranslateX(this.__view.sliderEL, calcTranslateSliderX(this))
        setTranslateX(this.__view.paneContainerEL, calcTranslatePaneX(this))
      })
    }
  }

  __onNavClick (id) {
    removeActive(this.__selectedEL)
    this.selected = id
    addActive(this.__selectedEL)
    setTranslateX(this.__view.sliderEL, calcResetSliderX(this))
    setTranslateX(this.__view.paneContainerEL, calcResetPaneX(this))
  }

  get __selectedEL () { return this.__view.navListEL[this.selected] }

  get width () { return this.__dimensions.width }

  get count () { return this.__navItems.length }

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
