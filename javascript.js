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

  const start = findSquare(startLocation, chessBoard);
  const end = findSquare(endLocation, chessBoard);

  if (!start || !end)
    return console.log('Must have valid start and valid end locations');

  const possiblePaths = findPossiblePaths(start);

  let pathInOrder;

  for (let i = 1; i <= 6; i += 1) {
    let currentLevel = possiblePaths[`level${i}`];
    currentLevel.forEach((square) => {
      if (square.location === end.location) {
        let pathInReverse = [];
        let currentSquare = square;

        pathInReverse.push(currentSquare);

        while (currentSquare.previous) {
          pathInReverse.push(currentSquare.previous);
          currentSquare = currentSquare.previous;
        }

        if (pathInReverse.length === 0) {
          pathInReverse.push(currentSquare);
        }
        pathInReverse.push(start);

        pathInOrder = [];

        for (let j = pathInReverse.length; j > 0; j -= 1) {
          pathInOrder.push(pathInReverse[j - 1]);
        }
      }
    });
  }

  console.log(
    `You made it in ${pathInOrder.length - 1} moves! Here's your path:`
  );
  pathInOrder.forEach((square) => {
    console.log(square.location);
  });

  return pathInOrder;
}

function findPossiblePaths(start) {
  let possiblePaths = {};

  // A knight can reach any other square it at-most six moves
  for (let i = 1; i <= 6; i += 1) {
    possiblePaths[`level${i}`] = [];
  }

  possiblePaths.level1 = start.neighbors;
  for (let j = 2; j <= 6; j += 1) {
    let currentLevel = possiblePaths[`level${j}`];
    let previousLevel = possiblePaths[`level${j - 1}`];
    let ancestorLevel = possiblePaths[`level${j - 2}`];

    if (ancestorLevel) {
      previousLevel.forEach((previousSquare) => {
        previousSquare.neighbors.forEach((neighbor) => {
          let repeat = false;
          ancestorLevel.forEach((ancestorSquare) => {
            if (neighbor.location === ancestorSquare.location) {
              repeat = true;
            }
          });
          if (!repeat) {
            neighbor.previous = previousSquare;
            currentLevel.push(neighbor);
          }
        });
      });
    } else {
      previousLevel.forEach((previousSquare) => {
        previousSquare.neighbors.forEach((neighbor) => {
          neighbor.previous = previousSquare;
          currentLevel.push(neighbor);
        });
      });
    }
  }

  return possiblePaths;
}

const shortestPath = knightMoves([0, 0], [5, 5]);
