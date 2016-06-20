'use strict';

// converts geojson files of multipolygons into a list of two-point line segments
// written to stdout

const fs = require('fs');
const path = require('path');

if (!process.argv[2]) {
  console.error('Please pass in a path');
  process.exit(1);
}

const filepath = path.resolve(process.cwd(), process.argv[2]);
const fileContents = fs.readFileSync(filepath);
const geojson = JSON.parse(fileContents);

process.stdout.write('[');

let isFirst = true;

geojson.features
  .map(feat => feat.geometry.coordinates)
  .forEach(poly => {
    poly.forEach(lines => {
      lines.forEach(line => {
        for (let i = 1; i < line.length; i++) {
          if (!isFirst) process.stdout.write(',');
          isFirst = false;
          const segmentJSON = JSON.stringify([line[i - 1], line[i]]);
          process.stdout.write(segmentJSON);
        }
      });
    });
  });

process.stdout.write(']');
