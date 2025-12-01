import { GraphEditor } from './graphEditor';
import { Graph } from './math/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';
import './style.css';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;

canvas.width = 600;
canvas.height = 600;

const context = canvas.getContext('2d');

const p1 = new Point(100, 100);
const p2 = new Point(500, 100);
const p3 = new Point(500, 500);
const p4 = new Point(100, 500);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p2, p3);
const s3 = new Segment(p3, p4);
const s4 = new Segment(p4, p1);

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
const graphEditor = new GraphEditor(canvas, graph);

function animate() {
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  graphEditor.display();
  requestAnimationFrame(animate);
}

animate();
