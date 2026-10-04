import { getScheme } from './lib/server';

async function test() {
  const scheme = await getScheme('rani-durgavati-shri-anna-protsahan-yojana');
  console.log("Got scheme:", !!scheme);
  if (scheme) {
    console.log("detailedDescription:", scheme.detailedDescription?.[0]?.substring(0, 50));
  }
}

test();
