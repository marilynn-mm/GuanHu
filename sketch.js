let mapImg;
let iconsImg;
let mapX = 0;
let mapY = 0;
let mapWidth;
let mapHeight;


let game_tab = false;
let ringbell_tab = false;
let viewpoint_tab = false;


let clickRadius = 20;
let mapclickables = [
  ["building1",  xZoomIn,  yZoomIn],
  ["ZoomOut", xZoomOut, yZoomOut],
  ["buidling",   x,   y],
  ["duck",  xZoomIn,  yZoomIn],
  ["bike", xZoomOut, yZoomOut],
  ["tag",   x,   y]
];



let tabs = []

// preload resources for main 
function preload() {
  mapImg = loadImage("images/main.jpg");
  iconsImg = loadImage("images/icon.png");

}



// set up canva
function setup() {
  createCanvas(windowWidth, windowHeight);
  mapWidth = height * 3 / 4;
  mapHeight = height;
}

// console.log("control.js loaded");

// main controller for visual output
function draw() {
  background(240);

  drawMap();
  drawTabs();

}

function drawMap() {
  
  if (!mapImg) {
    console.log("mapImg not loaded yet");
    return;
  }
  background(208, 199, 166);
  image(mapImg, mapX, mapY, mapWidth, mapHeight)
  image(iconsImg, mapX, mapY, mapWidth, mapHeight)
}


// all the markers of interactions
function drawTabs() {
  // games, buildings, interactions, images, videos, friends, textbox
  // for (let p of places) {
  //   fill(50, 120, 255);
  //   circle(p.x, p.y, p.r * 2);
  // }
}



function drawTabFor(place) {
  const w = 260;
  const h = 160;
  const x = width / 2 - w / 2;
  const y = height / 2 - h / 2;

  // call specific draw functions like drawTag()

}



// main controller for mouse and key detechtion
function mousePressed() {

}



// let ui_control = [
//   ["game_exit", x,  y]
//   ["tab_exit", x,  y]
//   ["game_exit", x,  y]
// ]




// map handler
function click_control() {
  
  let click = findClickablesUnderMouse();

  switch (click) {
  case "duck":
    // code to execute if expression === value1
    break;
  case value2:
    // code to execute if expression === value2
    break;
  // ... more cases
  default:
    break;
  }

}

function findClickablesUnderMouse() {
  for (let i = 0; i < mapclickables.length; i++) {
    const [id, x, y] = games[i];
    const x_range = mouseX - x;
    const y_range = mouseY - y;
    if (x_range * x_range + y_range * y_range <= clickRadius * clickRadius) {
      return id;
    }
  }
  return null;
}