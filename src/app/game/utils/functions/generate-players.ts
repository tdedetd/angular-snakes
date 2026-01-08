import { Directions } from '../../enums/directions.enum';
import { PlayerConfig } from '../../models/player-config.model';
import { Player } from '../../models/player.model';
import { Snake } from '../../snake';

export function generatePlayers(players: PlayerConfig[]): Player[] {
  return players.map((player, i) => {
    const snake = new Snake(
      [[0, i], [1, i], [2, i]],
      player.color,
      Directions.Right
    );

    return {
      name: player.name,
      points: 0,
      isOut: false,
      snake,
    };
  });
}
