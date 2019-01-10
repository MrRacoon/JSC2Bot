const { createSystem } = require('@node-sc2/core');

// {
//         onStep?: (world: World, gameLoop?: number) => Promise<any>;
//         onGameStart?: (world: World) => Promise<any>;
//         onUnitIdle?: (world: World, data: Unit) => Promise<any>;
//         onUnitDamaged?:(world: World, data: Unit) => Promise<any>;
//         onUnitCreated?: (world: World, data: Unit) => Promise<any>;
//         onUnitFinished?: (world: World, data: Unit) => Promise<any>;
//         onEnemyFirstSeen?: (world: World, data: Unit) => Promise<any>;
//         onUnitDestroyed?: (world: World, data: Unit) => Promise<any>;
// }

module.exports = createSystem({
  onGameStart({ resources }) {
    const { units, actions, map } = resources.get();
    const workers = units.getWorkers();
    return actions.attackMove(workers, map.getEnemyMain().townhallPosition);
  }
});
