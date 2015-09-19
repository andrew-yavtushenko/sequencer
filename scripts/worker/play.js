function play (bufferIdx, gain, patternId, lineId, noteId) {
  if (gain > 0) postMessage(['play-note', bufferIdx, gain, patternId, lineId, noteId]);
}