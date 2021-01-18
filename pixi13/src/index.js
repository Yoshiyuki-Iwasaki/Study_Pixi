import * as PIXI from "pixi.js";
import { TimelineMax, Power3 } from "gsap";
import $ from "jquery";

import image01 from "./img/1.jpg";
import image02 from "./img/4.jpg";

let width = $(window).width();
let height = $(window).height();

var renderer = PIXI.autoDetectRenderer(width, height, { antialias: true });
document.body.appendChild(renderer.view);

let loader = PIXI.loader;

var stage = new PIXI.Container();

var container = new PIXI.Container();
container.position.x = renderer.width / 2;
container.position.y = renderer.height / 2;

let bg, bgFront, thing;

loader.add("first", image01).add("second", image02);
loader.load((loader, resources) => {
  bg = new PIXI.Sprite(resources.first.texture);
  bg.anchor.x = 0.5;
  bg.anchor.y = 0.5;

  bg.position.x = renderer.width / 2;
  bg.position.y = renderer.height / 2;

  let windowAspect = window / height;
  let imageAspect = bg.window / bg.height;

  // if (windowAspect > imageAspect) {
  //   bg.width = width;
  //   bg.height = height * imageAspect;
  // } else {
  //   bg.height = height;
  // }
  stage.addChild(bg);

  bgFront = new PIXI.Sprite(resources.second.texture);
  bgFront.anchor.x = 0.5;
  bgFront.anchor.y = 0.5;

  container.addChild(bgFront);

  stage.addChild(container);

  thing = new PIXI.Graphics();
  stage.addChild(thing);
  thing.lineStyle(0);
  thing.beginFill(0x8bc5ff, 0.4);
  thing.moveTo(0, 0);
  thing.lineTo(width, 0);
  thing.lineTo(width, height * 0);
  thing.lineTo(0, height * 0);
  container.mask = thing;

  renderer.render(stage);
});

$("body").on("click", () => {
  let tl = new TimelineMax();
  let obj = { a: 0 };
  bgFront.position.y -= 100;
  tl.to(obj, 1.8, {
    a: 1,
    ease: Power3.easeOut,
    onUpdate: function () {
      let middle = (obj.a * obj.a + obj.a) / 2;
      thing.clear();
      thing.beginFill(0x8bc5ff, 0.4);
      thing.moveTo(0, 0);
      thing.lineTo(width, 0);
      thing.lineTo(width, height * obj.a * obj.a);
      thing.lineTo(0, height * obj.a);

      let rect =
        "rect(" + height * middle + "px," + width + "px," + height + "px,0)";

      let rect2 =
        "rect(" + 0 + "px," + width + "px," + height * middle + "px,0)";

      $(".one").css("clip", rect);
      $(".two").css("clip", rect2);
      renderer.render(stage);
    },
  })
    .to(bg.position, 1.2, { y: "+=100" }, 0)
    .to(bgFront.position, 1.2, { y: "+=100" }, 0)
    .to(bgFront.scale, 3, { x: "+=0.4", y: "+=0.4" }, 0.8);
});
