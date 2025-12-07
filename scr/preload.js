let mapImg;
let iconsImg;
let mapX = 0;
let mapY = 0;
let mapWidth;
let mapHeight;
let clickRadius = 20;
let clickAudio;

let viewpoints_images = {};
let friends_images = {};

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

  ["ringbell1", 0.40, 0.17],
  ["ringbell2", 0.75, 0.135],
  ["ringbell3", 0.2, 0.4],
  ["ringbell4", 0.76, 0.44],
  ["ringbell5", 0.44, 0.76],

  // ["duck", 0.56, 0.65],
  // ["bike", 0.33, 0.36],
  // ["tag",  0.74, 0.81]
];


const FRIEND_IMAGE_IDS = [
  "friendA_RB", "friendA_tag",
  "friendB_RB", "friendB_tag",
  "friendC_RB", "friendC_tag",
  "friendD_RB", "friendD_tag",
  "friendE_RB", "friendE_tag"
];



// preload resources for main 
function preload() {

  mapImg = loadImage("images/main.jpg");
  iconGamesImg = loadImage("images/icon_games.png");
  iconRingbellsImg = loadImage("images/icon_ringbells.png");
  iconViewpointsImg = loadImage("images/icon_viewpoints.png");
  iconViewpointsMockImg = loadImage("images/icon_viewpointsmock.PNG");
  ringbellBaseImg = loadImage("images/backdropRingbell.png");
  

  // Load viewpoints images
  for (let item of mapclickables) {
    let id = item[0];

    if (id.startsWith("viewpoint")) {
      viewpoints_images[id] = loadImage(`images/${id}.png`);
    }
  }

  // Load ringbell 
  ringbell = loadImage("images/backdropRingbell.png");
    
  console.log("before loading")
  // Load friends images
  for (let id of FRIEND_IMAGE_IDS) {
    friends_images[id] = loadImage(`images/${id}.PNG`);
    console.log("loaded")
  }

  console.log("loaded all", friends_images)
  // Load font 
  pixelFont = loadFont("libraries/04B_03__.TTF");
}



let FRIENDS = {
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
