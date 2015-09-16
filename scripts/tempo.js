define('tempo', ['jquery', 'dispatcher'], function ($, dispatcher) {
  var tempo = 120;

  function updateTempo(message, newTempo) {
    tempo = newTempo;
    $('.tempo-wrapper span').html(tempo);
  }

  return {
    set: function (newTempo) {
      dispatcher.setTempo(newTempo, updateTempo);
    },
    get: function () {
      return tempo;
    }
  };
});