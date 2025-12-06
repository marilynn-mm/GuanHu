
let openTabs = [];

// const GAME_SLOT     = { x: 420, y: 20,  w: 360, h: 260 };
// const RINGBELL_SLOT = { x: 420, y: 300, w: 360, h: 120 };
let VIEWPOINT_SLOTS = [
{ id: "viewpoint", x: 10, y: 200},
// { x: 540, y: 440, w: 110, h: 110 },
// { x: 660, y: 440, w: 110, h: 110 },
// add more if needed
];


function setUpTabs(mapWidth) {
    const rightPanelX = mapWidth;

    VIEWPOINT_SLOTS = [
        { id: "viewpoint1", x: mapWidth + 10, y: 200},
        // add more if needed
    ];
}


function openViewpoint(id, img) {
  // Find open viewpoint slot
  for (let slot of VIEWPOINT_SLOTS) {

    // If the slot is free, create a new viewpoint tab
    let occupied = false;
    for (let t of openTabs) {
      if (t.x === slot.x && t.y === slot.y) {
        occupied = true;
        drawText("You have too many tabs open :(")
        break;
      }
    }

    // If no tab is using this slot, we can put new viewpoint here
    if (!occupied) {
      
      openTabs.push(new ViewpointTab(slot.x, slot.y, img));
      openTabs[0].drawFrame();
      return;
    }
  }
}
