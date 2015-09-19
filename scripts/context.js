define('context', [], function  () {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  window.context = context;
  var isUnlocked = false;

   window.unlock = function (reason) {
    console.log('reason', reason);
    var buffer = context.createBuffer(1, 1, 22050);
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    source.onended = function () {
      console.log("source.onended", arguments)
    }
    source.start(0);


    setTimeout(function () {
      if (source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE) {
        isUnlocked = true;
      }
      window.removeEventListener('touchstart', unlock, true);

    }, 10);
  }

  window.addEventListener('touchstart', unlock, true);

  return context;
});