var boardSize = 3;
var maxDepth = 8;
var diagonals;
var emptyMoves;
var canvasSize = 360;
var playerSym = "O";
var currentPlayer;
var gameOver = false;
var bestMove;

function createArray(row, col, value) {
  var myArray = new Array(row);
  for (i = 0; i < col; i++) {
    myArray[i] = new Array(col);
    myArray[i].fill(value);
  }
  return myArray;
}

function getEmptyMoves(map) {
  emptyMoves = 0;
  for (var row = 0; row < boardSize; row++) {
    for (var col = 0; col < boardSize; col++) {
      if (map[row][col] == -1) {
        emptyMoves += 1;
      }
    }
  }
}

function getDiagonalIndices(size) {
  var diagonal1 = [];
  var diagonal2 = [];
  for (var i = 0; i < size * size; i += size + 1) {
    diagonal1.push(i);
  }
  for (var i = size - 1; i < size * size - 1; i += size - 1) {
    diagonal2.push(i);
  }
  return [diagonal1, diagonal2];
}

function checkWin(map1) {
  var countRows = createArray(2, boardSize, 0);
  var countCols = createArray(2, boardSize, 0);
  var countDiags = createArray(2, 2, 0);
  for (var row = 0; row < boardSize; row++) {
    for (var col = 0; col < boardSize; col++) {
      n = map1[row][col]; //get value of occupied cell
      if (n != -1) //if cell is occupied with 0 or 1, continue
      {
        //check horizontal wins
        countRows[n][row] += 1;
        if (countRows[n][row] == boardSize) {
          return [n - 0.5, 'row', row];
        }
        // check vertical wins
        countCols[n][col] += 1;
        if (countCols[n][col] == boardSize) {
          return [n - 0.5, 'col', col];
        }
        index = row * boardSize + col;
        for (var diagN = 0; diagN < 2; diagN++) {
          // Check diagonal wins
          if (diagonals[diagN].includes(index)) {
            countDiags[n][diagN] += 1;
            if (countDiags[n][diagN] == boardSize) {
              return [n - 0.5, 'diag', diagN];
            }
          }
        } //end diagonal for

      }
    }
  }
  return [0, 0, 0];
}

function score(map) {
  var isWin = checkWin(map)[0];
  if (isWin < 0) {
    return -10;
  } else if (isWin > 0) {
    return 10;
  }
  return 0;
}

function minimax(map, currentDepth, currentPlayer) {
  var currentScore = score(map);
  // console.log("currentScore, currentPlayer =",currentScore, currentPlayer, map);
  if (currentScore != 0) {
    return currentScore;
  }

  if (currentDepth >= maxDepth) {
    return 0;
  }
  var scores = [];
  var moves = [];
  var maxScoreIndex, minScoreIndex;
  for (var row = 0; row < boardSize; row++) {
    for (var col = 0; col < boardSize; col++) {
      if (map[row][col] == -1) {
        var newMap = copyArray(map);
        newMap[row][col] = currentPlayer;
        scores.push(minimax(newMap, currentDepth + 1, 1 - currentPlayer));
        moves.push([row, col]);
      }
    }
  }
  if (scores.length == 0) {
    return 0;
  }
  // console.log("scores,moves = ",scores,moves);
  if (currentPlayer == 1) {
    maxScoreIndex = scores.indexOf(Math.max.apply(Math, scores));
    bestMove = moves[maxScoreIndex];
    return scores[maxScoreIndex];
  } else {
    minScoreIndex = scores.indexOf(Math.min.apply(Math, scores));
    bestMove = moves[minScoreIndex];
    return scores[minScoreIndex];
  }

}

function getNextMove(map) {
  getEmptyMoves(map);
  if (emptyMoves == 0) {
    return;
  }

  var score, bestCol, bestRow;
  var maxScore = -1e20;
  minimax(map, 0, 1);
  console.log("bestMove = ", bestMove);
  return ([1, bestMove[0], bestMove[1]]);

}

