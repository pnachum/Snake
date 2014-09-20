(function(root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {});
  var Settings = SnakeGame.Settings;
  var Snake = SnakeGame.Snake
  var Cell = SnakeGame.Cell; 

  var Game = SnakeGame.Game = function(ctx) {
    this.ctx = ctx;
    
    // Constants representing the number of rows and columns 
    this.WIDTH = Settings.game.WIDTH;
    this.HEIGHT = Settings.game.HEIGHT;
    
    // This is the block that the player can currently control. 
    this.snake = new Snake(this);
    this.food = this.placeFood();
    
    // The player's current score in the game. 
    this.score = 0;
    
    this.bindKeyHandlers();
    
    
  };
  
  Game.speed = Settings.game.speed;
  Game.DIM_X = 500;
  Game.DIM_Y = 500;
  Game.FOOD_COLOR = Settings.game.FOOD_COLOR;

  
  Game.prototype.start = function() {
    // Begin running the 'step' logic 30 times per second. 
    
    var that = this;
    var interval = Math.floor(1000/Game.speed);
    this.intervalID = window.setInterval(that.step.bind(that), interval);
  };
  
  Game.prototype.step = function() {
    this.move();
    this.draw();
  };
  
  Game.prototype.move = function() {
    this.snake.move();
  };
  
  Game.prototype.draw = function() {
    // Every frame, the canvas is cleared and both the block and grid are redrawn.
    
    this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.snake.draw(this.ctx);
    this.food.draw(this.ctx);
    
  };
  
  Game.prototype.stop = function(){
    clearInterval(this.intervalID);
  };
  
  Game.prototype.gameOver = function() {
    this.stop();
    alert("Game Over! Your score is " + this.score);
  };
  
  Game.prototype.bindKeyHandlers = function() {
    var game = this; 
    key("up", function() {
      game.snake.turn("N");
    });
    
    key("down", function() {
      game.snake.turn("S");
    });
    
    key("left", function() {
      game.snake.turn("W");
    });
    
    key("right", function() {
      game.snake.turn("E");
    });
    
		key("P", function(){
			game.togglePause();
		});
  };
  
	Game.prototype.togglePause = function(){
		if (this.paused){
      // Unpause
			this.start();
			this.paused = false; 
		} else {
      // Pause
			this.stop(); 
			this.paused = true; 
		}
	};
  
  Game.prototype.placeFood = function() {
    // Continually pick a random position for food until one is found that the 
    // snake does not contain.
    do {
      var randX = _.random(this.WIDTH - 1);
      var randY = _.random(this.HEIGHT - 1);
      var pos = [randX, randY]
    } while (this.snake.contains(pos))
    
    return new Cell(pos, Game.FOOD_COLOR);
  };
  
  
  Game.prototype.foodEaten = function() {
    // Place a new food, increment the score, and update it on the page.

    this.food = this.placeFood();
    this.score++; 
    $("#score").html(this.score);
  };
  
  Game.prototype.outOfBounds = function(pos) {
    var x = pos[0];
    var y = pos[1];
    return (x < 0) || (x >= this.WIDTH) || (y < 0) || (y >= this.HEIGHT);
  };
  
  
})(this);