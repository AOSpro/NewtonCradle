//Start:🕒 2026-06-30 Tuesday 18:07:03
//Owner:🔧 AOSpro
//Call: 📞 t.me/aospro
//Project: 📌 Newton Cradle
export class PhysicsEngine {
    constructor() {
        this.timeStep = 1 / 120;
        this.accumulator = 0;
        this.lastTime = performance.now();
        this.gravity = -9.82;
        this.balls = [];
    }
    resetBalls(ballsArray) {
        this.balls = ballsArray;
    }
    update(currentTime) {
        let frameTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        if (frameTime > 0.1) frameTime = 0.1;
        this.accumulator += frameTime;
        while (this.accumulator >= this.timeStep) {
            this.stepPhysics(this.timeStep);
            this.accumulator -= this.timeStep;
        }
    }
    stepPhysics(dt) {
        if (!this.balls || this.balls.length === 0) return;
        const g = this.gravity;
        for (let i = 0; i < this.balls.length; i++) {
            const b = this.balls[i].state;
            b.vy += g * dt;
            b.x += b.vx * dt;
            b.y += b.vy * dt;
        }
        for (let i = 0; i < this.balls.length - 1; i++) {
            const b1 = this.balls[i].state;
            const b2 = this.balls[i + 1].state;
            const minDist = b1.radius + b2.radius;
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist && dist > 0.0001) {
                const nx = dx / dist;
                const ny = dy / dist;
                const dvx = b1.vx - b2.vx;
                const dvy = b1.vy - b2.vy;
                const dvn = dvx * nx + dvy * ny;
                if (dvn > 0) {
                    b1.vx -= dvn * nx; b1.vy -= dvn * ny;
                    b2.vx += dvn * nx; b2.vy += dvn * ny;
                }
                const overlap = minDist - dist;
                const correctionX = (overlap * 0.5) * nx;
                const correctionY = (overlap * 0.5) * ny;
                b1.x -= correctionX; b1.y -= correctionY;
                b2.x += correctionX; b2.y += correctionY;
            }
        }
        for (let i = 0; i < this.balls.length; i++) {
            const b = this.balls[i].state;
            const dx = b.x - b.pivotX;
            const dy = b.y - b.pivotY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > b.len) {
                const nx = dx / dist;
                const ny = dy / dist;
                b.x = b.pivotX + nx * b.len;
                b.y = b.pivotY + ny * b.len;
                const velDotNorm = b.vx * nx + b.vy * ny;
                b.vx -= velDotNorm * nx;
                b.vy -= velDotNorm * ny;
            }
        }
    }
}
