const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;
const geoip = require('geoip-lite');

app.use(cors());
app.use(bodyParser.json());

let count = 0;
let clickdistribution = {};

app.get('/count', (req, res) => {
  res.json({ count: count, distribution: clickdistribution });
});

app.post('/increment', (req, res) => {
  count++;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
  const location = geoip.lookup(ip);
  const region = location.country + '-' + location.region
  if (region in clickdistribution) {
    clickdistribution[region] += 1
  }
  else {
    clickdistribution[region] = 1
  }

  res.json({ count: count, distribution: clickdistribution });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
