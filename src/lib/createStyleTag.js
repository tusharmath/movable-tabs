/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

export default (jss, style) => <style>{jss.createStyleSheet(style, {named: false}).toString()}</style>
