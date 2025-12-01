import type { Point } from '../primitives/point';

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
