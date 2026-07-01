//Start:🕒 2026-06-30 Tuesday 18:07:03
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌
import * as THREE from 'three';
export class CradleBalls {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.instances = [];
        this.initMaterials();
        this.buildBallsAndStrings();
    }
    initMaterials() {
        this.ballMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888, metalness: 1, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.03
        });
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x665500 });
    }
    buildBallsAndStrings() {
        const sphereGeo = new THREE.SphereGeometry(this.config.ballRadius, 32, 32);
        const totalWidth = (this.config.ballCount - 1) * this.config.spacing;
        const startX = -totalWidth / 2;
        const stringOffsetZ = this.config.frameDepth / 2 - 0.5;
        const pivotY = this.config.frameHeight / 2;
        for (let i = 0; i < this.config.ballCount; i++) {
            const x = startX + i * this.config.spacing;
            const y = pivotY - this.config.stringLength;
            const pivotFront = new THREE.Vector3(x, pivotY, stringOffsetZ);
            const pivotBack = new THREE.Vector3(x, pivotY, -stringOffsetZ);
            const ballTopPoint = new THREE.Vector3(x, y + this.config.ballRadius, 0);
            const state = {
                vx: 0, vy: 0, x: x, y: y,
                radius: this.config.ballRadius, mass: this.config.ballMass,
                pivotX: x, pivotY: pivotY, len: this.config.stringLength
            };
            const mesh = new THREE.Mesh(sphereGeo, this.ballMaterial);
            mesh.position.set(x, y, 0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);
            const lineGeoFront = new THREE.BufferGeometry().setFromPoints([pivotFront, ballTopPoint]);
            const lineFront = new THREE.Line(lineGeoFront, this.lineMaterial);
            this.scene.add(lineFront);
            const lineGeoBack = new THREE.BufferGeometry().setFromPoints([pivotBack, ballTopPoint]);
            const lineBack = new THREE.Line(lineGeoBack, this.lineMaterial);
            this.scene.add(lineBack);
            this.instances.push({
                mesh, state, lineFront, lineBack, pivotFront, pivotBack
            });
        }
        sphereGeo.dispose();
    }
    update() {
        this.instances.forEach(b => {
            b.mesh.position.set(b.state.x, b.state.y, 0);
            const dx = b.state.x - b.state.pivotX;
            const dy = b.state.y - b.state.pivotY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = dx / dist;
            const ny = dy / dist;
            const upVector = new THREE.Vector3(-nx, -ny, 0);
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), upVector);
            b.mesh.setRotationFromQuaternion(quaternion);
            const attachX = b.state.x + (-nx * this.config.ballRadius);
            const attachY = b.state.y + (-ny * this.config.ballRadius);
            const fp = b.lineFront.geometry.attributes.position.array;
            fp[3] = attachX; fp[4] = attachY; fp[5] = this.config.frameDepth / 2 - 0.5;
            b.lineFront.geometry.attributes.position.needsUpdate = true;
            const bp = b.lineBack.geometry.attributes.position.array;
            bp[3] = attachX; bp[4] = attachY; bp[5] = -this.config.frameDepth / 2 + 0.5;
            b.lineBack.geometry.attributes.position.needsUpdate = true;
        });
    }
    destroy() {
        this.instances.forEach(b => {
            this.scene.remove(b.mesh);
            this.scene.remove(b.lineFront);
            this.scene.remove(b.lineBack);
            b.mesh.geometry.dispose();
            b.lineFront.geometry.dispose();
            b.lineBack.geometry.dispose();
        });
        this.instances = [];
    }
}
