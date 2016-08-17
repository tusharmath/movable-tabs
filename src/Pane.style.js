/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import * as F from 'flex-jss'

export default {
  width: '100%',
  overflow: 'hidden',
  '& .pane-container': {
    extend: F.row,
    '&.animated': {
      transition: 'transform 100ms ease-in'
    },
    '&.transformable': {
      willChange: 'transform'
    },
    '& .pane-item': {
      extend: F.spread
    }
  }
}
