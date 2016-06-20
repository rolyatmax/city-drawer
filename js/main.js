// @flow

import 'whatwg-fetch';
import InfoBox from './info_box';


let callbacks = [];

function loop(t) {
  callbacks = callbacks.map(cb => cb(t) ? cb : null).filter(cb => cb);
  if (callbacks.length) requestAnimationFrame(loop);
}

function register(cb) {
  const running = !!callbacks.length;
  callbacks.push(cb);
  if (!running) {
    requestAnimationFrame(loop);
  }

  return function remove() {
    const index = callbacks.indexOf(cb);
    if (index < 0) {
      return;
    }
    callbacks.splice(index, 1);
  };
}

function easeIn(step, start, change) {
  return change * (1 - Math.pow(1 - step, 3)) + start;
}

function startAnimation(renderFn, duration) {
  return new Promise((resolve) => {
    let startTime;
    register((t) => {
      startTime = startTime || t;
      const step = (t - startTime) / duration;
      renderFn(step);
      if (step >= 1) {
        resolve();
        return false;
      }
      return true;
    });
  });
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

class Drawer {
  constructor(container) {
    const { height, width } = container.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.style.height = `${height}px`;
    canvas.style.width = `${width}px`;
    canvas.height = height * 2;
    canvas.width = width * 2;
    container.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
  }

  arc(arc, duration, color, width = 1) {
    return startAnimation(step => {
      const perc = easeIn(step, 0, 1);
      const toDraw = cutArc(arc, perc);
      drawArc(this.ctx, toDraw, color, width);
    }, duration);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}


const container = document.getElementById('wrapper');

function loadJSON(file) {
  return fetch(file).then((resp) => resp.json());
}

function batch(list, size) {
  const batches = [];
  list = list.slice();
  while (list.length) {
    batches.push(list.slice(0, size));
    list = list.slice(size);
  }
  return batches;
}

loadJSON('data/segments.json')
.then((segments) => {
  window.segments = segments;

  const points = [];
  segments.forEach(seg => {
    seg.forEach(point => points.push(point));
  });

  const maxPt = points.reduce(([mX, mY], [x, y]) => (
    [mX > x ? mX : x, mY > y ? mY : y]
  ), [-Infinity, -Infinity]);

  const minPt = points.reduce(([mX, mY], [x, y]) => (
    [mX < x ? mX : x, mY < y ? mY : y]
  ), [Infinity, Infinity]);

  const createMapper = (canvasHeight, canvasWidth, min, max) => {
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

    return ([x, y]) => ([margin + (x - minX) * scale, (maxY - y) * scale]);
  };

  container.style.height = `${container.getBoundingClientRect().height * 2}px`;

  const drawer = new Drawer(container);

  const info = new InfoBox(document.querySelector('.info'));
  setTimeout(() => info.show(), 3000);

  const mapToCanvas = createMapper(drawer.canvas.height, drawer.canvas.width, minPt, maxPt);
  let i = 0;
  batch(segments, 12).forEach(segmentBatch => {
    i += 1;
    setTimeout(() => {
      segmentBatch.forEach(line => {
        line = line.map(mapToCanvas);
        drawer.arc(line, 2000, 'rgba(10, 10, 10, 0.5)');
      });
    }, 15 * i);
  });
});
