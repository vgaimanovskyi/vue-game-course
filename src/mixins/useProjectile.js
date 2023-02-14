export const useProjectile = {
  methods: {
    buildProjectile(x, y) {
      const projectile = {
        x: x,
        y: y,
        width: 10,
        height: 3,
        speed: 3,
        markedForDeletion: false,
      };

      return projectile;
    },
    updateProjectile(projectile) {
      projectile.x += projectile.speed;
      if (projectile.x > this.game.width * 0.8) {
        projectile.markedForDeletion = true;
      }
    },
    drawProjectile(ctx, projectile) {
      ctx.save();
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        projectile.x,
        projectile.y,
        projectile.width,
        projectile.height
      );
      ctx.restore();
    },
  },
};
