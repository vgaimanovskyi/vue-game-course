import { reactive } from "vue";
import { useProjectile } from "@/hooks/useProjectile.js";
import playerImage from "@/assets/player.png";

export function usePlayer() {
  const { initProjectile, updateProjectile, drawProjectile } = useProjectile();
  const img = new Image();
  img.src = playerImage;

  const player = reactive({
    width: 120,
    height: 190,
    x: 20,
    y: 100,
    speedY: 0,
    maxSpeed: 2,
    projectiles: [],
    image: img,
    frameX: 0,
    frameY: 0,
    maxFrame: 37,
    powerUp: false,
    powerUpTimer: 0,
    powerUpLimit: 10000,
  });

  function updatePlayer(game, deltaTime) {
    if (game.keys.includes("ArrowUp")) {
      player.speedY = -player.maxSpeed;
    } else if (game.keys.includes("ArrowDown")) {
      player.speedY = player.maxSpeed;
    } else {
      player.speedY = 0;
    }
    player.y += player.speedY;
    // vertical boundaries
    if (player.y > game.height - player.height * 0.5) player.y = game.height - player.height * 0.5;
    else if (player.y < 0) player.y = 0;
    // handle projectiles
    player.projectiles.forEach((projectile) => updateProjectile(game, projectile));
    player.projectiles = player.projectiles.filter((projectile) => !projectile.markedForDeletion);
    // sprite animation
    if (player.frameX < player.maxFrame) {
      player.frameX++;
    } else {
      player.frameX = 0;
    }
    // power up
    if (player.powerUp) {
      if (player.powerUpTimer > player.powerUpLimit) {
        player.powerUpTimer = 0;
        player.powerUp = false;
        player.frameY = 0;
      } else {
        player.powerUpTimer += deltaTime;
        player.frameY = 1;

        game.ammo += 0.1;
      }
    }
  }

  function drawPlayer(ctx, game) {
    if (game.debug) {
      ctx.strokeRect(player.x, player.y, player.width, player.height);
    }
    player.projectiles.forEach((projectile) => drawProjectile(ctx, projectile));
    ctx.drawImage(
      player.image,
      player.frameX * player.width,
      player.frameY * player.height,
      player.width,
      player.height,
      player.x,
      player.y,
      player.width,
      player.height
    );
  }

  function playerShootTop(game) {
    if (game.ammo > 0) {
      player.projectiles.push(initProjectile(player.x + 80, player.y + 30));
      game.ammo--;
    }
    if (player.powerUp) playerShootBottom(game);
  }
  function playerShootBottom(game) {
    if (game.ammo > 0) {
      player.projectiles.push(initProjectile(player.x + 80, player.y + 175));
      game.ammo--;
    }
  }
  function enterPlayerPower(game) {
    player.powerUpTimer = 0;
    player.powerUp = true;
    if (game.ammo < game.maxAmmo) game.ammo = game.maxAmmo;
  }

  return { player, updatePlayer, drawPlayer, playerShootTop, enterPlayerPower };
}
