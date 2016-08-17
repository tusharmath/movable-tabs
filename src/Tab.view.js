/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import h from 'hyperscript'
import R from 'ramda'

const mapI = R.addIndex(R.map)

export default ({$}) => {
  const sliderEL = h('div.slider')
  const navListEL = mapI((k, i) => h('li', {onclick: R.partial($.__onNavClick, [i])}, k), $.__navItems)
  const DOM = h('div.movable-tabs',
    h('div.header',
      h('ul.nav', navListEL),
      sliderEL
    )
  )
  return {DOM, sliderEL, navListEL}
}
