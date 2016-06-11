// @flow

import Sketch from 'sketch-js';
import InfoBox from './info_box';


const info = new InfoBox(document.querySelector('.info'));
setTimeout(() => info.show(), 3000);

const container = document.getElementById('wrapper');

const sketch = Sketch.create({
  container,
  fullscreen: false,
  retina: true,
  globals: false,
  width: container.getBoundingClientRect().width,
  height: container.getBoundingClientRect().height,

  resize() {
    const { width, height } = container.getBoundingClientRect();
    this.canvas.style.height = `${height}px`;
    this.canvas.style.width = `${width}px`;
    this.canvas.height = height;
    this.canvas.width = width;
    this.height = height;
    this.width = width;
  },
});

window.sketch = sketch;
