/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import h from 'hyperscript'
import R from 'ramda'

const hc = R.curryN(2, h)

export default ({tabItems}) => h('div.movable-tabs',
  h('ul',
    R.map(hc('li'), tabItems)
  ),
  h('div.slider')
)
