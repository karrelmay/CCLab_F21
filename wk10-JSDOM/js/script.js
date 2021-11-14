let x = 0;

function change(){

  // x += 10;
  red += 10;

  let b = document.getElementById('box')
  b.innerHTML = "WOW";
  // b.style.width = "200px";
  // b.style.height = "200px";
  b.style.left = x + "px";
  b.style.backgroundColor = "rgb('+red', 223, 39);";
}

function addDiv() {
  //create HTML element
  let elt = document.createElement("p")
  //update style
  elt.style.width = "50px";
  elt.style.height = "40px"
  elt.style.backgroundColor = "blue";
  elt.style.margin = "50px;"

  //attach to the document
  // let body = document.body;
  // body.appendChild(elt);

  let box = document.getElementById('box');
  box.appendChild(elt);

}
