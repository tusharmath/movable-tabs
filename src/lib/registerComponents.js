import * as R from 'ramda'
/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

export default (document, components) => {
  R.forEach(c => document.registerElement(c.tagName, c), components)
}
