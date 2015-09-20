function Line (notes) {
  this._threshold = 0.200;
  this.notes = notes;
  this._noteTime = 0.0;
  this._rhythmIndex = 0;
  this._isStoped = true;
}

Line.prototype.updateVolume = function(noteIdx) {
  function changeNoteVolume(volume) {
    if (volume === 0) {
      return 0.6;
    } else if (volume === 0.6) {
      return 1;
    } else {
      return 0;
    }
  }

  this.notes[noteIdx].volume = changeNoteVolume(this.notes[noteIdx].volume)
};

Line.prototype.reset = function() {
  this._noteTime = 0;
  this._rhythmIndex = 0;
};

Line.prototype.start = function() {
  this._noteTime = 0;
  this._isStoped = false;
};

Line.prototype.stop = function(num) {
  this._rhythmIndex = 0;
  this._isStoped = true;
};

Line.prototype._scheduleNextNote = function (tempo) {

  if (this._rhythmIndex === this.notes.length) this.stop();

  var noteTime = timing.note(this.notes[this._rhythmIndex].value, tempo);
  this._noteTime += noteTime;

  this._rhythmIndex++;
};

Line.prototype.check = function (currentTime, tempo, patternId, lineId) {
  if (this._noteTime <= currentTime + this._threshold) {
    console.log(tempo);
    var currentNoteIndex = this._rhythmIndex;
    this._scheduleNextNote(tempo);
    if (!this._isStoped) play(this.notes[currentNoteIndex].bufferIdx, this.notes[currentNoteIndex].volume, patternId, lineId, currentNoteIndex);
  }
  return this._isStoped;
};
