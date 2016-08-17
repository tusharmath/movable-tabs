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
    '& .pane-item': {
      extend: F.spread
    }
  }
}
