import type { Point } from '../primitives/point';
import type { Segment } from '../primitives/segment';

class Graph {
  points: Point[];
  segments: Segment[];

  constructor(points: Point[] = [], segments: Segment[] = []) {
    this.points = points;
    this.segments = segments;
  }

  draw(context: CanvasRenderingContext2D | null) {
    for (const segment of this.segments) {
      segment.draw(context);
    }

    for (const point of this.points) {
      point.draw(context);
    }
  }

  containsPoint(point: Point): boolean {
    return this.points.find((p) => p.equals(point)) !== undefined;
  }

  addPoint(point: Point) {
    this.points.push(point);
  }

  removePoint(pointToRemove: Point) {
    const index = this.points.indexOf(pointToRemove);
    if (index === -1) {
      return;
    }
    const segmentsWithPoint = this.segments.filter((s) =>
      s.includes(pointToRemove)
    );

    for (const seg of segmentsWithPoint) {
      this.removeSegment(seg);
    }
    this.points.splice(index, 1);
  }

  tryAddPoint(point: Point): boolean {
    if (this.containsPoint(point)) {
      return false;
    }
    this.addPoint(point);
    return true;
  }

  addSegment(segment: Segment) {
    this.segments.push(segment);
  }

  tryAddSegment(segment: Segment): boolean {
    for (const existingSegment of this.segments) {
      if (existingSegment.equals(segment)) {
        return false;
      }
    }
    this.addSegment(segment);
    return true;
  }

  removeSegment(segmentToRemove: Segment) {
    const index = this.segments.indexOf(segmentToRemove);
    if (index === -1) {
      return;
    }
    this.segments.splice(index, 1);
  }

  dispose() {
    // reuse arrays, instead of creating new ones
    this.points.length = 0;
    this.segments.length = 0;
  }
}

export { Graph };
