
function getTicker () {
  var intervalId;
  var timeoutId;
  var startTime;
  var currentTime;
  var currentTrack;
  var inProgress = false;
  var tracks = [];

  function schedule() {
    currentTime = timing.current();

    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    currentTime -= startTime;
    currentTrack.play(currentTime, startTime);
  }

  function stop (track) {
    clearInterval(intervalId);
    currentTrack.isPlaying = false;

    inProgress = false;
    // console.profileEnd("worker");
  }

  function play (track) {
    // console.profile("worker");
    currentTrack = track;
    currentTrack.reset();
    currentTrack.isPlaying = true;
    inProgress = true;
    startTime = timing.current() + 0.005;
    schedule();
    intervalId = setInterval(schedule, 1);
  }

  return {
    play: play,
    stop: stop
  };

}