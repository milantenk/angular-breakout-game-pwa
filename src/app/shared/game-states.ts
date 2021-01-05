import { Brick } from './brick';

export class GameStates {
    score: number;
    lives: number;
    ballX: number;
    ballY: number;
    ballDX: number;
    ballDY: number;
    paddleX: number;
    rightPressed: boolean;
    leftPressed: boolean;
    bricks: Brick[][];
}
