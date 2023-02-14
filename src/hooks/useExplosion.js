import { reactive } from "vue";
import smokeExplosionImage from "@/assets/explosions/smokeExplosion.png";
import fireExplosionImage from "@/assets/explosions/fireExplosion.png";

export function useExplosion() {
  function initExplosion(game, x, y) {
    const explosion = reactive({
      x: x,
      y: y,
      frameX: 0,
      spriteHeight: 200,
      fps: 30,
      timer: 0,
      markedForDeletion: false,
      image: new Image(),
      maxFrame: 8,
      spriteWidth: 200,
    });
    explosion.interval = 1000 / explosion.fps;
    explosion.width = explosion.spriteWidth;
    explosion.height = explosion.spriteHeight;
    explosion.x = explosion.x - explosion.width * 0.5;
    explosion.y = explosion.y - explosion.height * 0.5;
    return explosion;
  }
  function initSmokeExplosion(game, x, y) {
    const smokeExplosion = reactive({
      ...initExplosion(game, x, y),
    });
    smokeExplosion.image.src = smokeExplosionImage;
    return smokeExplosion;
  }
  function initFireExplosion(game, x, y) {
    const fireExplosion = reactive({
      ...initExplosion(game, x, y),
    });
    fireExplosion.image.src = fireExplosionImage;
    return fireExplosion;
  }
  function updateExplosion(game, explosion, deltaTime) {
    explosion.x -= game.speed;

    if (explosion.timer > explosion.interval) {
      explosion.frameX++;
      explosion.timer = 0;
    } else {
      explosion.timer += deltaTime;
    }
    if (explosion.frame > explosion.maxFrame) explosion.markedForDeletion = true;
  }
  function drawExplosion(ctx, game, explosion) {
    ctx.save();
    ctx.drawImage(
      explosion.image,
      explosion.frameX * explosion.width,
      0,
      explosion.spriteWidth,
      explosion.spriteHeight,
      explosion.x,
      explosion.y,
      explosion.width,
      explosion.height
    );
    ctx.restore();
  }
  return { initSmokeExplosion, initFireExplosion, updateExplosion, drawExplosion };
}
