import { GameConfig } from '../../game/models/game-config.model';

export const gameConfig: GameConfig = {
  width: 40,
  height: 40,
  players: [
    { name: 'Player 1', color: '#d10b0b', notAi: false },
    { name: 'Player 2', color: '#2d1cea', notAi: false },
    { name: 'Player 3', color: '#77a600', notAi: false },
    { name: 'Player 4', color: '#8c0cdc', notAi: false },
    { name: 'Player 5', color: '#0d9e00', notAi: false },
    { name: 'Player 6', color: '#caaf00', notAi: false },
    { name: 'Player 7', color: '#1cb5a6', notAi: false },
    { name: 'Player 8', color: '#8a8a8a', notAi: false },
    { name: 'Player 9', color: '#ff8787', notAi: false },
    { name: 'Player 10', color: '#147a00', notAi: false },
  ],
  applesCount: 2,
};
