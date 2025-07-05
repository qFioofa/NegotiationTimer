const HEX_COLOR_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

function hexToRgb(hex) {
    const result = HEX_COLOR_REGEX.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
}

function interpolateColor(c1, c2, t) {
    return `rgb(${Math.round(c1.r + t * (c2.r - c1.r))}, ${Math.round(c1.g + t * (c2.g - c1.g))}, ${Math.round(c1.b + t * (c2.b - c1.b))})`;
}

export class Particle {
    constructor(x, y, width, height, direction, options) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.initialWidth = width;
        this.initialHeight = height;

        this.direction = direction;
        this.speed = options.speed ?? 2;
        this.vx = Math.cos(direction) * this.speed;
        this.vy = Math.sin(direction) * this.speed;

        this.lifespan = options.lifespan ?? 1000;
        this.age = 0;
        this.isAlive = true;

        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;

        this.colorStart = hexToRgb(options.startColor ?? '#ffffff');
        this.colorEnd = hexToRgb(options.endColor ?? '#000000');
        this.currentColor = interpolateColor(this.colorStart, this.colorEnd, 0);
    }

    update(dt) {
        if (!this.isAlive) return;

        this.age += dt;
        if (this.age >= this.lifespan) {
            this.isAlive = false;
            return;
        }

        const t = this.age / this.lifespan;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        this.width = this.initialWidth * (1 - t);
        this.height = this.initialHeight * (1 - t);
        this.currentColor = interpolateColor(this.colorStart, this.colorEnd, t);
    }

    draw(ctx) {
        if (!this.isAlive || this.width <= 0 || this.height <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.currentColor;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height / 3);
        ctx.restore();
    }
}

export default class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.lastTime = performance.now();
        this.isEmitting = false;
        this.lastEmission = 0;
        this.emissionInterval = 100;

        this.config = {
            particleCount: 50,
            lifespan: 2000,
            size: 20,
            speed: 3,
            variance: 45,
            startColor: '#ff7e5f',
            endColor: '#feb47b',
        };

        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        }
    }

    createParticles(count = this.config.particleCount, position, direction) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const baseDir = direction ?? Math.PI / 2;

        for (let i = 0; i < count; i++) {
            const dir = baseDir + (Math.random() - 0.5) * this.config.variance * Math.PI / 180;
            this.particles.push(new Particle(
                position?.x ?? centerX,
                position?.y ?? centerY,
                this.config.size,
                this.config.size,
                dir,
                {
                    ...this.config
                }
            ));
        }
    }

    update(dt) {
        this.particles.forEach(p => p.update(dt));
        this.particles = this.particles.filter(p => p.isAlive);
    }
    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground(ctx);
        this.particles.forEach(p => p.draw(ctx));
    }

    drawBackground(ctx) {
        const gridSize = 50;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
        ctx.fill();
    }

    toggleEmission() {
        this.isEmitting = !this.isEmitting;
        return this.isEmitting;
    }

    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
    }

    reset() {
        this.particles = [];
    }

    step(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.isEmitting && timestamp - this.lastEmission >= this.emissionInterval) {
            this.createParticles(5);
            this.lastEmission = timestamp;
        }

        this.update(dt);
        this.draw();
        requestAnimationFrame(ts => this.step(ts));
    }

    start() {
        this.createParticles(100);
        this.lastTime = performance.now();
        requestAnimationFrame(ts => this.step(ts));
    }
}