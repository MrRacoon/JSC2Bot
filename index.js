// main.js
const { createAgent, createEngine, createPlayer } = require('@node-sc2/core');
const { Difficulty, Race } = require('@node-sc2/core/constants/enums');

const botSystem = require('./src');

const bot = createAgent();
bot.use(botSystem);

const engine = createEngine({
  launch: false,
});

engine.connect()
  .then(() => engine.runGame('AcidPlantLE', [
    createPlayer({ race: Race.RANDOM }, bot),
    createPlayer({ race: Race.RANDOM, difficulty: Difficulty.MEDIUM }),
  ]));
