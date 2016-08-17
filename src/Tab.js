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

const jss = new Jss(preset())
const styleSheets = createStyleTag(jss, style)

const getNavItems = R.compose(
  R.map(R.path(['attributes', 'title', 'value'])),
  findChildrenOfType(TabPane)
)

const getData = R.applySpec({
  navItems: getNavItems
})

export default class Tab extends HTMLElement {
  static get tagName () { return 'x-tab'.toUpperCase() }

  __onNavClick (id) {
    this.__selectedId = id
    this.__updateSlider()
  }

  __updateSlider () {
    const width = this.__dimensions.width / this.__navItems.length
    this.__view.sliderEL.style.transform = `translateX(${width * this.__selectedId}px)`
  }

  createdCallback () {
    /**
     * Bind handlers
     */
    bindMethods(this, ['__onNavClick'])

    /**
     * Create ShadowRoot
     */
    const shadow = this.createShadowRoot()

    /**
     * Get Attributes
     */
    this.__navItems = getData(this).navItems

    /**
     * Create view
     */
    this.__view = view({$: this})

    /**
     * Render View for the first time
     */
    shadow.appendChild(styleSheets)
    shadow.appendChild(this.__view.DOM)

    /**
     * Get Dimensions
     */
    this.__dimensions = this.getBoundingClientRect()
  }
}
