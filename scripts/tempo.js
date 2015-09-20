define('tempo', ['jquery', 'dispatcher'], function ($, dispatcher) {
  var tempo = 120;

  function updateTempo(message, newTempo) {
    tempo = newTempo;
  }

  return {
    setTrackTempo: function (newTempo, trackId, callback) {
      dispatcher.setTrackTempo(newTempo, trackId, callback);
    },
    setPatternTempo: function (newTempo, trackId, patternId, callback) {
      dispatcher.setPatternTempo(newTempo, trackId, patternId, callback);
    },
    releaseCustomTempo: function (trackId, patternId, callback) {
      dispatcher.releaseCustomTempo(trackId, patternId, callback);
    },
    get: function () {
      return tempo;
    }
  };
});