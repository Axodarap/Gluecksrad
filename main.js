import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js';
import * as config from './config.js';
import {loadImages} from './util.js';


/* ------------------------ global variables ------------------------ */

let items = [];
let wheelProps = config.WHEEL_PROPS;
let activeScreen = "mainScreen";





window.onload = async () => {

  await loadImages(config.IMAGES);

  // Initialize wheel with props after loading
  const wheelContainer = document.getElementById("wheelContainer");
  let wheel = new Wheel(wheelContainer, wheelProps);

  // Show the wheel container 
  document.getElementById("wheelContainer").style.visibility = "visible"; 
}



/* ----------------- event listeners ----------------------- */
document.getElementById("wheelContainer").addEventListener("click", pickItem);

document.getElementById("editWheelButton").addEventListener("click", toggleScreens);
document.getElementById("CloseAddItemButton").addEventListener("click", toggleScreens);

document.getElementById("addItemButton").addEventListener("click", function() {
  addItem(document.getElementById("addItemInput").value);
});

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
  if(!item) return;
   
  // add item to wheel
  items.push({label: item})
  wheelProps.items = items;

  // get ui elements
  const itemInput = document.getElementById('addItemInput');
  const itemList = document.getElementById("itemList"); 
  
  // create item wrapper div
  const newItem = document.createElement('div');
  newItem.className = "item";

  // create span text
  const span = document.createElement('span');
  span.className = "item-text";
  span.textContent = item; // safer, no HTML injection

  // create remove button
  const button = document.createElement('button');
  button.className = "remove-item-button";
  button.textContent = "×";

  button.addEventListener("click", () => removeItem(newItem));

  // assemble the item
  newItem.appendChild(span);
  newItem.appendChild(button);

  // add to list
  itemList.appendChild(newItem);

  // Clear input
  itemInput.value = '';
  itemInput.focus();
}

/**
 * Removes an item from the wheel.
 */
function removeItem(item) {
    if (!item) return;

    // Get the label text from the DOM element
    const label = item.querySelector(".item-text").textContent;

    // Remove from the JS array
    const index = items.findIndex(obj => obj.label === label);
    if (index !== -1) {
        items.splice(index, 1);
        wheelProps.items = items; // update wheelProps
        wheel.init(wheelProps);   // reinitialize wheel
    }

    // Add removing class for animation
    item.classList.add('removing');

    // Remove from the DOM
    setTimeout(() => {
      item.remove();
    }, config.REMOVE_ITEM_DELAY);
    
}

/**
 * Updates the overlay image based on the current number of items.
 * also adds items from the wheel props to the wheel
 */
function updateWheelUI(){
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
    secondaryScreen.style.display = "flex";
    activeScreen = "secondaryScreen";
  } else {
    mainScreen.style.display = "grid"; 
    secondaryScreen.style.display = "none";
    activeScreen = "mainScreen";

    updateWheelUI();
  }
}



