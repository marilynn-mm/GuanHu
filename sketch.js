let mapImg;
let iconsImg;
let mapX = 0;
let mapY = 0;
let mapWidth;
let mapHeight;





let clickRadius = 20;
let clickAudio;


let images = {};

// x coordinate with respect to the map image
let mapclickables = [
  ["viewpoint1", 0.30, 0.15],
  ["viewpoint2", 0.49, 0.53],
  ["viewpoint3", 0.42, 0.32],
  ["viewpoint4", 0.55, 0.30],
  ["viewpoint5", 0.7, 0.5],
  ["viewpoint6", 0.73, 0.56],
  ["viewpoint7", 0.66, 0.62],
  ["viewpoint8", 0.87, 0.66],
  ["viewpoint9", 0.85, 0.79],
  ["viewpoint10", 0.70, 0.85],
  ["viewpoint11", 0.68, 0.75],
  ["viewpoint12", 0.38, 0.75],
  ["viewpoint13", 0.12, 0.30],
  ["viewpoint14", 0.14, 0.64],
  ["viewpoint15", 0.20, 0.66],
  ["viewpoint16", 0.17, 0.92],

  // ["ringbell1", 0.40, 0.17],
  // ["ringbell2", 0.75, 0.135],
  // ["ringbell3", 0.2, 0.4],
  // ["ringbell4", 0.76, 0.44],
  // ["ringbell5", 0.44, 0.76],

  // ["duck", 0.56, 0.65],
  // ["bike", 0.33, 0.36],
  // ["tag",  0.74, 0.81]
];


let tabs = []

// preload resources for main 
function preload() {

  mapImg = loadImage("images/main.jpg");
  iconGamesImg = loadImage("images/icon_games.png");
  iconRingbellsImg = loadImage("images/icon_ringbells.png");
  iconViewpointsImg = loadImage("images/icon_viewpoints.png");
  iconViewpointsMockImg = loadImage("images/icon_viewpointsmock.PNG");

  // Load VIEWPOINT images
  for (let item of mapclickables) {
    let id = item[0];

    if (id.startsWith("viewpoint")) {
      images[id] = loadImage(`images/${id}.png`);
    }
  }

}

// set up canva
function setup() {
  createCanvas(windowWidth, windowHeight);
  mapWidth = height * 3 / 4;
  mapHeight = height;
  setUpTabs(mapWidth);

}


// main controller for visual output
function draw() {
  drawMap();
  drawTabs();
  test_draw_clickables();
  
  
}


function drawMap(){
  background(208, 199, 166);
  image(mapImg, mapX, mapY, mapWidth, mapHeight);
  image(iconGamesImg, mapX, mapY, mapWidth, mapHeight);
  image(iconRingbellsImg, mapX, mapY, mapWidth, mapHeight);
  image(iconViewpointsImg, mapX, mapY, mapWidth, mapHeight);
}


// all the markers of interactions
function drawTabs() {
  for (let tab of openTabs) {
      if (tab.type === "game") tab.update();
      tab.draw();
      console.log(tab.id)
  }
}


// main controller for mouse and key detechtion
function mousePressed() {

  // try to click-close a tab first
  for (let i = openTabs.length - 1; i >= 0; i--) {
    const tab = openTabs[i];
    // console.log("checking to close")
    if (tab.wasCloseClicked(mouseX, mouseY)) {
      // console.log("removing tab")
      openTabs.splice(i, 1);  // remove that tab
      drawMap();
      return;
    }
  }
  
  // open a new tab 
  clickable();

}




// map handler
function clickable() {
  
  let click = findClickablesUnderMouse();

  if (click.startsWith("viewpoint")) {
    openViewpoint(click, images[click]);
    return;
  }

  if (click.startsWith("ringbell")) {
    openRingbell(click, images[click]);
    return;
  }

  // if (click === "duck") {

  //   return;
  // }
  
  // If (click === "bike") {
  //   return;
  // }

  // if (click === "tag") {
  //   return;
  // }
}


function findClickablesUnderMouse() {
  for (let i = 0; i < mapclickables.length; i++) {
    const [id, xratio, yratio] = mapclickables[i];
    const x = xratio*mapWidth + mapX;
    const y = yratio*mapHeight + mapY;
    const x_range = mouseX - x;
    const y_range = mouseY - y;
    if (x_range * x_range + y_range * y_range <= clickRadius * clickRadius) {
      console.log("clicked ", id)
      return id;
    }
  }
  // console.log("no click ", id)
  return null;
}



function test_draw_clickables(){
  for (let i = 0; i < mapclickables.length; i++) {
    const [id, x, y] = mapclickables[i];

    fill(255, 0, 0);
    circle(mapX + mapWidth * x, mapY + mapHeight* y, clickRadius);
  }
}




