define('buffers', ['lodash.min', 'context'], function (_, context) {
  var availableSamples = {
    'hihat':'hihat',
    'snare':'snare',
    'kick':'kick',
    'tick-low': 'tick-low',
    'tick-med': 'tick-med',
    'tick-high': 'tick-high'
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
    _.each(availableSamples, function (sampleName) {
      loadedBuffers[sampleName] = buffers[sampleName];
    })
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
    loadAll: loadBuffers,
    areLoaded: areLoaded
  };
});