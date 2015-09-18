function Track (name) {
  this.counter = 0;
  this.defaultName = 'New track';
  // this.currentPattern = null;
  this.isPlaying = false;
  this.patternIndex = 0;
  this.currentPatternDuration = 0;
  this.patternsLength = 0;
  this.patternTime = 0;
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

Track.prototype.shiftNextPattern = function() {
  if (this.patternsLength > 1) {
    var oldTimeLeftToPlay = this.patternTime - this.currentTime;
    console.log(this.patternTime - this.currentTime);
    var currentPatternIndex = this.patternIndex > 0 ? this.patternIndex - 1 : this.patternsLength - 1;

    var currentPattern = this.patterns[currentPatternIndex];
    var nextPattern = this.patterns[this.patternIndex];

    var newTime = timing.pattern(currentPattern.beat, currentPattern.noteValue);
    var newPatternTime = this.patternTime - this.currentPatternDuration + newTime;

    var newTimeLeftToPlay = (newTime - this.currentTime);

    console.log(oldTimeLeftToPlay, newTimeLeftToPlay);

    // console.log('shift', this.currentPatternDuration - newTime);
    // console.log('this.patternTime before shift', this.patternTime);
    // console.log('newPatternTime after shift', newPatternTime);

    this.patternTime = newPatternTime;
    this.currentPatternDuration = newTime;
    nextPattern.setTime(newPatternTime, 'shiftNextPattern', nextPattern.id);
  }
};

Track.prototype.advancePattern = function() {
  this.prevPattern.stop();
  // console.log(this.patternTime);
  this.currentPatternDuration = timing.pattern(this.currentPattern.beat, this.currentPattern.noteValue);

  this.patternIndex++;
  if (this.patternIndex === this.patternsLength) {
    this.patternIndex = 0;
  }

  var nextPattern = this.patterns[this.patternIndex];

  this.patternTime += this.currentPatternDuration;
  nextPattern.setTime(this.patternTime, 'advancePattern', nextPattern.id);
};



Track.prototype.play = function(currentTime, startTime) {
  this.currentTime = currentTime;
  if (this.patternTime <= currentTime + 0.200) {

    // console.log('freezeCheck', this.patternIndex, prevPatternIndex);
    // console.log('this.currentPattern.id', this.currentPattern.id);
    // console.log('this.patternTime play', this.patternTime)

    this.prevPatternIndex = this.patternIndex > 0 ? this.patternIndex - 1 : this.patternsLength - 1;

    this.prevPattern = this.patterns[this.prevPatternIndex];
    this.currentPattern = this.patterns[this.patternIndex];

    // console.log('patternTime', this.patternTime, currentTime);

    this.currentPattern.play();

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
