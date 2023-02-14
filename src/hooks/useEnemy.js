import { reactive } from "vue";
import angler1Image from "@/assets/enemies/angler-1.png";
import angler2Image from "@/assets/enemies/angler-2.png";
import luckyImage from "@/assets/enemies/lucky.png";
import hivewhaleImage from "@/assets/enemies/hivewhale.png";
import droneImage from "@/assets/enemies/drone.png";

export function useEnemy() {
  function initEnemy(game) {
    const enemy = reactive({
      x: game.width,
      markedForDeletion: false,
      frameY: 0,
      frameX: 0,
      maxFrame: 37,
      image: new Image(),
    });
    return enemy;
  }
  function initAngler1(game) {
    const angler1 = reactive({
      ...initEnemy(game),
      speedX: Math.random() * -1.5 - 0.5,
      lives: 5,
      width: 228,
      height: 169,
      frameY: Math.floor(Math.random() * 3),
    });
    angler1.y = Math.random() * (game.height * 0.95 - angler1.height);
    angler1.image.src = angler1Image;
    angler1.score = angler1.lives;
    return angler1;
  }
  function initAngler2(game) {
    const angler2 = reactive({
      ...initEnemy(game),
      speedX: Math.random() * -1.5 - 0.5,
      lives: 6,
      width: 213,
      height: 165,
      frameY: Math.floor(Math.random() * 2),
    });
    angler2.y = Math.random() * (game.height * 0.95 - angler2.height);
    angler2.image.src = angler2Image;
    return angler2;
  }
  function initLucky(game) {
    const lucky = reactive({
      ...initEnemy(game),
      speedX: Math.random() * -1.5 - 0.5,
      lives: 5,
      width: 99,
      height: 95,
      frameY: Math.floor(Math.random() * 2),
      type: "lucky",
    });
    lucky.y = Math.random() * (game.height * 0.95 - lucky.height);
    lucky.image.src = luckyImage;
    lucky.score = lucky.lives;
    return lucky;
  }
  function initHivewhale(game) {
    const hivewhale = reactive({
      ...initEnemy(game),
      speedX: Math.random() * -1.2 - 0.2,
      lives: 20,
      width: 400,
      height: 227,
      type: "hive",
    });
    hivewhale.y = Math.random() * (game.height * 0.95 - hivewhale.height);
    hivewhale.image.src = hivewhaleImage;
    hivewhale.score = hivewhale.lives;
    return hivewhale;
  }
  function initDrone(game, x, y) {
    const drone = reactive({
      ...initEnemy(game),
      x: x,
      y: y,
      speedX: Math.random() * -4.2 - 0.5,
      lives: 3,
      width: 115,
      height: 95,
      frameY: Math.floor(Math.random() * 2),
      type: "drone",
    });
    drone.y = Math.random() * (game.height * 0.95 - drone.height);
    drone.image.src = droneImage;
    drone.score = drone.lives;
    return drone;
  }

  function updateEnemy(game, enemy) {
    enemy.x += enemy.speedX - game.speed;
    if (enemy.x + enemy.width < 0) enemy.markedForDeletion = true;
    // sprite animation
    if (enemy.frameX < enemy.maxFrame) {
      enemy.frameX++;
    } else {
      enemy.frameX = 0;
    }
  }
  function drawEnemy(ctx, game, enemy) {
    ctx.save();
    if (game.debug) {
      ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
      ctx.fillStyle = "#000";
      ctx.font = "20px Helvetica";
      ctx.fillText(enemy.lives, enemy.x, enemy.y);
    }
    ctx.drawImage(
      enemy.image,
      enemy.frameX * enemy.width,
      enemy.frameY * enemy.height,
      enemy.width,
      enemy.height,
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    );
    ctx.restore();
  }

  return { initAngler1, initAngler2, initLucky, initHivewhale, initDrone, updateEnemy, drawEnemy };
}
