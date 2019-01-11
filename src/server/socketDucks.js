;(function () {
  const e = {};

  e.encode = m => JSON.stringify(m);
  e.decode = m => JSON.parse(m);

  e.types = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    MESSAGE: 'MESSAGE',
    START: 'START',
    STOP: 'STOP',
    SET_ID: 'SET_ID',
    SET_GAME_LOOP: 'SET_GAME_LOOP',
  };

  e.open = () => ({
    type: e.types.OPEN,
  });

  e.close = () => ({
    type: e.types.CLOSE,
  });

  e.message = (payload) => ({
    type: e.types.MESSAGE,
    payload,
  });

  e.start = () => ({
    type: e.types.START,
  });

  e.stop = () => ({
    type: e.types.STOP,
  });

  e.setId = (id) => ({
    type: e.types.SET_ID,
    id,
  });

  e.setGameLoop = (loop) => ({
    type: e.types.SET_GAME_LOOP,
    loop,
  });

  if (typeof document !== 'undefined') {
    window.ducks = e;
  } else {
    module.exports = e;
  }
})();
