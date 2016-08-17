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

const getData = R.applySpec({
  __navItems: getNavItems,
  __selectedId: R.always(0),
  __startX: R.always(null),
  __endX: R.always(null),
  __moveX: R.always(null),
  __paneItems: getPaneItems
})

export default class Tab extends HTMLElement {
  static get tagName () {
    return 'x-tab'.toUpperCase()
  }

  __bind () {
    const methods = ['__onNavClick', '__onTouchStart', '__onTouchMove', '__onTouchEnd']
    bindMethods(this, methods)
  }

  __onTouchStart (ev) {
    this.__startX = touchClientX(ev)
    this.__disablePaneAnimation()
  }

  __onTouchEnd (ev) {
    this.__endX = touchClientX(ev)
    this.__updateSelected()
    this.__enablePaneAnimation()
  }

  __onTouchMove (ev) {
    this.__moveX = touchClientX(ev)
  }

  __updateSelected () {
    const diff = this.__startX - this.__endX
    const direction = numberSign(diff)
    const selectedId = this.__selectedId + direction
    const threshold = 0.20 * this.__dimensions.width
    const count = this.__navItems.length
    if (Math.abs(diff) > threshold && direction !== 0 && inRange(-1, count, selectedId)) {
      this.__selectedId = selectedId
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

  __updateSlider () {
    const width = this.__dimensions.width / this.__navItems.length
    this.__view.sliderEL.style.transform = translateX(width * this.__selectedId)
  }

  __deactivateSelectedNavItem () {
    const el = this.__view.navListEL[this.__selectedId]
    el.classList.remove('active')
  }

  __activateSelectedNavItem () {
    const el = this.__view.navListEL[this.__selectedId]
    el.classList.add('active')
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

  __enablePaneAnimation () {
    this.__view.paneContainerEL.classList.add('animated')
  }

  __disablePaneAnimation () {
    this.__view.paneContainerEL.classList.remove('animated')
  }
}
