import * as R from 'ramda'
/**
 * Created by tushar.mathur on 18/08/16.
 */

'use strict'

export default R.curry((className, el) => el.classList.remove(className))
