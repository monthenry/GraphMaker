var currentNodeName=97;
var currentTool="cursor";
var xPos=0;
var yPos=0;
var xPosNode=0;
var yPosNode=0;
var editingMod=false;

var x1Line=0;
var y1Line=0;
var x2Line=0;
var y2Line=0;

function setTool(toolName) {
  // check that the inputBox is not open before changing tool
  if (!editingMod) {
    currentTool=toolName;
    selectButton("button_"+toolName);
  }
}

// get current mouse pos.
onmousemove = function(e){
  xPos=e.clientX;
  yPos=e.clientY;

  // griddish layout
  // xPos=(xPos/25|0)*25;
  // yPos=(yPos/25|0)*25;
}

// detect mouseclick and launch the appropriate function depending on tool used
function canvasClick(){
  if (currentTool=="link") {
    x1Line=xPos;
    y1Line=yPos;

    // continuous stroke mod
    // if (Math.abs(x2Line-x1Line)<=50) {
    //   x1Line=x2Line;
    // }
    // if (Math.abs(y2Line-y1Line)<=50) {
    //   y1Line=y2Line;
    // }

    console.log("Link creation");
  }else if (currentTool=="cursor") {
    console.log("Mouse pointer mod");
  }else if (currentTool=="eraser") {
    console.log("Eraser mod")
  }else {
    addElement(currentTool);
  }
}

// handle the outline on the currently used button
function selectButton(buttonId){
  document.getElementById('button_circle').style.border="1px solid #FFFFFF";
  document.getElementById('button_square').style.border="1px solid #FFFFFF";
  document.getElementById('button_diamond').style.border="1px solid #FFFFFF";
  document.getElementById('button_link').style.border="1px solid #FFFFFF";
  document.getElementById('button_cursor').style.border="1px solid #FFFFFF";
  document.getElementById('button_eraser').style.border="1px solid #FFFFFF";
  document.getElementById(buttonId).style.border="2px solid #FFFFFF";
}

// create a new element (circle, square or diamond)
function addElement(className){
    xPosNode=xPos-20;
    yPosNode=yPos-20;

    // shape node
    var newNode = document.createElement('div');
    newNode.className = className;
    newNode.id = currentNodeName;
    newNode.style.position = "absolute";
    newNode.style.left = xPosNode+"px";
    newNode.style.top = yPosNode+"px";
    newNode.addEventListener('click', remove, false);
    document.getElementById('canvas').appendChild(newNode);

    // node containing the text
    var innerNode = document.createElement('div');
    innerNode.className = 'unselectable';
    innerNode.innerHTML = String.fromCharCode(currentNodeName);
    document.getElementById(currentNodeName).appendChild(innerNode);

    // opening caption card
    document.getElementById('inputBox').style.display='flex';
    setTool('cursor');
    editingMod=true;
}

// create a caption for the recently added element
function getCaption(){
  var captionValue=document.getElementById('inputField').value;

  // caption node
  var captionNode = document.createElement('div');
  captionNode.className = 'nodeCaption';
  captionNode.id = currentNodeName+"_caption";
  captionNode.style.position = "absolute";
  captionNode.style.left = xPosNode+"px";
  captionNode.style.top = yPosNode+"px";
  captionNode.innerHTML = captionValue;
  captionNode.addEventListener('click', remove, false);
  document.getElementById('canvas').appendChild(captionNode);

  // node name incrementation
  currentNodeName+=1;

  document.getElementById('inputBox').style.display='none';
  document.getElementById('inputField').value='';
  editingMod=false;
}

// erasing function (only if eraser activated)
function remove() {
  if (currentTool=='eraser') {
    this.remove();
  }
}

// drawing line between 2 points
function drawLine(x1, y1, x2, y2){
  var heightSvg=Math.abs(y2-y1)+3;
  var widthSvg=Math.abs(x2-x1)+3;

  // create the svg element
  var svgArrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // set width and height
  svgArrow.setAttribute("width", widthSvg.toString());
  svgArrow.setAttribute("height", heightSvg.toString());
  svgArrow.style.position = "absolute";
  svgArrow.style.left = (Math.min(x1, x2)-2)+"px";
  svgArrow.style.top = (Math.min(y1, y2)-2)+"px";

  // create a line
  var svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  svgLine.setAttribute("x1", (x1-Math.min(x1, x2)).toString());
  svgLine.setAttribute("x2", (x2-Math.min(x1, x2)).toString());
  svgLine.setAttribute("y1", (y1-Math.min(y1, y2)).toString());
  svgLine.setAttribute("y2", (y2-Math.min(y1, y2)).toString());
  svgLine.setAttribute("class", "arrow");

  // attach it to the container
  svgArrow.appendChild(svgLine);

  // add arrow in canvas
  document.getElementById("canvas").appendChild(svgArrow);
}

function lastPos(){
  if (currentTool=="link") {
    x2Line=xPos;
    y2Line=yPos;
    drawLine(x1Line, y1Line, x2Line, y2Line);
  }
}
