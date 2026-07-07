//Start:🕒 2026-07-06 Monday 18:15:17
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle
import {CONFIG,Balls,pullCount,pullAngle,gravity,set} from '../script.js';

export function updatePhysics(dt) {
    // ===== STEP 1: Update angles (pure angular, no conversion) =====
    for (let i = 0; i < Balls.length; i++) {
        const ballState = Balls[i].state;
        ballState.angle += ballState.angularVelocity * dt + 0.5 * ballState.angularAcceleration_old * dt * dt;
    }
    // ===== STEP 2: Angular collision detection (no Cartesian conversion!) =====
    for (let iter = 0; iter < 10; iter++) {  // Reduced from 20 to 10
        let collisionDetected = false;
        for (let i = 0; i < Balls.length - 1; i++) {
            const Ball1 = Balls[i].state;
            const Ball2 = Balls[i + 1].state;
            // Calculate x-positions directly from angles
            const x1 = Ball1.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(Ball1.angle);
            const x2 = Ball2.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(Ball2.angle);
            const dx = x2 - x1;
            // For collisions, we mainly care about horizontal distance
            // since balls are at similar heights when colliding
            const minDist = CONFIG.ballRadius * 2;
            if (Math.abs(dx) < minDist) {
                // Quick angle-based separation
                const angleToMove = (minDist - Math.abs(dx)) / CONFIG.stringLength;
                if (dx > 0) {
                    Ball1.angle -= angleToMove * 0.5;
                    Ball2.angle += angleToMove * 0.5;
                } else {
                    Ball1.angle += angleToMove * 0.5;
                    Ball2.angle -= angleToMove * 0.5;
                }
                // Clamp angles
                Ball1.angle = Math.max(-Math.PI/2, Math.min(Math.PI/2, Ball1.angle));
                Ball2.angle = Math.max(-Math.PI/2, Math.min(Math.PI/2, Ball2.angle));
                collisionDetected = true;
            }
        }
        if (!collisionDetected) break;
    }
    // ===== STEP 3: Update angular acceleration =====
    for (let i = 0; i < Balls.length; i++) {
        const ballState = Balls[i].state;
        const angularAcceleration_old = ballState.angularAcceleration_old;
        // Use exact pendulum equation (not small-angle approximation)
        ballState.angularAcceleration_old = -(Math.abs(gravity) / CONFIG.stringLength) * Math.sin(ballState.angle);
        ballState.angularVelocity += 0.5 * (angularAcceleration_old + ballState.angularAcceleration_old) * dt;
    }
    // ===== STEP 4: Angular velocity collisions =====
    for (let iter = 0; iter < 10; iter++) {
        let collisionDetected = false;
        for (let i = 0; i < Balls.length - 1; i++) {
            const Ball1 = Balls[i].state;
            const Ball2 = Balls[i + 1].state;
            const x1 = Ball1.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(Ball1.angle);
            const x2 = Ball2.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(Ball2.angle);
            const dx = x2 - x1;
            const minDist = CONFIG.ballRadius * 2;
            if (Math.abs(dx) <= minDist + 0.01 && Math.abs(dx) > 0.001) {
                // Simple elastic collision with angular velocities
                // Since masses are equal, just swap velocities
                const v1_old = Ball1.angularVelocity;
                const v2_old = Ball2.angularVelocity;
                // Only resolve if approaching
                if ((dx > 0 && v1_old > v2_old) || (dx < 0 && v1_old < v2_old)) {
                    Ball1.angularVelocity = v2_old;
                    Ball2.angularVelocity = v1_old;
                    collisionDetected = true;
                }
            }
        }
        if (!collisionDetected) break;
    }
    // ===== STEP 5: Convert to Cartesian ONCE for rendering =====
    for (let i = 0; i < Balls.length; i++) {
        const ballState = Balls[i].state;
        ballState.x = ballState.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(ballState.angle);
        ballState.y = ballState.topPivot_Y - CONFIG.stringLength * Math.cos(ballState.angle);
    }
    // ===== STEP 6: Energy restoration =====
    // if (totalSystemEnergy > 0) {
    //     let currentEnergy = 0;
    //     const restState_Y = -CONFIG.frameHeight / 2;
    //     for (let i = 0; i < Balls.length; i++) {
    //         const ballState = Balls[i].state;
    //         const tangentialSpeed = ballState.angularVelocity * CONFIG.stringLength;
    //         const kinetic = 0.5 * CONFIG.ballMass * tangentialSpeed * tangentialSpeed;
    //         const height = ballState.y - restState_Y;
    //         const potential = CONFIG.ballMass * Math.abs(gravity) * height;
    //         currentEnergy += kinetic + potential;
    //     }
    //     if (currentEnergy < totalSystemEnergy && currentEnergy > 0) {
    //         const energyRatio = Math.sqrt(totalSystemEnergy / currentEnergy);
    //         for (let i = 0; i < Balls.length; i++) {
    //             Balls[i].state.angularVelocity *= energyRatio;
    //         }
    //     }
    // }
}
export function pullBalls(side) {
    const angle = pullAngle * Math.PI / 180;
    if (side === 'left') {
        for (let i = 0; i < pullCount; i++) {
            const ballState = Balls[i].state;
            ballState.angle = -angle;
            ballState.angularVelocity = 0;
            ballState.angularAcceleration_old = -(Math.abs(gravity) / CONFIG.stringLength) * Math.sin(-angle);
            // Update Cartesian position
            ballState.x = ballState.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(-angle);
            ballState.y = ballState.topPivot_Y - CONFIG.stringLength * Math.cos(-angle);
        }
    } else if (side === 'right') {
        for (let i = 0; i < pullCount; i++) {
            const idx = Balls.length - 1 - i;
            const ballState = Balls[idx].state;
            ballState.angle = angle;
            ballState.angularVelocity = 0;
            ballState.angularAcceleration_old = -(Math.abs(gravity) / CONFIG.stringLength) * Math.sin(angle);
            // Update Cartesian position
            ballState.x = ballState.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(angle);
            ballState.y = ballState.topPivot_Y - CONFIG.stringLength * Math.cos(angle);
        }
    }
    set('tse',calculateSystemEnergy());
}
export function calculateSystemEnergy() {
    let totalEnergy = 0;
    const restState_Y = -CONFIG.frameHeight / 2;
    for (let i = 0; i < Balls.length; i++) {
        const ballState = Balls[i].state;
        const vSquared = ballState.vx * ballState.vx + ballState.vy * ballState.vy;
        const kinetic = 0.5 * CONFIG.ballMass * vSquared;
        const height = ballState.y - restState_Y;
        const potential = CONFIG.ballMass * Math.abs(gravity) * height;
        totalEnergy += kinetic + potential;
    }
    return totalEnergy;
}
