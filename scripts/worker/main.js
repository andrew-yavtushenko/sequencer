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

initTicker();
initDispatcher();

function initWorker() {
  return true;
}

