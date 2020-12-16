import * as PIXI from "pixi.js";
import { TimelineMax } from "gsap";
import $ from "jquery";

import image01 from "./img/1.jpg";
import image02 from "./img/2.jpg";

let width = $(window).width();
let height = $(window).height();

var renderer = PIXI.autoDetectRenderer(width, height, { antialias: true });
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

stage.interactive = true;

var bg = PIXI.Sprite.fromImage(image02);

bg.anchor.x = 0.5;
bg.anchor.y = 0.5;

bg.position.x = renderer.width / 2;
bg.position.y = renderer.height / 2;

stage.addChild(bg);

var container = new PIXI.Container();
container.position.x = renderer.width / 2;
container.position.y = renderer.height / 2;

// add a bunch of sprites

var bgFront = PIXI.Sprite.fromImage(image01);
bgFront.anchor.x = 0.5;
bgFront.anchor.y = 0.5;

container.addChild(bgFront);

stage.addChild(container);

// let's create a moving shape
var thing = new PIXI.Graphics();
stage.addChild(thing);
thing.position.x = renderer.width / 2;
thing.position.y = renderer.height / 2;
thing.lineStyle(0);

container.mask = thing;

var count = 0;

animate();

function animate() {
  bg.rotation += 0.01;
  bgFront.rotation -= 0.01;

  count += 0.1;

  thing.clear();

  thing.beginFill(0x8bc5ff, 0.4);
  thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
  thing.lineTo(-320 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
  thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
  thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
  thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
  thing.lineTo(-120 + Math.sin(count) * 20, -300 + Math.cos(count) * 20);
  thing.lineTo(-320 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
  thing.rotation = count * 0.1;

  renderer.render(stage);
  requestAnimationFrame(animate);
}
