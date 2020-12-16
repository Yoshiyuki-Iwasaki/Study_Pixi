import image from "./image/img.jpg";
import displacement from "./image/displacement02.jpg";

const width = window.innerWidth;
const height = window.innerHeight;
const playground = document.getElementById("canvas");

var canvas, raf, tp, preview, displacementSprite, displacementFilter, stage;
var count = 0;

const renderer = PIXI.autoDetectRenderer(width, height, { transparent: true });
renderer.autoResize = true;
renderer.view.style.position = "absolute";
renderer.view.style.width = window.innerWidth + "px";
renderer.view.style.height = window.innerHeight + "px";
renderer.view.style.display = "block";

function setScene(url) {
  playground.appendChild(renderer.view);
  stage = new PIXI.Container();
  tp = PIXI.Texture.fromImage(url);
  preview = new PIXI.Sprite(tp);

  preview.anchor.x = 0;

  displacementSprite = PIXI.Sprite.fromImage(displacement);
  displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
  displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

  displacementSprite.scale.y = 0.6;
  displacementSprite.scale.x = 0.6;

  stage.addChild(displacementSprite);
  stage.addChild(preview);

  animate();
}

function animate() {
  raf = requestAnimationFrame(animate);

  displacementSprite.x = count * 10;
  displacementSprite.y = count * 10;
  count += 0.1;

  stage.filters = [displacementFilter];
  renderer.render(stage);
  canvas = playground.querySelector("canvas");
}

setScene(image);
