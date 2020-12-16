import image from "./image/img.jpg";
import image01 from "./image/img1.jpg";
import image02 from "./image/img2.jpg";
import displacement from "./image/displacement02.jpg";

const mySlide = {
  currentSlide: 0,
  init: function (options) {
    this.options = options;
    this.slideWrap = document.getElementById(this.options.targetId);
    this.app = new PIXI.Application({
      width: this.options.width,
      height: this.options.height,
      autoStart: true,
      autoResize: true,
      transparent: true,
      resolution: devicePixelRatio,
    });
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.container.filterArea = this.app.screen;
    this.container.filters = [];
    this.slideLength = this.options.slides.length;

    this.slideWrap.appendChild(this.app.view);
    this.app.stage.addChild(this.container);

    const images = [];
    this.options.slides.map((image, i) => {
      images.push({ name: `slide${i}`, url: image });
    });
    PIXI.loader
      .add(images)
      .add("displacement", displacement)
      .load(() => {
        this.setSlide();
        this.setDisplacement();
        // this.setPagenation();
        this.container.on("click", e => this.clickEvent(e));
      });
  },
  setSlide: function () {
    this.slides = [];
    for (let res of Object.keys(PIXI.loader.resources)) {
      if (res.search(/slide/) !== -1) {
        this.slides.push(new PIXI.Sprite(PIXI.loader.resources[res].texture));
      }
    }
    this.slides.map((slide, i) => {
      console.log(slide);
      slide.x = this.options.width * i;
      this.container.addChild(slide);
    });
    this.start();
  },
  setDisplacement: function () {
    this.displacementSprite = new PIXI.Sprite(
      PIXI.loader.resources.displacement.texture
    );
    this.displacementSprite.texture.baseTexture.wrapMode =
      PIXI.WRAP_MODES.REPEAT;
    this.displacementFilter = new PIXI.filters.DisplacementFilter(
      this.displacementSprite
    );
    this.displacementSprite.skew.x = 1;
    this.displacementSprite.skew.y = -1;
    this.displacementSprite.position.y = 0;
    this.displacementSprite.scale.y = 1.8;
    this.displacementSprite.scale.x = 1.8;
    this.displacementSprite.anchor.set(0.5);
    this.container.filters.push(this.displacementFilter);
    this.container.addChild(this.displacementSprite);
  },
  // setPagenation: function () {
  //   this.pagenations = [];
  //   const gContainer = new PIXI.Container();
  //   for (let i = 0; i < this.slideLength; i++) {
  //     this.pagenations.push(new PIXI.Graphics());
  //     this.pagenations[i].beginFill("0xffffff");
  //     this.pagenations[i].drawCircle(20 * (i + 1), this.options.height - 15, 3);
  //     this.pagenations[i].endFill();
  //     this.pagenations[i].slideNumber = i;
  //     this.pagenations[i].interactive = true;
  //     this.pagenations[i].on("click", e => {
  //       this.pagenationEvent(e.currentTarget.slideNumber);
  //       e.stopped = true;
  //     });
  //     gContainer.addChild(this.pagenations[i]);
  //   }
  //   this.app.stage.addChild(gContainer);
  //   this.navigationCheck();
  // },
  pagenationEvent: function (targetNumber) {
    this.stop();
    this.currentSlide = targetNumber;
    this.animateSlide();
    this.navigationCheck();
    this.start();
  },
  clickEvent: function (e) {
    const posX = e.data.global.x;
    if (
      (posX < this.options.width / 2 && this.currentSlide === 0) ||
      (posX > this.options.width / 2 &&
        this.currentSlide === this.slideLength - 1)
    ) {
      return;
    }
    this.stop();
    this.onShockWave(e.data.global.x, e.data.global.y, 1);
    this.currentSlide =
      posX < this.options.width / 2
        ? this.currentSlide - 1
        : this.currentSlide + 1;
    this.animateSlide();
    // this.navigationCheck();
    this.start();
  },
  // navigationCheck: function () {
  //   this.pagenations.map((pagenation, i) => {
  //     pagenation.alpha = i !== this.currentSlide ? 0.5 : 1;
  //   });
  // },
  start: function () {
    this.timer = setInterval(() => {
      this.currentSlide =
        this.currentSlide < this.slideLength - 1 ? this.currentSlide + 1 : 0;
      this.animateSlide();
      this.navigationCheck();
    }, this.options.autoplaySpeed);
  },
  stop: function () {
    clearInterval(this.timer);
  },
  animateSlide: function () {
    this.slides.map((slide, i) => {
      TweenMax.to(slide, this.options.speed, {
        x: (i - this.currentSlide) * this.options.width,
        ease: "Power2.easeInOut",
      });
    });
  },
  onShockWave: function (x, y) {
    const shock = new PIXI.filters.ShockwaveFilter([x, y], {
      time: 0,
      amplitude: 44,
      wavelength: 200,
      brightness: 1.2,
      radius: 500,
    });
    this.container.filters.push(shock);
    TweenMax.to(shock, 2, {
      time: 1,
      ease: Expo.easeOut,
      onComplete: () => {
        this.container.filters.unshift();
      },
    });
  },
};

mySlide.init({
  targetId: "canvas",
  width: 900,
  height: 540,
  autoplaySpeed: 5000,
  speed: 1.5,
  slides: [image, image01, image02],
});
