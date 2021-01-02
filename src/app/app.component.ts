import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, DoCheck {
  @ViewChild('canvas', {static: false}) canvas: ElementRef<HTMLCanvasElement>;
  canvasContext: CanvasRenderingContext2D;

  ballRadius: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  paddleHeight: number;
  paddleWidth: number;
  paddleX: number;
  rightPressed: boolean;
  leftPressed: boolean;
  brickRowCount: number;
  brickColumnCount: number;
  brickWidth: number;
  brickHeight: number;
  brickPadding: number;
  brickOffsetTop: number;
  brickOffsetLeft: number;
  score: number;
  lives: number;

  bricks = [];

  constructor(private ngZone: NgZone) {
  }

  ngAfterViewInit() {
    this.canvasContext = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.ballRadius = 10;
    this.x = this.canvas.nativeElement.width / 2;
    this.y = this.canvas.nativeElement.height - 30;
    this.dx = 2;
    this.dy = -2;
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.paddleX = (this.canvas.nativeElement.width - this.paddleWidth) / 2;
    this.rightPressed = false;
    this.leftPressed = false;
    this.brickRowCount = 5;
    this.brickColumnCount = 3;
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;
    this.score = 0;
    this.lives = 3;

    // TODO: use array functions instead of nested for loops
    for (var c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (var r = 0; r < this.brickRowCount; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    this.ngZone.runOutsideAngular(() => this.draw());
  }


  counter=0;
  ngDoCheck() {
    this.counter++;
    console.log(this.counter);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode == 39) {
      this.rightPressed = true;
    }
    else if (event.keyCode == 37) {
      this.leftPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.keyCode == 39) {
      this.rightPressed = false;
    }
    else if (event.keyCode == 37) {
      this.leftPressed = false;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    let relativeX = event.clientX - this.canvas.nativeElement.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.nativeElement.width) {
      this.paddleX = relativeX - this.paddleWidth / 2;
    }
  }

  collisionDetection() {
    for (var c = 0; c < this.brickColumnCount; c++) {
      for (var r = 0; r < this.brickRowCount; r++) {
        var b = this.bricks[c][r];
        if (b.status == 1) {
          if (this.x > b.x && this.x < b.x + this.brickWidth && this.y > b.y && this.y < b.y + this.brickHeight) {
            this.dy = -this.dy;
            b.status = 0;
            this.score++;
            if (this.score == this.brickRowCount * this.brickColumnCount) {
              alert("YOU WIN, CONGRATS!");
              document.location.reload(); // TODO: remove
            }
          }
        }
      }
    }
  }

  drawBall() {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    this.canvasContext.fillStyle = "#0095DD";
    this.canvasContext.fill();
    this.canvasContext.closePath();
  }

  drawPaddle() {
    this.canvasContext.beginPath();
    this.canvasContext.rect(this.paddleX, this.canvas.nativeElement.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    this.canvasContext.fillStyle = "#0095DD";
    this.canvasContext.fill();
    this.canvasContext.closePath();
  }

  drawBricks() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        if (this.bricks[c][r].status == 1) {
          let brickX = (r * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
          let brickY = (c * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.canvasContext.beginPath();
          this.canvasContext.rect(brickX, brickY, this.brickWidth, this.brickHeight);
          this.canvasContext.fillStyle = "#0095DD";
          this.canvasContext.fill();
          this.canvasContext.closePath();
        }
      }
    }
  }

  drawScore() {
    this.canvasContext.font = "16px Arial";
    this.canvasContext.fillStyle = "#0095DD";
    this.canvasContext.fillText("Score: " + this.score, 8, 20);
  }

  drawLives() {
    this.canvasContext.font = "16px Arial";
    this.canvasContext.fillStyle = "#0095DD";
    this.canvasContext.fillText("Lives: " + this.lives, this.canvas.nativeElement.width - 65, 20);
  }

  draw() {
    this.canvasContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.drawScore();
    this.drawLives();
    this.collisionDetection();

    if (this.x + this.dx > this.canvas.nativeElement.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
      this.dx = -this.dx;
    }
    if (this.y + this.dy < this.ballRadius) {
      this.dy = -this.dy;
    }
    else if (this.y + this.dy > this.canvas.nativeElement.height - this.ballRadius) {
      if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
        this.dy = -this.dy;
      }
      else {
        this.lives--;
        if (!this.lives) {
          alert("GAME OVER");
          document.location.reload();
        }
        else {
          this.x = this.canvas.nativeElement.width / 2;
          this.y = this.canvas.nativeElement.height - 30;
          this.dx = 3;
          this.dy = -3;
          this.paddleX = (this.canvas.nativeElement.width - this.paddleWidth) / 2;
        }
      }
    }

    if (this.rightPressed && this.paddleX < this.canvas.nativeElement.width - this.paddleWidth) {
      this.paddleX += 7;
    }
    else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }

    this.x += this.dx;
    this.y += this.dy;
    window.requestAnimationFrame(this.draw.bind(this));
  }

}
