

// function render() {
//   if (currentScreen === "map") {
//     renderMap();
//   } else if (currentScreen === "game_cafe") {
//     tagGameCafe.update();
//     tagGameCafe.draw();
//   } else if (currentScreen === "game_library") {
//     tagGameLibrary.update();
//     tagGameLibrary.draw();
//   }
// }



function drawMap() {
  // your pan/zoom / base map drawing
}

// all the markers of interactions
function drawPlaces() {
  // games, buildings, interactions, images, videos, friends, textbox
  // for (let p of places) {
  //   fill(50, 120, 255);
  //   circle(p.x, p.y, p.r * 2);
  // }
}

function drawDimOverlay() {
  push();
  noStroke();
  fill(0, 0, 0, 100); // transparent black
  rect(0, 0, width, height);
  pop();
}

function drawTabFor(place) {
  const w = 260;
  const h = 160;
  const x = width / 2 - w / 2;
  const y = height / 2 - h / 2;

  // call specific draw functions like drawTag()

}
