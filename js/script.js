// help messages
const helpMessageShape="Once the node type is selected, click anywhere on the whiteboard to place it. \n A text area will pop-up, you can enter there the node caption or leave it blank and press save.";
const helpMessageEdge="Once the edge mod selected, click on the two node you want to link, an edge will automatically be added. \n A text area will pop-up, you can enter there the edge caption or leave it blank and press save.";
const helpMessageCursor="Once the cursor mod selected, you cannot perform any action. This is the default mod.";
const helpMessageEraser="Once the eraser mod selected, you can click on any element previously added to delete it (nodes, edges and caption).";

var currentNodeName=97;
var currentTool="cursor";
var xPos=0;
var yPos=0;
var xPosLastElement=0;
var yPosLastElement=0;

// status var
var editingMod=false;
var linkBuilding=false;
var helpBoxToogled=false;
var onForbiddenElement=false;

// function executed on load
function firstCall(){
  setTool("cursor");
}

function setTool(toolName) {
  // check that the inputBox is not open before changing tool
  if (!editingMod) {
    currentTool=toolName;
    selectButton("button_"+toolName);
    setHelpMessage(toolName);
    setHelpHeader(toolName);
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
    console.log("Link creation mod.");
  }else if (currentTool=="cursor") {
    console.log("Mouse pointer mod.");
  }else if (currentTool=="eraser") {
    console.log("Eraser mod.")
  }else {
    console.log("Node creation mod.")
    addNode(currentTool);
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
function addNode(className){
    xPosLastElement=xPos-20;
    yPosLastElement=yPos-20;

    // area exclusion condition
    if (onForbiddenElement) {
      onForbiddenElement=false;
    }else {
      // shape node
      var newNode = document.createElement('div');
      newNode.className = className;
      newNode.id = currentNodeName;
      newNode.style.position = "absolute";
      newNode.style.left = xPosLastElement+"px";
      newNode.style.top = yPosLastElement+"px";
      newNode.addEventListener('click', elementTouched, false);
      document.getElementById('canvas').appendChild(newNode);

      // node containing the text
      var innerNode = document.createElement('div');
      innerNode.className = 'unselectable';
      innerNode.innerHTML = String.fromCharCode(currentNodeName);
      document.getElementById(currentNodeName).appendChild(innerNode);

      // opening caption card
      xPosLastElement=xPosLastElement+45;
      document.getElementById('inputBox').style.display='flex';
      setTool('cursor');
      editingMod=true;
    }
}

// create a caption for the recently added element
function getCaption(){
  var captionValue=document.getElementById('inputField').value;

  var nbLines=((captionValue.split(/\r\n|\r|\n/).length+1)/2|0);

  if (captionValue.length>0) {
    // caption creation
    var captionNode = document.createElement('div');
    if (linkBuilding) {
      captionNode.className = 'arrowCaption';
      yPosLastElement-=nbLines*16;
    }else {
      captionNode.className = 'nodeCaption';
    }
    captionNode.id = currentNodeName+"_caption";
    captionNode.style.position = "absolute";
    captionNode.style.left = xPosLastElement+"px";
    captionNode.style.top = yPosLastElement+"px";
    captionNode.innerHTML = captionValue;
    captionNode.addEventListener('click', elementTouched, false);


    document.getElementById('canvas').appendChild(captionNode);
  }

  // node name incrementation
  if (linkBuilding) {
    linkBuilding=false;
  }else {
    currentNodeName+=1;
  }

  document.getElementById('inputBox').style.display='none';
  document.getElementById('inputField').value='';
  editingMod=false;
}

// Element interaction on click
function elementTouched() {
  if (currentTool=='eraser') {
    this.remove();
  }else if (currentTool=='link') {
    if (linkBuilding) {
      addArrow(xPosLastElement, yPosLastElement, parseInt(this.style.left, 10)+20, parseInt(this.style.top, 10)+20);
    }else {
      xPosLastElement=parseInt(this.style.left, 10)+20;
      yPosLastElement=parseInt(this.style.top, 10)+20;
      linkBuilding=true;
    }
  }
}

// drawing arrow between 2 points
function addArrow(x1, y1, x2, y2){
  // calculating caption position
  xPosLastElement=(x1+x2)/2;
  yPosLastElement=(y1+y2)/2;

  // system offset due to toolbar
  var systemOffset=85;
  y1=y1-systemOffset;
  y2=y2-systemOffset;

  // calculating offset to not go over Elements
  var offsetX1=0;
  var offsetX2=0
  var offsetY1=0;
  var offsetY2=0

  if (Math.abs(x2-x1)>Math.abs(y2-y1)) {
    offsetX1=25;
    offsetX2=offsetX1;
    offsetY1=offsetX1/Math.abs(x2-x1)*Math.abs(y2-y1);
    offsetY2=offsetY1;
  }else {
    offsetY1=25;
    offsetY2=offsetY1;
    offsetX1=offsetY1/Math.abs(y2-y1)*Math.abs(x2-x1);
    offsetX2=offsetX1;
  }

  if (x1>x2) {
    offsetX1=-1*offsetX1;
  }else {
    offsetX2=-1*offsetX2;
  }

  if (y1>y2) {
    offsetY1=-1*offsetY1;
  }else {
    offsetY2=-1*offsetY2;
  }

  if (y2<(y1-25)) {
    x1=x1-25;
    x2=x2-25;

    var xAnchor=Math.min(x1, x2);
    var heightDiff=Math.abs(y1-y2);

    // create curved arrow
    var dPath="M"+x1+" "+y1+" C "+(xAnchor-(heightDiff/2|0))+" "+(y1-10)+", "+(xAnchor-(heightDiff/2|0))+" "+(y2+10)+", "+x2+" "+y2;
    var svgCurve = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgCurve.setAttribute("d", dPath);
    svgCurve.setAttribute("fill", "transparent");
    svgCurve.setAttribute("class", "arrow");
    svgCurve.addEventListener('click', removeArrow, false);

    // add curved arrow to svg container
    document.getElementById("svgContainer").appendChild(svgCurve);

    // calculating caption position
    xPosLastElement=xAnchor-(heightDiff/2|0)+30;
    yPosLastElement=yPosLastElement-(systemOffset/2|0);
  }else {
    // create an arrow
    var svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    svgLine.setAttribute("x1", (x1+offsetX1).toString());
    svgLine.setAttribute("x2", (x2+offsetX2).toString());
    svgLine.setAttribute("y1", (y1+offsetY1).toString());
    svgLine.setAttribute("y2", (y2+offsetY2).toString());
    svgLine.setAttribute("class", "arrow");
    svgLine.addEventListener('click', removeArrow, false);

    // add arrow to svg container
    document.getElementById("svgContainer").appendChild(svgLine);

    // calculating caption position
    xPosLastElement=xPosLastElement;
    yPosLastElement=yPosLastElement;
  }

  // opening caption card
  document.getElementById('inputBox').style.display='flex';
  setTool('cursor');
  editingMod=true;
}

// remove arrow function
function removeArrow(){
  if (currentTool=='eraser') {
    this.remove();
  }
}

// toogle help window
function toogleHelp(){
  if (helpBoxToogled) {
    document.getElementById('helpBox').style.display='none';
    document.getElementById('helpButton').style.color='#FF846A';
    helpBoxToogled=false;
  }else {
    document.getElementById('helpBox').style.display='flex';
    document.getElementById('helpButton').style.color='#FFFFFF';
    helpBoxToogled=true;
  }
}

// set help message depending on which tool is selected
function setHelpMessage(toolName) {
  if (toolName=="circle" || toolName=="square" || toolName=="diamond") {
    document.getElementById('helpBoxContent').innerHTML=helpMessageShape;
  }else if (toolName=="link") {
    document.getElementById('helpBoxContent').innerHTML=helpMessageEdge;
  }else if (toolName=="eraser") {
    document.getElementById('helpBoxContent').innerHTML=helpMessageEraser;
  }else {
    document.getElementById('helpBoxContent').innerHTML=helpMessageCursor;
  }
}

function setHelpHeader(value){
  document.getElementById('helpBoxHeader').innerHTML="How to use : "+value;
}

function clickBlock(){
  if (currentTool=="circle" || currentTool=="square" || currentTool=="diamond") {
    onForbiddenElement=true;
  }
}
