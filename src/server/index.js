const { createSystem } = require('@node-sc2/core');
const fs = require('fs');
const path = require('path');
const http = require('http');
const ducks = require('./socketDucks');
const express = require('express');
const WebSocket = require('ws');
const bmp = require('bmp-js');

// Constants
const PORT = 3000;

// Server Construction
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let id = 1;

module.exports = createSystem({
  onStep(world, loop) {
    return new Promise((resolve) => {
      const { agent, resources } = world;
      const { units, map, frame } = resources.get();

      // THIS IS NEXT RIGHT!?
      const size = map.getSize();

      // const featureLayer = frame.getFeatureLayer();
      // const x = featureLayer.renders.heightMap.size.x;
      // const y = featureLayer.renders.heightMap.size.y;
      // const data = bmp.decode(featureLayer.renders.heightMap.data);

      wss.clients.forEach((socket) => {
        socket.send(ducks.encode(ducks.setGameLoop(loop)));
        socket.send(ducks.encode(ducks.setBoard(size)))
        socket.send(ducks.encode(ducks.setGameAgent({
          race: agent.race,
          enemy: agent.enemy,
          playerId: agent.playerId,
          minerals: agent.minerals,
          vespene: agent.vespene,
          foodCap: agent.foodCap,
          foodUsed: agent.foodUsed,
          foodArmy: agent.foodArmy,
          foodWorkers: agent.foodWorkers,
          idleWorkerCount: agent.idleWorkerCount,
          armyCount: agent.armyCount,
          warpGateCount: agent.warpGateCount,
          larvaCount: agent.larvaCount,
          powerSources: agent.powerSources,
          camera: agent.camera,
          upgradeIds: agent.upgradeIds,
        })));
        socket.send(ducks.encode(ducks.setGameUnits(units.getAlive().map(unit => ({
          tag: unit.tag,
          alliance: unit.alliance,
          unitType: unit.unitType,
          owner: unit.owner,
          pos: unit.pos,
          radius: unit.radius,
          buildProgress: unit.buildProgress,
          detectRange: unit.detectRange,
          radarRange: unit.radarRange,
          health: unit.health,
          healthMax: unit.healthMax,
          shield: unit.shield,
          shieldMax: unit.shieldMax,
          energy: unit.energy,
          energyMax: unit.energyMax,
          isFlying: unit.isFlying,
          isBurrowed: unit.isBurrowed,
          cargoSpaceTaken: unit.cargoSpaceTaken,
          cargoSpaceMax: unit.cargoSpaceMax,
          buffIds: unit.buffIds,
          weaponCooldown: unit.weaponCooldown,
          engagedTargetTag: unit.engagedTargetTag,
        })))));
      });

      resolve();
    });
  },
  onGameStart() {
    const state = this.state;
    const setState = this.setState;
    return new Promise(
      (resolve) => {
        wss.on('connection', (socket) => {
          socket.id = id++;
          console.log(`Connected to socket: ${socket.id}`);

          socket.on('message', (m) => {
            try {
              const message = ducks.decode(m);
              console.log(`WS Message: ${message.type}`);
              switch(message.type) {
                default: {
                  console.log(`Unkown type: ${message.type}`);
                }
              }
            } catch (e) {
              console.error(`Could not parse message ${m}`);
            }
          });

          socket.on('close', (m) => {
            console.log(`Closing socket: ${socket.id}`);
          });

          socket.send(ducks.encode(ducks.setId(socket.id)));
        });

        app.use((req, res, next) => {
          console.log(`${req.method}: ${req.path}`);
          next();
        })

        app.get('/', (req, res, next) => {
          const payload = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
          res.send(payload);
          next();
        });

        app.get('/socketDucks.js', (req, res, next) => {
          const payload = fs.readFileSync(path.resolve(__dirname, 'socketDucks.js'), 'utf8');
          console.log('sending socket ducks file');
          res.send(payload);
          next();
        });

        process.on('SIGINT', () => {
          // if (socket) {
          //   console.log('Closing Socket');
          //   socket.close();
          // }
          process.exit();
        });

        server.listen(PORT, () => {
          console.log(`Server Started on port: ${PORT}`);
          resolve();
        });
      }
    );
  }
})
