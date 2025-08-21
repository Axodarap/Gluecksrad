/*
* Configuration settings for the application.
*/
import { easeOutExpo, easeOutQuad } from './util.js';

const emptyWheelOverlay = new Image();  
const wheelOverlay = new Image();
emptyWheelOverlay.src = './img/empty-wheel-background.svg';
wheelOverlay.src = './img/wheel-overlay.svg';

export const IMAGES = [emptyWheelOverlay, wheelOverlay];

export const SPIN_DURATION = 10000;
export const EASING_FUNCTION = easeOutQuad;

/* wheel props */
export const WHEEL_PROPS = {
  items: [],
  radius: 0.84,
  itemBackgroundColors: ['#fff', '#6e0f0fff', '#2d2baaff'],
  itemLabelFontSizeMax: 40,
  rotationResistance: -100,
  rotationSpeedMax: 1000,
  isInteractive: false,
  lineWidth: 0,
  borderWidth: 0,
  overlayImage: IMAGES[0],
};

/* add item screen */
export const REMOVE_ITEM_DELAY = 300;   // care, when changing this .item.removing style has to be adjusted as well