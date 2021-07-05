/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, height, width) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;        // active player: 1 or 2
    this.gameOver = false;
    console.log('done variable initialization');
    this.makeBoard();
    console.log('board made');
    this.makeHtmlBoard();
    console.log('dom work done');
  }

  //make in-memory board

  makeBoard = function() {
    this.board = [];            // array of rows, each row is array of cells  (board[y][x])
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  };
  
  // makeHtmlBoard

  makeHtmlBoard = function() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    board.innerHTML = '';
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${x}-${y}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  };
  
  // handleClick

  handleClick = (evt) => {

    if (this.gameOver === false) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
    
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
      
      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer} won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
        
      // switch players
      this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  } return;
  };

  // findSpotForCol: given column x, return top empty y (null if filled)

  findSpotForCol = (x) => {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  };

  // placeInTable: update DOM to reflect position of piece in table

  placeInTable = function(x, y) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  // endGame

  endGame = function(msg) {
    alert(msg);
  }

  // checkForWin

  checkForWin = () => {

    const _win = cells => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          this.gameOver = true;
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}


document.querySelector('#startGame').addEventListener('click', (event) => {
  event.preventDefault();
  const p1 = new Player(document.querySelector('#player-one').value);
  const p2 = new Player(document.querySelector('#player-two').value);
  new Game(p1, p2, 6 , 7);
});
