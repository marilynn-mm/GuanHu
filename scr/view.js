// const border = 5;
// const blackborder = 2;         // thickness of black border
// const titleBarHeight = 20;
// const r = 8;              // circle diameter
// const paddingX = 10;
// const centerY = this.y + blackborder/2 + titleBarHeight / 2;

const BORDER = 2;           // black border thickness
const TITLE_BAR_HEIGHT = 20;
const PADDING = 6;          // padding inside content area
const DOT_R = 8;
const DOT_PADDING_X = 10;

class BaseTab {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.closeBtn = {
      x: this.x + BORDER/2 + PADDING,
      y: this.y + BORDER/2 + (TITLE_BAR_HEIGHT - 14) / 2,
      size: 14
    };

  }

  drawFrame() {
    noSmooth();

    // outer border
    stroke(0);
    strokeWeight(BORDER);
    fill(255);
    rect(this.x, this.y, this.w, this.h);

    const innerX = this.x + BORDER / 2;
    const innerY = this.y + BORDER / 2;
    const innerW = this.w - BORDER;
    const innerH = this.h - BORDER;

    // title bar
    noStroke();
    fill(80);
    rect(innerX, innerY, innerW, TITLE_BAR_HEIGHT);

    // content background
    fill(255);
    rect(innerX,
         innerY + TITLE_BAR_HEIGHT,
         innerW,
         innerH - TITLE_BAR_HEIGHT);

    // close button
    const padding = 6;  // distance from left edge of title bar

    // draw red box
    fill(200, 30, 30);
    rect(this.closeBtn.x, this.closeBtn.y, this.closeBtn.size, this.closeBtn.size, 4);

    // draw white "x"
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("x",
        this.closeBtn.x + this.closeBtn.size / 2,
        this.closeBtn.y + this.closeBtn.size / 2);
  }

  // helper for rectangle where content should go
  getContentRect() {
    const innerX = this.x + BORDER / 2;
    const innerY = this.y + BORDER / 2;
    const innerW = this.w - BORDER;
    const innerH = this.h - BORDER;

    return {
      x: innerX + PADDING,
      y: innerY + TITLE_BAR_HEIGHT + PADDING,
      w: innerW - PADDING * 2,
      h: innerH - TITLE_BAR_HEIGHT - PADDING * 2
    };
  }
  
  // check if close tab
  wasCloseClicked(mx, my) {
    return mx > this.closeBtn.x &&
           mx < this.closeBtn.x + this.closeBtn.size &&
           my > this.closeBtn.y &&
           my < this.closeBtn.y + this.closeBtn.size;
  }
}

class ViewpointTab extends BaseTab {
  constructor(x, y, img, targetImgWidth = 160) {
    const aspect = img.height / img.width;

    // image display size
    const imgW = targetImgWidth;
    const imgH = imgW * aspect;

    // full window size (frame)
    const windowW = imgW + PADDING * 2 + BORDER;
    const windowH = TITLE_BAR_HEIGHT + imgH + PADDING * 2 + BORDER;

    super(x, y, windowW, windowH);

    this.img = img;
    this.imgW = imgW;
    this.imgH = imgH;
  }

  draw() {
    this.drawFrame();
    const content = this.getContentRect();
    image(this.img, content.x, content.y, this.imgW, this.imgH);
  }
}




function drawText(string) {
  
}
// class RingbellTab extends BaseTab {
//   constructor(slot, id) {
//     super(slot, "ringbell", id);
//   }
//   draw() {
//     this.drawFrame();
//     fill(0);
//     textAlign(CENTER, CENTER);
//     text("Ringbell: " + this.id, this.x + this.w/2, this.y + this.h/2);
//   }
// }


// class GameTab extends BaseTab {
//   constructor(slot, id) {
//     super(slot, "game", id);
//     this.t = 0; // placeholder game logic
//   }

//   update() {
//     this.t += 0.03;
//   }

//   draw() {
//     this.drawFrame();
//     fill(240);
//     textAlign(LEFT, TOP);
//     text("Game: " + this.id, this.x + 10, this.y + 10);
//     text("t = " + this.t.toFixed(2), this.x + 10, this.y + 40);
//   }
// }

// class BikeRaceTab extends BaseTab {
//   constructor() {
//     super();
//     this.playerX = 100;
//     this.playerY = 300;
//   }

//   enter() {
//     // reset or prepare mini-game state
//   }

//   update() {
//     // game logic, e.g. move player with keyboard
//     if (keyIsDown(LEFT_ARROW))  this.playerX -= 3;
//     if (keyIsDown(RIGHT_ARROW)) this.playerX += 3;
//   }

//   draw() {
//     background(10, 10, 30);
//     // draw the road, trees, whatever
//     rect(this.playerX, this.playerY, 30, 15); // simple bike
//     // maybe a small “Back” button
//     rect(20, 20, 60, 30);
//     fill(255);
//     text("Back", 25, 40);
//   }

//   mousePressed() {
//     // click back: return to map
//     if (mouseX > 20 && mouseX < 80 && mouseY > 20 && mouseY < 50) {
//       currentTab.exit?.();
//       currentTab = tabs["map"];
//       currentTab.enter?.();
//     }
//   }
// }





function openGame(id) {
  // close old game
  openTabs = openTabs.filter(t => t.type !== "game");
  openTabs.push(new GameTab(GAME_SLOT, id));
}

function openRingbell(id) {
  // close old ringbell
  openTabs = openTabs.filter(t => t.type !== "ringbell");
  openTabs.push(new RingbellTab(RINGBELL_SLOT, id));
}

function closeTab(tab) {
  openTabs = openTabs.filter(t => t !== tab);
}


// // integrate with the other mousePressedLogic
// function mousePressed() {

//   // Check right-side windows first
//   for (let tab of openTabs) {
//     if (tab.wasCloseClicked(mouseX, mouseY)) {
//       closeTab(tab);
//       return;
//     }
//   }

//   // Otherwise check left-map hotspot logic (demo)
//   if (mouseX < 400) {
//     // Example triggers:
//     if (mouseY < 150) {
//       openGame("cycling");
//     } else if (mouseY < 300) {
//       openRingbell("find-conor");
//     } else {
//       // open random viewpoints
//       openViewpoint("vp1", random([img1, img2]));
//     }
//   }

  
// }

