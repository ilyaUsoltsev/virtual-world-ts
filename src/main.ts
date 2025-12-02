import { GraphEditor } from './graphEditor';
import { Graph } from './math/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';
import './style.css';
import { Viewport } from './viewport';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const saveButton = document.getElementById('save') as HTMLButtonElement;
const disposeButton = document.getElementById('dispose') as HTMLButtonElement;

disposeButton.addEventListener('click', () => {
  dispose();
});

saveButton.addEventListener('click', () => {
  save();
});

canvas.width = 600;
canvas.height = 600;

const context = canvas.getContext('2d');

const savedGraph = localStorage.getItem('graph');
const graphData = savedGraph ? JSON.parse(savedGraph) : null;

const graph = graphData ? Graph.load(graphData) : new Graph();

const viewPort = new Viewport(canvas);
const graphEditor = new GraphEditor(viewPort, graph);

function animate() {
  if (!context) return;

  viewPort.reset();
  graphEditor.display();
  requestAnimationFrame(animate);
}

animate();

function dispose() {
  graphEditor.dispose();
}

function save() {
  localStorage.setItem('graph', JSON.stringify(graph));
}
