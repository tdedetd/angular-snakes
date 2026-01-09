import { Directions } from '../../enums/directions.enum';
import { PlayerConfig } from '../../models/player-config.model';
import { Player } from '../../models/player.model';
import { Point } from '../../models/point.model';
import { Snake } from '../../snake';

interface SpawnOptions {
  row: number;
  width: number;
  height: number;
  snakeLength: number;
  playersOnSide: number;
  spawnVerticalInterval: number;
}

const spawnConfigBySide: Record<'left' | 'right', {
  direction: Directions,
  getParts: (options: SpawnOptions) => Point[],
}> = {
  left: {
    direction: Directions.Right,
    getParts: (options) => {
      const xCoords = Array(options.snakeLength)
        .fill(null)
        .map((_, i) => options.snakeLength - i - 1);

      const y = getY(options);
      return xCoords.map((x) => ({ x, y }));
    },
  },
  right: {
    direction: Directions.Left,
    getParts: (options) => {
      const xCoords = Array(options.snakeLength)
        .fill(null)
        .map((_, i) => options.width - options.snakeLength + i);

      const y = getY(options);
      return xCoords.map((x) => ({ x, y }));
    },
  },
};

export function generatePlayers(players: PlayerConfig[], width: number, height: number): Player[] {
  const snakeLength = 3;
  const playersOnSide = Math.ceil(players.length / 2);
  const spawnVerticalInterval = Math.floor(height / (playersOnSide - 1));

  return players.map((player, i) => {
    const side = i < playersOnSide ? 'left' : 'right';
    const spawnConfig = spawnConfigBySide[side];

    const snake = new Snake(
      spawnConfig.getParts({
        width,
        height,
        playersOnSide,
        spawnVerticalInterval,
        snakeLength,
        row: i % playersOnSide,
      }),
      player.color,
      spawnConfig.direction
    );

    return {
      id: genId(),
      name: player.name,
      points: 0,
      isOut: false,
      snake,
    };
  });
}

function genId(): string {
  return String(Math.random()).split('.')[1];
}

function getY({ row, height, playersOnSide, spawnVerticalInterval }: SpawnOptions): number {
  return row === playersOnSide - 1
    ? height - 1
    : spawnVerticalInterval * row;
}
