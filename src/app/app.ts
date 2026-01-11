import { Component, effect, inject, Signal } from '@angular/core';
import { Canvas } from './components/canvas/canvas';
import { GameService } from './services/game.service';
import { Scoreboard } from './components/scoreboard/scoreboard';
import { PlayerDisplayInfo } from './game/models/player-display-info.model';
import { playConfig } from './utils/constants/play-config';
import { PlayersStats } from './components/players-stats/players-stats';

@Component({
  selector: 'app-root',
  imports: [Canvas, Scoreboard, PlayersStats],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected playerDisplayItems: Signal<PlayerDisplayInfo[]>;
  protected gameResults: Signal<PlayerDisplayInfo[] | undefined>;

  constructor() {
    const gameService = inject(GameService);

    this.playerDisplayItems = gameService.playersState;
    this.gameResults = gameService.gameoverSignal;

    effect(() => {
      gameService.newGame({
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
        ].slice(0, playConfig.playersCount),
        applesCount: playConfig.applesCount,
      }, playConfig.autoRestart);
    });
  }
}
