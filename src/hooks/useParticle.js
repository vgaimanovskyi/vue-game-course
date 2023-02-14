import { reactive } from "vue";
import particleImage from "@/assets/gears.png";

export function useParticle() {
  function initParticle(x, y) {
    const particle = reactive({
      x: x,
      y: y,
      image: new Image(),
      frameX: Math.floor(Math.random() * 3),
      frameY: Math.floor(Math.random() * 3),
      spriteSize: 50,
      sizeModifire: (Math.random() * 0.5 + 0.5).toFixed(1),
      speedX: Math.random() * 6 - 3,
      speedY: Math.random() * -15,
      gravity: 0.5,
      markedForDeletion: false,
      angle: 0,
      va: Math.random() * 0.2 - 0.1,
      bounced: 0,
      bottomBounceBuondary: Math.random() * 80 + 60,
    });
    particle.size = particle.spriteSize * particle.sizeModifire;
    particle.image.src = particleImage;
    return particle;
  }
  function updateParticle(game, particle) {
    particle.angle += particle.va;
    particle.speedY += particle.gravity;
    particle.x -= particle.speedX + game.speed;
    particle.y += particle.speedY;

    if (particle.y > game.height + particle.size || particle.x < 0 - particle.size) {
      particle.markedForDeletion = true;
    }

    if (particle.y > game.height - particle.bottomBounceBuondary && particle.bounced < 2) {
      particle.bounced++;
      particle.speedY *= -0.7;
    }
  }
  function drawParticle(ctx, particle) {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle);
    ctx.drawImage(
      particle.image,
      particle.frameX * particle.spriteSize,
      particle.frameY * particle.spriteSize,
      particle.spriteSize,
      particle.spriteSize,
      particle.size * -0.5, // not particle.x because of ctx.transform
      particle.size * -0.5, // not particle.y because of ctx.transform
      particle.size,
      particle.size
    );
    ctx.restore();
  }
  return { initParticle, updateParticle, drawParticle };
}
