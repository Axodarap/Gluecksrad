/**
 * Easing function.
 */
export function easeSinOut(n) {
  return Math.sin((n * Math.PI) / 2);
}

export function easeOutExpo( t ) {

    if( t === 1 ) {
        return 1;
    }

    return ( -Math.pow( 2, -10 * t ) + 1 );

}

export function easeOutQuad( t ) {
    return t * ( 2 - t );
}



/**
 * Attempt to load all images (of type HTMLImageElement) in the given array.
 * The browser will download the images and decode them so they are ready to be used.
 * An error will be thrown if any image fails to load.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode
 */
export async function loadImages(images = []) {
  const promises = [];

  for (const img of images) {
    if (img instanceof HTMLImageElement) promises.push(img.decode());
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    throw new Error('An image could not be loaded');
  }
}