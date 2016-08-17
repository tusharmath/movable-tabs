/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import h from 'hyperscript'
import R from 'ramda'

const hc = R.curryN(2, h)

export default ({navItems}) => h('div.movable-tabs',
  h('div.header',
    h('ul.nav',
      R.map(hc('li'), navItems)
    ),
    h('div.slider')
  )
)
