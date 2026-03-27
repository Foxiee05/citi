//*************************
//    INITIALIZATION
//*************************

let music;
let isMusicPlaying = false;   // Music starts OFF

let isLoading = true;
let loadProgress = 0;
let displayedProgress = 0;

// Mountains & scrolling
let increment = 0.001;
let offset1 = 0;
let offset2 = 10000;
let lower = 100;

let scroll1 = 0;
let scroll2 = 0;
let scroll3 = 0;

// Colors
let farDay = '#AFCFCD';
let midDay = '#9B9E49';
let closeDay = '#576206';
let farNight = '#7396D8';
let midNight = '#2E655C';
let closeNight = '#0E2C37';

let colorFarDay, colorMidDay, colorCloseDay;
let colorFarNight, colorMidNight, colorCloseNight;

let targetFarColor, targetMidColor, targetCloseColor;
let currentFarColor, currentMidColor, currentCloseColor;

let BGdayTop = '#71BFFF';
let BGdayBottom = '#C2E3FF';
let BGnightTop = '#010410';
let BGnightBottom = '#122496';

let currentTop, currentBottom;

// Sun/Moon
let centerX, centerY;
let sunmoonX, sunmoonY;
let sunmoonSize = 300;
let r;
let currentAngle;
let targetAngle;
let isSun = true;

let sunIMG, moonIMG;

// Tree assets
let treeFarDay, treeMidDay, treeNearDay;
let treeFarNight, treeMidNight, treeNearNight;

// Building assets
let bFarDay = [], bMidDay = [], bNearDay = [];
let bFarNight = [], bMidNight = [], bNearNight = [];

let farBuildings = [], midBuildings = [], nearBuildings = [];
let spawnRate = 250;

// Stars
let starPosX = [];
let starPosY = [];

// Loading
let totalAssets = 0;
let loadedAssets = 0;
let overlayWasVisible = true;

//*************************
//    PRELOAD (Empty)
//*************************
function preload() {
  // Assets loaded manually in setup()
}

//*************************
//    SETUP
//*************************
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  centerX = windowWidth / 2;
  centerY = windowHeight / 1.5;
  r = windowWidth / 3;

  // Star positions
  for (let i = 0; i < 80; i++) {
    starPosX.push(random(0, windowWidth));
    starPosY.push(random(0, windowHeight));
  }

  imageMode(CENTER);

  // Color setup
  colorFarDay = color(farDay);
  colorMidDay = color(midDay);
  colorCloseDay = color(closeDay);
  colorFarNight = color(farNight);
  colorMidNight = color(midNight);
  colorCloseNight = color(closeNight);

  currentFarColor = colorFarDay;
  currentMidColor = colorMidDay;
  currentCloseColor = colorCloseDay;

  currentTop = color(BGdayTop);
  currentBottom = color(BGdayBottom);

  currentAngle = -PI / 4;
  targetAngle = -PI / 4;

  noiseDetail(3, 0.7);

  initLoadingBar();

  // Start loading assets
  loadAllAssets(() => {
    isLoading = false;
    // Music is NOT started automatically anymore
  });
}

//*************************
//    ASSET LOADING
//*************************
function loadAllAssets(onComplete) {
  const assetList = [
    'sound.mp3', 'sun.svg', 'moon.svg',
    'trees-day-far.svg', 'trees-day-mid.svg', 'trees-day-near.svg',
    'trees-night-far.svg', 'trees-night-mid.svg', 'trees-night-near.svg',
    'building-day-far1.svg', 'building-day-far2.svg',
    'building-day-mid1.svg', 'building-day-mid2.svg',
    'building-day-near.svg', 'building-day-near2.svg',
    'building-night-far1.svg', 'building-night-far2.svg',
    'building-night-mid1.svg', 'building-night-mid2.svg',
    'building-night-near.svg', 'building-night-near2.svg'
  ];

  totalAssets = assetList.length;
  loadedAssets = 0;
  loadProgress = 0;

  function onAssetLoaded() {
    loadedAssets++;
    loadProgress = loadedAssets / totalAssets;
  }

  // Load Sound
  music = loadSound('sound.mp3', onAssetLoaded);

  // Load Images
  sunIMG = loadImage('sun.svg', onAssetLoaded);
  moonIMG = loadImage('moon.svg', onAssetLoaded);

  treeFarDay = loadImage('trees-day-far.svg', onAssetLoaded);
  treeMidDay = loadImage('trees-day-mid.svg', onAssetLoaded);
  treeNearDay = loadImage('trees-day-near.svg', onAssetLoaded);
  treeFarNight = loadImage('trees-night-far.svg', onAssetLoaded);
  treeMidNight = loadImage('trees-night-mid.svg', onAssetLoaded);
  treeNearNight = loadImage('trees-night-near.svg', onAssetLoaded);

  bFarDay = [loadImage('building-day-far1.svg', onAssetLoaded), loadImage('building-day-far2.svg', onAssetLoaded)];
  bMidDay = [loadImage('building-day-mid1.svg', onAssetLoaded), loadImage('building-day-mid2.svg', onAssetLoaded)];
  bNearDay = [loadImage('building-day-near.svg', onAssetLoaded), loadImage('building-day-near2.svg', onAssetLoaded)];

  bFarNight = [loadImage('building-night-far1.svg', onAssetLoaded), loadImage('building-night-far2.svg', onAssetLoaded)];
  bMidNight = [loadImage('building-night-mid1.svg', onAssetLoaded), loadImage('building-night-mid2.svg', onAssetLoaded)];
  bNearNight = [loadImage('building-night-near.svg', onAssetLoaded), loadImage('building-night-near2.svg', onAssetLoaded)];

  // Final check
  const checkInterval = setInterval(() => {
    if (loadedAssets >= totalAssets) {
      clearInterval(checkInterval);
      if (onComplete) onComplete();
    }
  }, 100);
}

function initLoadingBar() {
  const htmlBar = document.getElementById('progress-bar');
  if (htmlBar) {
    htmlBar.style.transition = 'width 0.18s ease-out';
  }
}

//*************************
//    DRAW
//*************************
function draw() {
  runMainSketch();
}




//*************************
//    EVENTS
//*************************
function keyPressed() {
  if (key === ' ' && !isLoading) {        // Spacebar
    if (music && music.isLoaded()) {
      if (isMusicPlaying) {
        music.pause();
        isMusicPlaying = false;
      } else {
        music.loop();
        isMusicPlaying = true;
      }
    }
  }
}



function mousePressed() {
  for (let i = 0; i < 15; i++) {
    if (farBuildings.length > 0) farBuildings.shift();
    if (midBuildings.length > 0) midBuildings.shift();
    if (nearBuildings.length > 0) nearBuildings.shift();
  }
}

function mouseWheel(event) {
  targetAngle -= event.delta * 0.001;
  
  if (targetAngle >= PI/2) {
    targetAngle -= PI * 2;
    currentAngle -= PI * 2;
    isSun = !isSun;
  } else if (targetAngle < PI/2 - PI * 2) {
    targetAngle += PI * 2;
    currentAngle += PI * 2;
    isSun = !isSun;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}