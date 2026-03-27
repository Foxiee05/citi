//*************************
//    MAIN SKETCH
//*************************
function runMainSketch() {
  if (isLoading) {
    background(147, 186, 73);

    noStroke();
    fill(255);
    rect(width/2 - 150, height/2 + 20, 300, 12, 6);

    fill(255, 220, 80);
    rect(width/2 - 150, height/2 + 20, 300 * loadProgress, 12, 6);

    textAlign(CENTER, CENTER);
    textFont('monospace');
    textSize(28);
    fill(255);
    text("BUILDING LANDSCAPE...", width/2, height/2 - 60);

    // Smooth HTML progress bar
    const htmlBar = document.getElementById('progress-bar');
    if (htmlBar) {
      displayedProgress = lerp(displayedProgress, loadProgress, 0.15);
      const percent = Math.min(Math.max(displayedProgress * 100, 0), 100);
      htmlBar.style.width = percent + '%';
    }

    return;
  }

  // ========================
  // NORMAL SCENE
  // ========================

  currentAngle = lerp(currentAngle, targetAngle, 0.05);
  sunmoonX = centerX + r * cos(currentAngle);
  sunmoonY = centerY + r * sin(currentAngle);

  // Color switching
  let targetTop, targetBottom;
  if (isSun) {
    targetTop = color(BGdayTop);
    targetBottom = color(BGdayBottom);
    targetFarColor = colorFarDay;
    targetMidColor = colorMidDay;
    targetCloseColor = colorCloseDay;
  } else {
    targetTop = color(BGnightTop);
    targetBottom = color(BGnightBottom);
    targetFarColor = colorFarNight;
    targetMidColor = colorMidNight;
    targetCloseColor = colorCloseNight;
  }

  currentFarColor = lerpColor(currentFarColor, targetFarColor, 0.05);
  currentMidColor = lerpColor(currentMidColor, targetMidColor, 0.05);
  currentCloseColor = lerpColor(currentCloseColor, targetCloseColor, 0.05);
  currentTop = lerpColor(currentTop, targetTop, 0.05);
  currentBottom = lerpColor(currentBottom, targetBottom, 0.05);

  // Gradient
  for (let y = 0; y <= height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(currentTop, currentBottom, inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Sun / Moon + Stars
  if (isSun) {
    image(sunIMG, sunmoonX, sunmoonY, sunmoonSize, sunmoonSize);
  } else {
    for (let i = 0; i < 80; i++) {
      push();
      let twinkle = noise(frameCount * 0.05, i * 100);
      let starSize = map(twinkle, 0, 1, 1, 8);
      fill(255, 255, 255, map(twinkle, 0, 1, 150, 255));
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = 'white';
      noStroke();
      ellipse(starPosX[i], starPosY[i], starSize, starSize);
      pop();
    }
    image(moonIMG, sunmoonX, sunmoonY, sunmoonSize, sunmoonSize);
  }

  // Spawn buildings
  if (frameCount % floor(max(spawnRate, 2)) === 0) {
    spawnBuilding(randomInteger(0, 2));
  }

  // Draw mountains + buildings (Layer 1, 2, 3)
  // Far layer
  for (let x = 0; x < width; x++) {
    let y1 = map(noise(offset1 + x * increment + scroll1), 0, 1, 0, height);
    stroke(currentFarColor);
    strokeWeight(2);
    line(x, height, x, y1);
    let worldX = x + (scroll1 / increment);
    if (y1 <= height / 2 && Math.floor(worldX) % 70 === 0) {
      drawSingleTree(0, x, y1 + 10);
    }
  }
  drawBuildings(0, scroll1);

  // Mid layer
  for (let x = 0; x < width; x++) {
    let y2 = map(noise(offset2 + x * increment + scroll2), 0, 1, 0, height) + lower;
    stroke(currentMidColor);
    strokeWeight(2);
    line(x, height, x, y2);
    let worldX = x + (scroll2 / increment);
    if (y2 <= height / 2 && Math.floor(worldX) % 90 === 0) {
      drawSingleTree(1, x, y2 + 10);
    }
  }
  drawBuildings(1, scroll2);

  // Near layer
  for (let x = 0; x < width; x++) {
    let y3 = map(noise(offset1 + x * increment + scroll3, offset2 + x * increment + scroll3), 0, 1, 0, height) + lower * 1.5;
    stroke(currentCloseColor);
    strokeWeight(2);
    line(x, height, x, y3);
    let worldX = x + (scroll3 / increment);
    if (y3 <= height / 2 && Math.floor(worldX) % 110 === 0) {
      drawSingleTree(2, x, y3 + 10);
    }
  }
  drawBuildings(2, scroll3);

  scroll1 += 0.002;
  scroll2 += 0.005;
  scroll3 += 0.01;

  // Instructions
  textSize(30);
  textFont('monospace');
  fill('white');
  text('Click to clear buildings', 300, height - 50);
  text('Scroll to change day/night', width - 350, height - 50);
  text('Press SPACE to toggle music', width/2, height - 50);  

  // Hide loading overlay
  if (overlayWasVisible) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 600);
      overlayWasVisible = false;
    }
  }
}
