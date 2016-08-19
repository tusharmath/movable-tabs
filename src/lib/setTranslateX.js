import translateX from './translateX'
import * as R from 'ramda'
/**
 * Created by tushar.mathur on 18/08/16.
 */

'use strict'

export default R.curry((el, x) => {
  if (el.style.transform === translateX(x)) return
  el.style.transform = translateX(x)
})
