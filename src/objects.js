//Start:🕒 2026-07-06 Monday 18:15:17
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle

import * as THREE from 'three';
import { Wireframe } from 'three/examples/jsm/Addons.js';
import {CONFIG,Balls} from '../script.js';
import {frameGroup} from './frame.js';

export function createBallsAndStrings(scene) {

    const firstBallPosition = - (((CONFIG.ballCount / 2) * CONFIG.spacing) - CONFIG.ballRadius) ;

    const stringTopPivot_Y = CONFIG.frameHeight / 2;
    const stringTopPivot_Z = CONFIG.frameDepth / 2;


    for (let i = 0; i < CONFIG.ballCount; i++) {

        const x = firstBallPosition + (i * CONFIG.spacing);
        //console.log(x);

        const y = stringTopPivot_Y - CONFIG.stringLength ;
        //console.log(y);

        // NoTe : changing the y here does not affect the top point
        // because it will be overwritten by the animation immediatelly
        const ballTopPoint = new THREE.Vector3(x, y + CONFIG.ballRadius, 0);

        const strTopFrontPivot = new THREE.Vector3(x, stringTopPivot_Y, stringTopPivot_Z);
        const StrTopBackPivot = new THREE.Vector3(x, stringTopPivot_Y, -stringTopPivot_Z);

        const state = {
            vx: 0,
            vy: 0,
            x: x,
            y: y,
            oldBallCenterPosition_X: x,//-4 first ball (initial values)
            topPivot_Y: stringTopPivot_Y,//4 all balls (initial values)
        };

        const ballGeometry = new THREE.SphereGeometry(CONFIG.ballRadius, 16, 16);
        const ballMaterial = new THREE.MeshStandardMaterial({
            color: 0xF7E8D0,
            metalness: 1,
            roughness: 0.1,
            //wireframe : true
        });
        const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
        scene.add(ballMesh);


        const frontStringGeometry = new THREE.BufferGeometry().setFromPoints([
            strTopFrontPivot.clone(),
            ballTopPoint.clone()
        ]);
        const frontStringMaterial = new THREE.LineBasicMaterial({ color: 0xFFD1DC  });
        const frontString = new THREE.Line(frontStringGeometry, frontStringMaterial);
        scene.add(frontString);

        const backStringGeometry = new THREE.BufferGeometry().setFromPoints([
            StrTopBackPivot.clone(),
            ballTopPoint.clone()
        ]);
        const backStringMaterial = new THREE.LineBasicMaterial({ color: 0xFFD1DC  });
        const backString = new THREE.Line(backStringGeometry, backStringMaterial);
        scene.add(backString);

        Balls.push({
            ballMesh,
            state,
            frontString,
            backString ,
        });

        frameGroup.add(frontString,backString);

    }

}
