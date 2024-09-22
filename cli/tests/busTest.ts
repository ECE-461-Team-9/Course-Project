import { BusFactor } from "../lib/models/BusFactor";
import { Correctness } from "../lib/models/Correctness";

//

async function calculateBusFactor() {
    const busFactor = new BusFactor('https://github.com/facebook/react');
    await busFactor.init();
    const score = await busFactor.getScore();
    console.log(`Bus Factor score: ${score}`);
}

async function calculateCorrectnss() {
    const busFactor = new Correctness('https://github.com/jasdeepkhalsa/jest-unit-testing-examples');
    await busFactor.init();
    const score = busFactor.getScore();
    console.log(`Bus Factor score: ${score}`);
}
  
calculateCorrectnss();


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



30/30 tests jest:

https://github.com/eduter/screeps-typescript-jest-starter

*/