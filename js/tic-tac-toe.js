const NUM_OF_ROWS = 3;
const NUM_OF_COLS = 3;

let Gameboard = (function () {
  let board = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
  let numFreeSpaces = NUM_OF_ROWS * NUM_OF_COLS;

  isValidCoordinates = (x, y) => {
    return ((x >= 0) && (x < NUM_OF_ROWS) && (y >= 0) && (y < NUM_OF_COLS));
  };

  setPiece = (x, y, piece) => {
    if (!isValidCoordinates(x, y) || (board[y][x] !== " ")) {
      return false;
    }
    board[y][x] = piece;
    numFreeSpaces--;
    return true;
  };

  getPiece = (x, y) => {
    if (!isValidCoordinates(x, y)) {
      return "";
    }
    return board[y][x];
  };

  getNumFreeSpaces = () => {
    return numFreeSpaces;
  };

  let countConsecutiveMatchesRow = (y, piece) => {
    if (y >= NUM_OF_ROWS) {
      return 0;
    }
    let numMatches = 0;
    for (let x = 0; x < NUM_OF_COLS; x++) {
      if (board[y][x] !== piece) {
        break;
      }
      numMatches++;
    }
    return numMatches;
  };

  let countConsecutiveMatchesCol = (x, piece) => {
    if (x >= NUM_OF_COLS) {
      return 0;
    }
    let numMatches = 0;
    for (let y = 0; y < NUM_OF_ROWS; y++) {
      if (board[y][x] !== piece) {
        break;
      }
      numMatches++;
    }
    return numMatches;
  };

  return {setPiece, getPiece, getNumFreeSpaces, countConsecutiveMatchesRow, countConsecutiveMatchesCol};
})();

function Player(name, piece) {
  let getName = () => {
    return name;
  };

  let getPiece = () => {
    return piece;
  };

  return {getName, getPiece};
}

const Players = (function () {
  let playerIndex = -1;
  let players = [];

  let addPlayer = (player) => {
    players.push(player);
  };

  let currentPlayer = () => {
    if (playerIndex === -1) {
      if (players.length === 0) {
        return null;
      } else {
        playerIndex = 0;
      }
    }
    return players[playerIndex];
  };

  let nextPlayer = () => {
    let numOfPlayers = players.length;
    if (numOfPlayers === 0) {
      return null;
    }
    playerIndex = (playerIndex + 1) % numOfPlayers;
    return players[playerIndex];
  };

  return {addPlayer, currentPlayer, nextPlayer};
})();

const GameState = (function () {
  const IN_PROGRESS = 0;
  const DRAW = 1;
  const WIN = 2;
  let winner = null;
  let state = IN_PROGRESS;

  function checkForWin() {
    let player = Players.currentPlayer();
    for (let i = 0; i < NUM_OF_ROWS; i++) {
      if (Gameboard.countConsecutiveMatchesRow(i, player.getPiece()) >= 3) {
        winner = player;
        return true;
      }
    }

    for (let i = 0; i < NUM_OF_COLS; i++) {
      if (Gameboard.countConsecutiveMatchesCol(i, player.getPiece()) >= 3) {
        winner = player;
        return true;
      }
    }
    return false;
  }

  let check = () => {
    if (checkForWin()) {
      state = WIN;
    } else if (Gameboard.getNumFreeSpaces() === 0) {
      state = DRAW;
    }
    return state;
  };

  let getWinner = () => {
    return winner;
  };

  return {IN_PROGRESS, DRAW, WIN, check, getWinner};
})();

const GameController = (function () {
  playRound = (x, y) => {
    let turnPlayer = Players.currentPlayer();
    if (Gameboard.setPiece(x, y, turnPlayer.getPiece())) {
      if (GameState.check() === GameState.IN_PROGRESS) {
        Players.nextPlayer();
      }
      refreshView();
    } else {
      console.warn(`Invalid move: ${x}, ${y}`);
    }
  };
  return {playRound};
})();

function refreshView() {
  let gameState = GameState.check();

  if (gameState === GameState.IN_PROGRESS) {
    console.log(`\n\n${Players.currentPlayer().getName()}'s turn\n`);
  } else if (gameState === GameState.DRAW) {
    console.log("Draw!");
  } else if (gameState === GameState.WIN) {
    console.log(`${GameState.getWinner().getName()} won!`);
  }

  for (let i = 0; i < NUM_OF_COLS; i++) {
    let row = "";
    for (let j = 0; j < NUM_OF_ROWS; j++) {
      row += `|${Gameboard.getPiece(j, i)}`;
    }
    row += "|";
    console.log(row);
  }
  console.log("-------");
}

