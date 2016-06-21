// @flow

import 'whatwg-fetch';
import Sketch from 'sketch-js';
import InfoBox from './info_box';
import { Line, createMapper, getMinMax, isWithinBounds } from './helpers';


const BRUSH_SIZE = 150;
const DURATION = 1500;
const container = document.getElementById('wrapper');

fetch('data/segments.json')
.then((resp) => resp.json())
.then((segments) => {
  window.segments = segments;

  const points = [];
  segments.forEach(seg => {
    seg.forEach(point => points.push(point));
  });

  const {
    min: minPt,
    max: maxPt,
  } = getMinMax(points);

  container.style.height = `${container.getBoundingClientRect().height * 2.5}px`;

  window.sketch = Sketch.create({
    container,
    fullscreen: false,
    autopause: true,
    autoclear: true,
    autostart: true,
    retina: true,
    globals: false,
    width: container.getBoundingClientRect().width,
    height: container.getBoundingClientRect().height,

    setup() {
      const mapToCanvas = createMapper(this.height, this.width, minPt, maxPt);
      this.lines = segments.map(segment => {
        segment = segment.map(mapToCanvas);
        const color = 'rgba(10, 10, 10, 0.45)';
        const duration = DURATION;
        return new Line({ segment, color, duration });
      });
      // this.lines = this.lines.sort((a, b) => (a.center[0] < b.center[0] ? -1 : 1));
    },

    // getWithinBounds(min, max) {
    //   return this.lines.filter(line => isWithinBounds(line, min, max));
    // },

    resize() {
      const { width, height } = container.getBoundingClientRect();
      this.canvas.style.height = `${height}px`;
      this.canvas.style.width = `${width}px`;
      this.canvas.height = height;
      this.canvas.width = width;
      this.height = height;
      this.width = width;
    },

    update() {
      const touch = this.touches[0] || this.mouse;
      const min = [touch.x - BRUSH_SIZE, touch.y - BRUSH_SIZE];
      const max = [touch.x + BRUSH_SIZE, touch.y + BRUSH_SIZE];
      this.lines.forEach(line => {
        const to = isWithinBounds(line, min, max) ? 1 : 0;
        line.setTo(to, this.millis);
      });
      this.lines.forEach(line => line.update(this.millis));
    },

    draw() {
      this.lines.forEach(line => line.draw(this));
    },
  });

  const info = new InfoBox(document.querySelector('.info'));
  setTimeout(() => info.show(), 3000);
});
