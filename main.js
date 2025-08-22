import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js';
import * as config from './config.js';
import {loadImages} from './util.js';


/* ------------------------ global variables ------------------------ */

let items = [];
let wheelProps = config.WHEEL_PROPS;
let activeScreen = "mainScreen";

let isSpinning = false;
let currentWinner = null;

const wheelContainer = document.getElementById("wheelContainer");
let wheel = new Wheel(wheelContainer, wheelProps);



window.onload = async () => {

  await loadImages(config.IMAGES);

  // Initialize wheel with props after loading
  wheel.init(wheelProps);

  // Show the wheel container after loading
  document.getElementById("wheelContainer").style.visibility = "visible"; 
}



/* ----------------- event listeners ----------------------- */
document.getElementById("wheelContainer").addEventListener("click", pickItem);
document.getElementById("editWheelButton").addEventListener("click", toggleScreens);

document.getElementById("btnModalClose").addEventListener("click", closeWinnerModal);
document.getElementById("btnRemoveWinner").addEventListener("click", removeWinner);

document.getElementById("CloseAddItemButton").addEventListener("click", toggleScreens);

document.getElementById("ClearButton").addEventListener("click", clearItems);

document.getElementById("addItemButton").addEventListener("click", function() {
  addItem(document.getElementById("addItemInput").value);
});
document.getElementById("addItemInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addItem(document.getElementById("addItemInput").value);
  }
});

/* ------------------------ functions ------------------------ */
/**
 * Picks a random item from the wheel.
 */
function pickItem(){
  if(isSpinning) return;

  isSpinning = true;

  const winningIndex = Math.floor(Math.random() * items.length);
  const duration = config.SPIN_DURATION;
  wheel.spinToItem(winningIndex, duration, true, 4, 1, config.EASING_FUNCTION);
  let selItem = items[winningIndex];
  console.log(selItem);

  currentWinner = selItem;
  setTimeout(() => {
    openWinnerModal(selItem);
    isSpinning = false;
  }, config.SPIN_DURATION + config.WINNER_REVEAL_DELAY);
}

/**
 * Adds a new item to the wheel.
 */
function addItem(item){
  if(!item) return;
   
  // add item to wheel
  items.push(item);
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

  button.addEventListener("click", () => removeItem(item));

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
 * @param {string} item - item to remove.
 */
function removeItem(item) {
   
  // Remove from the JS array
  const index = items.indexOf(item);
  if (index !== -1) {
      items.splice(index, 1);
  }

  // Find the DOM element based on its text content
  const itemList = document.getElementById("itemList");
  const itemElement = Array.from(itemList.querySelectorAll(".item"))
    .find(el => el.querySelector(".item-text")?.textContent === item);

  console.log("itemElement:", itemElement.lenth);

  if (itemElement) {
    itemElement.classList.add("removing");
    setTimeout(() => {
      itemElement.remove();
    }, config.REMOVE_ITEM_DELAY);
  } 
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

  // load items into wheelProps
  wheelProps.items = items.map(item => ({ label: item }));

  wheel.init(wheelProps);
}

/**
 * Clears all items from the list & the wheel.
 */
function clearItems() {
  // Clear the JS array
  items = [];
  wheelProps.items = [];

  // Remove all DOM elements with animation
  const itemList = document.getElementById("itemList");
  const itemElements = Array.from(itemList.querySelectorAll(".item"));

  itemElements.forEach((itemElement, idx) => {
    itemElement.classList.add("removing");
    setTimeout(() => {
      itemElement.remove();
      // Optionally update the wheel UI after all are removed
      if (idx === itemElements.length - 1) {
        updateWheelUI();
      }
    }, config.REMOVE_ITEM_DELAY);
  });

  // If there are no items, update the wheel UI immediately
  if (itemElements.length === 0) {
    updateWheelUI();
  }
}

/* ------------------------ addItems stuff ------------------------ */
function toggleScreens(){
  if(isSpinning) return;

  let mainScreen = document.getElementById("mainScreen");
  let secondaryScreen = document.getElementById("secondaryScreen");

  if(activeScreen === "mainScreen") {
    mainScreen.style.display = "none"; 
    secondaryScreen.style.display = "flex";
    activeScreen = "secondaryScreen";
    document.getElementById("addItemInput").focus();

  } else {
    mainScreen.style.display = "grid"; 
    secondaryScreen.style.display = "none";
    activeScreen = "mainScreen";

    updateWheelUI();
  }
}

/* ------------------------- winner modal -------------------------*/
/* Opens a modal to display the winner.
 * @param {string} winner - The label of the winning item.
 */
function openWinnerModal(winner) {
  document.getElementById("winnerTitle").textContent = winner;
  document.getElementById("resultsModal").style.display = "flex";
}

/* Closes the winner modal. */
function closeWinnerModal() {
  document.getElementById("resultsModal").style.display = "none";
  updateWheelUI();
}

function removeWinner() {
  removeItem(currentWinner);

  closeWinnerModal();
}
