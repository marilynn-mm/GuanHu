class Character {
  constructor(x, y, r, s, boundsW, boundsH, spriteImg = null) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = r;
    this.maxSpeed = s;
    this.boundsW = boundsW;
    this.boundsH = boundsH;

    this.isIt = false;
    this.lasttagtime = -1000;

    this.spriteImg = spriteImg;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  jumpBack() {
    this.vel.mult(-1);
    this.vel.setMag(this.maxSpeed * 2);
    this.pos.add(this.vel.copy().mult(5));
    this.pos.y -= 10;
  }

  wander() {
    let angleChange = random(-0.3, 0.3);
    this.vel.rotate(angleChange);
    this.vel.setMag(this.maxSpeed);
  }

  wallcheck() {
    if (this.pos.x < 0 || this.pos.x > this.boundsW) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > this.boundsH) this.vel.y *= -1;
  }

  physicsUpdate() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.constrain();
  }

//   display() {
//     noStroke();
//     fill(this.isIt ? "red" : this.color);
//     ellipse(this.pos.x, this.pos.y, this.r * 2);
//   }

  constrain() {
    this.pos.x = constrain(this.pos.x, 0, this.boundsW);
    this.pos.y = constrain(this.pos.y, 0, this.boundsH);
  }
}



class Player extends Character {
  constructor(x, y, r, s, c, boundsW, boundsH, spriteImg) {
    super(x, y, r, s, c, boundsW, boundsH);
  }

  handleInput() {
    let move = createVector(0, 0);

    if (keyIsDown(LEFT_ARROW)) move.x -= 1;
    if (keyIsDown(RIGHT_ARROW)) move.x += 1;
    if (keyIsDown(UP_ARROW)) move.y -= 1;
    if (keyIsDown(DOWN_ARROW)) move.y += 1;

    if (move.mag() > 0) {
      move.setMag(this.maxSpeed);
      this.vel = move;
    } else {
      this.vel.mult(0.9);
    }

    this.pos.add(this.vel);
    this.constrain();
  }

  update() {
    this.handleInput();
    this.wallcheck();
  }
  
  display() {
    const size = this.r * 2;

    noStroke();
    if (this.isIt) { // player is IT red
    fill(255, 80, 80, 230);
    } else { // player, not IT yellow
    fill(255, 230, 120, 230);
    }
    ellipse(this.pos.x, this.pos.y, size * 1.6);

    if (this.spriteImg) {
    imageMode(CENTER);
    image(this.spriteImg, this.pos.x, this.pos.y, size, size);
    imageMode(CORNER);
    }
    }
}


class TagFriend extends Character {
  constructor(x, y, r, s, c, boundsW, boundsH, friendId, spriteImg) {
    super(x, y, r, s, c, boundsW, boundsH, spriteImg);
    this.mode = "run";
    this.friendId = friendId;
  }

  seek(targetPos) {
    let desired = p5.Vector.sub(targetPos, this.pos);
    desired.setMag(this.maxSpeed);
    this.applyForce(desired);
  }

  flee(player) {
    let desired = p5.Vector.sub(this.pos, player.pos).mult(1); // away
    desired.setMag(this.maxSpeed);
    this.applyForce(desired);
  }

  display() {
    const size = this.r * 2;

    // colored underneath
    noStroke();
    if (this.isIt) { // player is IT red
    fill(255, 80, 80, 230);
    } else { // player, not IT white
    fill(255, 255, 255, 220);
    }
    ellipse(this.pos.x, this.pos.y, size * 1.6);

    if (this.spriteImg) {
    imageMode(CENTER);
    // image(this.spriteImg, this.pos.x, this.pos.y, size, size);
    imageMode(CORNER);
    }
  }

  updateBehavior(player) {
    if (this.isIt) {
      this.seek(player.pos);
    } else {
      let distance = p5.Vector.dist(this.pos, player.pos);

      if (distance < 100) {
        this.flee(player);
      } else {
        this.wander();
      }
    }
  }

  update(player) {
    this.wallcheck();
    this.updateBehavior(player);
    this.physicsUpdate();
  }
}
