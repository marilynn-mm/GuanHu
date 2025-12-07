
let openTabs = [];

// let GAME_SLOT     = { x: 420, y: 20,  w: 360, h: 260 };
let RINGBELL_SLOT = { x: 10, y: 20};

// Base relative positions
let BASE_VIEWPOINT_SLOTS = [
  { id: "slot0", x: 10, y: 5 },
  { id: "slot1", x: 5, y: 150 },
  { id: "slot2", x: 15, y: 100 },
  { id: "slot3", x: 0, y: 50 },
];



function setUpTabs(mapWidth) {
  VIEWPOINT_SLOTS = BASE_VIEWPOINT_SLOTS.map(base => {
    return {
      id: base.id,
      x: base.x + mapWidth,
      y: base.y
    };
  });
    RINGBELL_SLOT = { x: 10 + mapWidth, y: 20};
}


function setUpFriends() {
    FRIENDS = {
    ringbell1: {
        id: "friendA",
        name: "Friend A",
        profileImg: friends_images["friendA_RB"],
        tagSprite: friends_images["friendA_tag"],
        lines: {
        idle: "Home of Friend A",
        ringing: "Ringing...",
        response: "We’re playing tag! Coming down!"
        }
    },
    ringbell2: {
        id: "friendB",
        name: "Friend B",
        profileImg: friends_images["friendB_RB"],
        tagSprite: friends_images["friendB_tag"],
        lines: {
        idle: "Home of Friend B",
        ringing: "Ringing...",
        response: "Oh, tag? Give me 2 seconds!"
        }
    },
    ringbell3: {
        id: "friendC",
        name: "Friend C",
        profileImg: friends_images["friendC_RB"],
        tagSprite: friends_images["friendC_tag"],
        lines: {
        idle: "Home of Friend C",
        ringing: "Ringing...",
        response: "TAG?? YES I'm sprinting down right now!"
        }
    },
    ringbell4: {
        id: "friendD",
        name: "Friend D",
        profileImg: friends_images["friendD_RB"],
        tagSprite: friends_images["friendD_tag"],
        lines: {
        idle: "Home of Friend D",
        ringing: "Ringing...",
        response: "Tag? You should start running! Game on."
        }
  },
  ringbell5: {
    id: "friendE",
    name: "Friend E",
    profileImg: friends_images["friendE_RB"],
    tagSprite: friends_images["friendE_tag"],
    lines: {
      idle: "Home of Friend E",
      ringing: "Ringing...",
      response: "Tag..? Mmm...I'm just waking up..ok."
    }
  },
};


  console.log("FRIENDS after setup:", FRIENDS);
}








function openViewpoint(img) {
  // Find open viewpoint slot
  for (let slot of VIEWPOINT_SLOTS) {
    

    // If the slot is free, create a new viewpoint tab
    let occupied = false;
    for (let t of openTabs) {
      if (t.x === slot.x && t.y === slot.y) {
        occupied = true;
        break;
      }
    }

    if (!occupied) {
      console.log("create new")
      openTabs.push(new ViewpointTab(slot.x, slot.y, img));
      openTabs[0].drawFrame();
      return;
    }
  }
  toomanyviewtabs = true;
//   console.log("too many")
}

function openRingbell(id) {
  // 1. Get the friend associated with this ringbell
  const friend = FRIENDS[id];
  console.log(friends_images)
  console.log("ringing ", friend)
  if (!friend) {
    console.error("No friend data for:", id);
    return;
  }

  // 2. Ensure only one ringbell tab exists at a time
  openTabs = openTabs.filter(t => t.type !== "ringbell");

  // 3. Create a new ringbell tab
  openTabs.push(
    new RingbellTab(
      RINGBELL_SLOT.x,
      RINGBELL_SLOT.y,
      friend              // the specific friend object
    )
  );
}



function drawText(msg) {
  textFont(pixelFont);
  textSize(14);

  fill(0);
  textAlign(RIGHT, TOP);

  const margin = 20;
  text(msg, width - margin, margin);
}

function addActiveFriend(friendId) {
  if (!activeFriends.includes(friendId)) {
    activeFriends.push(friendId);
  }
}


