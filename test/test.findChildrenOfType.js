/**
 * Created by imamudin.naseem on 17/08/16.
 */

import test from 'ava'
import findChildrenOfType from '../src/lib/findChildrenOfType'

test('findChildrenOfType', t => {
  const node = {
    children: [
      {tagName: 'div', id: 1},
      {tagName: 'div', id: 2},
      {tagName: 'span', id: 3},
      {tagName: 'div', id: 4},
      {tagName: 'li', id: 5},
      {tagName: 'div', id: 6},
      {tagName: 'ul', id: 7},
      {tagName: 'li', id: 8},
      {tagName: 'small', id: 9}
    ]
  }
  t.deepEqual(findChildrenOfType({tagName: 'small'}, node), [{
    tagName: 'small',
    id: 9
  }])
  t.deepEqual(findChildrenOfType({tagName: 'div'}, node), [{
    tagName: 'div',
    id: 1
  }, {tagName: 'div', id: 2}, {tagName: 'div', id: 4}, {tagName: 'div', id: 6}])
  t.deepEqual(findChildrenOfType({tagName: 'li'}, node), [{
    tagName: 'li',
    id: 5
  }, {tagName: 'li', id: 8}])
})
