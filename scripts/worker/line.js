function Line (notes) {
  this.threshold = 0.200;
  this.loopLength = notes.length;
  this.notes = notes;
  this.noteTime = 0.0;
  this.rhythmIndex = 0;
}

Line.prototype.updateLoopLength = function (loopLength) {
  this.loopLength = loopLength;
};


Line.prototype.updateTime = function (time) {
  this.noteTime += time;
};

Line.prototype.setTime = function (time) {
  this.noteTime = time;
};

Line.prototype.advanceNote = function () {
  this.rhythmIndex++;

  if (this.rhythmIndex === this.loopLength) {
    this.rhythmIndex = 0;
  }
  var noteTime = timing.note(this.notes[this.rhythmIndex].value);
  this.updateTime(noteTime);
};

Line.prototype.check = function (currentTime, startTime, patternId, lineId) {
  if (this.noteTime <= currentTime + this.threshold) { //threshold
    var contextPlayTime = this.noteTime + startTime;

    play(this.notes[this.rhythmIndex].bufferIdx, 0.5, this.notes[this.rhythmIndex].volume, 1, 0, patternId, lineId, this.rhythmIndex);
    this.advanceNote();
  }
};
