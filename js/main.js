// @flow

import Sketch from 'sketch-js';
import InfoBox from './info_box';


const geoData = {};

const info = new InfoBox(document.querySelector('.info'));
// setTimeout(() => info.show(), 3000);

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

loadJSON('data/lots.geojson')
  .then((lots) => {
    geoData.lots = lots;
    window.geoData = geoData;

    const points = [];
    const polys = lots.features
      .filter(feat => feat.properties.numfloors && feat.properties.numfloors >= 6)
      .map(feat => feat.geometry.coordinates);
    polys.forEach(poly => {
      poly.forEach(lines => {
        lines.forEach(line => {
          line.forEach(point => points.push(point));
        });
      });
    });

    const [maxX, maxY] = points.reduce(([mX, mY], [x, y]) => (
      [mX > x ? mX : x, mY > y ? mY : y]
    ), [-Infinity, -Infinity]);

    const [minX, minY] = points.reduce(([mX, mY], [x, y]) => (
      [mX < x ? mX : x, mY < y ? mY : y]
    ), [Infinity, Infinity]);

    const createMapper = (lowA, highA, lowB, highB) => (val) => {
      const rangeA = highA - lowA;
      const rangeB = highB - lowB;
      return (val - lowA) / rangeA * rangeB + lowB;
    };

    const sketch = Sketch.create({
      container,
      fullscreen: false,
      autoclear: false,
      autostart: false,
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

    const xMapper = createMapper(minX, maxX, 0, sketch.width);
    const yMapper = createMapper(maxY, minY, 0, sketch.height);
    batch(polys, 100).forEach(polygons => {
      setTimeout(() => {
        polygons.forEach(poly => {
          poly.forEach(lines => {
            lines.forEach(line => {
              line = line.map(([x, y]) => [xMapper(x) | 0, yMapper(y) | 0]);
              sketch.beginPath();
              sketch.moveTo(...line[0]);
              for (let i = 1; i < line.length; i++) {
                sketch.lineTo(...line[i]);
              }
              sketch.strokeStyle = 'rgba(10, 10, 10, 0.5)';
              sketch.stroke();
            });
          });
        });
      }, 5);
    });

    window.sketch = sketch;
  });
