//Start:🕒 2026-07-06 Monday 18:15:17
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {CONFIG,Balls,camera,renderer,gravity,set} from '../script.js';
import {createGUI} from './gui.js';
import {calculateSystemEnergy} from './move.js';

export let controls;

export function Controls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    createGUI();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let draggedBall = null;
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    renderer.domElement.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(Balls.map(Ball => Ball.ballMesh));
        if (intersects.length > 0) {
            isDragging = true;
            controls.enabled = false;
            draggedBall = Balls.find(Ball => Ball.ballMesh === intersects[0].object);
            // Reset velocities when grabbing
            draggedBall.state.angularVelocity = 0;
        }
    });
    renderer.domElement.addEventListener('mousemove', (event) => {
        if (!isDragging || !draggedBall){
            return;
        }
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, target);
        if (target) {
            const ballState = draggedBall.state;
            const dx = target.x - ballState.oldBallCenterPosition_X;
            const dy = target.y - ballState.topPivot_Y;
            let angle = Math.atan2(dx, -dy);
            // Clamp angle to ±90 degrees
            angle = Math.max(-Math.PI * 90/180, Math.min(Math.PI * 90/180, angle));
            // Update angular state
            ballState.angle = angle;
            ballState.angularVelocity = 0;
            ballState.angularAcceleration_old = -(Math.abs(gravity) / CONFIG.stringLength) * Math.sin(angle);
            // Update Cartesian position for rendering and collisions
            ballState.x = ballState.oldBallCenterPosition_X + CONFIG.stringLength * Math.sin(angle);
            ballState.y = ballState.topPivot_Y - CONFIG.stringLength * Math.cos(angle);
        }
    });
    window.addEventListener('mouseup', () => {
        if (isDragging && draggedBall) {
            // Calculate system energy after releasing ball
            set('tse',calculateSystemEnergy());
        }
        isDragging = false;
        draggedBall = null;
        controls.enabled = true;
    });
}
// c f , c b s , u ph , gui , c , p b , sim
