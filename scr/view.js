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


let toomanyviewtabs = false;

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
  getTitleBarRect() {
    return {
      x: this.x + BORDER / 2,
      y: this.y + BORDER / 2,
      w: this.w - BORDER,
      h: TITLE_BAR_HEIGHT
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
    console.log("content", content);
    const content = this.getContentRect();
    image(this.img, content.x, content.y, this.imgW, this.imgH);
  }
}


class RingbellTab extends BaseTab {
  constructor(x, y, friend) {
    // you can choose a fixed window size that fits your UI
    const w = 250;
    const h = 250 * ringbellBaseImg.height / ringbellBaseImg.width;
    super(x, y, w, h);
    
    this.type = "ringbell";
    this.friend = friend;
    

    this.state = "idle";
    this.text = friend.lines.idle;

    const aspect = this.friend.profileImg.width/this.friend.profileImg.height;

    // define areas relative to tab
    this.buttonArea = { x: this.x + 125, y: this.y + 130, w: 100, h: 90}; // "Press to ring"
    this.profileArea = { x: this.x + 125, y: this.y + TITLE_BAR_HEIGHT, w: 80, h: 80 * aspect};  // top-right text/face
  }

  
  draw() {
    this.drawFrame();

    // base picture of the doorbell
    image(ringbellBaseImg, this.x, this.y + TITLE_BAR_HEIGHT, this.w, this.h);

    
    // friend portrait in the top-right block
    image(this.friend.profileImg,
            this.profileArea.x, this.profileArea.y + TITLE_BAR_HEIGHT,
            this.profileArea.w, this.profileArea.h);

    // overlay text on titlebar
    const bar = this.getTitleBarRect();

    fill(255);          // white text pops better on gray
    textFont(pixelFont);
    textSize(10);
    textAlign(LEFT, CENTER);   // or CENTER if you prefer centered
    noStroke();

    text(
      this.text,
      bar.x + 30,          // small padding from left
      bar.y + bar.h / 2   // vertically centered
    );


    // bottom-right Press to ring block
    // fill(0);
    // rect(this.buttonArea.x, this.buttonArea.y,
    //      this.buttonArea.w, this.buttonArea.h);

    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER); 
    text("Press to Ring",
         this.buttonArea.x + this.buttonArea.w / 2,
         this.buttonArea.y + this.buttonArea.h / 2);
  }

  handleClick(mx, my) {
    // clicked on "Press to ring" region?
    if (mx >= this.buttonArea.x && mx <= this.buttonArea.x + this.buttonArea.w &&
        my >= this.buttonArea.y && my <= this.buttonArea.y + this.buttonArea.h) {
      this.onRing();
    }
  }

  onRing() {
    if (this.state !== "idle") return;

    this.state = "ringing";
    this.text = this.friend.lines.ringing;

    // after a short delay, friend responds + joins activeFriends
    setTimeout(() => {
      this.state = "responded";
      this.text = this.friend.lines.response;
      addActiveFriend(this.friend.id);
    }, 1200);
  }
}




class TagGameTab extends BaseTab {
  constructor(x, y, windowW, windowH, activeFriendIds) {
    super(x, y, windowW, windowH);
    this.type = "game_tag";

    // frame
    const content = this.getContentRect();
    this.contentX = content.x;
    this.contentY = content.y;
    this.gameW = content.w;
    this.gameH = content.w * tagImg.width/tagImg.height;// content.h;

    this.tagCooldown = 400; // ms

    //create player & AI friends in local game coords
    this.player = new Player(
      this.gameW / 2,
      this.gameH / 2,
      15,
      3,
      this.gameW,
      this.gameH,
      selfImg
    );

    this.friends = [];

    // for (let friendId of activeFriendIds) {
    //   const spriteImg = getTagSpriteFor(friendId);
    //   console.log(spriteImg);

    //   const spawnX = random(40, this.gameW - 40);
    //   const spawnY = random(40, this.gameH - 40);

    //   this.friends.push(
    //     new TagFriend(
    //       spawnX,
    //       spawnY,
    //       14,
    //       2.3,
    //       this.gameW,
    //       this.gameH,
    //       friendId,
    //       spriteImg
    //     )
    //   );
    for (let friendId of activeFriends) {
      const friendData = getFriendById(friendId);
      if (!friendData) {
        console.warn("No FRIENDS entry for", friendId);
        continue;
      }

      const spriteImg = friendData.tagSprite;
      const spawnX = random(40, this.gameW - 40);
      const spawnY = random(40, this.gameH - 40);

      this.friends.push(
        new TagFriend(
          spawnX,
          spawnY,
          14,
          2.3,
          this.gameW,
          this.gameH,
          friendId,
          spriteImg
        )
      );
    }

    
  }

