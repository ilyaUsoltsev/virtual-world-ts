import { Point } from '../primitives/point';

export const getNearestPoint = (
  target: Point,
  points: Point[],
  threshold: number = 20
): Point | null => {
  let nearestPoint: Point | null = null;
  let minDistance = Infinity;

  for (const point of points) {
    const distance = Math.hypot(point.x - target.x, point.y - target.y);
    if (distance < minDistance && distance <= threshold) {
      minDistance = distance;
      nearestPoint = point;
    }
  }

  return nearestPoint;
};

export const subtractPoints = (p1: Point, p2: Point): Point => {
  return new Point(p1.x - p2.x, p1.y - p2.y);
};

export const addPoints = (p1: Point, p2: Point): Point => {
  return new Point(p1.x + p2.x, p1.y + p2.y);
};

export const scalePoint = (p: Point, scale: number): Point => {
  return new Point(p.x * scale, p.y * scale);
};
