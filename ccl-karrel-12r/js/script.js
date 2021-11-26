let video;
let vScale = 8;

function preload() {
  img01 = loadImage("assets/img01.jpg");
  img02 = loadImage("assets/img02.jpg");
  img03 = loadImage("assets/img03.jpg");
  img04 = loadImage("assets/img04.jpg");
  img05 = loadImage("assets/img05.jpg");
  img06 = loadImage("assets/img06.jpg");
  img07 = loadImage("assets/img07.jpg");
  img08 = loadImage("assets/img08.jpg");
  img09 = loadImage("assets/img09.jpg");
  frame = loadImage("assets/frame.png")
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("canvas-container");
  pixelDensity(10);
  frameRate(30);
  video = createCapture(VIDEO);
  video.size(width / vScale, height / vScale);
  video.hide();
}

function draw() {
  background("black");

  video.loadPixels();
  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      let index = (video.width - x + 1 + (y * video.width)) * 4;
      let r = video.pixels[index + 0];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let bright = (r + g + b) / 3;
      if (isNaN(bright)) bright = 0;
      let w = Math.floor(map(bright, 0, 255, 0, 8));
      noStroke();
      fill(255);
      rectMode(CENTER);

      // select image shape from images array
      let assets_array = [img01, img02, img03, img04, img05, img06, img07, img08, img09];
      let asset = assets_array[w];
      let size = w * 2
      image(asset, x * vScale, y * vScale, vScale, vScale);
    }
  }
  push();
  scale(0.380, 0.395);
  translate(-320, -250);
  image(frame, width / 2, height / 2)

  pop();

}
