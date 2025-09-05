import { useEffect, useRef } from "react";

export default function FastFireworks({ show, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    let fireworks = [];
    let particles = [];
    let animationFrame;

    class Firework {
      constructor(x, y, targetY, hue) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.hue = hue;
        this.speed = 7;
        this.brightness = 60;
      }
      update(index) {
        const dy = this.targetY - this.y;
        this.y += dy / Math.abs(dy) * this.speed;

        if (Math.abs(this.y - this.targetY) < 10) {
          this.explode();
          fireworks.splice(index, 1);
        }
      }
      explode() {
        const count = 150;
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(this.x, this.y, this.hue));
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        ctx.fill();
      }
    }

    class Particle {
      constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.speed = Math.random() * 6 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.friction = 0.94;
        this.gravity = 0.6;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.brightness = Math.random() * 40 + 50;
      }
      update(index) {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
        if (this.alpha <= 0) particles.splice(index, 1);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.fill();
      }
    }

    function loop() {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      fireworks.forEach((fw, i) => {
        fw.draw();
        fw.update(i);
      });

      particles.forEach((p, i) => {
        p.draw();
        p.update(i);
      });

      // Frequent launches
      if (Math.random() < 0.3) {
        const x = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height * 0.4;
        const hue = Math.random() * 360;
        fireworks.push(new Firework(x, canvas.height, targetY, hue));
      }

      animationFrame = requestAnimationFrame(loop);
    }

    loop();

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [show]);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        background: "transparent"
      }}
    />
  );
}
