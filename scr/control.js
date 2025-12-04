
function handleMapClick(mx, my) {
  const place = findPlaceUnderMouse(mx, my);

  if (place && place.id === "arena") {
    resetTagGame();   // set up variables for the game
    mode = "tag";     // now draw() and mousePressed() use the tag branches
  }
}

function handleTagClick(mx, my) {
  // Close the window button
  if (mx >= 10 && mx <= 90 && my >= 10 && my <= 40) {
    mode = "map";
  }

  // tag.checkClick() or checkMous() --> handle the detechtion for specific game 
