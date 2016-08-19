/**
 * Created by tushar.mathur on 19/08/16.
 */

'use strict'

import R from 'ramda'
export default R.curry((min, max, val) => R.max(min, R.min(max, val)))
