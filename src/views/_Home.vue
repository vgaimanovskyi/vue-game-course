<template>
  <div class="home">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
import { useCanvas } from "@/mixins/useCanvas.js";
import { useInputHandler } from "@/mixins/useInputHandler.js";
import { useProjectile } from "@/mixins/useProjectile.js";

export default {
  name: "Home",
  mixins: [useCanvas, useInputHandler, useProjectile],
  data() {
    return {
      lastTime: 0,
      game: {
        keys: [],
        ammo: 20,
      },
      player: {
        width: 120,
        height: 190,
        x: 20,
        y: 100,
        speedY: 0,
        maxSpeed: 2,
        projectiles: [],
      },
    };
  },
  methods: {
    updatePlayer() {
      if (this.game.keys.includes("ArrowUp")) {
        this.player.speedY = -this.player.maxSpeed;
      } else if (this.game.keys.includes("ArrowDown")) {
        this.player.speedY = this.player.maxSpeed;
      } else {
        this.player.speedY = 0;
      }
      this.player.y += this.player.speedY;
      // handle projectiles
      this.player.projectiles.forEach(this.updateProjectile);
      this.player.projectiles = this.player.projectiles.filter((projectile) => !projectile.markedForDeletion);
    },
    drawPlayer(ctx) {
      ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
      this.player.projectiles.forEach((projectile) => this.drawProjectile(this.ctx, projectile));
    },
    playerShootTop() {
      if (this.game.ammo > 0) {
        this.player.projectiles.push(this.buildProjectile(this.player.x + 80, this.player.y + 30));
        this.game.ammo--;
      }
    },
    initGame() {
      this.game.width = this.canvas.width;
      this.game.height = this.canvas.height;
    },
    animate(timeStamp) {
      const deltaTime = timeStamp - this.lastTime;
      this.lastTime = timeStamp;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.updatePlayer();
      this.drawPlayer(this.ctx);
      requestAnimationFrame(this.animate);
    },
  },
  mounted() {
    this.initGame();
    this.animate(0);
  },
};
</script>

<style lang="scss" scoped>
.canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  max-width: 100%;
  max-height: 100%;
  border: 2px solid #000;
  background: #ccc;
}
</style>
