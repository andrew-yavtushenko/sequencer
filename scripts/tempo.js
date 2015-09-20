define('tempo', ['jquery', 'dispatcher'], function ($, dispatcher) {
  var tempo = 120;

  function updateTempo(message, newTempo) {
    tempo = newTempo;
  }

  return {
    set: function (newTempo) {
      console.log(newTempo);
      dispatcher.setTempo(newTempo, updateTempo);
    },
    get: function () {
      return tempo;
    }
  };
});