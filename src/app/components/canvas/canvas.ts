import { Component, computed, effect, ElementRef, inject, untracked, viewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { IsBrowserToken } from '../../tokens/is-browser.token';
import { Game } from '../../game/game';
import { WINDOW } from '../../tokens/window.token';
import { debounceTime, fromEvent, startWith } from 'rxjs';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas {
  protected canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private isBrowser = inject(IsBrowserToken);

  private canvasEl = computed(() => {
    const canvasRef = this.canvasRef();
    return this.isBrowser && canvasRef ? canvasRef.nativeElement : null;
  });

  private ctx = computed(() => {
    const canvasEl = this.canvasEl();
    return canvasEl ? canvasEl.getContext('2d') : null;
  });

  constructor() {
    const gameService = inject(GameService);
    const window = inject(WINDOW);

    const tickSignal = gameService.tick;
    const gameSignal = gameService.game;

    effect(() => {
      tickSignal();
      const game = gameSignal();
      const ctx = this.ctx();
      const canvasEl = untracked(() => this.canvasEl());

      if (game && ctx && canvasEl) {
        this.redraw(game, ctx, canvasEl);
      }
    });

    effect((cleanup) => {
      const canvasEl = this.canvasEl();
      const subscription = canvasEl
        ? fromEvent(window, 'resize')
          .pipe(debounceTime(500), startWith(null))
          .subscribe(() => {
            canvasEl.width = Math.floor(canvasEl.clientWidth);
            canvasEl.height = Math.floor(canvasEl.clientHeight);
          })
        : null;

      cleanup(() => {
        subscription?.unsubscribe();
      });
    });
  }

  private redraw(
    game: Game,
    ctx: CanvasRenderingContext2D,
    canvasEl: HTMLCanvasElement
  ): void {
    const cellLength = 20;

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeRect(-1, -1, game.width * cellLength + 2, game.height * cellLength + 2);

    game.remainingPlayers.forEach(({ snake }) => {
      ctx.fillStyle = snake.color;
      snake.parts.forEach(
        (part) => ctx.fillRect(part.x * cellLength, part.y * cellLength, cellLength, cellLength)
      );
    });

    ctx.fillStyle = '#87e47f';
    game.apples.forEach((apple) => {
      ctx.fillRect(apple.x * cellLength, apple.y * cellLength, cellLength, cellLength)
    });
  }
}
