const NUM_OF_ROWS = 3;
const NUM_OF_COLS = 3;

let Gameboard = (function () {
  let board = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
  isValidCoordinates = (x, y) => {
    return ((x >= 0) && (x < NUM_OF_ROWS) && (y >= 0) && (y < NUM_OF_COLS));
  };

  setPiece = (x, y, piece) => {
    if (!isValidCoordinates(x, y)) {
      return false;
    }
    board[y][x] = piece;
    return true;
  };
  getPiece = (x, y) => {
    if (!isValidCoordinates(x, y)) {
      return "";
    }
    return board[y][x];
  }
  return {setPiece, getPiece};
})();

function refreshView() {
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

