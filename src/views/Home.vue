<template>
  <div class="home">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useCanvas } from "@/hooks/useCanvas.js";
import { useUI } from "@/hooks/useUI.js";
import { useProjectile } from "@/hooks/useProjectile.js";
import { usePlayer } from "@/hooks/usePlayer.js";
import { useEnemy } from "@/hooks/useEnemy.js";
import { useParticle } from "@/hooks/useParticle.js";
import { useExplosion } from "@/hooks/useExplosion.js";
import { useBackground } from "@/hooks/useBackground.js";

// canvas ========================
const { canvas, context } = useCanvas();

// GAME ==========================
const game = reactive({
  keys: [],
  ammo: 20,
  maxAmmo: 50,
  ammoTimer: 0,
  ammoInterval: 350,
  enemies: [],
  enemyTimer: 0,
  enemyInterval: 2000,
  particles: [],
  explosions: [],
  gameOver: false,
  score: 0,
  winningScore: 80,
  gameTime: 0,
  timeLimit: 30000,
  speed: 1,
  debug: false,
});
onMounted(() => {
  game.width = canvas.value.width;
  game.height = canvas.value.height;
  game.background = background;
  game.player = player;
});

function gameUpdate(game, player, deltaTime) {
  // timer
  if (!game.gameOver) game.gameTime += deltaTime;
  if (game.gameTime > game.timeLimit) game.gameOver = true;
  // BG
  updateBG(game);
  // player
  updatePlayer(game, deltaTime);
  // BG last layer
  updateLayer(game, game.background.layers[3]);
  // ammo
  if (game.ammoTimer > game.ammoInterval) {
    if (game.ammo < game.maxAmmo) game.ammo++;
    game.ammoTimer = 0;
  } else {
    game.ammoTimer += deltaTime;
  }
  // enemies
  game.enemies.forEach((enemy) => {
    updateEnemy(game, enemy);

    if (checkCollisions(player, enemy)) {
      enemy.markedForDeletion = true;
      addExplosion(game, enemy);
      for (let i = 0; i < enemy.score; i++) {
        game.particles.push(initParticle(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
      }
      if (enemy.type === "lucky") enterPlayerPower(game);
      else if (!game.gameOver) game.score--;
    }

    player.projectiles.forEach((projectile) => {
      if (checkCollisions(projectile, enemy)) {
        enemy.lives--;
        projectile.markedForDeletion = true;
        game.particles.push(initParticle(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
        if (enemy.lives <= 0) {
          for (let i = 0; i < enemy.score; i++) {
            game.particles.push(initParticle(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
          }
          enemy.markedForDeletion = true;
          addExplosion(game, enemy);
          if (enemy.type === "hive") {
            for (let i = 0; i < 5; i++) {
              game.enemies.push(
                initDrone(game, enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height)
              );
            }
          }
          if (!game.gameOver) game.score += enemy.score;
          if (game.score > game.winningScore) game.gameOver = true;
        }
      }
    });
  });
  game.enemies = game.enemies.filter((enemy) => !enemy.markedForDeletion);
  if (game.enemyTimer > game.enemyInterval && !game.gameOver) {
    addEnemy(game);
    game.enemyTimer = 0;
  } else {
    game.enemyTimer += deltaTime;
  }
  // particles
  game.particles.forEach((particle) => updateParticle(game, particle));
  game.particles = game.particles.filter((particle) => !particle.markedForDeletion);

  // explosions
  game.explosions.forEach((explosion) => updateExplosion(game, explosion, deltaTime));
  game.explosions = game.explosions.filter((explosion) => !explosion.markedForDeletion);
}
function gameDraw(ctx, game) {
  drawBG(ctx);
  drawUI(ctx, game);
  drawPlayer(ctx, game);
  game.particles.forEach((particle) => drawParticle(ctx, particle));
  game.enemies.forEach((enemy) => drawEnemy(ctx, game, enemy));
  game.explosions.forEach((explosion) => drawExplosion(ctx, game, explosion));
  // BG last layer
  drawLyer(ctx, game.background.layers[3]);
}
function addEnemy(game) {
  const randomize = Math.random();
  if (randomize < 0.3) game.enemies.push(initAngler1(game));
  else if (randomize < 0.6) game.enemies.push(initAngler2(game));
  else if (randomize < 0.8) game.enemies.push(initHivewhale(game));
  else game.enemies.push(initLucky(game));
}
function addExplosion(game, enemy) {
  const randomize = Math.random();
  if (randomize < 0.5) {
    game.explosions.push(initSmokeExplosion(game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
  } else {
    game.explosions.push(initFireExplosion(game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
  }
}
function checkCollisions(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// UI ============================
const { drawUI } = useUI();

// Background =========================
const { background, updateBG, drawBG, drawLyer, updateLayer } = useBackground();

// Projectile ====================
const { initProjectile, updateProjectile, drawProjectile } = useProjectile();

// Emeny =========================
const { initAngler1, initAngler2, initLucky, initHivewhale, initDrone, updateEnemy, drawEnemy } = useEnemy();

// Particle
const { initParticle, updateParticle, drawParticle } = useParticle();

// Explosion
const { initSmokeExplosion, initFireExplosion, updateExplosion, drawExplosion } = useExplosion();

// PLAYER ========================
const { player, updatePlayer, drawPlayer, playerShootTop, enterPlayerPower } = usePlayer();

// Input Handler ========================
function keydown(e) {
  if ((e.key === "ArrowUp" || e.key === "ArrowDown") && !game.keys.includes(e.key)) {
    game.keys.push(e.key);
  } else if (e.key === "d") {
    game.debug = !game.debug;
  }
}
function keyup(e) {
  if (e.key === " ") playerShootTop(game);
  if (game.keys.includes(e.key)) {
    game.keys.splice(game.keys.indexOf(e.key), 1);
  }
}
onMounted(() => {
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);
});

// animate =============================
let lastTime = ref(0);
function animate(timeStamp) {
  const deltaTime = ref(timeStamp - lastTime.value);
  lastTime.value = timeStamp;

  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  gameDraw(context.value, game);
  gameUpdate(game, player, deltaTime.value);
  requestAnimationFrame(animate);
}
onMounted(() => {
  animate(0);
});
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
