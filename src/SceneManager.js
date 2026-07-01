//Start:🕒 2026-06-30 Tuesday 18:07:03
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
export class SceneManager {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0d1b2a);
        this.scene.fog = new THREE.Fog(0x0d1b2a, 20, 50);
        this.initCamera();
        this.initRenderer();
        this.initEnvironment();
        this.initLights();
        this.initControls();
        this.handleLoaderTeardown();
        window.addEventListener('resize', () => this.onWindowResize());
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 5, 18);
    }
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.container.appendChild(this.renderer.domElement);
    }
    initEnvironment() {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
        pmremGenerator.dispose();
    }
    initLights() {
        const ambient = new THREE.AmbientLight(0xffe4b5, 20);
        this.scene.add(ambient);
        const dirLight = new THREE.DirectionalLight(0xfff5e0, 15);
        dirLight.position.set(5, 12, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.bias = -0.001;
        this.scene.add(dirLight);
        const spotLight = new THREE.SpotLight(0xff8c00, 3);
        spotLight.position.set(-10, 10, -5);
        spotLight.lookAt(0, 0, 0);
        this.scene.add(spotLight);
    }
    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }
    handleLoaderTeardown() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = 0;
            setTimeout(() => loader.remove(), 500);
        }
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
