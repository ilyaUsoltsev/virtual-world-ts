import { addPoints, scalePoint, subtractPoints } from './math/utils';
import { Point } from './primitives/point';

class Viewport {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  zoomLevel = 1.0;
  offset: Point; // offest from canvas origin
  center: Point;

  drag = {
    start: new Point(0, 0), // mouse position at drag start
    end: new Point(0, 0), // mouse position at drag end
    offset: new Point(0, 0), // accumulated offset while dragging
    active: false,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.zoomLevel = 1;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scalePoint(this.center, -1);
    this._addEventListeners();
  }

  private _addEventListeners() {
    this.canvas.addEventListener('wheel', this._handleZoom.bind(this));
    this.canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));
  }

  getMouse(event: MouseEvent, subtractDragOffset: boolean = false): Point {
    const p = new Point(
      (event.offsetX - this.center.x) / this.zoomLevel - this.offset.x,
      (event.offsetY - this.center.y) / this.zoomLevel - this.offset.y
    );
    if (subtractDragOffset) {
      return subtractPoints(p, this.drag.offset);
    }
    return p;
  }

  getOffset() {
    return addPoints(this.offset, this.drag.offset);
  }

  reset() {
    this.context?.restore();
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context?.save();
    this.context?.translate(this.center.x, this.center.y);
    this.context?.scale(this.zoomLevel, this.zoomLevel);
    const offset = this.getOffset();
    this.context?.translate(offset.x, offset.y);
  }

  private _handleZoom(event: WheelEvent) {
    event.preventDefault();
    const dir = Math.sign(event.deltaY);
    const step = 0.1;
    this.zoomLevel += dir * step;
    this.zoomLevel = Math.min(Math.max(this.zoomLevel, 0.1), 5);
  }

  private _handleMouseDown(event: MouseEvent) {
    if (event.button === 1) {
      // middle mouse button
      this.drag.start = this.getMouse(event);
      this.drag.active = true;
    }
  }

  private _handleMouseMove(event: MouseEvent) {
    if (!this.drag.active) {
      return;
    }
    this.drag.end = this.getMouse(event);
    this.drag.offset = subtractPoints(this.drag.end, this.drag.start);
  }

  private _handleMouseUp(event: MouseEvent) {
    if (this.drag.active) {
      this.offset = addPoints(this.offset, this.drag.offset);
    }
    this.drag = {
      start: new Point(0, 0), // mouse position at drag start
      end: new Point(0, 0), // mouse position at drag end
      offset: new Point(0, 0), // accumulated offset while dragging
      active: false,
    };
  }
}

export { Viewport };
