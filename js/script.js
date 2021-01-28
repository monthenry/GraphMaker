var currentNodeName=97;
var currentTool="square";
var xPos=0;
var yPos=0;

// String.fromCharCode(currentNodeName);

function setTool(toolName) {
  currentTool=toolName;
  selectButton("button_"+toolName);
}

onmousemove = function(e){
  xPos=e.clientX;
  yPos=e.clientY;
}

function canvasClick(){
  if (currentTool=="link") {
    console.log("Link creation");
  }else if (currentTool=="cursor") {
    console.log("Mouse pointer interaction");
  }else {
    addElement(currentTool);
  }
}

function selectButton(buttonId){
  document.getElementById('button_circle').style.border="1px solid #FFFFFF";
  document.getElementById('button_square').style.border="1px solid #FFFFFF";
  document.getElementById('button_diamond').style.border="1px solid #FFFFFF";
  document.getElementById('button_link').style.border="1px solid #FFFFFF";
  document.getElementById('button_cursor').style.border="1px solid #FFFFFF";
  document.getElementById(buttonId).style.border="2px solid #FFFFFF";
}

function addElement(className){
    xPos=xPos-20;
    yPos=yPos-20;
    var newNode = document.createElement('div');
    newNode.className = className;
    newNode.innerHTML = String.fromCharCode(currentNodeName);
    newNode.style.position = "absolute";
    newNode.style.left = xPos+"px";
    newNode.style.top = yPos+"px";
    document.getElementById('canvas').appendChild(newNode);
    currentNodeName+=1;
}
