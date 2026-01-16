import { Ai } from '../../../game/ai';
import { Game } from '../../../game/game';
import { Player } from '../../../game/models/player.model';
import { Point } from '../../../game/models/point.model';
import { toRgb } from '../../../utils/to-rgb';
import { RenderOptions } from './render-options';

const boundsBackground = '#eee';
const appleColor = '#b30000';
const aiPathDebug = false;

export function drawField(
  ctx: CanvasRenderingContext2D,
  renderOptions: RenderOptions,
  game: Game,
  ais: Ai[],
): void {
  drawBounds(ctx, renderOptions);
  drawSnakes(ctx, renderOptions, game.remainingPlayers);
  drawApples(ctx, renderOptions, game.apples);

  if (aiPathDebug) {
    drawAiPaths(ctx, renderOptions, ais);
  }
}

function drawBounds(
  ctx: CanvasRenderingContext2D,
  { startPoint, fieldWidthPx, fieldHeigthPx }: RenderOptions,
): void {
  ctx.fillStyle = boundsBackground;
  ctx.fillRect(
    startPoint.x,
    startPoint.y,
    fieldWidthPx,
    fieldHeigthPx
  );
}

function drawSnakes(
  ctx: CanvasRenderingContext2D,
  { cellLength, startPoint }: RenderOptions,
  players: Player[],
): void {
  players.forEach(({ snake }) => {
    ctx.fillStyle = snake.color;
    ctx.beginPath();
    snake.parts.forEach((part) => ctx.rect(
      startPoint.x + part.x * cellLength,
      startPoint.y + part.y * cellLength,
      cellLength,
      cellLength,
    ));
    ctx.fill();
  });
}

function drawApples(
  ctx: CanvasRenderingContext2D,
  { cellLength, halfCellLength, startPoint }: RenderOptions,
  apples: Point[],
): void {
  ctx.fillStyle = appleColor;
  apples.forEach((apple) => {
    ctx.beginPath();
    ctx.arc(
      startPoint.x + apple.x * cellLength + halfCellLength,
      startPoint.y + apple.y * cellLength + halfCellLength,
      halfCellLength,
      0,
      2 * Math.PI
    );
    ctx.fill();
  });
}

function drawAiPaths(
  ctx: CanvasRenderingContext2D,
  { cellLength, startPoint }: RenderOptions,
  ais: Ai[],
): void {
  ais.filter(({ isOut }) => !isOut).forEach((ai) => {
    const path = ai.getPath();
    if (path) {
      const rgb = toRgb(ai.color);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
      ctx.beginPath();
      path.forEach((point) => {
        ctx.rect(
          startPoint.x + point.x * cellLength,
          startPoint.y + point.y * cellLength,
          cellLength,
          cellLength,
        );
      });
      ctx.fill();
    }
  });
}
