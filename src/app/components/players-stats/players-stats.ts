import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayerDisplayInfo } from '../../game/models/player-display-info.model';
import { ColorCircle } from '../../ui/color-circle/color-circle';
import { DecimalPipe } from '@angular/common';

interface PlayersStatsItem {
  player: Pick<PlayerDisplayInfo, 'name' | 'color'>;
  placeSum: number;
  points: number;
  wins: number;
}

@Component({
  selector: 'app-players-stats',
  imports: [ColorCircle, DecimalPipe],
  templateUrl: './players-stats.html',
  styleUrl: './players-stats.scss',
})
export class PlayersStats {
  protected gamesCount = signal(0);

  protected playersStatsItemsSorted = computed(() => {
    return this.playersStatsItems().toSorted((a, b) => a.placeSum - b.placeSum);
  });

  private playersStatsItems = signal<PlayersStatsItem[]>([]);

  constructor() {
    const gameService = inject(GameService);

    effect(() => {
      const gamePlayerItems = gameService.gameoverSignal();

      if (gamePlayerItems) {
        const playersStatsItems = untracked(() => this.playersStatsItems());
        this.gamesCount.update((gamesCount) => gamesCount + 1);
        this.playersStatsItems.set(this.enrichStats(playersStatsItems, gamePlayerItems));
      }
    });
  }

  private enrichStats(
    playersStatsItems: PlayersStatsItem[],
    gamePlayerItems: PlayerDisplayInfo[],
  ): PlayersStatsItem[] {
    return gamePlayerItems
      .toSorted((a, b) => b.points - a.points)
      .map<PlayersStatsItem>((gamePlayerItem, index) => {
        const playerStatsItem = playersStatsItems.find(({ player }) => player.name === gamePlayerItem.name);
        const place = index + 1;
        const isWin = place === 1;

        return playerStatsItem
          ? {
            player: playerStatsItem.player,
            placeSum: playerStatsItem.placeSum + place,
            points: playerStatsItem.points + gamePlayerItem.points,
            wins: playerStatsItem.wins + Number(isWin),
          }
          : {
            player: {
              name: gamePlayerItem.name,
              color: gamePlayerItem.color,
            },
            placeSum: place,
            points: gamePlayerItem.points,
            wins: Number(isWin),
          };
      });
  }
}
