function play (bufferIdx, sendGain, mainGain, playbackRate, noteTime, patternId, lineId, noteId) {
  postMessage(['play-note', bufferIdx, sendGain, mainGain, playbackRate, noteTime, patternId, lineId, noteId]);
}