import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "vinext/server/fetch-handler",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

function patchVinextLinkPlugin(): import("vite").Plugin {
  return {
    name: "patch-vinext-link",
    enforce: "pre",
    transform(code: any, id: any) {
      if (id.includes("vinext") && id.includes("link.js")) {
        let changed = false;
        if (!code.includes('import * as navigationModule from "./navigation.js";')) {
          code = code.replace(
            'let loadedNavigationModule = null;\nlet navigationModulePromise = null;',
            'import * as navigationModule from "./navigation.js";\nlet loadedNavigationModule = navigationModule;\nlet navigationModulePromise = Promise.resolve(navigationModule);'
          );
          code = code.replace(
            'function loadNavigationModule() {\n\treturn navigationModulePromise ??= import("./navigation.js").then((module) => {\n\t\tloadedNavigationModule = module;\n\t\treturn module;\n\t});\n}',
            'function loadNavigationModule() {\n\treturn navigationModulePromise;\n}'
          );
          changed = true;
        }
        const targetCode = 'if (hasAppNavigationRuntime) {\n\t\t\tconst { navigateClientSide } = loadedNavigationModule ?? await loadNavigationModule();\n\t\t\tconst setter = setPendingRef.current;';
        const safeCode = 'if (hasAppNavigationRuntime) {\n\t\t\tconst { navigateClientSide } = loadedNavigationModule ?? await loadNavigationModule();\n\t\t\tif (typeof navigateClientSide !== "function") {\n\t\t\t\tif (replace) window.location.replace(absoluteFullHref);\n\t\t\t\telse window.location.assign(absoluteFullHref);\n\t\t\t\treturn;\n\t\t\t}\n\t\t\tconst setter = setPendingRef.current;';
        if (code.includes(targetCode)) {
          code = code.replace(targetCode, safeCode);
          changed = true;
        }
        if (changed) return { code };
      }
    },
  };
}

function weakRefPolyfillPlugin(): import("vite").Plugin {
  return {
    name: "weakref-polyfill",
    enforce: "pre",
    transform(code: string, id: string) {
      if (id.includes("react-server-dom-webpack") || id.includes("vinext")) {
        if (!code.includes("class WeakRef")) {
          return `if (typeof globalThis.WeakRef === 'undefined') { globalThis.WeakRef = class WeakRef { constructor(t) { this.t = t; } deref() { return this.t; } }; }\n` + code;
        }
      }
    }
  };
}

export default defineConfig(async () => {
  // Use Miniflare's local Request.cf placeholder unless fetching is requested.
  process.env.CLOUDFLARE_CF_FETCH_ENABLED ??= "false";
  process.env.WRANGLER_SEND_METRICS ??= "false";

  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.WRANGLER_REGISTRY_PATH ??= ".wrangler/dev-registry";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    // Pre-bundle lucide-react as one chunk to avoid "Duplicated JavaScript" warnings
    optimizeDeps: {
      include: ['lucide-react'],
    },
    // Target modern browsers → eliminates "Legacy JavaScript" transforms
    build: {
      target: 'es2020',
    },
    plugins: [
      weakRefPolyfillPlugin(),
      patchVinextLinkPlugin(),
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          ...localBindingConfig,
          compatibility_date: "2024-09-23"
        },
      }),
    ],
  };
});
