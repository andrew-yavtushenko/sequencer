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

