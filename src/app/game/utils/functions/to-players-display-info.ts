import { PlayerDisplayInfo } from '../../models/player-display-info.model';
import { Player } from '../../models/player.model';

export function toPlayersDisplayInfo(players: Player[]): PlayerDisplayInfo[] {
  return players.map((player) => ({
    id: player.id,
    name: player.name,
    color: player.snake.color,
    isOut: player.isOut,
    points: player.points,
  }));
}
