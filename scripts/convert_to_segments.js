// converts geojson files of multipolygons into a list of two-point line segments
// written to stdout

const { stdin, stdout } = process;

const BOUNDS = {
  x: [2.274771, 2.406092],
  y: [48.829804, 48.895417],
};

let data = '';

stdin.on('readable', () => {
  const chunk = stdin.read();
  if (chunk !== null) {
    data += chunk;
  }
  pump();
});

stdin.on('end', () => {
  pump();
  end();
});

stdout.write('[');

let hasReachedFeatures = false;

function pump() {
  // ignore everything up to features
  if (!hasReachedFeatures) {
    const featuresText = '"features": [';
    const featuresIndex = data.indexOf(featuresText);
    if (featuresIndex < 0) {
      data = '';
    } else {
      data = data.slice(featuresIndex + featuresText.length);
      hasReachedFeatures = true;
    }
  }

  let openBraces = 0;
  let objectStart = null;
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (char === '{' && openBraces === 0) objectStart = i;
    if (char === '{') openBraces += 1;
    if (char === '}') openBraces -= 1;
    if (char === '}' && openBraces === 0) processFeature(data.slice(objectStart, i + 1));
    if (char === ']' && openBraces === 0) end();
  }
  data = data.slice(objectStart);
}

function processFeature(featJSON) {
  const feat = JSON.parse(featJSON);
  const geo = feat.geometry;
  setTimeout(() => {
    if (geo.type === 'MultiPolygon') {
      geo.coordinates.forEach(lines => {
        lines.forEach(processLine);
      });
    }
    if (geo.type === 'Polygon') {
      geo.coordinates.forEach(processLine);
    }
    if (geo.type === 'LineString') {
      processLine(geo.coordinates);
    }
  }, 1);
}

function end() {
  stdout.write(']');
  process.exit(0);
}

let isFirst = true;

function processLine(line) {
  for (let i = 1; i < line.length; i++) {
    if (!isPointInBounds(line[i - 1]) || !isPointInBounds(line[i])) {
      continue;
    }
    if (!isFirst) stdout.write(',');
    isFirst = false;
    const segmentJSON = JSON.stringify([line[i - 1], line[i]]);
    stdout.write(segmentJSON);
  }
}

function isPointInBounds([x, y]) {
  return x > BOUNDS.x[0] && x < BOUNDS.x[1] &&
    y > BOUNDS.y[0] && y < BOUNDS.y[1];
}
