var wrapper = {
  createTrack: function (data) {
    var name = data[0];
    var newTrack = new Track(name);
    tracks.push(newTrack);
    var trackId = tracks.length - 1;
    currentTrack = tracks[trackId];
    return {
      name: newTrack.name,
      id: trackId
    };
  },

  createPattern: function (data) {
    var beat = data[0];
    var noteValue = data[1];
    var newPattern = currentTrack.createPattern(beat, noteValue);
    if (newPattern) {
      return {
        id: newPattern.id,
        beat: newPattern.beat,
        noteValue: newPattern.noteValue,
        availableSubDivisions: newPattern.availableSubDivisions
      };
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
        patternsLength: currentTrack.patterns.length
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

  tempo: function (newTempo) {
    tempo = newTempo;
    return tempo;
  },

  getPattern: function (data) {
    var patternId = data[0]
    return currentTrack.getPattern(patternId);
  },

  init: function () {
    return true;
  }
}
