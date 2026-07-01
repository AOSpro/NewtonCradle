import GUI from 'lil-gui';
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
export class CradleConfig {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.gravity = -9.82;
        this.pullCount = 1;
        this.pullAngle = 45;
        this.gui = null;
        this.createGUI();
    }
    createGUI() {
        if (this.gui) {
            this.gui.destroy();
        }
        this.gui = new GUI({ title: "Newton's Cradle Controls", width: 300 });
        this.gui.add(CONFIG, 'ballCount', 3, 15, 1)
            .name('Number of Balls')
            .onChange(() => {
                this.callbacks.rebuildSimulation();
                this.createGUI();
            });
        this.gui.add(this, 'gravity', -30, -1, 0.5)
            .name('Gravity')
            .onChange((value) => {
                this.callbacks.onGravityChange(value);
            });
        this.gui.add(this, 'pullCount', 1, CONFIG.ballCount - 1, 1)
            .name('Balls to Pull');
        this.gui.add(this, 'pullAngle', 1, 85, 1)
            .name('Pull Angle (degrees)');
        const pullFolder = this.gui.addFolder('Pull Balls');
        pullFolder.add({ pullLeft: () => this.callbacks.pullBalls('left', this.pullCount, this.pullAngle) }, 'pullLeft').name('Pull from Left');
        pullFolder.add({ pullRight: () => this.callbacks.pullBalls('right', this.pullCount, this.pullAngle) }, 'pullRight').name('Pull from Right');
        this.gui.add({ reset: this.callbacks.resetSimulation }, 'reset').name('Reset Simulation');
    }
}
