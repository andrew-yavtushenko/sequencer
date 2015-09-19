define('context', [], function  () {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  window.context = context;
  var isUnlocked = false;

   window.unlock = function (callback) {
    var buffer = context.createBuffer(1, 1, 22050);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    source.start(0);

    setTimeout(function () {
      if (source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE) {
        isUnlocked = true;
      }
      callback();
    }, 10);
  }

  return context;
});