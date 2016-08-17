/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'
import h from 'hyperscript'

export default (jss, style) => h('style', jss.createStyleSheet(style, {named: false}).toString())
