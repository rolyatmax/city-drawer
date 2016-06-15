// @flow

import Sketch from 'sketch-js';
import InfoBox from './info_box';


const geoData = {};

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

    const sketch = Sketch.create({
      container,
      fullscreen: false,
      autoclear: false,
      autostart: false,
      retina: true,
      globals: false,
      width: container.getBoundingClientRect().width * 2,
      height: container.getBoundingClientRect().height * 2,

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

    const info = new InfoBox(document.querySelector('.info'));
    setTimeout(() => info.show(), 3000);

    const mapToCanvas = createMapper(sketch.height, sketch.width, minPt, maxPt);
    batch(polys, 100).forEach(polygons => {
      setTimeout(() => {
        polygons.forEach(poly => {
          poly.forEach(lines => {
            lines.forEach(line => {
              line = line.map(mapToCanvas);
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
