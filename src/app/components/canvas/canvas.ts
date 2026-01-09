import { Component, computed, DestroyRef, effect, ElementRef, inject, untracked, viewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { IsBrowserToken } from '../../tokens/is-browser.token';
import { WINDOW } from '../../tokens/window.token';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { drawField } from './utils/draw-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    const destroyRef = inject(DestroyRef);

    if (!this.isBrowser) {
      return;
    }

    effect((cleanup) => {
      const canvasEl = this.canvasEl();
      const subscription = canvasEl
        ? fromEvent(window, 'resize')
          .pipe(debounceTime(200), startWith(null))
          .subscribe(() => {
            canvasEl.width = Math.floor(canvasEl.clientWidth);
            canvasEl.height = Math.floor(canvasEl.clientHeight);
            this.handleRedraw(gameService);
          })
        : null;

      cleanup(() => {
        subscription?.unsubscribe();
      });
    });

    effect(() => {
      gameService.getTickObservable().pipe(
        takeUntilDestroyed(destroyRef),
      ).subscribe(() => {
        this.handleRedraw(gameService);
      });
    });
  }

  private handleRedraw(gameService: GameService): void {
    const game = untracked(() => gameService.game());
    const ctx = untracked(() => this.ctx());
    const canvasEl = untracked(() => this.canvasEl());
    const ais = gameService.ais;

    if (game && ctx && canvasEl) {
      drawField(game, ctx, canvasEl, ais);
    }
  }
}