function copyArray(arr) {
  var newArray = [];

  for (var i = 0; i < arr.length; i++)
    newArray[i] = arr[i].slice();
  return newArray;
}

function fuzz(x, f) {
  return x + Math.random() * f - f / 4;
}

// estimate the movement of the arm
// x0: start
// x1: end
// t: step from 0 to 1
function handDrawMovement(x0, x1, t) {
  return x0 + (x0 - x1) * (
    15 * Math.pow(t, 4) -
    6 * Math.pow(t, 5) -
    10 * Math.pow(t, 3)
  )
}

function handDrawCircle(ctx, cx, cy, r, rounds, callback) {

  rounds = rounds ? rounds : 2.5; // can be fractional, ie. 2.5

  var x, y,
    /// try to find the sweet-spot here:
    tol = Math.random() * (r * 0.03) + (r * 0.025),
    dx = Math.random() * tol * 0.75,
    dy = Math.random() * tol * 0.75,
    /// and here:
    ix = (Math.random() - 1) * (r * 0.2 * 0.022),
    iy = (Math.random() - 1) * (r * 0.15 * 0.022),
    rx = r + Math.random() * tol,
    ry = (r + Math.random() * tol) * 0.8,
    a = 0,
    ad = 3,
    i = 0,
    start = Math.random() + 50,
    tot = 360 * rounds + Math.random() * 50 - 100,
    deg2rad = Math.PI / 180,
    points = [],
    rotate = Math.random() * 1;

  ctx.save();

  ctx.translate(cx, cy);
  ctx.rotate(-rotate);
  ctx.translate(-cx, -cy);

  for (; i < tot; i += ad) {
    dx += ix;
    dy += iy;

    if (dx < -tol || dx > tol) ix = -ix;
    if (dy < -tol || dy > tol) iy = -iy;

    x = cx + (rx + dx * 2) * Math.cos(i * deg2rad + start);
    y = cy + (ry + dy * 2) * Math.sin(i * deg2rad + start);

    points.push(x, y);

    ad = Math.random() * 4 + 2;
  }

  i = 2;
  var t = 0;
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  ctx.clearRect(cx - r - tol, cy - r - tol, (r + tol) * 2, (r + tol) * 2);
  while (i < points.length) {
    for (; t <= i; t += 2) {
      ctx.lineTo(points[t], points[t + 1]);
    }
    i += 2;
  }
  ctx.stroke();
  ctx.restore();
  // draw();

  function draw() {

    var t = 0;

    /// clear background, optimize by limiting the region
    ctx.clearRect(cx - r - tol, cy - r - tol, (r + tol) * 2, (r + tol) * 2);

    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);

    for (; t <= i; t += 2) {
      ctx.lineTo(points[t], points[t + 1]);
    }
    ctx.stroke();

    i += 2;

    if (i < points.length) {
      requestAnimationFrame(draw);
    } else {
      ctx.restore();
      if (typeof callback === 'function')
        callback();
    }
  }
}

function handDrawLine(ctx, x0, y0, x1, y1, width, fuz) {
  ctx.save();
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x0, y0)

  var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0))

  var steps = d / 25;
  if (steps < 4) {
    steps = 4;
  }

  // fuzzyness
  var f = fuz;
  for (var i = 1; i <= steps; i++) {
    var t1 = i / steps;
    var t0 = t1 - 1 / steps
    var xt0 = handDrawMovement(x0, x1, t0)
    var yt0 = handDrawMovement(y0, y1, t0)
    var xt1 = handDrawMovement(x0, x1, t1)
    var yt1 = handDrawMovement(y0, y1, t1)
    ctx.quadraticCurveTo(fuzz(xt0, f), fuzz(yt0, f), xt1, yt1)
    ctx.moveTo(xt1, yt1)
  }
  ctx.stroke();
  ctx.restore();
}

function chooseX() {
  playerSym = "X";
  currentPlayer = true;
  $('#chooseO').removeClass('selected');
  $('#chooseX').addClass('selected');
}

