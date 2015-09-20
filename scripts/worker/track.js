if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

function Track (name) {
  this.counter = 0;
  this.defaultName = 'New track';
  this.isPlaying = false;
  this.patternIndex = 0;
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
