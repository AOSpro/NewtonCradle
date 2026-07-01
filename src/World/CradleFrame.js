//Start:🕒 2026-06-30 Tuesday 18:07:03
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌
import * as THREE from 'three';
export class CradleFrame {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.group = new THREE.Group();
        this.initMaterials();
        this.buildFrame();
        this.scene.add(this.group);
    }
    initMaterials() {
        this.metallicMat = new THREE.MeshStandardMaterial({
            color: 0x8b6914, roughness: 0.25, metalness: 0.95
        });
        this.baseMat = new THREE.MeshStandardMaterial({
            color: 0x1A2A4A, roughness: 0.75, metalness: 0.95
        });
    }
    buildFrame() {
        const totalBallsWidth = (this.config.ballCount - 1) * this.config.spacing;
        const frameWidth = totalBallsWidth + 4;
        const barThickness = 0.2;
        const frameHeight = this.config.frameHeight;
        const frameDepth = this.config.frameDepth;
        const topBarY = frameHeight / 2;
        const baseY = -frameHeight / 2 - 0.2;
        const topBarGeo = new THREE.CylinderGeometry(barThickness, barThickness, frameWidth, 8);
        const frontTopBar = new THREE.Mesh(topBarGeo, this.metallicMat);
        frontTopBar.rotation.z = Math.PI / 2;
        frontTopBar.position.set(0, topBarY, frameDepth / 2 - 0.5);
        frontTopBar.castShadow = true;
        frontTopBar.receiveShadow = true;
        this.group.add(frontTopBar);
        const backTopBar = new THREE.Mesh(topBarGeo, this.metallicMat);
        backTopBar.rotation.z = Math.PI / 2;
        backTopBar.position.set(0, topBarY, -frameDepth / 2 + 0.5);
        backTopBar.castShadow = true;
        backTopBar.receiveShadow = true;
        this.group.add(backTopBar);
        const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, frameHeight, 16);
        const polePositions = [
            { x: -frameWidth / 2 + 0.5, z: frameDepth / 2 - 0.5 },
            { x: frameWidth / 2 - 0.5, z: frameDepth / 2 - 0.5 },
            { x: -frameWidth / 2 + 0.5, z: -frameDepth / 2 + 0.5 },
            { x: frameWidth / 2 - 0.5, z: -frameDepth / 2 + 0.5 }
        ];
        polePositions.forEach(pos => {
            const pole = new THREE.Mesh(poleGeo, this.metallicMat);
            pole.position.set(pos.x, 0, pos.z);
            pole.castShadow = true;
            pole.receiveShadow = true;
            this.group.add(pole);
        });
        const baseGeometry = new THREE.BoxGeometry(frameWidth + 1, 0.4, frameDepth + 1);
        const base = new THREE.Mesh(baseGeometry, this.baseMat);
        base.position.y = baseY;
        base.castShadow = true;
        base.receiveShadow = true;
        this.group.add(base);
    }
    destroy() {
        this.group.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
        this.scene.remove(this.group);
    }
}
