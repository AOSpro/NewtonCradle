//Start:🕒 2026-07-06 Monday 18:15:17
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle

import {CONFIG,Balls,pullCount,pullAngle,gravity} from '../script.js';

export function updatePhysics(dt) {

    for (let i = 0; i < Balls.length; i++) {

        const ballState = Balls[i].state;

        ballState.vy += gravity * dt * CONFIG.ballMass;
    }

    for (let i = 0; i < Balls.length; i++) {

        const ballState = Balls[i].state;

        ballState.x += ballState.vx * dt;
        ballState.y += ballState.vy * dt;
    }

    // string constraint — ALWAYS project velocity onto tangent
    // This removes any radial component (including gravity-induced)
    // so resting balls at the bottom stay perfectly still
    for (let i = 0; i < Balls.length; i++) {

        const ballState = Balls[i].state;

        const dx = ballState.x - ballState.oldBallCenterPosition_X;
        const dy = ballState.y - ballState.topPivot_Y;

        const distance = Math.sqrt((dx * dx) + (dy * dy));

            const normalizedVector_X = dx / distance;
            const normalizedVector_Y = dy / distance;

            if (distance > CONFIG.stringLength) {

                ballState.x = ballState.oldBallCenterPosition_X + (normalizedVector_X * CONFIG.stringLength);
                ballState.y = ballState.topPivot_Y + (normalizedVector_Y * CONFIG.stringLength);
            }

            // ALWAYS project velocity onto tangent (remove radial component)
            // This is the key fix: without it, gravity adds a tiny radial velocity
            // each frame that never gets removed when dist == len exactly
            const velDotNorm = ballState.vx * normalizedVector_X + ballState.vy * normalizedVector_Y;
            ballState.vx -= velDotNorm * normalizedVector_X;
            ballState.vy -= velDotNorm * normalizedVector_Y;

    }


    for (let iter = 0; iter < 20; iter++) {

        let collisionDetected = false;

        for (let i = 0; i < Balls.length - 1; i++) {

            const Ball1 = Balls[i].state;
            const Ball2 = Balls[i + 1].state;

            const collisionDistant = CONFIG.ballRadius * 2;

            const dx = Ball2.x - Ball1.x;
            const dy = Ball2.y - Ball1.y;
            const distant = Math.sqrt(dx * dx + dy * dy);

            if (distant <= collisionDistant) {

                const nx = dx / distant;
                const ny = dy / distant;

                const dvx = Ball1.vx - Ball2.vx;
                const dvy = Ball1.vy - Ball2.vy;
                const dvn = dvx * nx + dvy * ny;

                // Only resolve if approaching (prevents jitter on resting contacts)
                if (dvn > 0) {

                    // Perfect elastic collision (equal masses) — swap normal velocities
                    Ball1.vx -= dvn * nx;
                    Ball1.vy -= dvn * ny;
                    Ball2.vx += dvn * nx;
                    Ball2.vy += dvn * ny;

                    collisionDetected = true;
                }

                if (distant < collisionDistant) {

                    const overlap = collisionDistant - distant;

                    Ball1.x -= nx * overlap;
                    Ball1.y -= ny * overlap;
                    Ball2.x += nx * overlap;
                    Ball2.y += ny * overlap;
                }

            }

        }

        if (!collisionDetected) break;//from outer loop

    }


}

export function pullBalls(side) {

    const Angle = Math.PI * pullAngle / 180;

    if (side === 'left') {

        for (let i = 0; i < pullCount; i++) {

            const ballState = Balls[i].state;

            ballState.x = ballState.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(-Angle);
            ballState.y = ballState.topPivot_Y - CONFIG.stringLength * Math.cos(-Angle);

            // const boxGeo = new THREE.SphereGeometry(CONFIG.ballRadius, 16, 16);
            // const boxMat = new THREE.MeshBasicMaterial({color: 0xffffff});
            // const box = new THREE.Mesh(boxGeo,boxMat)
            // box.position.x = -10;
            // box.position.y = 4;
            // scene.add(box);
        }

    } else if (side === 'right') {

        for (let i = 0; i < pullCount; i++) {

            const idx = Balls.length - 1 - i;
            const ballState = Balls[idx].state;

            ballState.x = ballState.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(Angle);
            ballState.y = ballState.topPivot_Y - CONFIG.stringLength * Math.cos(Angle);
        }

    }

}
