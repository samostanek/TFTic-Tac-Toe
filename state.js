class state {
  constructor(data, posX, posY, size) {
    this.data = data;
    this.posX = posX;
    this.posY = posY;
    this.size = size;
    this.moveHistory = { X: [], O: [] };
  }
  render(size, posX, posY) {
    noFill();
    stroke(0);
    strokeWeight(2);
    if (size && posX && posY) {
      this.size = size;
      this.posX = posX;
      this.posY = posY;
    }
    for (var i = 0; i < this.data.length; i++) {
      for (var j = 0; j < this.data.length; j++) {
        rect(
          this.posX + (this.size / this.data.length) * i,
          this.posY + (this.size / this.data.length) * j,
          this.size / this.data.length,
          this.size / this.data.length
        );
        if (this.data[i][j] == 1)
          drawX(
            this.size / this.data.length - 10,
            this.posX + (this.size / this.data.length) * i + 5,
            this.posY + (this.size / this.data.length) * j + 5
          );
        else if (this.data[i][j] == 2)
          ellipse(
            this.posX + (this.size / this.data.length) * i + 5,
            this.posY + (this.size / this.data.length) * j + 5,
            this.size / this.data.length - 10
          );
      }
    }
    function drawX(size, posX, posY) {
      line(posX, posY, posX + size, posY + size);
      line(posX + size, posY, posX, posY + size);
    }
  }
  setXO(x, y, player) {
    // debugger;
    if (this.data[x][y] != 0) throw new Error("Pos is not free!");
    else if (player == 1 || player == 2) {
      let historyData = { state: this.data, move: [x, y] };
      if (player == 1) this.moveHistory.X.push(historyData);
      else this.moveHistory.O.push(historyData);
      this.data[x][y] = player;
    } else throw new Error("Invalid input for player!");
  }
  assignMove(move) {
    if (move[0] < this.data.length && move[1] < this.data.length)
      this.move = move;
    else throw new RangeError("Move out of bound of play field exception!");
  }
  getCellPos(mousePos) {
    if (
      mousePos[0] < this.posX ||
      mousePos[0] > this.posX + this.size ||
      mousePos[1] < this.posY ||
      mousePos[1] > this.posY + this.size
    )
      return -1;
    else {
      return [
        floor(
          map(
            mousePos[0],
            this.posX,
            this.posX + this.size,
            0,
            this.data.length
          )
        ),
        floor(
          map(
            mousePos[1],
            this.posY,
            this.posY + this.size,
            0,
            this.data.length
          )
        )
      ];
    }
  }
  getAsTensor() {
    return tf.tensor2d([[].concat(...this.data)]);
  }
  checkWinDraw() {
    // check cols
    // debugger;
    for (let col of this.data) {
      if (countElNum(col[0], col) == col.length && col[0] != 0) {
        return col[0];
      }
    }
    // check rows
    for (let row = 0; row < this.data.length; row++) {
      let row_data = getRow(this.data, row);
      if (
        countElNum(row_data[0], row_data) == row_data.length &&
        row_data[0] != 0
      )
        return row_data[0];
    }
    // check diagonals
    for (let diagonal of getDiagonals(this.data)) {
      if (
        countElNum(diagonal[0], diagonal) == diagonal.length &&
        diagonal[0] != 0
      )
        return diagonal[0];
    }
    // check draw
    let free = 0;
    for (let col of this.data) free += countElNum(0, col);
    if (free == 0) return 0;
    return -1;
  }
  static newBlank(size) {
    let data = [];
    let rows = [];
    for (let i = 0; i < size; i++) {
      rows.push(0);
    }
    for (let i = 0; i < size; i++) {
      data.push(rows.slice());
    }
    return new state(data);
  }
}

function countElNum(el, array) {
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] == el) count++;
  }
  return count;
}

function getRow(state, n) {
  let out = [];
  for (let col of state) out.push(col[n]);
  return out;
}

function getDiagonals(state) {
  out1 = [];
  out2 = [];
  for (let i = 0; i < state.length; i++) {
    out1.push(state[i][i]);
    out2.push(state[i][state.length - i - 1]);
  }
  return [out1, out2];
}
