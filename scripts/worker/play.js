function play (bufferIdx, gain, patternId, lineId, noteId, duration) {
  if (gain > 0) postMessage(['play-note', bufferIdx, gain, patternId, lineId, noteId, duration]);
}