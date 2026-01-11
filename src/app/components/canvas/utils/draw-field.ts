import { Ai } from '../../../game/ai';
import { Game } from '../../../game/game';
import { Player } from '../../../game/models/player.model';
import { Point } from '../../../game/models/point.model';
import { toRgb } from '../../../utils/to-rgb';

const cellLength = 18;
const halfCellLength = cellLength / 2;

const borderWidth = 1;
const doubleBorderWidth = borderWidth * 2;
const aiPathDebug = false;

export function drawField(
  game: Game,
  ctx: CanvasRenderingContext2D,
  canvasEl: HTMLCanvasElement,
  ais: Ai[],
): void {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  drawBounds(ctx, game);
  drawSnakes(ctx, game.remainingPlayers);
  drawApples(ctx, game.apples);

  if (aiPathDebug) {
    drawAiPaths(ctx, ais);
  }
}

function drawBounds(ctx: CanvasRenderingContext2D, game: Game): void {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(
    -borderWidth,
    -borderWidth,
    game.width * cellLength + doubleBorderWidth,
    game.height * cellLength + doubleBorderWidth
  );
}

function drawSnakes(ctx: CanvasRenderingContext2D, players: Player[]): void {
  players.forEach(({ snake }) => {
    ctx.fillStyle = snake.color;
    ctx.beginPath();
    snake.parts.forEach(
      (part) => ctx.rect(part.x * cellLength, part.y * cellLength, cellLength, cellLength)
    );
    ctx.fill();
  });
}

function drawApples(ctx: CanvasRenderingContext2D, apples: Point[]): void {
  ctx.fillStyle = '#87e47f';
  ctx.beginPath();
  apples.forEach((apple) => {
    ctx.arc(
      apple.x * cellLength + halfCellLength,
      apple.y * cellLength + halfCellLength,
      cellLength / 2,
      0,
      2 * Math.PI
    );
  });
  ctx.fill();
}

function drawAiPaths(ctx: CanvasRenderingContext2D, ais: Ai[]): void {
  ais.filter(({ isOut }) => !isOut).forEach((ai) => {
    const path = ai.getPath();
    if (path) {
      const rgb = toRgb(ai.color);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
      ctx.beginPath();
      path.forEach((point) => {
        ctx.rect(point.x * cellLength, point.y * cellLength, cellLength, cellLength);
      });
      ctx.fill();
    }
  });
}
