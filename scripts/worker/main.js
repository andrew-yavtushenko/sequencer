importScripts(
  './timing.js',
  './settings.js',
  './play.js',
  './line.js',
  './pattern.js',
  './track.js',
  './ticker.js',
  './dispatcher.js',
  './uuid.js'
);

var dispatcher = getDispatcher();

function initWorker() {
  return true;
}

