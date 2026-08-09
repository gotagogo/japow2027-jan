import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath: "/japow2027-jan",
      assetPrefix: "/japow2027-jan",
      trailingSlash: true,
      images: { unoptimized: true },
      // The static page does not use the Cloudflare-only database/worker files.
      typescript: { ignoreBuildErrors: true },
    }
  : {};

export default nextConfig;
