/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import R from 'ramda'

const mapI = R.addIndex(R.map)

export default ({$}) => {
  const sliderEL = <div className='slider'></div>
  const navListEL = mapI((k, i) => <li className={i === 0 ? 'active' : ''}
                                       onclick={R.partial($.__onNavClick, [i])}>{k}</li>, $.__navItems)
  const children =
    <div className='movable-tabs'>
      <div className='header'>
        <ul className='nav'>{navListEL}</ul>
        {sliderEL}
      </div>
      <div className='pane'>
        <div className='pane-container' style={{width: `${$.__navItems.length * 100}%`}}>
          {$.__paneItems}
        </div>
      </div>
    </div>
  return {children, sliderEL, navListEL}
}
