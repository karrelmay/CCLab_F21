console.log("Loaded!");

let sliderR, sliderG, sliderB;


function setup(){
  createCanvas(400,400);
  sliderR = document.getElementById('slider-R');
  sliderG = document.getElementById('slider-G');
  sliderB = document.getElementById('slider-B');
};

function draw(){
  let r = sliderR.value;
  let g = sliderB.value;
  let b = sliderG.value;
  background(r, g, b);
}

function drawCircle(){

let dia = random (10, 150)

}

// let btn = document.createelement("button");
//
// btn.style.backgroundColor = "yellow";
// btn.style.width = "100px";
// btn.style.width = "80px";
// btn.style.margin = "10px";
//
// btn.addEventListener("click", change);
//
// document.body.appendChild(btn)
//
// function change(){
//   let r = Math.random() * 255; // 0 to 100
//   let g = Math.random() * 255;
//   let b = Math.random() * 255;
//
//   document.body.backgroundColor = "rgb("+r+","+g+","+b+")"
//
// }

// for (let i=0; i<0; i++){
//   let elt = document.createelement("div");
//
//   elt.style.backgroundColor = "yellow";
//   elt.style.width = "100px";
//   elt.style.width = "150px";
//   elt.style.margin = "10px";
//
//   document.body.appendChild(elt);
// }
