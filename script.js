//Start:🕒 2026-06-30 Tuesday 18:07:03
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle
import { SceneManager } from './src/SceneManager.js';
import { CradleFrame } from './src/World/CradleFrame.js';
import { CradleBalls } from './src/World/CradleBalls.js';
import { PhysicsEngine } from './src/PhysicsEngine.js';
import { InteractionManager } from './src/InteractionManager.js';
// Global variables matching configuration state targets
export const CONFIG = {
    ballCount: 5,
    ballRadius: 1,
    stringLength: 6,
    spacing: 2,
    ballMass: 5,
    frameWidth: 26,
    frameHeight: 8,
    frameDepth: 4
};
let currentPullCount = 1;
let currentPullAngle = 45;
const sceneManager = new SceneManager();
const physics = new PhysicsEngine();
const interactions = new InteractionManager(sceneManager, CONFIG);
let currentFrame = null;
let currentBalls = null;
// Core Functional Pipeline Methods
const rebuildSimulation = () => {
    if (currentFrame) currentFrame.destroy();
    if (currentBalls) currentBalls.destroy();
    // Clamp your runtime interface settings boundaries
    const pullCountInput = document.getElementById('input-count');
    currentPullCount = Math.min(currentPullCount, CONFIG.ballCount - 1);
    const inputPullCount = document.getElementById('input-pullCount');
    if (inputPullCount) {
        inputPullCount.max = CONFIG.ballCount - 1;
        if (parseInt(inputPullCount.value) > CONFIG.ballCount - 1) {
            inputPullCount.value = CONFIG.ballCount - 1;
            document.getElementById('val-pullCount').innerText = inputPullCount.value;
            currentPullCount = CONFIG.ballCount - 1;
        }
    }
    currentFrame = new CradleFrame(sceneManager.scene, CONFIG);
    currentBalls = new CradleBalls(sceneManager.scene, CONFIG);
    physics.resetBalls(currentBalls.instances);
    interactions.setTargetBalls(currentBalls.instances);
};
const resetSimulation = () => {
    if (!currentBalls) return;
    const totalWidth = (CONFIG.ballCount - 1) * CONFIG.spacing;
    const startX = -totalWidth / 2;
    currentBalls.instances.forEach((b, index) => {
        const s = b.state;
        s.x = startX + index * CONFIG.spacing;
        s.y = CONFIG.frameHeight / 2 - CONFIG.stringLength;
        s.vx = 0;
        s.vy = 0;
    });
};
const pullBalls = (direction) => {
    if (!currentBalls) return;
    const instances = currentBalls.instances;
    const maxAngle = (Math.PI * currentPullAngle) / 180;
    if (direction === 'left') {
        for (let i = 0; i < currentPullCount && i < instances.length; i++) {
            const angle = -maxAngle;
            const s = instances[i].state;
            s.x = s.pivotX + CONFIG.stringLength * Math.sin(angle);
            s.y = s.pivotY - CONFIG.stringLength * Math.cos(angle);
            s.vx = 0; s.vy = 0;
        }
    } else if (direction === 'right') {
        for (let i = 0; i < currentPullCount && i < instances.length; i++) {
            const idx = instances.length - 1 - i;
            const angle = maxAngle;
            const s = instances[idx].state;
            s.x = s.pivotX + CONFIG.stringLength * Math.sin(angle);
            s.y = s.pivotY - CONFIG.stringLength * Math.cos(angle);
            s.vx = 0; s.vy = 0;
        }
    }
};
// --- BIND CUSTOM HTML INTERFACE INPUT ACTIONS ---
const setupHTMLUI = () => {
    // 1. Ball Count Slider
    const elBallCount = document.getElementById('input-ballCount');
    elBallCount.addEventListener('input', (e) => {
        CONFIG.ballCount = parseInt(e.target.value);
        document.getElementById('val-ballCount').innerText = CONFIG.ballCount;
        rebuildSimulation();
    });
    // 2. Gravity Slider
    const elGravity = document.getElementById('input-gravity');
    elGravity.addEventListener('input', (e) => {
        physics.gravity = parseFloat(e.target.value);
        document.getElementById('val-gravity').innerText = physics.gravity.toFixed(2);
    });
    // 3. Pull Ball Multiplier Slider
    const elPullCount = document.getElementById('input-pullCount');
    elPullCount.addEventListener('input', (e) => {
        currentPullCount = parseInt(e.target.value);
        document.getElementById('val-pullCount').innerText = currentPullCount;
    });
    // 4. Pull Angle Degree Slider
    const elPullAngle = document.getElementById('input-pullAngle');
    elPullAngle.addEventListener('input', (e) => {
        currentPullAngle = parseInt(e.target.value);
        document.getElementById('val-pullAngle').innerText = currentPullAngle + "°";
    });
    // 5. Trigger Buttons Buttons
    document.getElementById('btn-pullLeft').addEventListener('click', () => pullBalls('left'));
    document.getElementById('btn-pullRight').addEventListener('click', () => pullBalls('right'));
    document.getElementById('btn-reset').addEventListener('click', resetSimulation);
};
////////
alert("Newton`s Cradle. By:\nAdnan Sahlool,\nAasm Edrees,\nAya Abo Foda,\nAlaa Qattan");
////////
// Initialize system pipelines
setupHTMLUI();
rebuildSimulation();
// Dynamic Frame Rendering Loops
const tick = (currentTime) => {
    physics.update(currentTime);
    if (currentBalls) currentBalls.update();
    sceneManager.render();
    window.requestAnimationFrame(tick);
};
window.requestAnimationFrame(tick);
