import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  NgZone,
  ViewChild
} from '@angular/core';

import { Brick } from './shared/brick';
import { GameStates } from './shared/game-states';
import { LayoutSettings } from './shared/layout-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, DoCheck {
  @ViewChild('canvas', { static: false }) canvasElementRef: ElementRef<HTMLCanvasElement>;
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  gameStates: GameStates;
  layoutSettings: LayoutSettings;

  constructor(private ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this.canvas = this.canvasElementRef.nativeElement;
    this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.layoutSettings = new LayoutSettings();
    this.layoutSettings.ballRadius = 10;
    this.layoutSettings.paddleHeight = 10;
    this.layoutSettings.paddleWidth = 75;
    this.layoutSettings.brickRowCount = 7;
    this.layoutSettings.brickColumnCount = 3;
    this.layoutSettings.brickWidth = 51;
    this.layoutSettings.brickHeight = 15;
    this.layoutSettings.brickPadding = 10;
    this.layoutSettings.brickOffsetTop = 35;
    this.layoutSettings.brickOffsetLeft = 30;

    this.gameStates = new GameStates();
    this.gameStates.ballX = this.canvas.width / 2;
    this.gameStates.ballY = this.canvas.height - 30;
    this.gameStates.ballDX = 2;
    this.gameStates.ballDY = -2;
    this.gameStates.paddleX = (this.canvas.width - this.layoutSettings.paddleWidth) / 2;
    this.gameStates.rightPressed = false;
    this.gameStates.leftPressed = false;
    this.gameStates.score = 0;
    this.gameStates.lives = 3;
    this.gameStates.bricks = [];
    for (let c = 0; c < this.layoutSettings.brickColumnCount; c++) {
      this.gameStates.bricks[c] = [];
      for (let r = 0; r < this.layoutSettings.brickRowCount; r++) {
        this.gameStates.bricks[c][r] = { x: 0, y: 0, status: 1 } as Brick;
      }
    }

    // Disable change detection when we draw on the canvas
    this.ngZone.runOutsideAngular(() => this.draw());
  }


  counter = 0;
  ngDoCheck() {
    this.counter++;
    // console.log(this.counter);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.code == 'ArrowRight') {
      this.gameStates.rightPressed = true;
    }
    else if (event.code == 'ArrowLeft') {
      this.gameStates.leftPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.code == 'ArrowRight') {
      this.gameStates.rightPressed = false;
    }
    else if (event.code == 'ArrowLeft') {
      this.gameStates.leftPressed = false;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    let relativeX = event.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.gameStates.paddleX = relativeX - this.layoutSettings.paddleWidth / 2;
    }
  }

  collisionDetection() {
    for (let c = 0; c < this.layoutSettings.brickColumnCount; c++) {
      for (let r = 0; r < this.layoutSettings.brickRowCount; r++) {
        let b = this.gameStates.bricks[c][r];
        if (b.status == 1) {
          if (this.gameStates.ballX > b.x && this.gameStates.ballX < b.x + this.layoutSettings.brickWidth && this.gameStates.ballY > b.y && this.gameStates.ballY < b.y + this.layoutSettings.brickHeight) {
            this.gameStates.ballDY = -this.gameStates.ballDY;
            b.status = 0;
            this.gameStates.score++;
            if (this.gameStates.score == this.layoutSettings.brickRowCount * this.layoutSettings.brickColumnCount) {
              alert("YOU WIN, CONGRATS!");
              document.location.reload();
            }
          }
        }
      }
    }
  }

  drawBall() {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.gameStates.ballX, this.gameStates.ballY, this.layoutSettings.ballRadius, 0, Math.PI * 2);
    this.canvasContext.fillStyle = "#014f69";
    this.canvasContext.fill();
    this.canvasContext.closePath();
  }

  drawPaddle() {
    this.canvasContext.beginPath();
    this.canvasContext.rect(this.gameStates.paddleX, this.canvas.height - this.layoutSettings.paddleHeight, this.layoutSettings.paddleWidth, this.layoutSettings.paddleHeight);
    this.canvasContext.fillStyle = "#014f69";
    this.canvasContext.fill();
    this.canvasContext.closePath();
  }

  drawBricks() {
    for (let c = 0; c < this.layoutSettings.brickColumnCount; c++) {
      for (let r = 0; r < this.layoutSettings.brickRowCount; r++) {
        if (this.gameStates.bricks[c][r].status == 1) {
          let brickX = (r * (this.layoutSettings.brickWidth + this.layoutSettings.brickPadding)) + this.layoutSettings.brickOffsetLeft;
          let brickY = (c * (this.layoutSettings.brickHeight + this.layoutSettings.brickPadding)) + this.layoutSettings.brickOffsetTop;
          this.gameStates.bricks[c][r].x = brickX;
          this.gameStates.bricks[c][r].y = brickY;
          let gradientFill = this.canvasContext.createLinearGradient(brickX, brickY, brickX + this.layoutSettings.brickWidth, brickY + this.layoutSettings.brickHeight);
          gradientFill.addColorStop(0, "#8c0e06");
          gradientFill.addColorStop(1, "#e81305");
          this.canvasContext.beginPath();
          this.canvasContext.rect(brickX, brickY, this.layoutSettings.brickWidth, this.layoutSettings.brickHeight);
          this.canvasContext.fillStyle = gradientFill;
          this.canvasContext.strokeStyle = "#db7c00";
          this.canvasContext.lineWidth = 5;
          this.canvasContext.strokeRect(brickX, brickY, this.layoutSettings.brickWidth, this.layoutSettings.brickHeight);
          this.canvasContext.fill();
          this.canvasContext.closePath();
        }
      }
    }
  }

  drawScore() {
    this.canvasContext.font = "16px Arial";
    this.canvasContext.fillStyle = "#014f69";
    this.canvasContext.fillText("Score: " + this.gameStates.score, 8, 20);
  }

  drawLives() {
    this.canvasContext.font = "16px Arial";
    this.canvasContext.fillStyle = "#014f69";
    this.canvasContext.fillText("Lives: " + this.gameStates.lives, this.canvas.width - 65, 20);
  }

  draw() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.fillStyle = "#dedede";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.drawScore();
    this.drawLives();
    this.collisionDetection();

    if (this.gameStates.ballX + this.gameStates.ballDX > this.canvas.width - this.layoutSettings.ballRadius || this.gameStates.ballX + this.gameStates.ballDX < this.layoutSettings.ballRadius) {
      this.gameStates.ballDX = -this.gameStates.ballDX;
    }
    if (this.gameStates.ballY + this.gameStates.ballDY < this.layoutSettings.ballRadius) {
      this.gameStates.ballDY = -this.gameStates.ballDY;
    }
    else if (this.gameStates.ballY + this.gameStates.ballDY > this.canvas.height - this.layoutSettings.ballRadius) {
      if (this.gameStates.ballX > this.gameStates.paddleX && this.gameStates.ballX < this.gameStates.paddleX + this.layoutSettings.paddleWidth) {
        this.gameStates.ballDY = -this.gameStates.ballDY;
      }
      else {
        this.gameStates.lives--;
        if (!this.gameStates.lives) {
          alert("GAME OVER");
          document.location.reload();
        }
        else {
          this.gameStates.ballX = this.canvas.width / 2;
          this.gameStates.ballY = this.canvas.height - 30;
          this.gameStates.ballDX = 3;
          this.gameStates.ballDY = -3;
          this.gameStates.paddleX = (this.canvas.width - this.layoutSettings.paddleWidth) / 2;
        }
      }
    }

    if (this.gameStates.rightPressed && this.gameStates.paddleX < this.canvas.width - this.layoutSettings.paddleWidth) {
      this.gameStates.paddleX += 7;
    }
    else if (this.gameStates.leftPressed && this.gameStates.paddleX > 0) {
      this.gameStates.paddleX -= 7;
    }

    this.gameStates.ballX += this.gameStates.ballDX;
    this.gameStates.ballY += this.gameStates.ballDY;
    window.requestAnimationFrame(this.draw.bind(this));
  }

}
