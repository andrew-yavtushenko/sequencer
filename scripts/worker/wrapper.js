var wrapper = {
  createTrack: function (data) {
    var name = data[0];
    var newTrack = new Track(name);
    tracks.push(newTrack);

    currentTrack = tracks.find(function (track) {
      return track.id === newTrack.id
    });

    return newTrack;
  },

  createPattern: function (data) {
    var beat = data[0];
    var noteValue = data[1];
    var newPattern = currentTrack.createPattern(beat, noteValue);
    if (newPattern) {
      return newPattern;
    } else {
      return false;
    }
  },

  addLine: function (data) {
    var patternId = data[0];
    var bufferId = data[1];
    var subDivision = data[2];
    var currentPattern = currentTrack.getPattern(patternId);

    currentPattern.addLine(bufferId, subDivision);
    var lineId = currentPattern.lines.length - 1;
    var newLine = currentPattern.lines[lineId];

    return {
      id: lineId,
      patternId: patternId,
      notes: newLine.notes
    };
  },

  updateNote: function (data) {
    var patternId = data[0];
    var lineId = data[1];
    var noteId = data[2];
    var currentPattern = currentTrack.getPattern(patternId);

    var currentLine = currentPattern.lines[lineId]
    currentLine.updateVolume(noteId);

    return currentPattern.lines[lineId].notes[noteId].volume;
  },

  deletePattern: function (data) {
    var patternId = data[0];
    if (currentTrack.deletePattern(patternId)) {
      return {
        patternsLength: currentTrack.patterns.length,
        patternId: patternId
      };
    } else {
      return false;
    }
  },

  play: function (data) {
    Ticker.start(currentTrack);
  },

  stop: function (data) {
    Ticker.stop(currentTrack);
  },

  releaseCustomTempo: function (data) {
    trackId = data[0];
    patternId = data[1];
    currentTrack.releaseCustomTempo(patternId);
    return tempo;
  },

  customTempo: function (data) {
    tempo = data[0];
    trackId = data[1];
    patternId = data[2];
    currentTrack.setCustomTempo(tempo, patternId);
    return tempo;
  },

  tempo: function (data) {
    tempo = data[0];
    trackId = data[1];
    return currentTrack.setTempo(tempo);
  },

  getPattern: function (data) {
    var patternId = data[0]
    return currentTrack.getPattern(patternId);
  },

  init: function () {
    return true;
  }
}
