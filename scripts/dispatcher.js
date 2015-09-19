define('dispatcher', ['play-note'], function (playNote){
  var worker = new Worker('./scripts/worker/main.js');

  var callbacks = {};
  var callbacksCounter = 0;

  function createTrack (name, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['createTrack', callbackId, name]);
  }

  function createPattern (beat, noteValue, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['createPattern', callbackId, beat, noteValue]);
  }

  function addLine (patternId, bufferId, subDivision, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['addLine', callbackId, patternId, bufferId, subDivision]);
  }

  function updateNote (patternId, lineId, noteId, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['updateNote', callbackId, patternId, lineId, noteId]);
  }

  function deletePattern (patternId, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['deletePattern', callbackId, patternId]);
  }

  function play (trackId, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['play', callbackId, trackId]);
  }

  function stop (trackId, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['stop', callbackId, trackId]);
  }

  function setTempo (tempo, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['tempo', callbackId, tempo]);
  }

  function init(callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['init', callbackId]);
  }

  function getPattern (patternId, callback) {
    var callbackId = addCallback(callback);
    worker.postMessage(['getPattern', callbackId, patternId]);
  }

  function addCallback (callback) {
    callbacksCounter++;
    callbacks[callbacksCounter] = callback;
    return callbacksCounter;
  }

  worker.onmessage = function (e) {
    if (e.data[0] === 'play-note') {
      e.data.splice(0,1);
      playNote.apply(null, e.data);
      return false;
    }
    var data = e.data;
    var callbackId = data.splice(1,1);
    if (typeof(callbacks[callbackId]) === 'function') callbacks[callbackId].apply(null, data);
    delete callbacks[callbackId];
  };

  return {
    createTrack: createTrack,
    createPattern: createPattern,
    addLine: addLine,
    updateNote: updateNote,
    deletePattern: deletePattern,
    play: play,
    stop: stop,
    setTempo: setTempo,
    init: init,
    getPattern: getPattern
  };

});