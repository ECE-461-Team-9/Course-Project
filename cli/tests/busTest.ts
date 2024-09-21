import { BusFactor } from "../lib/models/BusFactor";

async function calculateBusFactor() {
    const busFactor = new BusFactor('https://github.com/facebook/react');
    const score = await busFactor.getScore();
    console.log(`Bus Factor score: ${score}`);
}
  
calculateBusFactor();


/*
https://github.com/hasansultan92/watch.js -- LOW
https://github.com/mrdoob/three.js/ -- HIGH
https://github.com/socketio/socket.io  --MED
https://github.com/prathameshnetake/libvlc -- LOW
https://github.com/facebook/react -- HIGH
https://github.com/ryanve/unlicensed -- LOW


Bus Factor score: 0
Bus Factor score: 0.9666666666666667
Bus Factor score: 0.5
Bus Factor score: 0
Bus Factor score: 0.8333333333333334
Bus Factor score: 0

*/