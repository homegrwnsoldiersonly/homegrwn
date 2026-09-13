import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // google-ads-api is a Node/gRPC library used only from Server Components via
  // a lazy import (src/lib/ads/index.ts). Opt it out of Turbopack's server
  // bundling so it loads via native require instead of being bundled — gRPC
  // libs with protobuf loading are a classic bundling failure mode.
  serverExternalPackages: ["google-ads-api"],

  // $HOME is itself a git repo with a package-lock.json, so Turbopack would
  // otherwise infer the wrong workspace root. Pin it to this project.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
