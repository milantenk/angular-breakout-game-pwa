import { Brick } from "./brick";

export class LayoutSettings {
    ballRadius: number;
    paddleHeight: number;
    paddleWidth: number;
    brickRowCount: number;
    brickColumnCount: number;
    brickWidth: number;
    brickHeight: number;
    brickPadding: number;
    brickOffsetTop: number;
    brickOffsetLeft: number;
    bricks: Brick[][];
}