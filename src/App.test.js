import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import Card from './Card'
import App, { SYMBOLS } from './App'

it('should match its reference snapshot', () => {
  const mock = sinon
    .stub(App.prototype, 'generateCards')
    .returns([...SYMBOLS.repeat(2)])
  try {
    const wrapper = shallow(<App />)

    expect(wrapper).to.matchSnapshot()
  } finally {
    mock.restore()
  }
})
