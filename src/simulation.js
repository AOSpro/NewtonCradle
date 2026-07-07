//Start:🕒 2026-07-06 Monday 18:15:17
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle
import {CONFIG,Balls,pullCount,pullAngle,scene,set} from '../script.js';
import {createFrame,frameGroup} from './frame.js';
import {createBallsAndStrings} from './objects.js';
export function resetSimulation() {
    const firstBallPosition = - (((CONFIG.ballCount / 2) * CONFIG.spacing) - CONFIG.ballRadius);
    Balls.forEach((Ball, index) => {
        const BallState = Ball.state;
        BallState.angle = 0;
        BallState.angularVelocity = 0;
        BallState.angularAcceleration_old = 0;  // Zero at rest position
        BallState.x = firstBallPosition + (index * CONFIG.spacing);
        BallState.y = CONFIG.frameHeight / 2 - CONFIG.stringLength;
    });
    set('tse',0);
}
export function rebuildSimulation() {
    Balls.forEach(ball => {
        scene.remove(ball.ballMesh);
        scene.remove(ball.frontString);
        scene.remove(ball.backString);
    });
    set('b',[]);
    scene.remove(frameGroup);
    set('pc',Math.min(pullCount, CONFIG.ballCount - 1));
    createFrame(scene);
    createBallsAndStrings(scene);
}
