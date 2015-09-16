function Track (name) {
  this.counter = 0;
  this.defaultName = 'New track';
  // this.currentPattern = null;
  this.isPlaying = false;
  this.patternIndex = 0;
  this.patternsLength = 0;
  this.patternTime = 0.0;
  this.patterns = [];
  this.name = name || this.defaultName + ' ' + this.counter++;
  return this;
}
Track.prototype.editName = function (newName) {
  this.name = newName;
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
      id: UUIDjs.create().hex
    });

    this.patterns.push(newPattern);
    this.patternsLength++;
    return newPattern;
  }
};

Track.prototype.advancePattern = function(first_argument) {
  this.patternIndex++;
  if (this.patternIndex === this.patternsLength) {
    this.patternIndex = 0;
  }

  var nextPattern = this.patterns[this.patternIndex];

  var nextPatternTime = timing.pattern(nextPattern.beat, nextPattern.noteValue);

  nextPattern.updateLinesTime(nextPatternTime);

  this.patternTime += nextPatternTime;
};



Track.prototype.play = function(currentTime, startTime) {
  if (this.patternTime <= currentTime + 0.200) {
    this.currentPattern = this.patterns[this.patternIndex];
    if (this.patternsLength > 1) {
      this.advancePattern();
    }
  }
  this.currentPattern.check(currentTime, startTime);
};

Track.prototype.deletePattern = function(patternId) {
  if (!this.isPlaying) {
    this.patterns.splice(patternId, 1);
    this.patternsLength--;
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
  this.patternTime = 0.0;
  this.patternIndex = 0;
  for (var patternIdx in this.patterns) {
    this.patterns[patternIdx].reset();
  }

};
