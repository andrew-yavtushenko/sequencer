define('play-note', ['context', 'buffers', 'blink'], function (context, buffers, blink) {

  // var effectDryMix = 1;
  // var masterGainNode;
  // var finalMixNode;
  // var convolver;
  // var effectLevelNode;

  // finalMixNode = context.destination;
  // masterGainNode = context.createGain();
  // masterGainNode.gain.value = 0.7; // reduce overall volume to avoid clipping
  // masterGainNode.connect(finalMixNode);
  // effectLevelNode = context.createGain();
  // effectLevelNode.gain.value = 1.0; // effect level slider controls this
  // effectLevelNode.connect(masterGainNode);

  // // Create convolver for effect
  // convolver = context.createConvolver();
  // convolver.connect(effectLevelNode);

  function play (bufferId, sendGain, mainGain, playbackRate, noteTime, patternId, lineId, noteId) {
    if (mainGain !== 0) {
      blink(patternId, lineId, noteId, mainGain);
      // var voice = context.createBufferSource();
      // voice.buffer = buffers.get()[bufferId];
      // voice.playbackRate.value = playbackRate;

      // // Connect to dry mix
      // var dryGainNode = context.createGain();
      // dryGainNode.gain.value = mainGain * effectDryMix;
      // voice.connect(dryGainNode);
      // dryGainNode.connect(masterGainNode);

      // // Connect to wet mix
      // var wetGainNode = context.createGain();
      // wetGainNode.gain.value = mainGain;
      // // wetGainNode.gain.value = gain * effectDryMix; FF doesn't work correctly with sendGain
      // voice.connect(wetGainNode);
      // wetGainNode.connect(convolver);

      var source = context.createBufferSource();
      source.buffer = buffers.get()[bufferId];
      source.buffer.gain = mainGain;
      source.connect(context.destination);

      if (!source.start) {
        source.start = source.noteOn;
      }

      source.start(0);
    }
  }
  return play;
});