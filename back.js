const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');


const nodes = {
  "50years": { lat: 18.790932591930726, lng: 98.97275153607072 },
  "Chorus": { lat: 18.792078, lng: 98.971493 },
  "Tennis": { lat: 18.791656, lng: 98.971530 },  
  "Chairball": { lat: 18.791527, lng: 98.972063 },
  "Pingpong": { lat: 18.791527, lng: 98.972063 },
  "Badminton": { lat: 18.791527, lng: 98.972063 },
  "Basketball": { lat: 18.791278, lng: 98.971319 },
  "Volleyball": { lat: 18.791283, lng: 98.971479 },
  "Thaimusic": { lat: 18.790943, lng: 98.971439 },
  "Music": { lat: 18.790943, lng: 98.971439 },
  "Bridge": { lat: 18.790933, lng: 98.972240 },
  "Coverdance": { lat: 18.790902, lng: 98.972707 },
  "Devil": { lat: 18.790902, lng: 98.972707 },
  "Cheerleader": { lat: 18.790549, lng: 98.972482 },
  "Swimming": { lat: 18.790549, lng: 98.972482 },
  "CMSO": { lat: 18.790257, lng: 98.972933 },
  "IMSU": { lat: 18.789990, lng: 98.972625 },
  "Libir": { lat: 18.789990, lng: 98.972625 },
  "E-Sport": { lat: 18.789990, lng: 98.972625 },
  "Research": { lat: 18.789990, lng: 98.972625 },
  "MCCC": { lat: 18.789990, lng: 98.972625 },
  "Muan": { lat: 18.789980, lng: 98.973104 },
  "Art": { lat: 18.789980, lng: 98.973104 },
  "Mhornoi": { lat: 18.789980, lng: 98.973104 },
  "Porch": { lat: 18.789980, lng: 98.973104 },
  "Football": { lat: 18.789815, lng: 98.971550 },
  "Run": { lat: 18.789815, lng: 98.971550 },
  "Petange": { lat: 18.789815, lng: 98.971550 },
  "path1chorus": { lat: 18.792057, lng: 98.971857 },
  "path1tennis": { lat: 18.791664, lng: 98.971852 },
  "path1basketball": { lat: 18.791291, lng: 98.971839 },
  "path1music": { lat: 18.790948, lng: 98.971801 },
  "path1bridge": { lat: 18.790927, lng: 98.971911 },
  "path1field": { lat: 18.790582, lng: 98.971898 },
  "path1cheerleader": { lat: 18.790572, lng: 98.972259 },
  "path2_50yeartoRB": { lat: 18.790811, lng: 98.972544 },
  "path2_50yeartoRB2": { lat: 18.790564, lng: 98.972520 },
  "path2_50yeartoRB3": { lat: 18.790559, lng: 98.972316},
  "path2_50yeartoRB4": { lat: 18.790176, lng: 98.972308 },
  "path2_50yeartoRB5": { lat: 18.790168, lng: 98.972490 },
  "pathupper_50year1": { lat: 18.790775, lng: 98.972793 },
  "pathupper_50year2": { lat: 18.790161, lng: 98.972799 },
  "pathupper_50year3": { lat: 18.790156, lng: 98.972981 },
  "RB": { lat: 18.789990, lng: 98.972625 },
  "RN": { lat: 18.789980, lng: 98.973104 },
};

