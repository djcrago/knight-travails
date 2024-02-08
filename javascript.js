function makeBoard() {
  const chessBoard = [];

  for (let i = 0; i < 8; i += 1) {
    let row = [];
    for (let j = 0; j < 8; j += 1) {
      let square = { location: [j, i] };
      row.push(square);
    }
    chessBoard.push(row);
  }

  chessBoard.forEach((row) => {
    row.forEach((square) => {
      const x = square.location[0];
      const y = square.location[1];
      square['neighbors'] = [];
      for (let i = 0; i < 8; i += 1) {
        let neighborX;
        let neighborY;
        // Neighbor 0,1,2,etc. always have the same relative x,y coordinates
        if (i === 0 || i === 5) neighborX = x - 1;
        if (i === 1 || i === 4) neighborX = x + 1;
        if (i === 2 || i === 3) neighborX = x + 2;
        if (i === 6 || i === 7) neighborX = x - 2;
        if (i === 0 || i === 1) neighborY = y + 2;
        if (i === 2 || i === 7) neighborY = y + 1;
        if (i === 3 || i === 6) neighborY = y - 1;
        if (i === 4 || i === 5) neighborY = y - 2;

        if (
          neighborX >= 0 &&
          neighborX <= 7 &&
          neighborY >= 0 &&
          neighborY <= 7
        ) {
          const neightborVertex = findSquare(
            [neighborX, neighborY],
            chessBoard
          );
          square.neighbors.push(neightborVertex);
        }
      }
    });
  });

  return chessBoard;
}

function findSquare([x, y], chessBoard) {
  let currentSquare;
  chessBoard.forEach((row) => {
    row.forEach((square) => {
      if (square.location[0] === x && square.location[1] === y)
        currentSquare = square;
    });
  });
  return currentSquare;
}

function knightMoves(startLocation, endLocation) {
  const chessBoard = makeBoard();
  console.log(chessBoard);

  const start = findSquare(startLocation, chessBoard);
  const end = findSquare(endLocation, chessBoard);

  const path = findPathController(start, end);

  //   console.log(`You made it in ${path.length} moves! Here's your path:`);
  //   path.forEach((position) => {
  //     console.log(position.location);
  //   });

  return path;
}

function findPathController(start, end) {
  let possiblePaths = {};
  for (let i = 1; i <= 6; i += 1) {
    possiblePaths[`level${i}`] = [];
  }

  possiblePaths.level1 = start.neighbors;
  for (let j = 2; j <= 6; j += 1) {
    let previousLevel = possiblePaths[`level${j - 1}`];
    let currentLevel = possiblePaths[`level${j}`];
    previousLevel.forEach((previousLevelNeighbor) => {
      currentLevel.push(...previousLevelNeighbor.neighbors);
    });
  }

  console.log(possiblePaths);
}

const shortestPath = knightMoves([0, 0], [0, 5]);
