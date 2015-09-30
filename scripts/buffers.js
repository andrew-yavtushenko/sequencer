define('buffers', ['lodash.min', 'context'], function (_, context) {
  var availableSamples = {
    'hihat':'hihat',
    'snare':'snare',
    'kick':'kick'
    // 'metronome-low': 'metronome-low',
    // 'metronome-med': 'metronome-med',
    // 'metronome-high': 'metronome-high'
  };
  var buffers = {};
  var loadedBuffers = {};

  function loadSample (url, callback) {

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var kit = this;

    request.onload = function() {
      context.decodeAudioData(
        request.response,
        callback,
        function(buffer) {
            console.log("Error decoding drum samples!");
        }
      );
    };

    request.send();
  }

  function compileBuffers (buffers) {
    _.reduce(availableSamples, function(result, sampleName){
      if (sampleName.match(/metronome-/gi)) {
        result['metronome'] = 'metronome';
      } else {
        result[sampleName] = buffers[sampleName];
      }
      return result;
    }, loadedBuffers)
  }

  function loadBuffers (callback) {
    _.each(availableSamples, function (sample) {

      loadSample('./sounds/'+ sample +'.wav', function (buffer) {
        buffers[sample] = buffer;

        if (areLoaded()) {
          compileBuffers(buffers);
          callback(loadedBuffers);
        }
      });
    });
  }

  function areLoaded () {
    return _.size(buffers) === _.size(availableSamples);
  }

  return {
    get: function () { return loadedBuffers; },
    getRaw: function () { return buffers; },
    loadAll: loadBuffers,
    areLoaded: areLoaded
  };
});