import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

function onScrollCallback() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    eventEmitter.emit('bottom');
  }
}

export default {
  start() {
    window.addEventListener('scroll', onScrollCallback));
  },
  stop() {
    window.removeEventListener(onScrollCallback);
  },
  on(evt, callback) {
    eventEmitter.on(evt, callback);
    return () => eventEmitter.removeListener(callback);
  },
}
