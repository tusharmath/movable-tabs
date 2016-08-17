/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import h from 'hyperscript'
import R from 'ramda'

const hc = R.curryN(2, h)

export default ({tabItems, sections}) => h('div.movable-tabs',
  h('div.header',
    h('ul.nav',
      R.map(hc('li'), tabItems)
    ),
    h('div.slider')
  ),
  h('ul.content',
    sections
  )
)
