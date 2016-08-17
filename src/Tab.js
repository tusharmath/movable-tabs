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
  __paneItems: getPaneItems
})

export default class Tab extends HTMLElement {
  static get tagName () { return 'x-tab'.toUpperCase() }

  __bind () {
    bindMethods(this, ['__onNavClick'])
  }

  __onNavClick (id) {
    this.__deactivateSelectedNavItem()
    this.__selectedId = id
    this.__updateSlider()
    this.__activateSelectedNavItem()
  }

  __updateSlider () {
    const width = this.__dimensions.width / this.__navItems.length
    this.__view.sliderEL.style.transform = `translateX(${width * this.__selectedId}px)`
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
    this.__bind(['__onNavClick'])

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
