import * as R from 'ramda'
/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

export default R.curry((min, max, num) => num > min && num < max)
