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

    fill(255);
    textFont(pixelFont);
    textSize(10);
    textAlign(LEFT, CENTER);
    noStroke();

    text(
      this.text,
      bar.x + 30,
      bar.y + bar.h / 2 
    );


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

    if (!ringSound.isPlaying()) {
      ringSound.play();
    }
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

    
    // overlay text on titlebar
    const bar = this.getTitleBarRect();

    fill(255);
    textFont(pixelFont);
    textSize(10);
    textAlign(LEFT, CENTER);
    noStroke();

    text(
      "Tag! Game start! (use your arrows)",
      bar.x + 30,          // small padding from left
      bar.y + bar.h / 2   // vertically centered
    );
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




class DuckGameTab extends BaseTab {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.type = "game_duck";

    const content = this.getContentRect();
    const cw = content.w;
    const ch = content.h;

    // bowl is a rectangle on the left side near the bottom
    this.bowlLocal = {
      x: 10,
      y: ch - 20,
      w: 80,
      h: 30
    };

    this.showQuack = false;
  }

  draw() {
    this.drawFrame();
    const content = this.getContentRect();

    push();
    translate(content.x, content.y);

    image(duckBGImg, 0, 0, content.w, content.h);

    if (this.showQuack) {

      fill(0);
      textFont(pixelFont);
      textSize(10);
      textAlign(CENTER, CENTER);
      text("quack", this.bowlLocal.x + 30, this.bowlLocal.y - 30) // bubbleX + textW / 2, bubbleY + textH / 2);
    }

    pop();

    // overlay text on titlebar
    const bar = this.getTitleBarRect();

    fill(255);
    textFont(pixelFont);
    textSize(10);
    textAlign(LEFT, CENTER);
    noStroke();

    text(
      "Click duck for quack)",
      bar.x + 30,          // small padding from left
      bar.y + bar.h / 2   // vertically centered
    );

  }

  handleClick(mx, my) {
    // console.log("checking duck clicks")
    const content = this.getContentRect();

    // bowl rect in absolute canvas coords
    const bowlAbs = {
      x: content.x + this.bowlLocal.x,
      y: content.y + this.bowlLocal.y,
      w: this.bowlLocal.w,
      h: this.bowlLocal.h
    };

    if (
      mx >= bowlAbs.x &&
      mx <= bowlAbs.x + bowlAbs.w &&
      my >= bowlAbs.y &&
      my <= bowlAbs.y + bowlAbs.h
    ) {
      this.showQuack = true;
      return true;
    }

    return false;
  }
  
}


class BikeGameTab extends BaseTab {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.type = "game_bike";

    // initial bike position inside content rect
    this.bikeX = 20;
    this.bikeY = 140;

    this.bikeSpeed = 12;   // how much to move per click

    // button dimensions
    this.button = { x: 10, y: 10, w: 60, h: 22 };
  }

  draw() {
    this.drawFrame();

    const content = this.getContentRect();
    push();
    translate(content.x, content.y);


    image(bikeBGImg, 0, 0, content.w, content.h);



    image(bikeSpirteImg, this.bikeX, this.bikeY, 60, 60);

    // pedal button
    noStroke();
    fill(0, 0, 0, 160);
    rect(this.button.x, this.button.y, this.button.w, this.button.h, 4);

    fill(255);
    textFont(pixelFont);
    textSize(10);
    textAlign(CENTER, CENTER);
    text("pedal", this.button.x + this.button.w/2, this.button.y + this.button.h/2);

    pop();
  }

  handleClick(mx, my) {
    const content = this.getContentRect();

    // convert button rect to absolute coordinates
    const btn = {
      x: content.x + this.button.x,
      y: content.y + this.button.y,
      w: this.button.w,
      h: this.button.h
    };

    if (
      mx >= btn.x &&
      mx <= btn.x + btn.w &&
      my >= btn.y &&
      my <= btn.y + btn.h
    ) {
      this.bikeX += this.bikeSpeed;   // move right
      return true;  // handled
    }

    return false;
  }
}