function chooseO() {
  playerSym = "O";
  currentPlayer = false;
  $('#chooseX').removeClass('selected');
  $('#chooseO').addClass('selected');
}

function restartGame() {
  var c = document.getElementById("boardCanvas");
  ctx = c.getContext("2d");
  ctx.lineWidth = 6;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.shadowBlur = 1;
  ctx.shadowColor = 'rgb(20, 20, 20)';
  gameOver = false;
  drawBoard(ctx);
  $(".cell").on("click",
    playerClicked);
  globalMap = createArray(boardSize, boardSize, -1);
  if (playerSym == "O") //COmputer starts first
  {
    var randomMove = [
      [0, 0],
      [0, boardSize - 1],
      [boardSize - 1, 0],
      [boardSize - 1, boardSize - 1],
      [Math.floor(boardSize / 2), Math.floor(boardSize / 2)]
    ];
    console.log("randomMove ", randomMove);
    var randomInd = Math.floor(Math.random() * (randomMove.length))
    var move = randomMove[randomInd];
    console.log("move = ", move, randomInd);
    var row = move[0];
    var col = move[1];
    console.log("row,col ", row, col);
    globalMap[row][col] = 1;
    handDrawX(ctx, row, col);
  }

}

function playerClicked() {
  if (gameOver) {
    return;
  }

  var id = $(this).attr('id');
  var functionDic = {
    'X': handDrawX,
    'O': handDrawO
  };
  var otherDic = {
    'X': 'O',
    'O': 'X'
  };
  console.log(id);
  var row = id[0];
  var col = id[1];
  console.log("clicked: ", row, col);
  if (globalMap[row][col] == -1) {
    console.log(playerSym);
    functionDic[playerSym](ctx, row, col);
    globalMap[row][col] = 0;
    if (checkDrawWin()) {
      return;
    }
    nextMove = getNextMove(copyArray(globalMap));
    console.log("next move =  ", nextMove);
    globalMap[nextMove[1]][nextMove[2]] = 1;
    functionDic[otherDic[playerSym]](ctx, nextMove[1], nextMove[2]);
    if (checkDrawWin()) {
      return;
    }

  }
}

function checkDrawWin() {
  var isWin = checkWin(globalMap);
  var color = "#0059b3"
  if (isWin[0] != 0) {
    if (isWin[0] < 0) {
      color = "#800000"
    }
    drawWin(isWin[1], isWin[2], color);
    gameOver = true;
    return true;
  }
  return false;
}

function choose4x4() {
  $('#3x3').removeClass('selected bordo').addClass('unselected');
  $('#4x4').removeClass('unselected').addClass('selected bordo');
  boardSize = 4;
  maxDepth = 4;
  restartGame();
}

function choose3x3() {
  $('#4x4').removeClass('selected bordo').addClass('unselected');
  $('#3x3').removeClass('unselected').addClass('selected bordo');
  boardSize = 3;
  restartGame();
}

$(document).ready(function() {
  var a = 1;
  var b = a + 1;
  a = 2;
  console.log("a,b = ", a, b);
  var map1 = createArray(boardSize, boardSize, -1);
  console.log(map1);
  diagonals = getDiagonalIndices(boardSize);
  $("#chooseX").on("click", chooseX);
  $("#chooseO").on("click", chooseO);
  $("#restart").on("click", restartGame);
  $("#3x3").on("click", choose3x3);
  $("#4x4").on("click", choose4x4);
  restartGame();
});

function handDrawO(ctx, row, col) {
  // ctx.beginPath()
  var radius = 40 * 2.9 / boardSize;
  var cellSize = canvasSize / boardSize;
  var x = (col) * cellSize + cellSize / 2;
  var y = (row) * cellSize + cellSize / 2;
  ctx.strokeStyle = '#800000';
  handDrawCircle(ctx, x, y, radius)
    //ctx.closePath();
    //ctx.stroke();

}

