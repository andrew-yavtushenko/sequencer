var Ticker = getTicker();

var tracks = [];
var currentTrack;

function changeNoteVolume(note) {
  if (note.volume === 0) {
    note.volume = 0.6;
  } else if (note.volume === 0.6) {
    note.volume = 1;
  } else {
    note.volume = 0;
  }
}


function createTrack (data) {
  var name = data[0];
  var newTrack = new Track(name);
  tracks.push(newTrack);
  var trackId = tracks.length - 1;
  currentTrack = tracks[trackId];
  return {
    name: newTrack.name,
    id: trackId
  };
}

function createPattern (data) {
  var beat = data[0];
  var noteValue = data[1];
  var newPattern = currentTrack.createPattern(beat, noteValue);
  if (newPattern) {
    return {
      id: newPattern.id,
      beat: newPattern.beat,
      noteValue: newPattern.noteValue,
      availableSubDivisions: newPattern.availableSubDivisions
    };
  } else {
    return false;
  }
  

}

function addLine (data) {
  var patternId = data[0];
  var bufferId = data[1];
  var subDivision = data[2];
  var currentPattern = currentTrack.getPattern(patternId);

  currentPattern.addLine(bufferId, subDivision);
  var lineId = currentPattern.lines.length - 1;
  var newLine = currentPattern.lines[lineId];

  return {
    id: lineId,
    patternId: patternId,
    notes: newLine.notes
  };
}

function updateNote (data) {
  var patternId = data[0];
  var lineId = data[1];
  var noteId = data[2];
  var currentPattern = currentTrack.getPattern(patternId);

  var currentLine = currentPattern.lines[lineId]
  currentLine.updateVolume(noteId);

  return currentPattern.lines[lineId].notes[noteId].volume;

}

function deletePattern (data) {
  var patternId = data[0];
  if (currentTrack.deletePattern(patternId)) {
    return {
      patternsLength: currentTrack.patterns.length
    };
  } else {
    return false;
  }
}

function playDispatcher (data) {
  // var trackId = data[0];
  // console.log(currentTrack);
  Ticker.play(currentTrack);
}

function stopDispatcher (data) {
  Ticker.stop(currentTrack);
}

function setTempo (newTempo) {
  tempo = newTempo;
  if (currentTrack && currentTrack.isPlaying) currentTrack.shiftNextPattern();
  return tempo;
}

function getPattern (data) {
  console.log(data);
  var patternId = data[0]
  return currentTrack.getPattern(patternId);
}

function getDispatcher () {

  onmessage = parseMessage;

  function parseMessage(message) {
    var fn;
    
    var actionName = message.data.splice(0, 1)[0];
    var messageId = message.data.splice(0, 1)[0];


    switch (actionName) {
      case "createTrack":
        fn = createTrack;
        break;
      case "createPattern":
        fn = createPattern;
        break;
      case "addLine":
        fn = addLine;
        break;
      case "updateNote":
        fn = updateNote;
        break;
      case "deletePattern":
        fn = deletePattern;
        break;
      case "play":
        fn = playDispatcher;
        break;
      case "stop":
        fn = stopDispatcher;
        break;
      case "tempo":
        fn = setTempo;
        break;
      case "init":
        fn = initWorker;
        break;
      case "getPattern":
        fn = getPattern;
        break;
      default:
        break;
    }


    var result = fn.call(null, message.data);

    postMessage([actionName, messageId, result]);
  }

}
