import { Component, input } from '@angular/core';
import { PlayerDisplayInfo } from '../../../game/models/player-display-info.model';
import { ColorCircle } from '../../../ui/color-circle/color-circle';

@Component({
  selector: 'app-player-scoreboard-item',
  imports: [ColorCircle],
  templateUrl: './player-scoreboard-item.html',
  styleUrl: './player-scoreboard-item.scss',
})
export class PlayerScoreboardItem {
  public place = input.required<number>();
  public playerDisplayItem = input.required<PlayerDisplayInfo>();
}
