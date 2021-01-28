var currentNodeName=97;
var currentTool="cursor";
var xPos=0;
var yPos=0;

// String.fromCharCode(currentNodeName);

function setTool(toolName) {
  currentTool=toolName;
}

onmousemove = function(e){
  xPos=e.clientX;
  yPos=e.clientY;
}

// document.getElementById("canvas").onmousedown = function () {
//     console.log("User moused down");
//     return true; // Not needed, as long as you don't return false
// };

function addElement(){
  var newNode = document.createElement('div');
  newNode.className = currentTool;
  newNode.innerHTML = String.fromCharCode(currentNodeName);
  newNode.style.position = "absolute";
  newNode.style.left = xPos+"px";
  newNode.style.top = yPos+"px";
  document.getElementById('canvas').appendChild(newNode);
  currentNodeName+=1;
}
