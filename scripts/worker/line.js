function Line (notes) {
  this.threshold = 0.200;
  this.loopLength = notes.length;
  this.notes = notes;
  this.noteTime = 0.0;
  this.rhythmIndex = 0;
  this.isPlaying = false;
}

Line.prototype.updateLoopLength = function (loopLength) {
  this.loopLength = loopLength;
};


Line.prototype.updateTime = function (time) {
  this.noteTime += time;
};

Line.prototype.setTime = function (time, source, id) {
  this.noteTime = time;
  // if (source) console.log('Line.prototype.setTime', source, this.noteTime, id);
  // if (source === 'shiftNextPattern') console.log(this.noteTime);
};

Line.prototype.play = function() {
  this.isPlaying = true;
};

Line.prototype.stop = function() {
  this.rhythmIndex = 0;
  this.isPlaying = false;
};

Line.prototype.advanceNote = function () {
  this.rhythmIndex++;

  if (this.rhythmIndex === this.loopLength) {
    this.stop();
  }
  var noteTime = timing.note(this.notes[this.rhythmIndex].value);
  this.updateTime(noteTime);
};

Line.prototype.check = function (currentTime, startTime, patternId, lineId) {
  if (this.isPlaying && this.noteTime <= currentTime + this.threshold) { //threshold
    // if (this.notes[this.rhythmIndex].volume) console.log('Line.prototype.check', this.noteTime, currentTime);
    play(this.notes[this.rhythmIndex].bufferIdx, 0.5, this.notes[this.rhythmIndex].volume, 1, 0, patternId, lineId, this.rhythmIndex);
    this.advanceNote();
  }
};
