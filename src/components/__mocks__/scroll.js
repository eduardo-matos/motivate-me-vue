/* eslint-disable no-undef */

import EventEmitter from 'events'

const eventEmitter = new EventEmitter()

export default {
  on: jest.fn().mockImplementation((evt, callback) => {
    eventEmitter.on(evt, callback)
    return jest.fn()
  }),

  _emit(evt) {
    eventEmitter.emit(evt)
  },

  off: jest.fn(),
  _offAll() {
    eventEmitter.removeAllListeners()
  }
}