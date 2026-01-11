import { Ai } from '../../../game/ai';
import { Game } from '../../../game/game';
import { Player } from '../../../game/models/player.model';
import { Point } from '../../../game/models/point.model';
import { toRgb } from '../../../utils/to-rgb';
import { RenderOptions } from './render-options';

const borderWidth = 1;
const doubleBorderWidth = borderWidth * 2;
const aiPathDebug = false;

export function drawField(
  canvasEl: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  renderOptions: RenderOptions,
  game: Game,
  ais: Ai[],
): void {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  drawBounds(ctx, renderOptions, game);
  drawSnakes(ctx, renderOptions, game.remainingPlayers);
  drawApples(ctx, renderOptions, game.apples);

  if (aiPathDebug) {
    drawAiPaths(ctx, renderOptions, ais);
  }
}

function drawBounds(
  ctx: CanvasRenderingContext2D,
  { cellLength, startPoint }: RenderOptions,
  game: Game,
): void {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(
    startPoint.x - borderWidth,
    startPoint.y - borderWidth,
    game.width * cellLength + doubleBorderWidth,
    game.height * cellLength + doubleBorderWidth
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
  ctx.fillStyle = '#87e47f';
  ctx.beginPath();
  apples.forEach((apple) => {
    ctx.arc(
      startPoint.x + apple.x * cellLength + halfCellLength,
      startPoint.y + apple.y * cellLength + halfCellLength,
      halfCellLength,
      0,
      2 * Math.PI
    );
  });
  ctx.fill();
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
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
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
