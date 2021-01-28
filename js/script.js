var currentNodeName=97;
var currentTool="cursor";
var xPos=0;
var yPos=0;
var xPosNode=0;
var yPosNode=0;
var editingMod=false;

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
}

// detect mouseclick and launch the appropriate function depending on tool used
function canvasClick(){
  if (currentTool=="link") {
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
  document.getElementById(buttonId).style.border="2px solid #FFFFFF";
}

// create a new element (circle, square or diamond)
function addElement(className){
    xPosNode=xPos-20;
    yPosNode=yPos-20;

    // griddish layout
    // xPos=(xPos/25|0)*25;
    // yPos=(yPos/25|0)*25;

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

function remove() {
  if (currentTool=='eraser') {
    this.remove();
  }
}
