import { Ai } from '../../../game/ai';
import { Game } from '../../../game/game';
import { toRgb } from '../../../utils/to-rgb';

const cellLength = 18;
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
  ctx.strokeStyle = 'white';
  ctx.lineWidth = borderWidth;
  ctx.strokeRect(
    -borderWidth,
    -borderWidth,
    game.width * cellLength + doubleBorderWidth,
    game.height * cellLength + doubleBorderWidth
  );

  game.remainingPlayers.forEach(({ snake }) => {
    ctx.fillStyle = snake.color;
    snake.parts.forEach(
      (part) => ctx.fillRect(part.x * cellLength, part.y * cellLength, cellLength, cellLength)
    );
  });

  ctx.fillStyle = '#87e47f';
  game.apples.forEach((apple) => {
    ctx.fillRect(apple.x * cellLength, apple.y * cellLength, cellLength, cellLength);
  });

  if (aiPathDebug) {
    ais.filter(({ isOut }) => !isOut).forEach((ai) => {
      const path = ai.getPath();
      if (path) {
        const rgb = toRgb(ai.color);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
        path.forEach((point) => {
          ctx.fillRect(point.x * cellLength, point.y * cellLength, cellLength, cellLength);
        });
      }
    });
  }
}
