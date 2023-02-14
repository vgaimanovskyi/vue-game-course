import { reactive } from "vue";

export function useUI() {
  const UI = reactive({
    fontSize: 20,
    fontFamily: "Helvetica",
    color: "#fff",
  });

  function drawUI(ctx, game) {
    ctx.save();
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "#000";
    ctx.font = `${UI.fontSize}px ${UI.fontFamily}`;
    ctx.fillStyle = UI.color;

    // score
    ctx.fillText(`Score: ${game.score}`, 20, 40);

    // timer
    const time = (game.gameTime * 0.001).toFixed(1);
    ctx.fillText(`Timer: ${time}`, 20, 100);

    // game over messages
    if (game.gameOver) {
      ctx.textAlign = "center";
      let message1;
      let message2;
      if (game.score > game.winningScore) {
        message1 = "You Win!";
        message2 = "Well done!";
      } else {
        message1 = "You lose!";
        message2 = "Try again next time!";
      }
      ctx.font = `50px ${UI.fontFamily}`;
      ctx.fillText(message1, game.width * 0.5, game.height * 0.5 - 20);
      ctx.font = `25px ${UI.fontFamily}`;
      ctx.fillText(message2, game.width * 0.5, game.height * 0.5 + 20);
    }

    // ammo
    if (game.player.powerUp) ctx.fillStyle = "#ffffbd";
    for (let i = 0; i < game.ammo; i++) {
      ctx.fillRect(20 + 5 * i, 50, 3, 20);
    }
    ctx.restore();
  }
  return { drawUI };
}
