//Project: 📌 Newton Cradle
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

//import { FontLoader } from 'three/examples/jsm/Addons.js'
//import { TextGeometry } from 'three/examples/jsm/Addons.js'

import {createFrame} from './src/frame.js';
import {createBallsAndStrings} from './src/objects.js';
import {createGUI} from './src/gui.js';
import {updatePhysics,pullBalls} from './src/move.js';
import {Controls, controls} from './src/control.js';
import {resetSimulation,rebuildSimulation} from './src/simulation.js';

export const CONFIG = {
    ballCount: 5,
    ballRadius: 1,
    ballMass: 5,
    spacing: 2,

    stringLength: 6,

    frameHeight: 8,
    frameWidth: 12,
    frameDepth: 4
};
export let Balls = [];

export let scene,camera,renderer;

export let pullCount = 1;
export let pullAngle = 60;
export let gravity = -9.82;


export let timeStep = 1 / 60;
export let lastTime = performance.now();
export let accumulator = 0;

export let updatePhysicsIsCalled = false;

export function set(x,val){
    switch(x){
        case "pc":
            pullCount=val;
            break;
        case "ac":
            pullAngle=val;
            break;
        case "g":
            gravity=val;
            break;
        case "b":
            Balls=val;
            break;
    }
}

function init() {

    const container = document.getElementById('canvas-container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1b2a);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1);
    camera.position.set(0, 5, 18);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);


    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
    ).texture;
    scene.environmentIntensity = 0.5;

    createFrame(scene);
    createBallsAndStrings(scene);
    Controls();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.getElementById('loader').style.opacity = 0;
    setTimeout(() => document.getElementById('loader').remove(), 500);
    animate();
}

function animate() {

    requestAnimationFrame(animate);

    const currentTime = performance.now();
    let frameTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    if (frameTime > 0.1) {
        //console.log(true);
        frameTime = 0.1;
    }

    //console.log(frameTime);

    accumulator += frameTime;

    while (accumulator >= timeStep) {

        updatePhysics(frameTime);
        accumulator -= timeStep;
        updatePhysicsIsCalled = true;
    }

    if (updatePhysicsIsCalled){

        Balls.forEach(Ball => {

            Ball.ballMesh.position.set(Ball.state.x, Ball.state.y, 0);

            const dx = Ball.state.x - Ball.state.oldBallCenterPosition_X;
            const dy = Ball.state.y - Ball.state.topPivot_Y;
            const dz = 0;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = dx / dist;
            const ny = dy / dist;
            const nz = 0;

            const upVector = new THREE.Vector3(-nx, -ny, -nz);
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                upVector
            );
            Ball.ballMesh.setRotationFromQuaternion(quaternion);

            // Calculate attachment point on ball surface
            const attachX = Ball.state.x + (-nx * CONFIG.ballRadius);
            const attachY = Ball.state.y + (-ny * CONFIG.ballRadius);
            const attachZ = 0 + (-nz * CONFIG.ballRadius);


            const fp = Ball.frontString.geometry.attributes.position.array;
            fp[3] = attachX;
            fp[4] = attachY;
            fp[5] = attachZ;
            Ball.frontString.geometry.attributes.position.needsUpdate = true;

            const bp = Ball.backString.geometry.attributes.position.array;
            bp[3] = attachX;
            bp[4] = attachY;
            bp[5] = attachZ;
            Ball.backString.geometry.attributes.position.needsUpdate = true;
        });
    }

    updatePhysicsIsCalled = false;

    controls.update();
    renderer.render(scene, camera);
}

init();
