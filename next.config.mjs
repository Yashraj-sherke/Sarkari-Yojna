/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["cloudflare:workers"],
  turbopack: {},
  images: {
  },
  async redirects() {
    return [
      { source: "/state/central", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com; frame-src 'self' https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';" },
        ],
      },
    ];
  },
};

export default nextConfig;
