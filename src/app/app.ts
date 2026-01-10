import { Component, effect, inject, signal } from '@angular/core';
import { Canvas } from './components/canvas/canvas';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  imports: [Canvas],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-snakes');

  constructor() {
    const gameService = inject(GameService);

    effect(() => {
      gameService.newGame({
        width: 40,
        height: 40,
        players: [
          { name: 'Player 1', color: '#d10b0b', notAi: false },
          { name: 'Player 2', color: '#2d1cea', notAi: false },
          { name: 'Player 3', color: '#f5ff87', notAi: false },
          { name: 'Player 4', color: '#8c0cdc', notAi: false },
          { name: 'Player 5', color: '#0d9e00', notAi: false },
          { name: 'Player 6', color: '#fade27', notAi: false },
          { name: 'Player 7', color: '#25dcc9', notAi: false },
          { name: 'Player 8', color: '#8a8a8a', notAi: false },
          { name: 'Player 9', color: '#ff8787', notAi: false },
          { name: 'Player 10', color: '#91ff7b', notAi: false },
        ],
        applesCount: 2,
      });
    });
  }
}
