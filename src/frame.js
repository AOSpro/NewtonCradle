//Start:🕒 2026-07-06 Monday 18:15:17
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle

import * as THREE from 'three';
import {CONFIG} from '../script.js';
export let frameGroup;

export function createFrame(scene) {

    frameGroup = new THREE.Group();

    CONFIG.spacing = CONFIG.ballRadius * 2;

    CONFIG.frameHeight = CONFIG.stringLength + (CONFIG.ballRadius * 2);
    CONFIG.frameWidth  = (CONFIG.ballCount * CONFIG.spacing)+ 2;
    CONFIG.frameDepth  = CONFIG.ballRadius * 4;

    const metallicMaterial = new THREE.MeshStandardMaterial({
        color: 0xC9D6EA,
        metalness: 0.95,
        roughness: 0.25
    });

    const topBarGeometry = new THREE.CylinderGeometry(0.2, 0.2, CONFIG.frameWidth + 1, 8);

    const frontTopBar = new THREE.Mesh(topBarGeometry, metallicMaterial);
    frontTopBar.rotation.z = Math.PI / 2;
    frontTopBar.position.set(0, CONFIG.frameHeight / 2, CONFIG.frameDepth / 2 );
    frameGroup.add(frontTopBar);

    const backTopBar = new THREE.Mesh(topBarGeometry, metallicMaterial);
    backTopBar.rotation.z = Math.PI / 2;
    backTopBar.position.set(0, CONFIG.frameHeight / 2, -CONFIG.frameDepth / 2 );
    frameGroup.add(backTopBar);


    const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, CONFIG.frameHeight, 16);
    const polePositions = [

        { x: -CONFIG.frameWidth/2 , z:  CONFIG.frameDepth/2},
        { x:  CONFIG.frameWidth/2 , z:  CONFIG.frameDepth/2},
        { x: -CONFIG.frameWidth/2 , z: -CONFIG.frameDepth/2},
        { x:  CONFIG.frameWidth/2 , z: -CONFIG.frameDepth/2}
    ];

    polePositions.forEach(position => {

        const pole = new THREE.Mesh(poleGeometry, metallicMaterial);
        pole.position.set(position.x, 0, position.z);
        frameGroup.add(pole);
    });


    const baseGeometry = new THREE.BoxGeometry(CONFIG.frameWidth + 2, 0.5, CONFIG.frameDepth + 2);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x39FF14,
        //0x39FF14
        metalness: 0.95,
        roughness: 0.45
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -CONFIG.frameHeight / 2;
    frameGroup.add(base);


//-------------------------------------------------------

/**
 *
 *  do not remove : for testing only !!!
 *
 */

    const helper = new THREE.AxesHelper(CONFIG.ballRadius * 4);
    frameGroup.add(helper);

//-------------------------------------------------------


    const colors = [0x006994, 0x00B4D8, 0xFF6B6B, 0xFFE66D, 0x00B4D8, 0x006994];

    const planMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.95,
            roughness: 0.45,
            side: THREE.DoubleSide
        });

    const planeGeometries = [
        new THREE.PlaneGeometry(64,64,64),
        new THREE.PlaneGeometry(64,64,64),
        new THREE.PlaneGeometry(64,64,64),
        new THREE.PlaneGeometry(64,64,64),
        new THREE.PlaneGeometry(64,64,64),
        new THREE.PlaneGeometry(64,64,64)
    ];

    const planeMeshes = planeGeometries.map((planGeometry, i) => {
        const planMat = planMaterial.clone();
        planMat.color.setHex(colors[i]);
        return new THREE.Mesh(planGeometry, planMat);
    });

    planeMeshes[0].position.set(0, 0, -32);
    planeMeshes[1].position.set(0, 0, 32);
    planeMeshes[2].position.set(-32, 0, 0);
    planeMeshes[3].position.set(32, 0, 0);
    planeMeshes[4].position.set(0, -32, 0);
    planeMeshes[5].position.set(0, 32, 0);

    planeMeshes[2].rotation.y = Math.PI / 2;
    planeMeshes[3].rotation.y = Math.PI / 2;
    planeMeshes[4].rotation.x = Math.PI / 2;
    planeMeshes[5].rotation.x = Math.PI / 2;

    scene.add(...planeMeshes);

    scene.add(frameGroup);

}
