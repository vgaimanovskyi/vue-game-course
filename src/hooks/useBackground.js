import { reactive } from "vue";

export function useBackground() {
  function initLayer(image, speedModifire) {
    return {
      image: image,
      speedModifire: speedModifire,
      width: 1768,
      height: 500,
      x: 0,
      y: 0,
    };
  }
  function updateLayer(game, layer) {
    if (layer.x <= -layer.width) layer.x = 0;
    layer.x -= game.speed * layer.speedModifire;
  }
  function drawLyer(ctx, layer) {
    ctx.drawImage(layer.image, layer.x, layer.y);
    ctx.drawImage(layer.image, layer.x + layer.width, layer.y);
  }

  const background = reactive({
    layers: [],
  });
  for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = require(`@/assets/backgrounds/layer-${i}.png`);
    const layer = initLayer(img, 0.4 * i);
    background.layers.push(layer);
  }
  function updateBG(game) {
    background.layers.forEach((layer) => updateLayer(game, layer));
  }
  function drawBG(ctx) {
    background.layers.forEach((layer) => drawLyer(ctx, layer));
  }

  return { background, updateBG, drawBG, drawLyer, updateLayer };
}
