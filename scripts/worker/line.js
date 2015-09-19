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

Line.prototype.stop = function(num) {
  // if (num) console.log(this.currentTime, this.noteTime);
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

Line.prototype.check = function (currentTime, patternId, lineId) {
  this.currentTime = currentTime;
  if (this.isPlaying && this.noteTime <= currentTime + this.threshold) {
    if (this.rhythmIndex === 0) console.log(currentTime, this.noteTime);
    play(this.notes[this.rhythmIndex].bufferIdx, this.notes[this.rhythmIndex].volume, patternId, lineId, this.rhythmIndex);
    this.advanceNote();
  }
};
