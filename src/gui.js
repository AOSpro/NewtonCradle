//Start:🕒 2026-07-06 Monday 18:15:17
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle
import GUI from 'lil-gui';
import {CONFIG,pullCount,pullAngle,gravity,set} from '../script.js';
import {resetSimulation,rebuildSimulation} from './simulation.js';
import {updatePhysics,pullBalls} from './move.js';

export let gui;

export function createGUI() {
    if (gui) {
        gui.destroy();
    }
    gui = new GUI({ title: 'Newton\'s Cradle Controls', width: 300 });
    const ballFolder = gui.addFolder('Ball Properties');
    ballFolder.add(CONFIG, 'ballCount', 3, 15, 1)
        .name('Ball Count')
        .onChange(() => {
            rebuildSimulation();
            createGUI();
        });
    ballFolder.add(CONFIG, 'ballMass', 1, 20, 1)
        .name('Ball Mass');
    ballFolder.add(CONFIG, 'ballRadius', 0.5, 2, 0.1)
        .name('Ball Radius')
        .onChange(() => {
            rebuildSimulation();
            createGUI();
        });
    ballFolder.add(CONFIG, 'stringLength', 3, 10, 0.5)
        .name('String Length')
        .onChange(() => {
            rebuildSimulation();
            createGUI();
        });
    const physicsFolder = gui.addFolder('Physics');
    physicsFolder.add({ gravity: gravity }, 'gravity', -30, -1, 0.5)
        .name('Gravity')
        .onChange((value) => {
            set('g',value);
        });
    const interactionFolder = gui.addFolder('Interaction');
    interactionFolder.add({ pullCount: pullCount }, 'pullCount', 1, CONFIG.ballCount - 1, 1)
        .name('Balls to Pull')
        .onChange((value) => {
            set('pc',value);
        });
    interactionFolder.add({ pullAngle: pullAngle }, 'pullAngle', 1, 90, 1)
        .name('Angle')
        .onChange((value) => {
            set('pa',value);
        });
    interactionFolder.add({ pullLeft: () => pullBalls('left') }, 'pullLeft')
        .name('Pull from Left');
    interactionFolder.add({ pullRight: () => pullBalls('right') }, 'pullRight')
        .name('Pull from Right');
    gui.add({ reset: resetSimulation }, 'reset')
        .name('Reset Simulation');
}
