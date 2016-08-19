'use strict'

import Tab from './Tab'
import TabPane from './TabPane'
import registerComponents from './lib/registerComponents'

export const setup = (document) => registerComponents(document, [TabPane, Tab])
