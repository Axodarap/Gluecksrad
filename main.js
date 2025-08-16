/*import { Wheel } from "https://cdn.jsdelivr.net/npm/spin-wheel@4.3.0/dist/spin-wheel-esm.js";*/


const wheelContainer = document.getElementById("wheel-container");
const wheelProps = {
  items: [
    { label: 'one' },
    { label: 'two' },
    { label: 'three' },
  ],
  itemBackgroundColors: ['#fff', '#6e0f0fff', '#2d2baaff'],
  itemLabelFontSizeMax: 40,
  rotationResistance: -100,
  rotationSpeedMax: 1000,
  isInteractive: false,
};

var wheel = new spinWheel.Wheel(wheelContainer, wheelProps);


function clicked() {
  
  wheelProps.items.push({ label: 'test' }); // add a new item
  wheel.init(wheelProps)
  
}

