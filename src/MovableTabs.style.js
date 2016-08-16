/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import * as F from 'flex-jss'

export default {
  '.movable-tabs': {
    backgroundColor: 'rgb(214, 10, 10)',
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
    color: '#FFF',
    '& ul': {
      extend: F.row,
      margin: 0,
      padding: 0,
      listStyle: 'none',
      '& li': {
        extend: F.spread,
        textAlign: 'center',
        color: 'rgb(242, 174, 174)',
        textTransform: 'uppercase',
        padding: '15px 5px',
        '&.active': {
          color: '#FFF'
        }
      }
    },
    '& .slider': {
      height: '3px',
      backgroundColor: '#FFF',
      width: 'calc(100%/3)'
    }
  }
}
