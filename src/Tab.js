/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import {Jss} from 'jss'
import h from 'hyperscript'
import preset from 'jss-preset-default'
import TabPane from './TabPane'
import view from './Tab.view'
import style from './Tab.style'
import findChildrenOfType from './lib/findChildrenOfType'
import * as R from 'ramda'

const jss = new Jss(preset())
const styleSheets = jss.createStyleSheet(style, {named: false}).toString()
const getNavItems = R.compose(R.map(R.path(['attributes', 'title', 'value'])), findChildrenOfType(TabPane))

export default class Tab extends HTMLElement {
  static get tagName () { return 'x-tab'.toUpperCase() }

  createdCallback () {
    const shadow = this.createShadowRoot()
    const navItems = getNavItems(this)
    shadow.appendChild(h('style', styleSheets))
    shadow.appendChild(view({navItems}))
  }
}
