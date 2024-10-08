// script.test.js

// Mocking the DOM environment using jsdom
const { JSDOM } = require('jsdom');

const htmlContent = `
  <div id="canvas"></div>
  <div id="inputBox" style="display: none;"></div>
  <div id="svgContainer"></div>
  <button id="button_circle"></button>
  <button id="button_square"></button>
  <button id="button_diamond"></button>
  <button id="button_link"></button>
  <button id="button_cursor"></button>
  <button id="button_eraser"></button>
  <div id="helpBox" style="display: none;">
    <div id="helpBoxHeader"></div>
    <div id="helpBoxContent"></div>
  </div>
  <input id="inputField" type="text" />
`;

let dom;
let document;

beforeEach(() => {
  dom = new JSDOM(htmlContent);
  document = dom.window.document;
  global.document = document;

  // Resetting global variables to their initial state
  currentNodeName = 97;
  currentTool = "cursor";
  xPos = 0;
  yPos = 0;
  editingMod = false;
  linkBuilding = false;
  helpBoxToogled = false;
  onForbiddenElement = false;
});

test('should set the tool to cursor and update the help message', () => {
  setTool('circle');
  
  expect(currentTool).toBe('circle');
  expect(document.getElementById('button_circle').style.border).toBe('2px solid #FFFFFF');
  expect(document.getElementById('helpBoxHeader').innerHTML).toBe('How to use : circle');
});

test('should add a node at the current position', () => {
  xPos = 100;
  yPos = 100;
  setTool('circle'); // Set tool to circle to enable node creation
  canvasClick(); // Simulate canvas click to add node

  const newNode = document.getElementById('97'); // ID of the newly created node
  expect(newNode).not.toBeNull();
  expect(newNode.className).toBe('circle');
  expect(newNode.style.left).toBe('80px'); // xPosLastElement = xPos - 20
  expect(newNode.style.top).toBe('80px'); // yPosLastElement = yPos - 20
});

test('should create a caption for the recently added element', () => {
  xPos = 100;
  yPos = 100;
  setTool('circle');
  canvasClick(); // Add a node first

  document.getElementById('inputField').value = 'Test Caption'; // Set caption value
  getCaption(); // Create caption

  const captionNode = document.getElementById('97_caption');
  expect(captionNode).not.toBeNull();
  expect(captionNode.innerHTML).toBe('Test Caption');
});

test('should toggle the help box visibility', () => {
  toogleHelp();
  expect(document.getElementById('helpBox').style.display).toBe('flex');
  
  toogleHelp();
  expect(document.getElementById('helpBox').style.display).toBe('none');
});

test('should remove an element when eraser tool is selected', () => {
  xPos = 100;
  yPos = 100;
  setTool('circle');
  canvasClick(); // Add a node first

  currentTool = 'eraser'; // Switch to eraser
  const newNode = document.getElementById('97'); // Get the added node
  newNode.click(); // Simulate clicking on the node to remove it

  expect(document.getElementById('97')).toBeNull(); // Node should be removed
});