  draw() {
    this.drawFrame();  // outer frame + title bar + white content

    const content = this.getContentRect();

    push();
    translate(content.x, content.y);

    // BACKGROUND FIRST
    if (tagImg) {
      image(tagImg, 0, 0, this.gameW, this.gameH);
    } else {
      console.log("tagImg missing in draw:", tagBgImg);
      fill(240);
      rect(0, 0, this.gameW, this.gameH);
    }

    // update + draw player
    this.player.update();
    this.player.display();

    // update + draw AI friends
    for (let f of this.friends) {
      f.update(this.player);
      f.display();
    }

    // check tag logic
    this.checkTag();

    pop();
  }

  

  checkTag() {
    for (let f of this.friends) {
      const distance = p5.Vector.dist(f.pos, this.player.pos);
      const touching = distance < (f.r + this.player.r);

      if (!touching) continue;

      const now = millis();
      if (
        now - this.player.lasttagtime < this.tagCooldown ||
        now - f.lasttagtime < this.tagCooldown
      ) {
        continue;
      }

      if (f.isIt && !this.player.isIt) {
        f.isIt = false;
        f.jumpBack();
        this.player.isIt = true;
        f.lasttagtime = now;
        this.player.lasttagtime = now;
        break;
      }

      if (this.player.isIt && !f.isIt) {
        this.player.isIt = false;
        f.jumpBack();
        f.isIt = true;
        f.lasttagtime = now;
        this.player.lasttagtime = now;
        break;
      }
    }
  }
}


// class RingbellTab extends BaseTab {
//   constructor(x, y, img) {
//     super({x, y, w: img.width, h: img.height}, "ringbell", friend);
    
//     this.img = img;
//     // this.friend = friend;

//     this.state = "idle"; 
//     this.text = `Home of ${friend.name}`;

//     // Click areas relative to tab position  
//     this.displayArea = { 
//       x: this.x + 240, 
//       y: this.y + 40, 
//       w: 220, 
//       h: 80 
//     };

//     this.buttonArea = {
//       x: this.x + 240, 
//       y: this.y + 180, 
//       w: 220, 
//       h: 100
//     };
//   }

//   draw() {
//     this.drawFrame();

//     // draw the main ringbell PNG
//     image(this.img, this.x, this.y);

//     // draw dynamic text on upper right screen
//     fill(255);
//     textSize(14);
//     textAlign(CENTER, CENTER);
//     text(this.text,
//          this.displayArea.x + this.displayArea.w/2,
//          this.displayArea.y + this.displayArea.h/2,
//          this.displayArea.w,
//          this.displayArea.h);

//     // draw the button highlight
//     fill(255, 255, 255, 40);
//     rect(this.buttonArea.x, this.buttonArea.y, 
//          this.buttonArea.w, this.buttonArea.h);
    
//     fill(255);
//     textSize(16);
//     text("Press to Ring",
//          this.buttonArea.x + this.buttonArea.w/2,
//          this.buttonArea.y + this.buttonArea.h/2);
//   }

//   handleClick(mx, my) {
//     // If click inside the "press to ring" area
//     if (mx > this.buttonArea.x && mx < this.buttonArea.x + this.buttonArea.w &&
//         my > this.buttonArea.y && my < this.buttonArea.y + this.buttonArea.h) {
      
//       this.startRinging();
//     }
//   }

//   startRinging() {
//     if (this.state !== "idle") return;
//     this.state = "ringing";
//     this.text = "Ringing...";

//     // After delay, friend responds
//     setTimeout(() => {
//       this.respond();
//     }, 1500);
//   }

//   respond() {
//     this.state = "responding";
//     this.text = this.friend.response;
//   }
// }


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





// function openGame(id) {
//   // close old game
//   openTabs = openTabs.filter(t => t.type !== "game");
//   openTabs.push(new GameTab(GAME_SLOT, id));
// }


// function closeTab(tab) {
//   openTabs = openTabs.filter(t => t !== tab);
// }


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

