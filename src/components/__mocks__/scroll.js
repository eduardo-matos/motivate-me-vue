/* eslint-disable no-undef */

import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

export default {
  start: jest.fn(),
  stop: jest.fn(),
  on: jest.fn().mockImplementation((evt, callback) => {
    eventEmitter.on(evt, callback);
    return jest.fn();
  }),

  _emit(evt) {
    eventEmitter.emit(evt);
  },

  _offAll() {
    eventEmitter.removeAllListeners();
  },
}