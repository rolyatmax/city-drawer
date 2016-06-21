// @flow

import 'whatwg-fetch';
import Sketch from 'sketch-js';
import InfoBox from './info_box';
import { Line, createMapper, getMinMax, rand } from './helpers';


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

  container.style.height = `${container.getBoundingClientRect().height * 2}px`;

  window.sketch = Sketch.create({
    container,
    fullscreen: false,
    autopause: false,
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
        const color = 'rgba(10, 10, 10, 0.8)';
        const speed = 0.02;
        return new Line({ segment, color, speed });
      });
      this.isActive = [];
      this.animate();
    },

    animate() {
      // this.isActive = this.isActive.filter(line => {
      //   line.to = 0;
      //   return false;
      // });
      let i = 20;
      while (i--) {
        const line = rand(this.lines);
        line.to = 1;
        this.isActive.push(line);
      }
      setTimeout(() => this.animate(), 30);
    },

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
      // look at mouse and set to 1 and add to isAnimating
      // look at those in isAnimating out of range and set to 0
      this.lines.forEach(line => line.update());
    },

    draw() {
      this.lines.forEach(line => line.draw(this));
    },
  });

  const info = new InfoBox(document.querySelector('.info'));
  setTimeout(() => info.show(), 3000);
});
