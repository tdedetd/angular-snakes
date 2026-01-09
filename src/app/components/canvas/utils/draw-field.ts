import { Game } from '../../../game/game';

const cellLength = 18;
const borderWidth = 1;
const doubleBorderWidth = borderWidth * 2;

export function drawField(
  game: Game,
  ctx: CanvasRenderingContext2D,
  canvasEl: HTMLCanvasElement
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
    ctx.fillRect(apple.x * cellLength, apple.y * cellLength, cellLength, cellLength)
  });
}
