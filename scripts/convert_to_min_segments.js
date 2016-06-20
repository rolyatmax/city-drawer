'use strict';

const fs = require('fs');
const path = require('path');

if (!process.argv[2]) {
  console.error('Please pass in a path');
  process.exit(1);
}

function randomItem(list) {
  return list[Math.random() * list.length | 0];
}

function removeFromLookupTable(segment, table) {
  const pointA = segment[0];
  const pointB = segment[segment.length - 1];
  const pointAKey = pointA.join(',');
  const pointBKey = pointB.join(',');
  table[pointAKey] = table[pointAKey] || [];
  table[pointBKey] = table[pointBKey] || [];
  const pointAList = table[pointAKey];
  const pointBList = table[pointBKey];
  pointAList.splice(pointAList.indexOf(segment), 1);
  pointBList.splice(pointBList.indexOf(segment), 1);
}

function addToLookupTable(segment, table) {
  const pointA = segment[0];
  const pointB = segment[segment.length - 1];
  const pointAKey = pointA.join(',');
  const pointBKey = pointB.join(',');
  table[pointAKey] = table[pointAKey] || [];
  table[pointBKey] = table[pointBKey] || [];
  table[pointAKey].push(segment);
  table[pointBKey].push(segment);
}

function isSamePoint(pointA, pointB) {
  return pointA.join(',') === pointB.join(',');
}

function mergeSegments(segmentA, segmentB) {
  segmentA = segmentA.slice();
  segmentB = segmentB.slice();
  if (isSamePoint(segmentA[0], segmentB[0])) {
    segmentA = segmentA.reverse();
  } else if (isSamePoint(segmentA[segmentA.length - 1], segmentB[segmentB.length - 1])) {
    segmentB = segmentB.reverse();
  } else if (isSamePoint(segmentA[0], segmentB[segmentB.length - 1])) {
    segmentA = segmentA.reverse();
    segmentB = segmentB.reverse();
  }
  return [].concat(segmentA, segmentB.slice(1));
}

////////////////////// tests

// const segs = [
//   [[0, 1], [3, 2]],
//   [[1, 2], [9, 0]],
//   [[9, 0], [8, 4]],
//   [[3, 2], [5, 5]],
// ];
//
// console.log('-------');
// console.log(reduceToMinSegments(segs));
//
//
// process.exit();


////////////////////// main

const filepath = path.resolve(process.cwd(), process.argv[2]);
const fileContents = fs.readFileSync(filepath);
const geojson = JSON.parse(fileContents);

const lineSegments = [];

geojson.features
  .map(feat => feat.geometry.coordinates)
  .forEach(poly => {
    poly.forEach(lines => {
      lines.forEach(line => {
        for (let i = 1; i < line.length; i++) {
          lineSegments.push([line[i - 1], line[i]]);
        }
      });
    });
  });

console.log(`${lineSegments.length} initial line segments, writing to file`);

const preSegOutputFile = path.resolve(process.cwd(), `pre-segments_${Date.now()}.json`);
fs.writeFileSync(preSegOutputFile, JSON.stringify(lineSegments));

console.log('File written');

function reduceToMinSegments(segments) {
  const lookupTable = {};
  segments.forEach((segment) => addToLookupTable(segment, lookupTable));

  const finalSegments = [];
  let i = 0;
  while (segments.length) {
    const segment = randomItem(segments);
    const pointA = segment[0];
    const pointB = segment[segment.length - 1];
    // console.log('Using segment:', segment);
    const mergeCandidates = [].concat(
      lookupTable[pointA.join(',')] || [],
      lookupTable[pointB.join(',')] || []
    );

    // if segment is in merge candidate list, remove it
    let selfIndex = mergeCandidates.indexOf(segment);
    while (selfIndex > -1) {
      mergeCandidates.splice(selfIndex, 1);
      selfIndex = mergeCandidates.indexOf(segment);
    }

    // console.log('Merge candidates:', mergeCandidates);

    if (!mergeCandidates.length || segments.length === 1) {
      finalSegments.push(segment);
      removeFromLookupTable(segment, lookupTable);
      segments.splice(segments.indexOf(segment), 1);
      continue;
    }

    const mergeCandidate = randomItem(mergeCandidates);

    // console.log('Selected merge candidate:', mergeCandidate);

    const merged = mergeSegments(segment, mergeCandidate);

    // console.log('Merged:', merged);

    segments.splice(segments.indexOf(segment), 1);
    segments.splice(segments.indexOf(mergeCandidate), 1);
    removeFromLookupTable(segment, lookupTable);
    removeFromLookupTable(mergeCandidate, lookupTable);
    segments.push(merged);
    addToLookupTable(merged, lookupTable);
    console.log(`${i} iterations: ${segments.length} segments, ${finalSegments.length} final segments`);
    // console.log('-------');
    i += 1;
  }
  console.log(`${finalSegments.length} final segments - in ${i} iterations`);
  return finalSegments;
}

const outputFile = path.resolve(process.cwd(), `segments_${Date.now()}.json`);
fs.writeFileSync(outputFile, JSON.stringify(reduceToMinSegments(lineSegments)));
