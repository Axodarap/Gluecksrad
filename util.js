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
