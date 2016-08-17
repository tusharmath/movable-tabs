/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import {Jss} from 'jss'
import h from 'hyperscript'
import R from 'ramda'
import preset from 'jss-preset-default'
import view from './MovableTabs.view'
import style from './MovableTabs.style'

const jss = new Jss(preset())
const styleSheets = jss.createStyleSheet(style, {named: false}).toString()

const findChildrenOfType = R.useWith(R.filter, [
  R.propEq('tagName'),
  R.prop('children')
])
const getTabItems = R.compose(
  R.pluck('innerText'),
  findChildrenOfType('X-TAB-ITEM'),
  R.head,
  findChildrenOfType('X-TAB-HEADER')
)
const getSections = R.compose(
  R.prop('children'),
  R.head,
  findChildrenOfType('X-TAB-CONTENT')
)

export class Tab extends HTMLElement {
  createdCallback () {
    const shadow = this.createShadowRoot()
    const tabItems = getTabItems(this)
    const sections = R.map(x => h('li', x.innerHTML), getSections(this))
    shadow.appendChild(h('style', styleSheets))
    shadow.appendChild(view({tabItems, sections}))
  }
}

export class TabHeader extends HTMLElement {

}

export class TabContent extends HTMLElement {

}

export class TabItem extends HTMLElement {

}