const connections = {
  "50years": ["path2_50yeartoRB","pathupper_50year1","Devil","Coverdance"],
  "Chorus": ["path1chorus"],
  "Tennis": ["path1tennis"],
  "Chairball": ["path1tennis","Pingpong","Badminton"],
  "Pingpong": ["path1tennis","Chairball","Badminton"],
  "Badminton": ["path1tennis","Pingpong","Chairball"],
  "Basketball": ["path1basketball","Volleyball"],
  "Volleyball": ["path1basketball","Basketball"],
  "Thaimusic": ["path1music"],
  "Music": ["path1music"],
  "Bridge": ["path1bridge"],
  "Coverdance": ["path2_50yeartoRB","pathupper_50year1","Devil"],
  "Devil": ["path2_50yeartoRB","pathupper_50year1","Coverdance"],
  "Cheerleader": ["path1cheerleader" , "path2_50yeartoRB3","Swimming"],
  "Swimming": ["path2_50yeartoRB3","Cheerleader"],
  "CMSO": ["path2_50yeartoRB5","RN"],
  "RB": ["path2_50yeartoRB5","pathupper_50year2","IMSU","Research","MCCC","E-Sport","Libir"],
  "IMSU": ["RB"],
  "Libir": ["RB"],
  "E-Sport": ["RB"],
  "Research": ["RB"],
  "MCCC": ["RB"],
  "RN": ["Muan","Art","Mhornoi","Porch","pathupper_50year3"],
  "Muan": ["RN"],
  "Art": ["RN"],
  "Mhornoi": ["RN"],
  "Porch": ["RN"],
  "Football": ["path1field","Run","Petange"],
  "Run": ["path1field","Football","Petange"],
  "Petange": ["path1field","Football","Run"],
  "path1chorus": ["Chorus", "path1tennis"],
  "path1tennis": ["Tennis", "path1basketball" ,"Chairball" , "Pingpong" , "Badminton","path1chorus"],
  "path1basketball": ["Basketball", "path1music","path1tennis","Volleyball"],
  "path1music": ["Music", "path1bridge","path1basketball","Thaimusic"],
  "path1bridge": ["Bridge", "path1field","path1music"],
  "path1field": ["Football", "Run", "Petange", "path1cheerleader","path1bridge","path2_50yeartoRB3"],
  "path1cheerleader": ["path2_50yeartoRB3","Cheerleader"],
  "path2_50yeartoRB": ["path2_50yeartoRB2","pathupper_50year1","Coverdance","Devil"],
  "path2_50yeartoRB2": ["path2_50yeartoRB3","path2_50yeartoRB","Cheerleader","Swimming"],
  "path2_50yeartoRB3": ["path2_50yeartoRB4","path2_50yeartoRB2","path1field"],
  "path2_50yeartoRB4": ["path2_50yeartoRB5","path2_50yeartoRB3","CMSO"],
  "path2_50yeartoRB5": ["RB","path2_50yeartoRB4","CMSO"],
  "pathupper_50year1": ["pathupper_50year2","path2_50yeartoRB"],
  "pathupper_50year2": ["pathupper_50year3","pathupper_50year1","RN"],
  "pathupper_50year3": ["RN","pathupper_50year2"],

};

const clubNames = {
  "50years": "อาคาร 50 ปี",
  "Chorus": "ชมรมคอลัส",
  "Tennis": "ชมรมเทนนิส",
  "Chairball": "ชมรมแชร์บอล",
  "Pingpong": "ชมรมปิงปอง",
  "Badminton": "ชมรมแบดมินตัน",
  "Basketball": "ชมรมบาสเกตบอล",
  "Volleyball": "ชมรมวอลเลย์บอล",
  "Thaimusic": "ชมรมดนตรีไทย",
  "Music": "ชมรมดนตรี",
  "Bridge": "ชมรมบอร์ดเกม",
  "Coverdance": "ชมรมคัฟเวอร์แดนซ์",
  "Devil": "ชมรมเดวิล",
  "Cheerleader": "ชมรมเชียร์หลีดเดอร์",
  "Swimming": "ชมรมว่ายน้ำ",
  "CMSO": "สโมสรนักศึกษา",
  "IMSU": "ชมรมอิมสู",
  "Libir": "ชมรมห้องสมุด",
  "E-Sport": "ชมรมอีสปอร์ต",
  "Research": "ชมรมวิจัย",
  "MCCC": "ชมรมถ่ายรูป",
  "Muan": "ชมรมมวน",
  "Art": "ชมรมศิลปะ",
  "Mhornoi": "ชมรมหมอน้อย",
  "Porch": "พอช",
  "Football": "ชมรมฟุตบอล",
  "Run": "ชมรมวิ่ง",
  "Petange": "ชมรมเปตอง",
};

