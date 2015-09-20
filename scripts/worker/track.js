var defaultTrackName = "New track";
var trackCounter = 0;

function Track (name) {
  this.bpm = 120;
  this.counter = 0;
  this.isPlaying = false;
  this.id = UUIDjs.create().hex;
  this.patternIndex = 0;
  this.patterns = [];
  this.name = name || defaultTrackName + ' ' + trackCounter++;

  return this;
}
Track.prototype.editName = function (newName) {
  this.name = newName;
};

Track.prototype.releaseCustomTempo = function (patternId) {
  this.getPattern(patternId).releaseCustomTempo(this.bpm);
}

Track.prototype.setCustomTempo = function (tempo, patternId) {
  this.getPattern(patternId).setCustomTempo(tempo);
}

Track.prototype.setTempo = function(tempo) {
  this.bpm = tempo;
  var result = {};
  for (var i = 0; i < this.patterns.length; i++) {
    result[this.patterns[i].id] = this.patterns[i].setTempo(tempo);
  }
  return result;
};

Track.prototype.createPattern = function (beat, noteValue) {
  if (this.isPlaying) {
    console.error("you can't modify track while playing");
    return false;
  } else {
    var availableSubDivisions = settings.subDivision.reduce(function (result, subDivision) {
      if (subDivision >= noteValue) {
        result.push(subDivision);
      }
      return result;
    }, []);

    var newPattern = new Pattern({
      availableSubDivisions: availableSubDivisions,
      currentSubDivision: availableSubDivisions[0],
      beat: beat,
      noteValue: noteValue,
      id: UUIDjs.create().hex,
      bpm: this.bpm
    });

    this.patterns.push(newPattern);
    return newPattern;
  }
};

Track.prototype.advancePattern = function(currentPattern) {
  currentPattern.stop();
  this.patternIndex++;
  if (this.patternIndex === this.patterns.length) {
    this.patternIndex = 0;
  }
};

Track.prototype.play = function(currentTime) {
  var currentPattern = this.patterns[this.patternIndex];

  currentPattern.start();

  var currentPatternIsStoped = currentPattern.check(currentTime);

  if (currentPatternIsStoped) this.advancePattern(currentPattern);

  return currentPatternIsStoped;
};

Track.prototype.deletePattern = function(patternId) {
  if (!this.isPlaying) {
    this.patterns.splice(patternId, 1);
    return true;
  } else {
    console.error("you can't modify track while playing");
    return false;
  }
};

Track.prototype.getPattern = function(patternId) {

  function findPattern (pattern) {
    return pattern.id === patternId;
  }

  return this.patterns.find(findPattern);
};

Track.prototype.reset = function() {
  this.patternIndex = 0;
  for (var i = 0, il = this.patterns.length; i < il; i++) {
    this.patterns[i].reset();
  }

};
