define('blink', ['jquery'], function ($) {
  // body...
  return function blink (patternId, lineId, noteId, volume) {
    if (volume !== 0) {
      var note = $('.notes li[data-pattern-id="'+patternId+'"][data-line-id="'+lineId+'"][data-note-id="'+noteId+'"]');
      note.attr('data-is-on', 'true');
      setTimeout(function () {
        note.attr('data-is-on', 'false');
      }, 50);
    }
  };
});