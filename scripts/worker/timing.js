var tempo = 120;

function getNow () {
  return Date.now();
}

var timing = {
  startTime: getNow(),
  pattern: function (beat, noteValue) {
    return beat / noteValue * this.note(1);
  },
  note: function (noteValue) {
    return 60 / tempo * 4000 / noteValue;
  },
  current: function (){
    return getNow() - this.startTime;
  },
};