const pathNames = {
  "Path1": "ทางเดินที่หนึ่ง",
  "Path2": "ทางเดินที่สอง"
};

const nodeFloors = {

  "Chorus": 1,
  "Tennis": 1,
  "Chairball": 1,
  "Pingpong": 1,
  "Badminton": 1,
  "Basketball": 1,
  "Volleyball": 1,
  "Thaimusic": 1,
  "Music": 1,
  "Bridge": 1,
  "Cheerleader": 1,
  "Swimming": 1,
  "Football": 1,
  "Run": 1,
  "Petange": 1,
  

  "Coverdance": 2,
  "Devil": 2,
  "CMSO": 1,
  "IMSU": 3,
  "Libir": 4,
  "E-Sport": 3,
  "Research": 4,
  "MCCC": 4,
  "Muan": 4,
  "Art": 2,
  "Mhornoi": 4,
  "Porch": 2,
  

  "path1chorus": 1,
  "path1tennis": 1,
  "path1basketball": 1,
  "path1music": 1,
  "path1bridge": 1,
  "path1field": 1,
  "path1cheerleader": 1,
  "path1football": 1,
  

  "pathupper_50year1": 2,
  "pathupper_50year2": 2,
  "pathupper_50year3": 2,
  

  "path2_50yeartoRB": 1,
  "path2_50yeartoRB2": 1,
  "path2_50yeartoRB3": 1,
  "path2_50yeartoRB4": 1,
  "path2_50yeartoRB5": 1,


  "RB": 1,
  "RN": 1
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
        
        if (nodeFloors[node] && nodeFloors[neighbor]) {
          const floorDifference = Math.abs(nodeFloors[node] - nodeFloors[neighbor]);
          if (floorDifference > 0) {
            distance += 50 * floorDifference;
          }
        }
        
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
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname)));

app.get('/api/data', (req, res) => {
  res.json({ nodes, connections, clubNames, pathNames, nodeFloors });
});


// Serve static files (including images)
app.use('/sponsor-images', express.static(path.join(__dirname)));

// Create individual endpoints for each sponsor image
app.get('/sponsor-image/left1', (req, res) => {
  res.sendFile(path.join(__dirname, 'IMG_8975.PNG'));
});

app.get('/sponsor-image/left2', (req, res) => {
  res.sendFile(path.join(__dirname, 'IMG_9395.JPG'));
});

app.get('/sponsor-image/left3', (req, res) => {
  res.sendFile(path.join(__dirname, 'IMG_9494.JPG'));
});

app.get('/sponsor-image/left4', (req, res) => {
  res.sendFile(path.join(__dirname, 'New Logo MFC.PNG.png'));
});

app.get('/sponsor-image/right1', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pocari Logo-BlueBG_180122(EN).png'));
});

app.get('/sponsor-image/right2', (req, res) => {
  res.sendFile(path.join(__dirname, 'a07557e716e8cd6490bc4ff03aa9da10.jpeg'));
});

app.get('/sponsor-image/right3', (req, res) => {
  res.sendFile(path.join(__dirname, 'images.png'));
});

app.get('/sponsor-image/right4', (req, res) => {
  res.sendFile(path.join(__dirname, 'logojackal_01.webp'));
});

// Modified sponsors API to return URLs to the individual endpoints
app.get('/api/sponsors', (req, res) => {
  const leftSponsors = [
    '/sponsor-image/left1',
    '/sponsor-image/left2',
    '/sponsor-image/left3',
    '/sponsor-image/left4'
  ];
  
  const rightSponsors = [
    '/sponsor-image/right1',
    '/sponsor-image/right2',
    '/sponsor-image/right3',
    '/sponsor-image/right4'
  ];
  
  res.json({ leftSponsors, rightSponsors });
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
