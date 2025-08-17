import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js';
import * as config from './config.js';
import {loadImages} from './util.js';

/* ------------------------ global variables ------------------------ */

let items = [];


const emptyWheelImg = new Image();  //TODO: handle loading (see themes example for this)
emptyWheelImg.src = './img/empty-wheel-background.svg';


const wheelContainer = document.getElementById("wheelContainer");
const wheelProps = {
  items: items,
  radius: config.RADIUS,
  itemBackgroundColors: config.ITEM_BG_COLORS,
  itemLabelFontSizeMax: config.ITEM_LABEL_FONT_SIZE_MAX,
  rotationResistance: config.ROTATION_RESISTANCE,
  rotationSpeedMax: config.ROTATION_SPEED_MAX,
  isInteractive: config.IS_INTERACTIVE,
  lineWidth: config.LINE_WIDTH,
  borderWidth: config.BORDER_WIDTH,
  overlayImage: emptyWheelImg,
};




var wheel = new Wheel(wheelContainer, wheelProps);

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
}

/**
 * Removes an item from the wheel.
 */
function removeItem(index) {
  wheelProps.items.splice(index, 1);
  wheel.init(wheelProps);
}

/* ----------------- event listeners ----------------------- */
document.getElementById("editButton").addEventListener("click", function() {
  addItem('test');
});
document.getElementById("wheelContainer").addEventListener("click", pickItem);