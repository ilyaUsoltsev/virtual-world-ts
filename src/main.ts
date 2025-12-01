import { Graph } from './math/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';
import './style.css';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const addPointButton = document.getElementById(
  'add-point'
) as HTMLButtonElement;
const addSegmentButton = document.getElementById(
  'add-segment'
) as HTMLButtonElement;
const removeSegmentButton = document.getElementById(
  'remove-segment'
) as HTMLButtonElement;
const removePointButton = document.getElementById(
  'remove-point'
) as HTMLButtonElement;
const disposeGraphButton = document.getElementById(
  'dispose-graph'
) as HTMLButtonElement;

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
graph.draw(context);

addPointButton.addEventListener('click', () => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const success = graph.tryAddPoint(new Point(x, y));
  if (success) {
    // clear canvas
    context?.clearRect(0, 0, canvas.width, canvas.height);
    // redraw graph
    graph.draw(context);
    console.log('Point added at', x, y);
  }
});

addSegmentButton.addEventListener('click', () => {
  if (graph.points.length < 2) {
    console.log('Not enough points to add a segment.');
    return;
  }
  const p1 = graph.points[Math.floor(Math.random() * graph.points.length)];
  let p2 = graph.points[Math.floor(Math.random() * graph.points.length)];
  // ensure p2 is different from p1
  while (p1.equals(p2)) {
    p2 = graph.points[Math.floor(Math.random() * graph.points.length)];
  }
  const segment = new Segment(p1, p2);
  const success = graph.tryAddSegment(segment);
  if (success) {
    // clear canvas
    context?.clearRect(0, 0, canvas.width, canvas.height);
    // redraw graph
    graph.draw(context);
    console.log('Segment added between', p1, 'and', p2);
  }
});

removeSegmentButton.addEventListener('click', () => {
  if (graph.segments.length === 0) {
    console.log('No segments to remove.');
    return;
  }
  const index = Math.floor(Math.random() * graph.segments.length);
  graph.removeSegment(graph.segments[index]);
  // clear canvas
  context?.clearRect(0, 0, canvas.width, canvas.height);
  // redraw graph
  graph.draw(context);
});

removePointButton.addEventListener('click', () => {
  if (graph.points.length === 0) {
    console.log('No points to remove.');
    return;
  }
  const index = Math.floor(Math.random() * graph.points.length);
  graph.removePoint(graph.points[index]);
  // clear canvas
  context?.clearRect(0, 0, canvas.width, canvas.height);
  // redraw graph
  graph.draw(context);
});

disposeGraphButton.addEventListener('click', () => {
  graph.dispose();
  // clear canvas
  context?.clearRect(0, 0, canvas.width, canvas.height);
  console.log('Graph disposed.');
});
