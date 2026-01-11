import { Component, computed, input } from '@angular/core';
import { PlayerDisplayInfo } from '../../game/models/player-display-info.model';
import { PlayerScoreboardItem } from './player-scoreboard-item/player-scoreboard-item';

@Component({
  selector: 'app-scoreboard',
  imports: [PlayerScoreboardItem],
  templateUrl: './scoreboard.html',
  styleUrl: './scoreboard.scss',
})
export class Scoreboard {
  public playerDisplayItems = input.required<PlayerDisplayInfo[]>();

  protected sortedPlayerDisplayItems = computed(() => {
    return this.playerDisplayItems().toSorted((a, b) => b.points - a.points);
  });
}
