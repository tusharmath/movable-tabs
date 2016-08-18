/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import R from 'ramda'

export default R.compose(
  R.prop('clientX'),
  R.head,
  R.prop('changedTouches')
)
