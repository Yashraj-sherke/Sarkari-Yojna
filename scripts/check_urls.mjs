import fs from 'fs';

const fileContent = fs.readFileSync('lib/mp-schemes-data.ts', 'utf-8');
const urlRegex = /"sourceUrl":\s*"([^"]*)"/g;
const statusRegex = /"status":\s*"([^"]*)"/g;
let match;
const urls = [];
while ((match = urlRegex.exec(fileContent)) !== null) {
  urls.push(match[1]);
}

const statuses = [];
while ((match = statusRegex.exec(fileContent)) !== null) {
  statuses.push(match[1]);
}

const urlCounts = {};
let emptyUrls = 0;
for (const u of urls) {
  if (!u) {
    emptyUrls++;
    continue;
  }
  let domain = "Invalid";
  try {
    domain = new URL(u).hostname;
  } catch (e) {
    domain = u; 
  }
  urlCounts[domain] = (urlCounts[domain] || 0) + 1;
}

const statusCounts = {};
for (const s of statuses) {
  statusCounts[s] = (statusCounts[s] || 0) + 1;
}

console.log('--- AUDIT REPORT (MP Schemes) ---');
console.log('Total Schemes in mp-schemes-data.ts:', urls.length);
console.log('Empty sourceUrls:', emptyUrls);
console.log('\n--- Domains Used ---');
Object.entries(urlCounts).sort((a, b) => b[1] - a[1]).forEach(([domain, count]) => {
  console.log(`${count.toString().padStart(3)} : ${domain}`);
});
console.log('\n--- Statuses ---');
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`${count.toString().padStart(3)} : ${status}`);
});