function handDrawX(ctx, row, col, width, fuz) {
  var height = 70 * 2.9 / boardSize;
  var tol = height / 4.0
  ctx.strokeStyle = '#0059b3';
  var cellSize = canvasSize / boardSize;
  var x = (col) * cellSize + cellSize / 2;
  var y = (row) * cellSize + cellSize / 2;
  console.log(cellSize, x, y);
  var x0 = x - height / 2.0 + (Math.random() - 0.5) * tol;
  var y0 = y - height / 2.0 + (Math.random() - 0.5) * tol;
  var x1 = x + height / 2.0 + (Math.random() - 0.5) * tol;
  var y1 = y + height / 2.0 + (Math.random() - 0.5) * tol;
  handDrawLine(ctx, x0, y0, x1, y1, 9, 2.0);
  var x0 = x + height / 2.0 + (Math.random() - 0.5) * tol;
  var y0 = y - height / 2.0 + (Math.random() - 0.5) * tol;
  var x1 = x - height / 2.0 + (Math.random() - 0.5) * tol;
  var y1 = y + height / 2.0 + (Math.random() - 0.5) * tol;
  handDrawLine(ctx, x0, y0, x1, y1, 9, 2.0)

  ctx.strokeStyle = '#800000';

}

function drawBoard(ctx) {
  var htmlCellsStr = "";
  for (var i = 0; i < boardSize * boardSize; i++) {
    htmlCellsStr += '<div class="cell" id="' + Math.floor(i / boardSize).toString() + (i % boardSize).toString() + '"></div>';
  }
  $("#cellPlace").html(htmlCellsStr);
  $('.cell').css('width', Math.floor(canvasSize / boardSize).toString() + "px");
  $('.cell').css('height', Math.floor(canvasSize / boardSize).toString() + "px");
  ctx.beginPath()
  var cellSize = canvasSize / boardSize;
  for (var row = 0; row < boardSize - 1; row++) {
    for (var col = 0; col < boardSize - 1; col++) {
      drawLine(ctx, col * cellSize + cellSize, 0, col * cellSize + cellSize, canvasSize);

    }
    drawLine(ctx, 0, row * cellSize + cellSize, canvasSize, row * cellSize + cellSize);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawLine(ctx, x0, y0, x1, y1) {
  gradientLine(ctx, (x0 + x1) / 2, (y0 + y1) / 2, x1, y1, 'black', '#e6e6e6')
  gradientLine(ctx, (x0 + x1) / 2, (y0 + y1) / 2, x0, y0, 'black', '#e6e6e6')
}

function gradientLine(ctx, x0, y0, x1, y1, color1, color2) {
  ctx.beginPath();

  ctx.shadowBlur = 0;
  var grad = ctx.createLinearGradient(x0, y0, x1, y1);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  ctx.strokeStyle = grad;
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.closePath();
}

function drawWin(winType, winLoc, color) {
  console.log("winlock, winType = ", winLoc, winType);
  var x0, x1, y0, y1;
  var cellSize = canvasSize / boardSize;
  if (winType == "col") {
    x0 = winLoc * cellSize + cellSize / 2;
    y0 = cellSize / 8.0;
    x1 = x0;
    y1 = canvasSize - y0;

  } else if (winType == "row") {
    y0 = winLoc * cellSize + cellSize / 2;
    x0 = cellSize / 8.0;
    y1 = y0;
    x1 = canvasSize - x0;
  } else if (winType == "diag") {
    if (winLoc == 0) {
      x0 = cellSize / 8;
      y0 = cellSize / 8;
      x1 = canvasSize - x0;
      y1 = x1
    } else {
      x0 = canvasSize - cellSize / 8;
      y0 = cellSize / 8;
      x1 = cellSize / 8;
      y1 = canvasSize - cellSize / 8;

    }
  }
  console.log(x0, y1, x1, y1);
  ctx.save();
  ctx.strokeStyle = '#800000';
  ctx.shadowBlur = 5;

  handDrawLine(ctx, x0, y0, x1, y1, 8, 7.0);
  ctx.restore();
}