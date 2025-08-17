import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js';
import { easeOutExpo, easeOutQuad } from './util.js';

let items = [];

const wheelContainer = document.getElementById("wheelContainer");
const wheelProps = {
  items: items,
  itemBackgroundColors: ['#fff', '#6e0f0fff', '#2d2baaff'],
  itemLabelFontSizeMax: 40,
  rotationResistance: -100,
  rotationSpeedMax: 1000,
  isInteractive: false,
  lineWidth: 0,
  borderWidth: 1,
};

var wheel = new Wheel(wheelContainer, wheelProps);

function pickItem(){
  const winningIndex = Math.floor(Math.random() * items.length);
  const duration = 10000;
  wheel.spinToItem(winningIndex, duration, true, 4, 1, easeOutQuad);
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