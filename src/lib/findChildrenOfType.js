/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import R from 'ramda'

export default R.useWith(R.filter, [
  R.compose(R.propEq('tagName'), R.prop('tagName')),
  R.prop('children')
])
