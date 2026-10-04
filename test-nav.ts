import { buildSchemeNavigation } from './lib/scheme-navigation';
import { getScheme } from './lib/server';

async function test() {
  const scheme = await getScheme('rani-durgavati-shri-anna-protsahan-yojana');
  if (scheme) {
    const nav = buildSchemeNavigation(scheme.slug, scheme.detailedDescription || [], [], 'hi');
    console.log("Nav customized:", nav.customized);
    console.log("Sidebar items count:", nav.sidebar.length);
    console.log("Sidebar items:", nav.sidebar);
    console.log("TOC items count:", nav.toc.length);
  }
}

test();
