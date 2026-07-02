//Start:🕒 2026-06-30 Tuesday 18:07:03
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle
import * as THREE from 'three';
export class InteractionManager {
    constructor(sceneManager, config) {
        this.sceneManager = sceneManager;
        this.config = config;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.isDragging = false;
        this.draggedBall = null;
        this.ballsArray = [];
        this.initEvents();
    }
    setTargetBalls(ballsArray) {
        this.ballsArray = ballsArray;
    }
    initEvents() {
        const dom = this.sceneManager.renderer.domElement;
        dom.addEventListener('mousedown', (e) => this.onMouseDown(e));
        dom.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
    }
    onMouseDown(event) {
        if (event.button !== 0 || this.ballsArray.length === 0) return;
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
        const meshes = this.ballsArray.map(b => b.mesh);
        const intersects = this.raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
            this.isDragging = true;
            this.sceneManager.controls.enabled = false;
            this.draggedBall = this.ballsArray.find(b => b.mesh === intersects[0].object);
            this.draggedBall.state.vx = 0;
            this.draggedBall.state.vy = 0;
        }
    }
    onMouseMove(event) {
        if (!this.isDragging || !this.draggedBall) return;
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);
        const target = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.plane, target);
        if (target) {
            const s = this.draggedBall.state;
            const dx = target.x - s.pivotX;
            const dy = target.y - s.pivotY;
            let angle = Math.atan2(dx, -dy);
            const maxAngle = (Math.PI * 85) / 180;
            angle = Math.max(-maxAngle, Math.min(maxAngle, angle));
            s.x = s.pivotX + this.config.stringLength * Math.sin(angle);
            s.y = s.pivotY - this.config.stringLength * Math.cos(angle);
            s.vx = 0;
            s.vy = 0;
        }
    }
    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggedBall = null;
            this.sceneManager.controls.enabled = true;
        }
    }
}
