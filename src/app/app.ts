import { Component, computed, effect, inject, Signal } from '@angular/core';
import { Canvas } from './components/canvas/canvas';
import { GameService } from './services/game.service';
import { Scoreboard } from './components/scoreboard/scoreboard';
import { PlayerDisplayInfo } from './game/models/player-display-info.model';
import { gameConfig } from './utils/constants/game-config';

@Component({
  selector: 'app-root',
  imports: [Canvas, Scoreboard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected playerDisplayItems: Signal<PlayerDisplayInfo[]>;

  constructor() {
    const gameService = inject(GameService);

    this.playerDisplayItems = computed(() => gameService.playersState());

    effect(() => {
      gameService.newGame(gameConfig);
    });
  }
}
