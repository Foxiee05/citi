//RANDOM INTEGER
//This function is created as the result of me following Renick Bell's lesson week 5
//Bell R (n.d.) p5js week 05, Renick Bell website, accessed 24 March 2026. https://renickbell.net/doku.php?id=p5js-week-05
function randomInteger(min, max) {
  return Math.floor(min + (max - min + 1) * Math.random());
}

//BUILD ARRAY FUNCTION
//This function is also created as the result of me following Renick Bell's lesson week 5
function buildArray(n, fillFunction) {
  let outputArray = [];
  for (let i = 0; i < n; i++) {
    outputArray.push(fillFunction(i));
  }
  return outputArray;
}



//buildings spawner
function spawnBuilding(layer) {
  let bW = random(150, 400);
  let bH = random(500, 1100); 
  let currentScroll = [scroll1, scroll2, scroll3][layer];
  
  let data = { 
    spawnScroll: currentScroll, 
    w: bW, 
    h: bH, 
    type: randomInteger(0,10),
    offsetX: width + 400 
  };
  
  if (layer === 0) farBuildings.push(data);
  else if (layer === 1) midBuildings.push(data);
  else nearBuildings.push(data);
}

function drawBuildings(layer, currentScroll) {
  let list = [farBuildings, midBuildings, nearBuildings][layer];
  let dayImgs = [bFarDay, bMidDay, bNearDay][layer];
  let nightImgs = [bFarNight, bMidNight, bNearNight][layer];
  let scale = [0.6, 0.9, 1.3][layer];

  for (let i = list.length - 1; i >= 0; i--) {
    let b = list[i];
    let xPos = b.offsetX - (currentScroll - b.spawnScroll) * (1 / increment);
    
    let imgSet = isSun ? dayImgs : nightImgs;
    let img = imgSet[b.type % imgSet.length];
    
    let drawH = b.h * scale;
    let drawW = b.w * scale;
    image(img, xPos, height - (drawH / 2), drawW, drawH);

    if (xPos < -1000) list.splice(i, 1);
  }
}

function drawSingleTree(layer, x, y) {
  let img, treeSize;
  
  if (layer === 0) { // Far
    img = isSun ? treeFarDay : treeFarNight;
    treeSize = 40; 
  } else if (layer === 1) { // Mid
    img = isSun ? treeMidDay : treeMidNight;
    treeSize = 70; 
  } else { // Near
    img = isSun ? treeNearDay : treeNearNight;
    treeSize = 120; 
  }

  let aspect = img.width / img.height;
  image(img, x, y - (treeSize / 2), treeSize * aspect, treeSize);
}




function drawLoadingScreen() {
  background(147, 186, 73); 
  
  // Draw a simple loading bar
  noStroke();
  fill(255, 255, 255);
  rect(width/2 - 100, height/2, 200, 10, 5); // Background of bar
  
  // Animated "fake" progress based on frameCount
  // (Real progress requires a more complex XHR setup, but this looks great)
  let barWidth = map(sin(frameCount * 0.1), -1, 1, 50, 200);
  fill(targetFarColor || '#739ff1'); 
  rect(width/2 - 100, height/2, barWidth, 10, 5);
  
  textAlign(CENTER);
  textFont('monospace');
  textSize(20);
  fill(255);
  text("BUILDING LANDSCAPE...", width/2, height/2 - 20);
}



