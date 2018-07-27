const model = tf.sequential();
var currentState, move;
const trainData = JSON.parse(
  '[{"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[1,1]},{"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[2,1]},{"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[0,2]},{"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[1,2]},{"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[0,0]}, {"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[2,2]},{"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[0,1]},{"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[2,0]},{"state":[[2,1,2],[1,2,2],[1,2,1]],"move":[1,0]}, {"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[2,2]},{"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[0,1]},{"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[0,2]},{"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[1,0]},{"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[2,1]}, {"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[1,1]},{"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[2,0]},{"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[1,2]},{"state":[[1,2,2],[2,1,1],[1,2,2]],"move":[0,0]}, {"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[1,0]},{"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[1,1]},{"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[2,2]},{"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[0,2]},{"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[2,1]}, {"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[0,1]},{"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[1,2]},{"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[0,0]},{"state":[[1,1,2],[2,2,1],[1,2,2]],"move":[2,0]}, {"state":[[1,0,2],[0,2,0],[2,1,1]],"move":[0,2]},{"state":[[1,0,2],[0,2,0],[2,1,1]],"move":[2,0]},{"state":[[1,0,2],[0,2,0],[2,1,1]],"move":[1,1]}, {"state":[[2,1,1],[0,2,1],[0,2,1]],"move":[0,1]},{"state":[[2,1,1],[0,2,1],[0,2,1]],"move":[0,2]},{"state":[[2,1,1],[0,2,1],[0,2,1]],"move":[2,2]},{"state":[[2,1,1],[0,2,1],[0,2,1]],"move":[1,2]}, {"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[1,1]},{"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[2,2]},{"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[0,1]},{"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[1,0]},{"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[2,0]}, {"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[1,2]},{"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[0,0]},{"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[2,1]},{"state":[[1,2,1],[2,2,1],[2,1,2]],"move":[0,2]}, {"state":[[1,0,2],[1,2,0],[1,1,2]],"move":[2,1]},{"state":[[1,0,2],[1,2,0],[1,1,2]],"move":[1,0]},{"state":[[1,0,2],[1,2,0],[1,1,2]],"move":[2,0]},{"state":[[1,0,2],[1,2,0],[1,1,2]],"move":[0,0]}, {"state":[[1,0,2],[1,2,0],[1,1,2]],"move":[2,1]},{"state":[[1,0,2],[1,2,0],[1,1,2]],"move":[1,0]},{"state":[[1,0,2],[1,2,0],[1,1,2]],"move":[2,0]},{"state":[[1,0,2],[1,2,0],[1,1,2]],"move":[0,0]}, {"state":[[2,1,2],[2,1,1],[2,0,1]],"move":[1,0]},{"state":[[2,1,2],[2,1,1],[2,0,1]],"move":[0,2]},{"state":[[2,1,2],[2,1,1],[2,0,1]],"move":[2,0]},{"state":[[2,1,2],[2,1,1],[2,0,1]],"move":[0,0]}]'
);
var trainData2 = { in: [], out: [] };

function preload() {
  for (let move of trainData) {
    trainData2.in.push([].concat(...move.state));
    trainData2.out.push(move.move);
  }
  trainData2.in = tf.tensor2d(trainData2.in);
  trainData2.out = tf.oneHot(
    tf.tensor1d(trainData2.out.map(x => x[0] + x[1] * 3), "int32"),
    9
  );
  console.log(trainData2);
}

function setup() {
  createCanvas(400, 400);
  background(254);
  ellipseMode(CORNER);

  model.add(
    tf.layers.dense({ units: 32, inputShape: [9], activation: "sigmoid" })
  );
  model.add(tf.layers.dense({ units: 16, activation: "sigmoid" }));
  model.add(tf.layers.dense({ units: 16, activation: "sigmoid" }));
  model.add(tf.layers.dense({ units: 9, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.sgd(1),
    loss: "categoricalCrossentropy"
  });

  move = 1;

  train();
}

async function train() {
  for (let i = 1; i <= 3; i++) {
    const h = await model.fit(trainData2.in, trainData2.out.asType("float32"), {
      batchSize: 4,
      epochs: 10
    });
    console.log("Loss after Epoch " + i * 3 + " : " + h.history.loss[0]);
  }
}

function draw() {
  if (currentState) currentState.render();
  // if ((move = 2)) currentState.setXO();
  train();
}

function mousePressed() {
  if (currentState && move) {
    let cell = currentState.getCellPos([mouseX, mouseY]);
    console.log(cell);
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
}
