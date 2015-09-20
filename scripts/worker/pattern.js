function buildLineNotes (pattern, bufferIdx, subDivision) {
  var arrLength = Math.ceil(pattern.beat * subDivision / pattern.noteValue);

  var arr = new Array(0);

  for (var i = 0; i < arrLength; i ++) {
    arr.push(i);
  }

  var notes = arr.map(function (num, key, array) {
    var correctNote;
    if (pattern.beat * subDivision % pattern.noteValue !== 0 &&
        ++key * subDivision > Math.floor(pattern.beat * subDivision / pattern.noteValue) * subDivision) {
      correctNote = pattern.availableSubDivisions.find(function (availableSubDivision) {
        if (availableSubDivision === subDivision * 2) return availableSubDivision;
      });
    } else {
      correctNote = subDivision;
    }
    return {
      value: correctNote,
      volume: 0,
      bufferIdx: bufferIdx
    };
  });
  return notes;
}

function Pattern (properties) {
  this.beat = properties.beat;
  this.noteValue = properties.noteValue;
  this.lines = [];
  this.currentSubDivision = properties.currentSubDivision;
  this.availableSubDivisions = properties.availableSubDivisions;
  this.id = properties.id;
  return this;
}

Pattern.prototype.check = function(currentTime) {
  var result;
  for (var i = 0, il = this.lines.length; i < il; i++) {
    result = this.lines[i].check(currentTime, this.id, i);
    if (i === 0) this.isStopped = result;
  }
  return this.isStopped;
};

Pattern.prototype.start = function() {
  if (this.isStopped) {
    this.isStopped = false;
    for (var i = 0, il = this.lines.length; i < il; i++) {
      this.lines[i].start();
    }
  }
};

Pattern.prototype.stop = function() {
  this.isStopped = true;
  for (var i = 0, il = this.lines.length; i < il; i++) {
    this.lines[i].stop();
  }
};

Pattern.prototype.reset = function() {
  for (var i = 0, il = this.lines.length; i < il; i++) {
    this.lines[i].reset();
  }
};

Pattern.prototype.addLine = function(bufferIdx, subDivision) {
  var notes = buildLineNotes(this, bufferIdx, subDivision);
  var newLine = new Line(notes);
  this.lines.push(newLine);
};
