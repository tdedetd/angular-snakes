import { Component, computed, effect, ElementRef, inject, untracked, viewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { IsBrowserToken } from '../../tokens/is-browser.token';
import { WINDOW } from '../../tokens/window.token';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { drawField } from './utils/draw-field';

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
        drawField(game, ctx, canvasEl);
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
}
