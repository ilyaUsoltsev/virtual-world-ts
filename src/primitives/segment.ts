import type { Point } from './point';

class Segment {
  constructor(public start: Point, public end: Point) {}

  draw(
    context: CanvasRenderingContext2D | null,
    lineWidth = 2,
    color = 'black'
  ) {
    if (!context) return;

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.end.x, this.end.y);
    context.stroke();
  }

  equals(other: Segment): boolean {
    return this.includes(other.start) && this.includes(other.end);
  }

  includes(point: Point): boolean {
    return this.start.equals(point) || this.end.equals(point);
  }
}

export { Segment };
