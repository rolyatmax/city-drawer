// @flow

export function getMinMax(points) {
  const max = points.reduce(([mX, mY], [x, y]) => (
    [mX > x ? mX : x, mY > y ? mY : y]
  ), [-Infinity, -Infinity]);

  const min = points.reduce(([mX, mY], [x, y]) => (
    [mX < x ? mX : x, mY < y ? mY : y]
  ), [Infinity, Infinity]);

  return { min, max };
}

export function rand(list) {
  return list[list.length * Math.random() | 0];
}

export function createMapper(canvasHeight, canvasWidth, min, max) {
  const [minX, minY] = min;
  const [maxX, maxY] = max;

  const xDiff = maxX - minX;
  const yDiff = maxY - minY;

  const xScale = canvasWidth / xDiff;
  const yScale = canvasHeight / yDiff;
  const scale = xScale < yScale ? xScale : yScale;

  // center
  const halfway = canvasWidth / 2;
  const halfMapWidth = xDiff * scale / 2;
  const margin = halfway - halfMapWidth;

  return ([x, y]) => ([margin + (x - minX) * scale | 0, (maxY - y) * scale | 0]);
}

function dist([x1, y1], [x2, y2]) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  return Math.sqrt(xDist * xDist + yDist * yDist);
}

function drawArc(ctx, arc, color, width) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(...arc[0]);
  arc.slice(1).forEach(pt => ctx.lineTo(...pt));
  ctx.stroke();
}

function getArcDist(arc) {
  let last = arc[0];
  return arc.reduce((total, pt) => {
    total += dist(last, pt);
    last = pt;
    return total;
  }, 0);
}

function cutArc(arc, perc) {
  let last = arc[0];
  let toGo = getArcDist(arc) * perc;
  const toDraw = [last];
  for (let i = 1, len = arc.length; i < len; i++) {
    const pt = arc[i];
    const segmentDist = dist(last, pt);
    if (!segmentDist) {
      continue;
    }
    if (toGo === 0) {
      break;
    }
    if (segmentDist <= toGo) {
      toDraw.push(pt);
      toGo -= segmentDist;
      last = pt;
      continue;
    }
    const cutPerc = toGo / segmentDist;
    const x = (pt[0] - last[0]) * cutPerc + last[0];
    const y = (pt[1] - last[1]) * cutPerc + last[1];
    toDraw.push([x, y]);
    break;
  }
  return toDraw;
}

function getCenter(segment) {
  const { min, max } = getMinMax(segment);
  return [
    (min[0] + max[0]) / 2 | 0,
    (min[1] + max[1]) / 2 | 0,
  ];
}


export class Line {
  constructor({ segment, color, speed }) {
    this.segment = segment;
    this.to = 0;
    this.cur = 0;
    this.color = color;
    this.speed = speed;
    this.center = getCenter(segment);
  }

  update() {
    if (Math.abs(this.cur - this.to) < 0.007) {
      this.cur = this.to;
    }
    const d = (this.to - this.cur) * this.speed;
    this.cur += d;
    this.cur = Math.min(Math.max(0, this.cur), 1);
    return this.cur !== this.to;
  }

  draw(ctx) {
    if (this.cur === 0) return;
    const toDraw = (this.cur === 1) ? this.segment : cutArc(this.segment, this.cur);
    drawArc(ctx, toDraw, this.color, 1);
  }
}
