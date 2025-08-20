import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js';
import * as config from './config.js';
import {loadImages} from './util.js';


/* ------------------------ global variables ------------------------ */

let items = [];
let wheelProps = config.WHEEL_PROPS;
let activeScreen = "mainScreen";


const wheelContainer = document.getElementById("wheelContainer");
let wheel = new Wheel(wheelContainer, wheelProps);


window.onload = async () => {

  await loadImages(config.IMAGES);

  // Show the wheel container after loading
  document.getElementById("wheelContainer").style.visibility = "visible"; 
}



/* ----------------- event listeners ----------------------- */
document.getElementById("editButton").addEventListener("click", function() {
  addItem('test');
});
document.getElementById("wheelContainer").addEventListener("click", pickItem);

document.getElementById("debugReturnButton").addEventListener("click", toggleScreens);
document.getElementById("wheelContainer").addEventListener("click", toggleScreens); // DEBUGGING


/* ------------------------ functions ------------------------ */
/**
 * Picks a random item from the wheel.
 */
function pickItem(){
  const winningIndex = Math.floor(Math.random() * items.length);
  const duration = config.SPIN_DURATION;
  wheel.spinToItem(winningIndex, duration, true, 4, 1, config.EASING_FUNCTION);
  let selItem = items[winningIndex];
  console.log(selItem.label);
}

/**
 * Adds a new item to the wheel.
 */
function addItem(item){
  items.push({label: item})
  wheelProps.items = items;
  wheel.init(wheelProps);

  updateOverlay();
}

/**
 * Removes an item from the wheel.
 */
function removeItem(index) {
  wheelProps.items.splice(index, 1);
  wheel.init(wheelProps);

  updateOverlay();
}

/**
 * Updates the overlay image based on the current number of items.
 */
function updateOverlay(){
  if(items.length == 0){
    wheelProps.overlayImage = config.IMAGES[0];  // TODO: fix this to not be a random index
    document.getElementById("emptyWheelText").style.visibility = "visible";
  }
  else {
    wheelProps.overlayImage = config.IMAGES[1]; // also change to images[1] once ready
    document.getElementById("emptyWheelText").style.visibility = "hidden";
  }
  wheel.init(wheelProps);
}


/* ------------------------ addItems stuff ------------------------ */
function toggleScreens(){
  let mainScreen = document.getElementById("mainScreen");
  let secondaryScreen = document.getElementById("secondaryScreen");

  if(activeScreen === "mainScreen") {
    mainScreen.style.display = "none"; 
    secondaryScreen.style.display = "grid";
    activeScreen = "secondaryScreen";
  } else {
    mainScreen.style.display = "grid"; 
    secondaryScreen.style.display = "none";
    activeScreen = "mainScreen";
  }
}



