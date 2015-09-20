var tracks = [];
var currentTrack;
var dispatherIsInitialized = false;

function initDispatcher () {

  if (dispatherIsInitialized) return;

  dispatherIsInitialized = true;

  onmessage = parseMessage;

  function parseMessage(message) {
    var fn;
    
    var actionName = message.data.shift(0, 1);
    var messageId = message.data.shift(0, 1);

    fn = wrapper[actionName];

    var result = fn.call(null, message.data);

    postMessage([actionName, messageId, result]);
  }

}
