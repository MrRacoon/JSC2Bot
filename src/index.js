const { createAgent, createEngine, createPlayer } = require('@node-sc2/core');
const { Difficulty, Race, PlayerType } = require('@node-sc2/core/constants/enums');

const workerRush = require('./workerRush');
const serverRecorder = require('./server');

function create() {
  const camera = {
    resolution: {
      x: 640,
      y: 480,
    },
  //   minimapResolution: {
  //     x: 128,
  //     y: 128,
  //   }
  };

  const bot = createAgent({
    settings: {
      race: Race.PROTOSS,
    },
    // interface: {
    //   raw: true,
    //   score: true, // optional, score data
    //   render: camera, // turns on the rendered interface
    //   featureLayer: camera, // turns on the feature layer interface
    // },
  });
  bot.use(workerRush);
  bot.use(serverRecorder);
  return bot;
}

function run(bot) {
  const engine = createEngine({
    launch: false,
  });

  return engine.connect()
    .then(() => engine.createGame('AcidPlantLE', [
      {
        type: PlayerType.PARTICIPANT,
        race: Race.PROTOSS,
      },
      {
        type: PlayerType.COMPUTER,
        race: Race.RANDOM,
        difficulty: Difficulty.MEDIUM,
      }
    ]))
    .then(() => engine.joinGame(bot))
    .then(([world, result]) => {
      console.log('FINISHED');
      console.log(result);
    });
}

module.exports = {
  create,
  run,
};
