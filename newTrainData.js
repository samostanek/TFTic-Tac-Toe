var currentState, move;

function setup() {
  createCanvas(400, 400);
  background(254);
  ellipseMode(CORNER);

  currentState = state.newBlank(3);
  currentState.render(300, 10, 10);
  move = 1;
}

function mousePressed() {
  if (currentState && move) {
    let cell = currentState.getCellPos([mouseX, mouseY]);
    if (cell == -1) return;
    else {
      try {
        currentState.setXO(cell[0], cell[1], move);
      } catch (e) {
        if (e.message == "Pos is not free!") return;
        else {
          console.error(e.message);
        }
      }
      if (move == 1) move = 2;
      else move = 1;
    }
  }
  console.log(currentState.checkWinDraw());
  switch (currentState.checkWinDraw()) {
    case 0:
      createP("DRAW!");
      console.log(
        JSON.stringify(getMovesRelativeToO(currentState.moveHistory.X))
      );
      console.log(JSON.stringify(currentState.moveHistory.O));
      break;
    case 1:
      createP("X WON!");
      console.log(
        JSON.stringify(getMovesRelativeToO(currentState.moveHistory.X))
      );
      break;
    case 2:
      createP("O WON!");
      console.log(JSON.stringify(currentState.moveHistory.O));
      break;
  }
}

function getMovesRelativeToO(moves) {
  let mvs = moves.slice();
  for (let move of mvs) {
    for (let i of move.state) {
      for (let j = 0; j < i.length; j++) {
        if (i[j] == 1) i[j] = 2;
        else if (i[j] == 2) i[j] = 1;
      }
    }
  }
  return mvs;
}

function draw() {
  currentState.render();
}
