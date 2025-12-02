import type { Graph } from './math/graph';
import { getNearestPoint } from './math/utils';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';
import type { Viewport } from './viewport';

class GraphEditor {
  private canvas: HTMLCanvasElement;
  private graph: Graph;
  private context: CanvasRenderingContext2D;
  private selected: Point | null = null;
  private hoveredPoint: Point | null = null;
  private mouse: Point | null = null;
  private dragging = false;
  private viewport: Viewport;

  constructor(viewport: Viewport, graph: Graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
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

  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hoveredPoint = null;
    this.mouse = null;
    this.dragging = false;
  }

  private _addEventListeners() {
    this.canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
    // remove browser context menu
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
    } else if (event.button === 0) {
      if (this.hoveredPoint && !this.dragging && !this.selected) {
        this.selected = this.hoveredPoint;
        this.dragging = true;
        return;
      }

      if (this.hoveredPoint && this.selected) {
        this._selectPoint(this.hoveredPoint);
        return;
      }

      if (!this.mouse) {
        return;
      }
      // add new point
      this.graph.addPoint(this.mouse);
      this._selectPoint(this.mouse);
      this.selected = this.mouse;
      this.hoveredPoint = this.mouse;
    }
  }

  private _handleMouseMove(event: MouseEvent) {
    this.mouse = this.viewport.getMouse(event, true);
    // color hovered point differently
    this.hoveredPoint = getNearestPoint(
      this.mouse,
      this.graph.points,
      10 / this.viewport.zoomLevel
    );

    if (this.dragging && this.selected) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }
}

export { GraphEditor };
