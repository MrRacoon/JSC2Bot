const { createAgent, createEngine, createPlayer } = require('@node-sc2/core');
const { Difficulty, Race } = require('@node-sc2/core/constants/enums');

const workerRush = require('./workerRush');

function create() {
  const bot = createAgent();
  bot.use(workerRush);
  return bot;
}

function run(bot) {
  const engine = createEngine({
    launch: false,
  });

  return engine.connect()
    .then(() => engine.runGame('AcidPlantLE', [
      createPlayer({ race: Race.RANDOM }, bot),
      createPlayer({ race: Race.RANDOM, difficulty: Difficulty.MEDIUM }),
    ]));
}

module.exports = {
  create,
  run,
};
