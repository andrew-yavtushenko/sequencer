define('play-note', ['context', 'buffers', 'blink'], function (context, buffers, blink) {

  function play (buffer, gain, duration, psh) {
    var noteDuration = duration / 1000;
    var source = context.createBufferSource();
    var gainNode = context.createGain();

    source.buffer = buffer;

    gainNode.gain.value = gain;
    source.connect(gainNode);

    gainNode.connect(context.destination);

    var ratio = noteDuration / buffer.duration

    if (!source.start) {
      source.start = source.noteOn;
    }
    source.start(0);
    if (psh) {
      gainNode.gain.setTargetAtTime(0, context.currentTime + buffer.duration * ratio, 0.1);
    }
  };

  window.play = play;

  function playNote (bufferId, gain, patternId, lineId, noteId, duration) {
    blink(patternId, lineId, noteId, gain);
    var source = context.createBufferSource();
    var buffer;

    var psh = bufferId.match(/muted/gi);

    if (bufferId.match(/metronome/gi)) {
      if (gain === 0.33) {
        buffer = buffers.getRaw()['metronome-low'];
      } else if (gain === 0.66) {
        buffer = buffers.getRaw()['metronome-med'];
      } else {
        buffer = buffers.getRaw()['metronome-high'];
      }
      gain = 1;
    } else {
      buffer = buffers.get()[bufferId];
    }

    play(buffer, gain, duration, psh);
  }
  return playNote;
});