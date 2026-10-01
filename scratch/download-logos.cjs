const fs = require('fs');
const https = require('https');
const states = {
  'cg': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Seal_of_Chhattisgarh.png',
  'gj': 'https://upload.wikimedia.org/wikipedia/commons/7/77/Seal_of_Gujarat.svg',
  'hr': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Seal_of_Haryana.svg',
  'mh': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Seal_of_Maharashtra.svg',
  'rj': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Seal_of_Rajasthan.png',
  'pb': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Seal_of_Punjab.svg',
  'jh': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Jharkhand_Rajakiya_Chihna.jpg'
};
Object.entries(states).forEach(([key, url]) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
    if (res.statusCode === 200) {
      const ext = url.split('.').pop();
      const file = fs.createWriteStream(`public/state-logos/${key}-logo.${ext}`);
      res.pipe(file);
      console.log('Downloaded', key);
    } else {
      console.log('Failed for', key, res.statusCode);
    }
  });
});
