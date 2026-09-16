import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const linkJsPath = resolve(__dirname, '../node_modules/vinext/dist/shims/link.js');

if (existsSync(linkJsPath)) {
  let content = readFileSync(linkJsPath, 'utf8');

  // 1. Ensure static import of navigation.js so Rolldown does not tree-shake navigateClientSide and prefetch helpers
  if (!content.includes('import * as navigationModule from "./navigation.js";')) {
    content = content.replace(
      'let loadedNavigationModule = null;\nlet navigationModulePromise = null;',
      'import * as navigationModule from "./navigation.js";\nlet loadedNavigationModule = navigationModule;\nlet navigationModulePromise = Promise.resolve(navigationModule);'
    );
    content = content.replace(
      'function loadNavigationModule() {\n\treturn navigationModulePromise ??= import("./navigation.js").then((module) => {\n\t\tloadedNavigationModule = module;\n\t\treturn module;\n\t});\n}',
      'function loadNavigationModule() {\n\treturn navigationModulePromise;\n}'
    );
  }

  // 2. Add safe fallback for navigateClientSide in link click handler
  const targetCode = 'if (hasAppNavigationRuntime) {\n\t\t\tconst { navigateClientSide } = loadedNavigationModule ?? await loadNavigationModule();\n\t\t\tconst setter = setPendingRef.current;';
  const safeCode = 'if (hasAppNavigationRuntime) {\n\t\t\tconst { navigateClientSide } = loadedNavigationModule ?? await loadNavigationModule();\n\t\t\tif (typeof navigateClientSide !== "function") {\n\t\t\t\tif (replace) window.location.replace(absoluteFullHref);\n\t\t\t\telse window.location.assign(absoluteFullHref);\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tconst setter = setPendingRef.current;';

  if (content.includes(targetCode)) {
    content = content.replace(targetCode, safeCode);
  }

  writeFileSync(linkJsPath, content, 'utf8');
  console.log('[patch-vinext] Successfully patched vinext/dist/shims/link.js');
} else {
  console.log('[patch-vinext] vinext/dist/shims/link.js not found, skipping patch');
}
