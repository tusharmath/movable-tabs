/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'
import R from 'ramda'

export default R.curry((jss, style) => <style>{jss.createStyleSheet(style, {named: false}).toString()}</style>)
