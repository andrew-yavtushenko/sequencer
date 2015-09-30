define('buffers', ['lodash.min', 'context'], function (_, context) {
  var availableSamples = {
    'hat'            : 'hat',
    'openhat'        : 'openhat',
    'snare'          : 'snare',
    'kick'           : 'kick',
    'ride'           : 'ride',
    'ridebell'       : 'ridebell',
    'crash'          : 'crash',
    'tom1'           :'tom1',
    'tom2'           :'tom2',
    'tom3'           :'tom3',
    'metronome-low'  : 'metronome-low',
    'metronome-med'  : 'metronome-med',
    'metronome-high' : 'metronome-high'
  };
  var buffers = {};
  var loadedBuffers = {};

  function loadSample (url, callback) {

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";


    var kit = this;

    request.onloadend = function() {
      
      var audioData = request.response;
      context.decodeAudioData(
        audioData,
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