
window.addEventListener('load', () => {
    // --- Setup ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let currentColor = '#f00';
    const mouse = {
        x: undefined,
        y: undefined
    };

    // --- Color Picker ---
    const colorPicker = new iro.ColorPicker('#color-picker-container', {
        width: 200,
        color: currentColor,
        borderWidth: 1,
        borderColor: '#fff',
    });

    colorPicker.on('color:change', (color) => {
        currentColor = color.hexString;
    });

    // --- Particle Class ---
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.life = 1; // 0 to 1
            this.decay = 0.02;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            if (this.size > 0.2) this.size -= 0.1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.fill();
        }
    }

    // --- Animation Loop ---
    function animate() {
        // Fading effect
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }

    // --- Event Listeners ---
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
        // Create a burst of particles
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(mouse.x, mouse.y, currentColor));
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Start animation
    animate();
});
