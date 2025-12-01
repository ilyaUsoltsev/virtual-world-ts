class Point {
  constructor(public x: number, public y: number) {}

  draw(
    context: CanvasRenderingContext2D | null,
    { size = 18, color = 'black', outline = false } = {}
  ) {
    if (!context) return;

    const radius = size / 2;
    context.fillStyle = color;
    context.beginPath();
    context.arc(this.x, this.y, radius, 0, Math.PI * 2);
    context.fill();
    if (outline) {
      context.beginPath();
      context.arc(this.x, this.y, radius + 2, 0, Math.PI * 2);
      context.lineWidth = 2;
      context.strokeStyle = 'yellow';
      context.stroke();
    }
  }

  equals(other: Point): boolean {
    return (
      Math.floor(this.x) === Math.floor(other.x) &&
      Math.floor(this.y) === Math.floor(other.y)
    );
  }
}
export { Point };
