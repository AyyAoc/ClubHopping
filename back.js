const express = require('express');
const path = require('path');
const app = express();
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');


const nodes = {
  "Chorus": { lat: 18.792121, lng: 98.971415 },
  "Tennis": { lat: 18.791664, lng: 98.971399 },
  "Basketball": { lat: 18.791293, lng: 98.971437 },
  "Santanakan": { lat: 18.791542, lng: 98.972070 },
  "Music": { lat: 18.790968, lng: 98.971222 },
  "ReadingRoom": { lat: 18.790897, lng: 98.972166 },
  "50Years": { lat: 18.790836, lng: 98.972751 },
  "TurtleDome": { lat: 18.790415, lng: 98.972488 },
  "CMSO": { lat: 18.790257, lng: 98.972928 },
  "RB": { lat: 18.789988, lng: 98.972579 },
  "RN": { lat: 18.789942, lng: 98.973100 },
  "Football": { lat: 18.789886, lng: 98.971555 },
  "Path1": { lat: 18.792085, lng: 98.971868 },
  "Path2": { lat: 18.790585, lng: 98.971811 }
};

const connections = {
  "Chorus": ["Path1"],
  "Tennis": ["Path1"],
  "Basketball": ["Path2", "Path1"],
  "Santanakan": ["Path2"],
  "Music": ["Path2"],
  "ReadingRoom": ["Path2"],
  "50Years": ["Path2"],
  "TurtleDome": ["Path2"],
  "CMSO": ["Path2"],
  "RB": ["Path2"],
  "RN": ["Path2"],
  "Football": ["Path2"],
  "Path1": ["Chorus", "Tennis", "Path2", "Santanakan"],
  "Path2": ["Path1", "Basketball", "Music", "ReadingRoom", "50Years", "TurtleDome", "CMSO", "RB", "RN", "Football"]
};

const clubNames = {
  "Chorus": "ชมรมคอลัส",
  "Tennis": "ชมรมเทนนิส",
  "Basketball": "ชมรมบาสเกตบอล",
  "Santanakan": "ชมรมสันทนาการ",
  "Music": "ชมรมดนตรี",
  "ReadingRoom": "ห้องอ่านหนังสือ",
  "50Years": "50 ปี",
  "TurtleDome": "โดมเต่า",
  "CMSO": "สโมสรณ์",
  "RB": "ตึก RB",
  "RN": "ตึก RN",
  "Football": "ชมรมฟุตบอล"
};

const pathNames = {
  "Path1": "ทางเดินที่หนึ่ง",
  "Path2": "ทางเดินที่สอง"
};


const distanceCache = {};

function haversineDistance(lat1, lon1, lat2, lon2) {
  const key = `${lat1},${lon1}-${lat2},${lon2}`;
  if (distanceCache[key]) return distanceCache[key];

  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  distanceCache[key] = distance;
  return distance;
}


const pathCache = {};

function generateGraph(connections, nodes) {
  let graph = {};
  for (let node in connections) {
    if (!graph[node]) graph[node] = {};
    connections[node].forEach(neighbor => {
      if (nodes[neighbor]) {
        let distance = haversineDistance(
          nodes[node].lat, nodes[node].lng,
          nodes[neighbor].lat, nodes[neighbor].lng
        );
        graph[node][neighbor] = distance;
      }
    });
  }
  return graph;
}

const graph = generateGraph(connections, nodes);

function dijkstra(start, end) {
  const cacheKey = `${start}-${end}`;
  if (pathCache[cacheKey]) return pathCache[cacheKey];

  let distances = {};
  let previous = {};
  let queue = new MinPriorityQueue(({ priority }) => priority);

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;
  queue.enqueue({ node: start, priority: 0 });

  while (!queue.isEmpty()) {
    let { node: current } = queue.dequeue();

    if (current === end) break;

    for (let neighbor in graph[current]) {
      let newDistance = distances[current] + graph[current][neighbor];

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
        queue.enqueue({ node: neighbor, priority: newDistance }); 
      }
    }
  }

  let path = [];
  let step = end;
  while (step) {
    path.unshift(step);
    step = previous[step];
  }

  pathCache[cacheKey] = path;
  return path;
}



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexForTestBackend.html'));
});

app.use(express.static(path.join(__dirname)));

app.get('/api/data', (req, res) => {
  res.json({ nodes, connections, clubNames, pathNames });
});


app.post('/api/path', express.json(), (req, res) => {
  const { start, end } = req.body;
  const cacheKey = `${start}-${end}`;
  
  if (pathCache[cacheKey]) {
    res.json({ path: pathCache[cacheKey], cached: true });
    return;
  }

  const path = dijkstra(start, end);
  res.json({ path, cached: false });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
