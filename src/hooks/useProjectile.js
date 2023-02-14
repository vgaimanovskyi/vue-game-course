import { reactive } from "vue";
import projectileImage from "@/assets/projectile.png";

export function useProjectile() {
  function initProjectile(x, y) {
    const projective = reactive({
      x: x,
      y: y,
      width: 28,
      height: 10,
      speed: 3,
      markedForDeletion: false,
      image: new Image(),
    });
    projective.image.src = projectileImage;
    return projective;
  }
  function updateProjectile(game, projectile) {
    projectile.x += projectile.speed;
    if (projectile.x > game.width * 0.8) {
      projectile.markedForDeletion = true;
    }
  }
  function drawProjectile(ctx, projectile) {
    ctx.save();
    ctx.drawImage(projectile.image, projectile.x, projectile.y);
    ctx.restore();
  }
  return { initProjectile, updateProjectile, drawProjectile };
}
