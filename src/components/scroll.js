import EventEmitter from 'events'

const eventEmitter = new EventEmitter()

function onScrollCallback() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    eventEmitter.emit('bottom');
  }
}

window.addEventListener('scroll', onScrollCallback);

export default {
  on(evt, callback) {
    eventEmitter.on(evt, callback);
    return () => eventEmitter.removeListener(callback);
  },
  off() {
    window.removeEventListener(onScrollCallback);
  }
}
