/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'
import h from 'hyperscript'
import R from 'ramda'

export default R.curry((type, elements) => h(type, ...elements))
