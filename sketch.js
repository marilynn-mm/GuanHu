let activeFriends = []; // array of friend IDs
let tabs = []

// set up canva
function setup() {
  createCanvas(windowWidth, windowHeight);
  mapWidth = height * 3 / 4;
  mapHeight = height;
  setUpTabs(mapWidth);
  setUpFriends();
  
  noSmooth();        // super crisp pixel font
  textFont(pixelFont);
  textSize(16);      // 04b03 looks good around 12–20 px

}

// main controller for visual output
function draw() {
  drawMap();
  drawTabs();
  test_draw_clickables();
  drawActiveFriendsBar()
  
  
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

  if (toomanyviewtabs) {
    drawText("Too many view tabs open!")
  }
}


// main controller for mouse and key detechtion
function mousePressed() {

  for (let i = openTabs.length - 1; i >= 0; i--) {
    const tab = openTabs[i];

    // removing taps 
    if (tab.wasCloseClicked(mouseX, mouseY)) {
      // console.log("removing tab")
      openTabs.splice(i, 1);  // remove that tab
      drawMap();
      toomanyviewtabs = false;
      return;
    }
    
    if (tab.type === "ringbell") {
      tab.handleClick(mouseX, mouseY);
      // if you want tabs to "eat" the click, you can `return;` here
    }

  }
  
  // open a new tab 
  clickable();

}




// map handler
function clickable() {
  
  let click = findClickablesUnderMouse();

  if (click.startsWith("viewpoint")) {
    openViewpoint(viewpoints_images[click]);
    return;
  }

  if (click.startsWith("ringbell")) {
    openRingbell(click, ringbell);
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







function getFriendById(friendId) {
  for (let key in FRIENDS) {
    const f = FRIENDS[key];
    if (f.id === friendId) return f;
  }
  return null;
}

function drawActiveFriendsBar() {
  if (!activeFriends || activeFriends.length === 0) return;

  const margin = 12;
  const barHeight = 52;
  const iconSize = 26;

  // label depends on count
  const label =
    activeFriends.length === 1 ? "Active Friend:" : "Active Friends:";

  textFont(pixelFont);
  textSize(10);
  textAlign(LEFT, TOP);

  const labelWidth = textWidth(label);
  const barWidth = labelWidth + 16 + activeFriends.length * (iconSize + 6);

  const x = width - barWidth - margin;
  const y = height - barHeight - margin;

  // --- background panel ---
  noStroke();
  fill(0, 0, 0, 200);
  rect(x, y, barWidth, barHeight, 4);

  // --- label text ---
  fill(255);
  const labelX = x + 8;
  const labelY = y + 6;
  text(label, labelX, labelY);

  // --- friend icons ---
  let iconX = labelX + labelWidth + 8;
  const iconY = y + 18;

  for (let friendId of activeFriends) {
    const friend = getFriendById(friendId);
    if (!friend) continue;

    const img = friend.profileImg;
    if (!img) continue;

    image(img, iconX, iconY, iconSize, iconSize);
    iconX += iconSize + 6;
  }
}
