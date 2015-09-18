var tempo = 120;

function getNow () {
  return Date.now()|0;
}

var timing = {
  startTime: getNow(),
  pattern: function (beat, noteValue) {
    return (beat / noteValue * this.note(1))|0;
  },
  note: function (noteValue) {
    return (60 / tempo * 4000 / noteValue)|0;
  },
  current: function (){
    return getNow() - this.startTime;
  },
};
