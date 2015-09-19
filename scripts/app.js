define('app', [
  'lodash.min',
  'jquery',
  'play-note',
  'tempo',
  'buffers',
  'dispatcher',
  'settings'
  ], function (
    _,
    $,
    play,
    tempo,
    buffers,
    dispatcher,
    settings
  ) {
  window.tempo = tempo;
  tempo.set(120);
  var isLocked = true;
  var isPlaying = false;
  var tracks = [];
  var currentTrack = null;
  var trackId;

  $("#meh button").on('click', function () {
    window.unlock('#meh');
  })

  window.showMeh = function () {
    $("#meh").show();
  }


  buffers.loadAll(function () {
    var loadedBuffers = buffers.get();
    _.each(loadedBuffers, function (buffer, bufferName) {
      $("select.audio").append("<option value='" + bufferName + "'>" + bufferName + "</option>");
    });
    isLocked = false;
    dispatcher.init(function (message, result) {
      $('.preloading').hide();
    });
    window.buffers = buffers;
    window.playnote = play;
    window.playnoteMeh = function (buffer, sendGain, volume) {
      playnote(buffer, sendGain, volume, 1, 0);
    };
  });

  function recalculatePatternListIndex () {
    $("#track-patterns > li").each(function(num, element) {
      $('.pattern-index', this).html(num+1);
    });
  }

  function changeNoteVolume(note) {
    if (note.volume === 0) {
      note.volume = 0.6;
    } else if (note.volume === 0.6) {
      note.volume = 1;
    } else {
      note.volume = 0;
    }
  }

  function startTrack (event) {
    if (!isPlaying) {
      dispatcher.play(trackId, function () {
        isPlaying = true;
        // console.profile('machine');
      });
    }
    event.preventDefault();
    event.stopPropagation();
  }

  function stopTrack (event) {
    if (isPlaying) {
      dispatcher.stop(trackId, function (){
        isPlaying = false;
        // console.profileEnd('machine');
      });
    }
    event.preventDefault();
    event.stopPropagation();
  }

  $('body').on('keyup', function(e){
    if (e.keyCode === 32 && isLocked === false) {
      isPlaying ? stopTrack(e) : startTrack(e);
    }
  });

  $(document).on('click', '.pattern-lines .notes li', function(event){
    var data = $(this).data();
    var that = this;

    var patternId = data.patternId;
    var lineId = data.lineId;
    var noteId = data.noteId;

    dispatcher.updateNote(patternId, lineId, noteId, function (message, noteVolume) {
      $(that).attr('data-note-volume', noteVolume);
    });

    event.preventDefault();
    event.stopPropagation();
  });

  $(document).on('click', '.delete-pattern', function (event) {
    var patternId = $(this).data('patternId');

    dispatcher.deletePattern(patternId, function (message, result) {
      if (result) {
        var patternDom = $('#track-patterns li[data-pattern-id=' + patternId + ']');
        patternDom.remove();
        recalculatePatternListIndex();
        if (result.patternsLength === 0) {
          $('.play-buttons').hide();
          $("#track-patterns").hide();
        }
      }
    });

    event.preventDefault();
    event.stopPropagation();
  });

  $(document).on('click', '#start', startTrack);
  $(document).on('click', '#stop', stopTrack);

  $("#tempo").on("change", function(){
    tempo.set(parseInt.call(this, this.value));
  });

  $("#new-track-form .btn").on('click', function (event) {
    var trackName = $("#new-track-form .track-name").val();
    // currentTrack = new Track($("#new-track-form .track-name").val());
    dispatcher.createTrack(trackName, function (message, track) {
      trackId = track.id;
      $("#current-track > h3").html(track.name);
      $("#current-track").show();
    });
    // tracks.push(currentTrack);
  });

  $("#new-pattern-form .create").on('click', function (event) {
    window.unlock();
    var newTrackBeat = parseInt.call(this, $("#new-pattern-form #beat").val());
    var newTrackNoteValue = parseInt.call(this, $("#new-pattern-form #noteValue").val());

    dispatcher.createPattern(newTrackBeat, newTrackNoteValue, function(message, newPattern) {
      if (!newPattern) return;
      var newPatternDom = $(".pattern-template > li").clone();

      $('.pattern-configuration', newPatternDom).html(newPattern.beat + "/" + newPattern.noteValue);
      $('.add-line', newPatternDom).attr('data-pattern-id', newPattern.id);
      newPatternDom.attr('data-pattern-id', newPattern.id);
      $('.delete-pattern', newPatternDom).attr('data-pattern-id', newPattern.id);

      for (var key in newPattern.availableSubDivisions) {

        var subDivisionVal = newPattern.availableSubDivisions[key];
        $('.subDivision', newPatternDom).append("<option value='" + subDivisionVal + "'>" + settings.subDivisionNames[subDivisionVal] + "</option>");
      }

      $("#track-patterns").append(newPatternDom);
      recalculatePatternListIndex();
      $("#track-patterns").css('display', 'block');
    });

    event.preventDefault();
    event.stopPropagation();
  });

  $("#track-patterns").on('click', 'li .add-line', function(event) {

    var patternId = $(this).data('patternId');
    var patternDom = $('#track-patterns li[data-pattern-id=' + patternId + ']');
    var newLineDom = $('.line-template .line').clone();
    var bufferId = $('.audio', patternDom).val();
    var subDivision = parseInt.call(this, $('.subDivision', patternDom).val());

    dispatcher.addLine(patternId, bufferId, subDivision, function (message, newLine) {

      // currentTrack.patterns[patternId].addLine(buffer, subDivision);

      for (var i = 0, il = newLine.notes.length; i < il; i++) {
        var noteDom = $('.note-template > li').clone();
        noteDom.attr('class', 'subdivision-' + newLine.notes[i].value);
        noteDom.attr('data-note-volume', newLine.notes[i].volume);
        noteDom.attr('data-note-id', i);
        noteDom.attr('data-line-id', newLine.id);
        noteDom.attr('data-pattern-id', newLine.patternId);
        $('.notes', newLineDom).append(noteDom);
      }

      $('.pattern-lines', patternDom).append(newLineDom);
      $('.play-buttons').show();
    });
    event.preventDefault();
    event.stopPropagation();
  });

  return {
    isLocked: isLocked
  };

});