define('play-note', ['context', 'buffers', 'blink'], function (context, buffers, blink) {

  var effectDryMix = 1;
  var masterGainNode;
  var finalMixNode;
  var convolver;
  var effectLevelNode;

  finalMixNode = context.destination;
  masterGainNode = context.createGain();
  masterGainNode.gain.value = 0.7; // reduce overall volume to avoid clipping
  masterGainNode.connect(finalMixNode);
  effectLevelNode = context.createGain();
  effectLevelNode.gain.value = 1.0; // effect level slider controls this
  effectLevelNode.connect(masterGainNode);

  // Create convolver for effect
  convolver = context.createConvolver();
  convolver.connect(effectLevelNode);

  function play (bufferId, gain, patternId, lineId, noteId) {
    blink(patternId, lineId, noteId, gain);
    var voice = context.createBufferSource();
    voice.buffer = buffers.get()[bufferId];

    // Connect to dry mix
    var dryGainNode = context.createGain();
    dryGainNode.gain.value = gain * effectDryMix;
    voice.connect(dryGainNode);
    dryGainNode.connect(masterGainNode);

    // Connect to wet mix
    var wetGainNode = context.createGain();
    wetGainNode.gain.value = gain;
    // wetGainNode.gain.value = gain * effectDryMix; FF doesn't work correctly with sendGain
    voice.connect(wetGainNode);
    wetGainNode.connect(convolver);


    if (!voice.start) {
      voice.start = voice.noteOn;
    }

    voice.start(0);
  }
  return play;
});