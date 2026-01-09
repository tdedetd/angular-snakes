import { Directions } from '../../enums/directions.enum';
import { PlayerConfig } from '../../models/player-config.model';
import { Player } from '../../models/player.model';
import { Point } from '../../models/point.model';
import { Snake } from '../../snake';

export function generatePlayers(players: PlayerConfig[], width: number, height: number): Player[] {
  return players.map((player, i) => {
    const y = i;

    if (y >= height) {
      throw new Error(`Y position is bigger than height of the field. Y - ${y}, height - ${height}`);
    }

    if (width < 3) {
      throw new Error(`width of the field is less than 3 (${width})`);
    }

    const parts: Point[] = [
      { x: 2, y },
      { x: 1, y },
      { x: 0, y },
    ];
    const snake = new Snake(parts, player.color, Directions.Right);

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
