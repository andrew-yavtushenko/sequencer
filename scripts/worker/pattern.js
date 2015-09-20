function Pattern (properties) {
  this.beat = properties.beat;
  this.noteValue = properties.noteValue;
  this.lines = [];
  this.currentSubDivision = properties.currentSubDivision;
  this.availableSubDivisions = properties.availableSubDivisions;
  this.id = properties.id;
  this.bpm = properties.bpm;
  this.customTempo = false;
  return this;
}

Pattern.prototype.releaseCustomTempo = function(tempo) {
  this.customTempo = false;
  this.bpm = tempo;
}

Pattern.prototype.setCustomTempo = function(tempo) {
  this.customTempo = true;
  this.bpm = tempo;
}

Pattern.prototype.setTempo = function(tempo) {
  var isSet = true;
  if (!this.customTempo) {
    this.bpm = tempo;
  } else {
    isSet = false;
  }
  return isSet;
};

Pattern.prototype.check = function(currentTime) {
  var result;
  for (var i = 0, il = this.lines.length; i < il; i++) {
    result = this.lines[i].check(currentTime, this.bpm, this.id, i);
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
