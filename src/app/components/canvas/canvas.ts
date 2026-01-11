import { Component, computed, DestroyRef, effect, ElementRef, inject, untracked, viewChild } from '@angular/core';
import { GameService } from '../../services/game.service';
import { IsBrowserToken } from '../../tokens/is-browser.token';
import { WINDOW } from '../../tokens/window.token';
import { debounceTime, fromEvent, startWith } from 'rxjs';
import { drawField } from './utils/draw-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RenderOptions } from './utils/render-options';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.scss',
})
export class Canvas {
  protected canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private renderOptions?: RenderOptions;
  private isBrowser = inject(IsBrowserToken);
  private gameService = inject(GameService);

  private canvasEl = computed(() => {
    const canvasRef = this.canvasRef();
    return this.isBrowser && canvasRef ? canvasRef.nativeElement : null;
  });

  private ctx = computed(() => {
    const canvasEl = this.canvasEl();
    return canvasEl ? canvasEl.getContext('2d') : null;
  });

  constructor() {
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

            this.updateRenderOptions(canvasEl.width, canvasEl.height);
            this.handleRedraw();
          })
        : null;

      cleanup(() => {
        subscription?.unsubscribe();
      });
    });

    effect(() => {
      this.gameService.getTickObservable().pipe(
        takeUntilDestroyed(destroyRef),
      ).subscribe(() => {
        this.handleRedraw();
      });
    });
  }

  private handleRedraw(): void {
    const game = untracked(() => this.gameService.game());
    const ctx = untracked(() => this.ctx());
    const canvasEl = untracked(() => this.canvasEl());
    const ais = this.gameService.ais;

    if (game && ctx && canvasEl && this.renderOptions) {
      drawField(canvasEl, ctx, this.renderOptions, game, ais);
    }
  }

  private updateRenderOptions(canvasWidth: number, canvasHeight: number): void {
    const game = untracked(() => this.gameService.game());

    if (game) {
      const horizontalCellLength = Math.floor(canvasWidth / game.width);
      const verticalCellLength = Math.floor(canvasHeight / game.height);

      const cellLength = Math.min(horizontalCellLength, verticalCellLength);

      this.renderOptions = new RenderOptions(
        game,
        cellLength,
        {
          x: (canvasWidth - cellLength * game.width) / 2,
          y: (canvasHeight - cellLength * game.height) / 2,
        },
      );
    }
  }
}
