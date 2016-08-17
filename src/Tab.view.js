/**
 * Created by tushar.mathur on 17/08/16.
 */

'use strict'

import R from 'ramda'

const mapI = R.addIndex(R.map)

export const createPanelContainer = ({$}) => {
  const width = `${$.__navItems.length * 100}%`
  return (
    <div className='pane-container animated' style={{width}}>
      {$.__paneItems}
    </div>
  )
}

export const createNavList = ({$}) => {
  const className = i => i === 0 ? 'active' : ''
  const LI = (k, i) => <li
    className={className(i)}
    onclick={R.partial($.__onNavClick, [i])}
  >
    {k}
  </li>
  return mapI(LI, $.__navItems)
}

export default ({$}) => {
  const sliderEL = <div className='slider'></div>
  const navListEL = createNavList({$})
  const paneContainerEL = createPanelContainer({$})
  const children =
    <div className='movable-tabs'>
      <div className='header'>
        <ul className='nav'>{navListEL}</ul>
        {sliderEL}
      </div>
      <div className='pane'
           ontouchstart={$.__onTouchStart}
           ontouchmove={$.__onTouchMove}
           ontouchend={$.__onTouchEnd}
      >
        {paneContainerEL}
      </div>
    </div>
  return {children, sliderEL, navListEL, paneContainerEL}
}
