import type { Graph } from './math/graph';
import { getNearestPoint } from './math/utils';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';

class GraphEditor {
  private canvas: HTMLCanvasElement;
  private graph: Graph;
  private context: CanvasRenderingContext2D;
  private selected: Point | null = null;
  private hoveredPoint: Point | null = null;
  private mouse: Point | null = null;
  private dragging = false;

  constructor(canvas: HTMLCanvasElement, graph: Graph) {
    this.canvas = canvas;
    this.graph = graph;
    this.context = this.canvas.getContext('2d')!;
    this._addEventListeners();
  }

  display() {
    this.graph.draw(this.context);

    if (this.selected) {
      this.selected.draw(this.context, { outline: true });
    }

    if (this.hoveredPoint && this.hoveredPoint !== this.selected) {
      this.hoveredPoint.draw(this.context, { color: 'blue', outline: true });
    }

    if (this.selected && this.mouse) {
      const tempSegment = new Segment(this.selected, this.mouse);
      tempSegment.draw(this.context, 2, 'gray');
    }
  }

  private _addEventListeners() {
    this.canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));

    this.canvas.addEventListener('mousemove', (event) => {
      this.mouse = new Point(event.offsetX, event.offsetY);
      // color hovered point differently
      this.hoveredPoint = getNearestPoint(this.mouse, this.graph.points);

      if (this.dragging && this.selected) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }
    });

    // remove the menu
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    this.canvas.addEventListener('mouseup', () => (this.dragging = false));
  }

  private _removePoint(point: Point) {
    this.graph.removePoint(point);
    this.hoveredPoint = null;
    if (this.selected === point) {
      this.selected = null;
    }
  }

  private _selectPoint(point: Point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
  }

  private _handleMouseDown(event: MouseEvent) {
    if (event.button === 2) {
      // mouse right click
      if (this.hoveredPoint) {
        this._removePoint(this.hoveredPoint);
      } else {
        this.selected = null;
      }

      return;
    }

    const mouse = new Point(event.offsetX, event.offsetY);
    if (this.hoveredPoint && !this.dragging && !this.selected) {
      this.selected = this.hoveredPoint;
      this.dragging = true;
      return;
    }

    if (this.hoveredPoint && this.selected) {
      this._selectPoint(this.hoveredPoint);
      return;
    }

    this.graph.addPoint(mouse);
    this._selectPoint(mouse);
    this.selected = mouse;
    this.hoveredPoint = mouse;
  }
}

export { GraphEditor };
